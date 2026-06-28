import express from "express";
import { initializeApp as initializeAdminApp, getApps as getAdminApps } from "firebase-admin/app";
import { getAuth as getAdminAuth } from "firebase-admin/auth";
import firebaseConfig from "../firebase-applet-config.json" assert { type: "json" };
import { db } from "../src/db/index.ts";
import { erpRows } from "../src/db/schema.ts";
import { eq, and } from "drizzle-orm";
import { ALL_ERP_SHEETS } from "../src/erpData";

// Initialize Firebase Admin SDK
if (!getAdminApps().length) {
  initializeAdminApp({
    projectId: firebaseConfig.projectId,
  });
}
export const adminAuth = getAdminAuth();

export async function getUserId(req: express.Request): Promise<string | null> {
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

export async function getSheetsForUser(userId: string) {
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

export { db, erpRows, eq, and };
