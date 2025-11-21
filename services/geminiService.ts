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

  try {
    const response = await fetch("/api/generate-quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();

    if (!data || !data.title) {
      throw new Error("Invalid data received from server");
    }

    return data as QuizData;
  } catch (error) {
    console.error("Error in generateQuiz service:", error);
    throw error;
  }
};
