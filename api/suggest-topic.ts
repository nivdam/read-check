import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("Missing GEMINI_API_KEY");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(
      "Suggest a short Hebrew topic (max 4 words) for a 4th grade reading comprehension test. Return ONLY the Hebrew text."
    );

    res.status(200).json({ text: result.response.text() });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to generate topic" });
  }
}
