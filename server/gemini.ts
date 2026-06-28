import { Router } from "express";
import { GoogleGenAI } from "@google/genai";
import { getUserId, getSheetsForUser } from "./db.ts";
import { sheetsStore } from "./sheets.ts";

const router = Router();

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

// Gemini AI ERP Assistant API
router.post("/chat", async (req, res) => {
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
    const sheetsSummary = activeSheets.map((sh: any) => 
      `- Sheet ID: "${sh.id}" | Name: "${sh.name}" (${sh.arabicName}) | Category: "${sh.category}" | Record Count: ${sh.rows.length}`
    ).join("\n");

    // Build specific context for the active sheet if provided
    let activeSheetContext = "";
    if (currentSheetId) {
      const activeSheet = activeSheets.find((sh: any) => sh.id === currentSheetId);
      if (activeSheet) {
        // Provide up to first 40 rows to stay within a reasonable token limit
        const sampleRows = activeSheet.rows.slice(0, 40);
        activeSheetContext = `
CURRENT SELECTED SHEET INFO:
- ID: "${activeSheet.id}"
- Name: "${activeSheet.name}" / "${activeSheet.arabicName}"
- Category: "${activeSheet.category}"
- Columns: ${JSON.stringify(activeSheet.columns.map((c: any) => `${c.label} (${c.key})`))}
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
2. Respond STRICTLY in professional Arabic at all times. Under no circumstances should you respond in English (except for codes, technical IDs, or if the user explicitly requests English translation), as the entire "الدولية ستيل" organization operates in Arabic.
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

export default router;
