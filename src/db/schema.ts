import { pgTable, serial, text, timestamp, jsonb } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  uid: text("uid").primaryKey(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const erpRows = pgTable("erp_rows", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  sheetId: text("sheet_id").notNull(),
  rowData: jsonb("row_data").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
