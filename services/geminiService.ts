import { GoogleGenAI, Type } from "@google/genai";
import { QuizData, QuizSettings } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const quizSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "A creative title for the story in Hebrew." },
    content: { type: Type.STRING, description: "The reading comprehension text in Hebrew." },
    questions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.INTEGER },
          text: { type: Type.STRING, description: "The question text in Hebrew." },
          options: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING, description: "Letter identifier: 'א', 'ב', 'ג', or 'ד'" },
                text: { type: Type.STRING, description: "The answer text in Hebrew." }
              },
              required: ["id", "text"]
            }
          },
          correctOptionIds: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Array of correct option IDs (e.g., ['א']). If multiple correct, list all." 
          },
          explanation: { type: Type.STRING, description: "Explanation why the answer is correct in Hebrew." },
          isMultipleChoice: { type: Type.BOOLEAN, description: "True if user must select multiple options." }
        },
        required: ["id", "text", "options", "correctOptionIds", "explanation", "isMultipleChoice"]
      }
    },
    bonusContent: { type: Type.STRING, description: "Optional shorter text for bonus section." },
    bonusQuestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.INTEGER },
          text: { type: Type.STRING, description: "Open-ended question text in Hebrew." },
          parentGuide: { type: Type.STRING, description: "Guide for parents on what a good answer includes." }
        },
        required: ["id", "text", "parentGuide"]
      }
    }
  },
  required: ["title", "content", "questions"]
};

export const suggestTopic = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Suggest a single, short topic (max 4 words) for a reading comprehension text suitable for a 4th-grade boy in Israel. Examples: 'Adventure in Minecraft', 'My Dog'. Return ONLY the Hebrew string.",
    });
    return response.text?.trim() || "הרפתקה בחלל";
  } catch (error) {
    console.error("Topic suggestion failed", error);
    return "יום כיף בלונה פארק";
  }
};

export const generateQuiz = async (settings: QuizSettings): Promise<QuizData> => {
  const prompt = `
    Create a reading comprehension test in Hebrew for a 4th-grade student.
    Topic: ${settings.topic || 'General Interest'}.
    Approximate text length: ${settings.textLength} lines.
    Number of multiple-choice questions: ${settings.questionCount}.
    Include Bonus Section: ${settings.includeBonus}.

    Guidelines:
    1. Language: Natural, modern Hebrew suitable for 9-10 year olds.
    2. Content: Engaging, positive, safe. Avoid complex academic language.
    3. Questions:
       - First questions should be easy (retrieval).
       - Later questions should be slightly harder (inference).
       - Provide 3-4 options for each question.
       - Mark correct answers clearly.
       - If questionCount > 6, make at least one question require selecting multiple answers (e.g., 'A and C are correct').
    4. Bonus Section (if requested):
       - A separate, shorter text related to the main topic (approx half length).
       - 2-3 open-ended questions suitable for discussion with a parent.
       - Provide a 'parentGuide' for checking the open answers.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: quizSchema,
    }
  });

  const jsonText = response.text;
  if (!jsonText) throw new Error("Failed to generate quiz");
  
  return JSON.parse(jsonText) as QuizData;
};