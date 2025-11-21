import { GoogleGenAI, Type, Schema } from "@google/genai";
import { QuizData } from "../types";

// Allow the function to run for up to 60 seconds (Vercel limit on Hobby plan)
export const config = {
  maxDuration: 60,
};

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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
              "Array of correct option IDs (e.g., ['א']). If multiple correct, list all.",
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
          parentGuide: {
            type: Type.STRING,
            description: "Guide for parents on what a good answer includes.",
          },
        },
        required: ["id", "text", "parentGuide"],
      },
    },
  },
  required: ["title", "content", "questions"],
};

export default async function handler(req: any, res: any) {
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

    const jsonText = response.text;

    if (!jsonText) {
      throw new Error("Failed to generate quiz");
    }

    const cleanJson = jsonText.replace(/```json|```/g, "").trim();
    const quiz = JSON.parse(cleanJson) as QuizData;

    return res.status(200).json(quiz);
  } catch (error: any) {
    console.error("generate-quiz error:", error);
    return res.status(500).json({
      error: "Failed to generate quiz",
      details: error.message || String(error),
    });
  }
}
