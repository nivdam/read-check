import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(request: Request) {
  try {
    const { prompt } = await request.json();

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro-latest",
    });

    const result = await model.generateContent(prompt);

    return new Response(JSON.stringify({ text: result.response.text() }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: "Failed to generate" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
