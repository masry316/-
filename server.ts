import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { ALL_ERP_SHEETS } from "./src/erpData";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { initializeApp as initializeAdminApp, getApps as getAdminApps } from "firebase-admin/app";
import { getAuth as getAdminAuth } from "firebase-admin/auth";
import firebaseConfig from "./firebase-applet-config.json" assert { type: "json" };
import { db } from "./src/db/index.ts";
import { erpRows } from "./src/db/schema.ts";
import { eq, and } from "drizzle-orm";

dotenv.config();

// Initialize Firebase Admin SDK
if (!getAdminApps().length) {
  initializeAdminApp({
    projectId: firebaseConfig.projectId,
  });
}
const adminAuth = getAdminAuth();

// Initialize Gemini API client safely (with optional/lazy fallback if API key is missing)
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("WARNING: GEMINI_API_KEY is not defined in the environment.");
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

async function getUserId(req: express.Request) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split('Bearer ')[1];
    try {
      const decodedToken = await adminAuth.verifyIdToken(token);
      return decodedToken.uid;
    } catch (e) {
      console.error("Firebase ID Token verification failed:", e);
    }
  }
  return null;
}

async function getSheetsForUser(userId: string) {
  try {
    let rows = await db.select().from(erpRows).where(eq(erpRows.userId, userId));
    
    if (rows.length === 0) {
      // Seed user with the default sheets
      const insertValues = [];
      for (const sheet of ALL_ERP_SHEETS) {
        for (const r of sheet.rows) {
          insertValues.push({
            userId,
            sheetId: sheet.id,
            rowData: r
          });
        }
      }
      if (insertValues.length > 0) {
        // Bulk insert
        await db.insert(erpRows).values(insertValues);
      }
      // Re-fetch
      rows = await db.select().from(erpRows).where(eq(erpRows.userId, userId));
    }

    return ALL_ERP_SHEETS.map(sheet => {
      const sheetRows = rows
        .filter(r => r.sheetId === sheet.id)
        .map(r => ({
          ...(r.rowData as any),
          _dbId: r.id
        }));
      return {
        ...sheet,
        rows: sheetRows
      };
    });
  } catch (error) {
    console.error("Error reading/seeding user sheets in Cloud SQL:", error);
    return ALL_ERP_SHEETS; // fallback
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Memory store for sheets (pre-loaded with ALL_ERP_SHEETS for fallback / anonymous users)
  let sheetsStore = JSON.parse(JSON.stringify(ALL_ERP_SHEETS));

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // Get all sheets with full data (high-performance optimization)
  app.get("/api/sheets-all", async (req, res) => {
    const userId = await getUserId(req);
    if (userId) {
      const userSheets = await getSheetsForUser(userId);
      res.json(userSheets);
    } else {
      res.json(sheetsStore);
    }
  });

  // Get list of all sheets (metadata only)
  app.get("/api/sheets", async (req, res) => {
    const userId = await getUserId(req);
    let activeSheets = sheetsStore;
    if (userId) {
      activeSheets = await getSheetsForUser(userId);
    }
    const list = activeSheets.map(sh => ({
      id: sh.id,
      name: sh.name,
      arabicName: sh.arabicName,
      category: sh.category,
      columnsCount: sh.columns.length,
      rowsCount: sh.rows.length
    }));
    res.json(list);
  });

  // Get full data for a specific sheet
  app.get("/api/sheets/:id", async (req, res) => {
    const userId = await getUserId(req);
    let activeSheets = sheetsStore;
    if (userId) {
      activeSheets = await getSheetsForUser(userId);
    }
    const sheet = activeSheets.find(sh => sh.id === req.params.id);
    if (!sheet) {
      return res.status(404).json({ error: "Sheet not found" });
    }
    res.json(sheet);
  });

  // Add a row to a specific sheet
  app.post("/api/sheets/:id/rows", async (req, res) => {
    const userId = await getUserId(req);
    const sheetId = req.params.id;
    const newRow = req.body.row;
    if (!newRow) {
      return res.status(400).json({ error: "Row data is required" });
    }

    if (userId) {
      try {
        const result = await db.insert(erpRows).values({
          userId,
          sheetId,
          rowData: newRow
        }).returning();
        const insertedRow = { ...newRow, _dbId: result[0].id };
        res.json({ success: true, row: insertedRow });
      } catch (error) {
        console.error("Failed to add row to db:", error);
        res.status(500).json({ error: "Failed to add row to database" });
      }
    } else {
      const sheet = sheetsStore.find(sh => sh.id === sheetId);
      if (!sheet) {
        return res.status(404).json({ error: "Sheet not found" });
      }
      sheet.rows.unshift(newRow); // Prepend to show immediately
      res.json({ success: true, sheet });
    }
  });

  // Delete a row from a specific sheet
  app.delete("/api/sheets/:id/rows/:index", async (req, res) => {
    const userId = await getUserId(req);
    const sheetId = req.params.id;
    const index = parseInt(req.params.index, 10);

    if (userId) {
      const dbId = req.query.dbId ? parseInt(req.query.dbId as string, 10) : null;
      if (dbId) {
        try {
          await db.delete(erpRows)
            .where(and(eq(erpRows.id, dbId), eq(erpRows.userId, userId)));
          res.json({ success: true });
        } catch (error) {
          console.error("Failed to delete row from db:", error);
          res.status(500).json({ error: "Failed to delete row from database" });
        }
      } else {
        res.status(400).json({ error: "Database row ID (dbId) is required for delete" });
      }
    } else {
      const sheet = sheetsStore.find(sh => sh.id === sheetId);
      if (!sheet) {
        return res.status(404).json({ error: "Sheet not found" });
      }
      if (isNaN(index) || index < 0 || index >= sheet.rows.length) {
        return res.status(400).json({ error: "Invalid row index" });
      }
      sheet.rows.splice(index, 1);
      res.json({ success: true, sheet });
    }
  });

  // Update a row in a specific sheet at a given index
  app.put("/api/sheets/:id/rows/:index", async (req, res) => {
    const userId = await getUserId(req);
    const sheetId = req.params.id;
    const index = parseInt(req.params.index, 10);
    const updatedRow = req.body.row;
    if (!updatedRow) {
      return res.status(400).json({ error: "Row data is required" });
    }

    if (userId) {
      const dbId = updatedRow._dbId;
      if (dbId) {
        try {
          const cleanRow = { ...updatedRow };
          delete cleanRow._dbId;
          await db.update(erpRows)
            .set({ rowData: cleanRow, updatedAt: new Date() })
            .where(and(eq(erpRows.id, dbId), eq(erpRows.userId, userId)));
          res.json({ success: true, row: updatedRow });
        } catch (error) {
          console.error("Failed to update row in db:", error);
          res.status(500).json({ error: "Failed to update row in database" });
        }
      } else {
        res.status(400).json({ error: "Database row ID (_dbId) is required for update" });
      }
    } else {
      const sheet = sheetsStore.find(sh => sh.id === sheetId);
      if (!sheet) {
        return res.status(404).json({ error: "Sheet not found" });
      }
      if (isNaN(index) || index < 0 || index >= sheet.rows.length) {
        return res.status(400).json({ error: "Invalid row index" });
      }
      sheet.rows[index] = updatedRow;
      res.json({ success: true, sheet });
    }
  });

  // Dedicated endpoint to "form" (create) a user with automatic ID generation, duplicate checks, and validation
  app.post("/api/users", async (req, res) => {
    const { Username, FullName, Email, Status } = req.body;

    if (!Username || !FullName || !Email) {
      return res.status(400).json({ error: "Username, Full Name, and Email are required fields." });
    }

    const userId = await getUserId(req);
    let activeSheets = sheetsStore;
    if (userId) {
      activeSheets = await getSheetsForUser(userId);
    }

    const usersSheet = activeSheets.find(sh => sh.id === "users");
    if (!usersSheet) {
      return res.status(404).json({ error: "Users worksheet not found." });
    }

    // Check for duplicates
    const duplicateUsername = usersSheet.rows.some(u => String(u.Username || "").toLowerCase() === String(Username).toLowerCase());
    const duplicateEmail = usersSheet.rows.some(u => String(u.Email || "").toLowerCase() === String(Email).toLowerCase());

    if (duplicateUsername) {
      return res.status(400).json({ error: `Username '${Username}' is already taken.` });
    }
    if (duplicateEmail) {
      return res.status(400).json({ error: `Email '${Email}' is already registered.` });
    }

    // Generate unique UserID like U011, U012...
    let nextNum = 11;
    usersSheet.rows.forEach(u => {
      const match = String(u.UserID || "").match(/^U(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num >= nextNum) {
          nextNum = num + 1;
        }
      }
    });
    const UserID = `U${String(nextNum).padStart(3, "0")}`;

    const newUser = {
      UserID,
      Username,
      FullName,
      Email,
      Status: Status || "Active"
    };

    if (userId) {
      try {
        const result = await db.insert(erpRows).values({
          userId,
          sheetId: "users",
          rowData: newUser
        }).returning();
        res.status(201).json({
          success: true,
          message: "User formed successfully.",
          user: { ...newUser, _dbId: result[0].id }
        });
      } catch (error) {
        console.error("Failed to insert new user in db:", error);
        res.status(500).json({ error: "Failed to create user in database" });
      }
    } else {
      usersSheet.rows.unshift(newUser); // Add to memory store
      res.status(201).json({
        success: true,
        message: "User formed successfully.",
        user: newUser
      });
    }
  });

  // --- GOOGLE WORKSPACE API ENDPOINTS (GMAIL & CALENDAR) ---

  // Google Calendar: Fetch events
  app.get("/api/calendar/events", async (req, res) => {
    const token = req.headers.authorization; // Expects "Bearer <accessToken>"
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Missing Google Access Token" });
    }
    try {
      const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=15&orderBy=startTime&singleEvents=true", {
        headers: { Authorization: token }
      });
      if (!response.ok) {
        const errText = await response.text();
        return res.status(response.status).json({ error: errText });
      }
      const data = await response.json();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Google Calendar: Create event
  app.post("/api/calendar/events", async (req, res) => {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Missing Google Access Token" });
    }
    try {
      const event = req.body;
      const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(event)
      });
      if (!response.ok) {
        const errText = await response.text();
        return res.status(response.status).json({ error: errText });
      }
      const data = await response.json();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Gmail: Fetch messages
  app.get("/api/gmail/messages", async (req, res) => {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Missing Google Access Token" });
    }
    try {
      const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10", {
        headers: { Authorization: token }
      });
      if (!response.ok) {
        const errText = await response.text();
        return res.status(response.status).json({ error: errText });
      }
      const listData = await response.json();
      const messages = [];
      if (listData.messages && listData.messages.length > 0) {
        for (const msg of listData.messages) {
          const msgRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`, {
            headers: { Authorization: token }
          });
          if (msgRes.ok) {
            const fullMsg = await msgRes.json();
            messages.push(fullMsg);
          }
        }
      }
      res.json({ messages });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Gmail: Send message
  app.post("/api/gmail/send", async (req, res) => {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Missing Google Access Token" });
    }
    try {
      const { to, subject, body } = req.body;
      if (!to || !subject || !body) {
        return res.status(400).json({ error: "Missing required fields (to, subject, body)" });
      }

      // Gmail API expects RFC 2822 formatted message encoded in base64url
      const messageParts = [
        `To: ${to}`,
        'Content-Type: text/html; charset=utf-8',
        'MIME-Version: 1.0',
        `Subject: ${subject}`,
        '',
        body
      ];
      const message = messageParts.join('\n');
      
      const base64Safe = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ raw: base64Safe })
      });

      if (!response.ok) {
        const errText = await response.text();
        return res.status(response.status).json({ error: errText });
      }
      const data = await response.json();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Gemini AI ERP Assistant API
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, currentSheetId } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const ai = getGeminiClient();
      if (!ai) {
        return res.status(503).json({
          error: "Gemini API key is not configured in Settings > Secrets. Please add GEMINI_API_KEY to start using the Intelligent ERP Assistant."
        });
      }

      // Build context of all sheets to help the model find data
      let activeSheets = sheetsStore;
      const userId = await getUserId(req);
      if (userId) {
        activeSheets = await getSheetsForUser(userId);
      }
      const sheetsSummary = activeSheets.map(sh => 
        `- Sheet ID: "${sh.id}" | Name: "${sh.name}" (${sh.arabicName}) | Category: "${sh.category}" | Record Count: ${sh.rows.length}`
      ).join("\n");

      // Build specific context for the active sheet if provided
      let activeSheetContext = "";
      if (currentSheetId) {
        const activeSheet = activeSheets.find(sh => sh.id === currentSheetId);
        if (activeSheet) {
          // Provide up to first 40 rows to stay within a reasonable token limit
          const sampleRows = activeSheet.rows.slice(0, 40);
          activeSheetContext = `
CURRENT SELECTED SHEET INFO:
- ID: "${activeSheet.id}"
- Name: "${activeSheet.name}" / "${activeSheet.arabicName}"
- Category: "${activeSheet.category}"
- Columns: ${JSON.stringify(activeSheet.columns.map(c => `${c.label} (${c.key})`))}
- Rows Context (Up to first 40 rows):
${JSON.stringify(sampleRows, null, 2)}
`;
        }
      }

      const systemInstruction = `
You are the Official AI Intelligent ERP Assistant of "الدولية ستيل" (International Steel), a leading steel enterprise.
You are embedded directly inside their ERP Workbook system.
You are mission-critical: answer queries about ERP worksheets, analyze inventory, users, financial logs, suppliers, or sales records.

Here is the current state of the ERP Workbook sheets:
${sheetsSummary}

${activeSheetContext}

GUIDELINES:
1. Always respond in a highly professional, polite, and executive manner.
2. Adopt the language of the user's prompt. Since this is an Egyptian/Arabic company (الدولية ستيل), respond in professional Arabic by default, unless the prompt is in English.
3. Be clear and direct. Use bullet points and bold text for key metrics, and formulate brief tables where appropriate.
4. If asked about numbers, perform logical calculations based on the provided JSON data.
5. Do not hallucinate or create mock entries that do not exist. Always stick to the verified facts.
6. If the user asks general steel manufacturing or commercial questions, help them with professional industry knowledge, keeping it relevant to "الدولية ستيل".
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: message,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ text: response.text });
    } catch (err: any) {
      console.error("Gemini API Error:", err);
      res.status(500).json({ error: err.message || "An error occurred with Gemini processing." });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
