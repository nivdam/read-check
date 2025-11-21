import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export default async function handler(req: any, res: any) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents:
        "Suggest a single, short topic (max 4 words) for a reading comprehension text suitable for a 4th-grade boy in Israel. Return ONLY the Hebrew string.",
    });

    const text = response.text?.trim();

    if (!text) {
      return res.status(500).json({ error: "Empty response from Gemini" });
    }

    return res.status(200).json({ text });
  } catch (error: any) {
    console.error("suggest-topic error:", error);
    return res.status(500).json({
      error: "Failed to generate topic",
      detail: error?.message ?? String(error),
    });
  }
}
