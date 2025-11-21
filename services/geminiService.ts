import { QuizData, QuizSettings } from "../types";

export const suggestTopic = async (): Promise<string> => {
  try {
    const res = await fetch("/api/suggest-topic", {
      method: "POST",
    });

    const data = await res.json();

    return data.text?.trim() || "הרפתקה בחלל";
  } catch {
    return "יום כיף בלונה פארק";
  }
};

export const generateQuiz = async (
  settings: QuizSettings
): Promise<QuizData> => {
  const prompt = `
    Create a reading comprehension test in Hebrew for a 4th-grade student.
    Topic: ${settings.topic || "General Interest"}.
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

  const res = await fetch("/api/generate-quiz", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    throw new Error("Failed to generate quiz");
  }

  const data = (await res.json()) as { text?: string };

  if (!data.text) {
    throw new Error("Failed to generate quiz (empty response)");
  }

  return JSON.parse(data.text) as QuizData;
};
