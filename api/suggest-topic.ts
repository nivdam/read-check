import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req: any, res: any) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const response = await model.generateContent(
      "Suggest a short Hebrew topic (max 4 words) for a 4th grade reading comprehension test. Return ONLY the Hebrew text."
    );

    res.status(200).json({
      text: response.response.text(),
    });
  } catch (error) {
    console.error("suggest-topic error", error);
    res.status(500).json({ error: "Failed to generate topic" });
  }
}
