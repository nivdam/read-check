import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt } = req.body ?? {};

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Missing prompt" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const jsonText = response.text;

    if (!jsonText) {
      throw new Error("Empty response from Gemini");
    }

    const quiz = JSON.parse(jsonText);

    return res.status(200).json(quiz);
  } catch (error: any) {
    console.error("generate-quiz error:", error);
    return res.status(500).json({
      error: "Failed to generate quiz",
      detail: error?.message ?? String(error),
    });
  }
}
