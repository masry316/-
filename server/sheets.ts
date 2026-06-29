import { Router } from "express";
import { ALL_ERP_SHEETS } from "../src/erpData";
import { db, erpRows, eq, and, getUserId, getSheetsForUser } from "./db.ts";

const router = Router();

// In-memory store for anonymous sessions/fallback
export const sheetsStore = JSON.parse(JSON.stringify(ALL_ERP_SHEETS));

// Get all sheets with full data (high-performance optimization)
router.get("/sheets-all", async (req, res) => {
  const userId = await getUserId(req);
  if (userId) {
    const userSheets = await getSheetsForUser(userId);
    res.json(userSheets);
  } else {
    res.json(sheetsStore);
  }
});

// Get list of all sheets (metadata only)
router.get("/sheets", async (req, res) => {
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
router.get("/sheets/:id", async (req, res) => {
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
router.post("/sheets/:id/rows", async (req, res) => {
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

// Sync invoice lines for a specific InvoiceNo (e.g. SalesInvoiceLines or PurchaseInvoiceLines)
router.post("/sheets/:id/sync-invoice-lines", async (req, res) => {
  const userId = await getUserId(req);
  const sheetId = req.params.id; // e.g. "salesInvoiceLines" or "purchaseInvoiceLines"
  const { invoiceNo, lines } = req.body;
  
  if (!invoiceNo) {
    return res.status(400).json({ error: "invoiceNo is required" });
  }

  if (userId) {
    try {
      // 1. Delete existing rows for this invoiceNo in this sheetId
      const existingRows = await db.select().from(erpRows).where(
        and(eq(erpRows.userId, userId), eq(erpRows.sheetId, sheetId))
      );
      
      for (const r of existingRows) {
        const rowData = r.rowData as any;
        if (rowData && String(rowData.InvoiceNo) === String(invoiceNo)) {
          await db.delete(erpRows).where(eq(erpRows.id, r.id));
        }
      }

      // 2. Insert new lines
      const insertedLines = [];
      for (const line of lines) {
        const result = await db.insert(erpRows).values({
          userId,
          sheetId,
          rowData: line
        }).returning();
        insertedLines.push({ ...line, _dbId: result[0].id });
      }

      res.json({ success: true, lines: insertedLines });
    } catch (error) {
      console.error("Failed to sync invoice lines in db:", error);
      res.status(500).json({ error: "Failed to sync invoice lines in database" });
    }
  } else {
    // In-memory store
    const sheet = sheetsStore.find(sh => sh.id === sheetId);
    if (!sheet) {
      return res.status(404).json({ error: "Sheet not found" });
    }
    // Remove old lines for this invoiceNo
    sheet.rows = sheet.rows.filter((r: any) => String(r.InvoiceNo) !== String(invoiceNo));
    // Add new lines
    sheet.rows.unshift(...lines);
    res.json({ success: true, sheet });
  }
});

// Delete a row from a specific sheet
router.delete("/sheets/:id/rows/:index", async (req, res) => {
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
router.put("/sheets/:id/rows/:index", async (req, res) => {
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
router.post("/users", async (req, res) => {
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

export default router;
