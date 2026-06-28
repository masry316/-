import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { ALL_ERP_SHEETS } from "./src/erpData";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

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

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Memory store for sheets (pre-loaded with ALL_ERP_SHEETS)
  let sheetsStore = JSON.parse(JSON.stringify(ALL_ERP_SHEETS));

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // Get all sheets with full data (high-performance optimization)
  app.get("/api/sheets-all", (req, res) => {
    res.json(sheetsStore);
  });

  // Get list of all sheets (metadata only)
  app.get("/api/sheets", (req, res) => {
    const list = sheetsStore.map(sh => ({
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
  app.get("/api/sheets/:id", (req, res) => {
    const sheet = sheetsStore.find(sh => sh.id === req.params.id);
    if (!sheet) {
      return res.status(404).json({ error: "Sheet not found" });
    }
    res.json(sheet);
  });

  // Add a row to a specific sheet
  app.post("/api/sheets/:id/rows", (req, res) => {
    const sheet = sheetsStore.find(sh => sh.id === req.params.id);
    if (!sheet) {
      return res.status(404).json({ error: "Sheet not found" });
    }
    const newRow = req.body.row;
    if (!newRow) {
      return res.status(400).json({ error: "Row data is required" });
    }
    sheet.rows.unshift(newRow); // Prepend to show immediately
    res.json({ success: true, sheet });
  });

  // Delete a row from a specific sheet
  app.delete("/api/sheets/:id/rows/:index", (req, res) => {
    const sheet = sheetsStore.find(sh => sh.id === req.params.id);
    if (!sheet) {
      return res.status(404).json({ error: "Sheet not found" });
    }
    const index = parseInt(req.params.index, 10);
    if (isNaN(index) || index < 0 || index >= sheet.rows.length) {
      return res.status(400).json({ error: "Invalid row index" });
    }
    sheet.rows.splice(index, 1);
    res.json({ success: true, sheet });
  });

  // Update a row in a specific sheet at a given index
  app.put("/api/sheets/:id/rows/:index", (req, res) => {
    const sheet = sheetsStore.find(sh => sh.id === req.params.id);
    if (!sheet) {
      return res.status(404).json({ error: "Sheet not found" });
    }
    const index = parseInt(req.params.index, 10);
    if (isNaN(index) || index < 0 || index >= sheet.rows.length) {
      return res.status(400).json({ error: "Invalid row index" });
    }
    const updatedRow = req.body.row;
    if (!updatedRow) {
      return res.status(400).json({ error: "Row data is required" });
    }
    sheet.rows[index] = updatedRow;
    res.json({ success: true, sheet });
  });

  // Dedicated endpoint to "form" (create) a user with automatic ID generation, duplicate checks, and validation
  app.post("/api/users", (req, res) => {
    const { Username, FullName, Email, Status } = req.body;

    if (!Username || !FullName || !Email) {
      return res.status(400).json({ error: "Username, Full Name, and Email are required fields." });
    }

    const usersSheet = sheetsStore.find(sh => sh.id === "users");
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

    usersSheet.rows.unshift(newUser); // Add to memory store

    res.status(201).json({
      success: true,
      message: "User formed successfully.",
      user: newUser
    });
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
      const sheetsSummary = sheetsStore.map(sh => 
        `- Sheet ID: "${sh.id}" | Name: "${sh.name}" (${sh.arabicName}) | Category: "${sh.category}" | Record Count: ${sh.rows.length}`
      ).join("\n");

      // Build specific context for the active sheet if provided
      let activeSheetContext = "";
      if (currentSheetId) {
        const activeSheet = sheetsStore.find(sh => sh.id === currentSheetId);
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
Your mission is to provide accurate, business-grounded answers about the ERP worksheets data and help users analyze inventory, users, financial logs, suppliers, or sales records.

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
