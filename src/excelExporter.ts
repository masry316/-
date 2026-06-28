import * as XLSX from "xlsx";
import { SheetConfig } from "./types";

/**
 * Generates and triggers download of a professional multi-tab Excel (.xlsx) file.
 * Each sheet is written as a worksheet. Columns are properly formatted.
 */
export const downloadExcelWorkbook = (
  sheets: SheetConfig[],
  filename = "International_Steel_ERP_Master.xlsx"
) => {
  try {
    const wb = XLSX.utils.book_new();

    sheets.forEach((sheet) => {
      // Build header display titles (Label + Key for professional reference)
      const headers = sheet.columns.map((col) => `${col.label} [${col.key}]`);

      const dataRows = sheet.rows.map((row) => {
        const formattedRow: Record<string, any> = {};
        sheet.columns.forEach((col) => {
          let val = row[col.key];
          if (val === undefined || val === null) {
            val = "";
          } else if (typeof val === "boolean") {
            val = val ? "TRUE" : "FALSE";
          }
          formattedRow[`${col.label} [${col.key}]`] = val;
        });
        return formattedRow;
      });

      // Create a worksheet
      const ws = XLSX.utils.json_to_sheet(dataRows, { header: headers });

      // SheetJS workbook sheet titles must be at most 31 characters
      const cleanSheetName = sheet.name.substring(0, 31);

      XLSX.utils.book_append_sheet(wb, ws, cleanSheetName);
    });

    // Write file
    XLSX.writeFile(wb, filename);
  } catch (error) {
    console.error("Failed to generate and download Excel workbook:", error);
    throw error;
  }
};
