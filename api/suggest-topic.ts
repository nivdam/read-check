import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req: any, res: any) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("Missing GEMINI_API_KEY");
      return res.status(500).json({ error: "Missing API key" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
    });

    const result = await model.generateContent(
      "Suggest a short Hebrew topic (max 4 words) for a 4th grade reading comprehension test. Return ONLY the Hebrew text."
    );

    return res.status(200).json({ text: result.response.text() });
  } catch (error: any) {
    console.error("suggest-topic error:", error);
    return res.status(500).json({
      error: "Failed to generate topic",
      detail: error?.message || String(error),
    });
  }
}
