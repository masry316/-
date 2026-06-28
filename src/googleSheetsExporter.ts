import { SheetConfig } from "./types";

export interface ExportProgress {
  step: string;
  percent: number;
}

export const exportToGoogleSheets = async (
  accessToken: string,
  sheets: SheetConfig[],
  spreadsheetTitle: string,
  onProgress: (progress: ExportProgress) => void
): Promise<string> => {
  try {
    onProgress({ step: "Creating Google Spreadsheet with 51 sheets...", percent: 10 });

    // 1. Create Spreadsheet with all sheet titles in one call
    const createResponse = await fetch("https://sheets.googleapis.com/v4/spreadsheets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        properties: {
          title: spreadsheetTitle,
        },
        sheets: sheets.map((sheet) => ({
          properties: {
            title: sheet.name,
          },
        })),
      }),
    });

    if (!createResponse.ok) {
      const err = await createResponse.json();
      throw new Error(`Failed to create spreadsheet: ${JSON.stringify(err)}`);
    }

    const spreadsheetData = await createResponse.json();
    const spreadsheetId = spreadsheetData.spreadsheetId;
    const createdSheets = spreadsheetData.sheets || [];

    onProgress({ step: "Populating tables and writing records (Batch values)...", percent: 40 });

    // 2. Prepare value updates for all sheets
    const dataValues = sheets.map((sheet) => {
      const headerRow = sheet.columns.map((col) => `${col.label} (${col.key})`);
      const dataRows = sheet.rows.map((row) =>
        sheet.columns.map((col) => {
          const val = row[col.key];
          if (val === undefined || val === null) return "";
          if (typeof val === "boolean") return val ? "TRUE" : "FALSE";
          return val;
        })
      );

      return {
        range: `'${sheet.name}'!A1`,
        values: [headerRow, ...dataRows],
      };
    });

    const valuesResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          valueInputOption: "USER_ENTERED",
          data: dataValues,
        }),
      }
    );

    if (!valuesResponse.ok) {
      const err = await valuesResponse.json();
      throw new Error(`Failed to populate spreadsheet values: ${JSON.stringify(err)}`);
    }

    onProgress({ step: "Applying executive styling, freezing headers, and autofitting columns...", percent: 70 });

    // 3. Apply Styling (Freeze row, grey headers, white bold text, auto-fit widths)
    const requests: any[] = [];

    createdSheets.forEach((sheetObj: any) => {
      const sheetId = sheetObj.properties.sheetId;

      // Request A: Freeze top row
      requests.push({
        updateSheetProperties: {
          properties: {
            sheetId: sheetId,
            gridProperties: {
              frozenRowCount: 1,
            },
          },
          fields: "gridProperties.frozenRowCount",
        },
      });

      // Request B: Header row formatting (Slate Grey Background, white bold text, centered)
      requests.push({
        repeatCell: {
          range: {
            sheetId: sheetId,
            startRowIndex: 0,
            endRowIndex: 1,
          },
          cell: {
            userEnteredFormat: {
              backgroundColor: {
                red: 0.22,
                green: 0.26,
                blue: 0.31, // Steel Grey (#38424E)
              },
              textFormat: {
                bold: true,
                foregroundColor: { red: 1.0, green: 1.0, blue: 1.0 },
                fontSize: 10,
              },
              horizontalAlignment: "CENTER",
            },
          },
          fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)",
        },
      });

      // Request C: Auto-fit column widths
      requests.push({
        autoResizeDimensions: {
          dimensions: {
            sheetId: sheetId,
            dimension: "COLUMNS",
          },
        },
      });
    });

    // Send styling batch request
    const stylingResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requests,
        }),
      }
    );

    if (!stylingResponse.ok) {
      console.warn("Styling batch update warning, continuing...");
    }

    onProgress({ step: "Workbook exported successfully!", percent: 100 });
    return spreadsheetId;
  } catch (error: any) {
    console.error("Google Sheets Exporter Error:", error);
    throw error;
  }
};
