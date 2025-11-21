import { GoogleGenAI, Type, Schema } from "@google/genai";
import { QuizData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Define the response schema to ensure structured JSON output
const quizSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "A creative title for the story in Hebrew.",
    },
    content: {
      type: Type.STRING,
      description: "The reading comprehension text in Hebrew.",
    },
    questions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.INTEGER },
          text: {
            type: Type.STRING,
            description: "The question text in Hebrew.",
          },
          options: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: {
                  type: Type.STRING,
                  description: "Letter identifier: 'א', 'ב', 'ג', or 'ד'",
                },
                text: {
                  type: Type.STRING,
                  description: "The answer text in Hebrew.",
                },
              },
              required: ["id", "text"],
            },
          },
          correctOptionIds: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description:
              "Array of correct option IDs. If multiple correct, list all.",
          },
          explanation: {
            type: Type.STRING,
            description: "Explanation why the answer is correct in Hebrew.",
          },
          isMultipleChoice: {
            type: Type.BOOLEAN,
            description: "True if user must select multiple options.",
          },
        },
        required: [
          "id",
          "text",
          "options",
          "correctOptionIds",
          "explanation",
          "isMultipleChoice",
        ],
      },
    },
    bonusContent: {
      type: Type.STRING,
      description: "Optional shorter text for bonus section.",
    },
    bonusQuestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.INTEGER },
          text: {
            type: Type.STRING,
            description: "Open-ended question text in Hebrew.",
          },
          parentGuide: { type: Type.STRING, description: "Guide for parents." },
        },
        required: ["id", "text", "parentGuide"],
      },
    },
  },
  required: ["title", "content", "questions"],
};

export default async function handler(req: any, res: any): Promise<QuizData> {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Missing prompt" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: quizSchema,
      },
    });

    // Fixed: Added parentheses to invoke the function
    const jsonText = response.text;

    if (!jsonText) {
      throw new Error("Failed to generate quiz");
    }

    return JSON.parse(jsonText) as QuizData;
  } catch (error: any) {
    console.error("generate-quiz error:", error);
    return res.status(500).json({
      error: "Failed to generate quiz",
      details: error.message || String(error),
    });
  }
}
