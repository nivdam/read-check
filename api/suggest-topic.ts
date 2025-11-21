import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("❌ Missing GEMINI_API_KEY in environment");
      return res
        .status(500)
        .json({ error: "GEMINI_API_KEY is missing on server" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(
      "Suggest a short Hebrew topic (max 4 words) for a 4th grade reading comprehension test. Return ONLY the Hebrew text."
    );

    const text = result.response.text();
    console.log("✅ Gemini topic:", text);

    return res.status(200).json({ text });
  } catch (error: any) {
    console.error("❌ suggest-topic error:", error);

    return res.status(500).json({
      error: "Failed to generate topic",
      detail: error?.response?.data || error?.message || String(error),
    });
  }
}
