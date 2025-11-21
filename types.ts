export enum AppState {
  SETUP = 'SETUP',
  LOADING = 'LOADING',
  QUIZ = 'QUIZ',
  BONUS_INTRO = 'BONUS_INTRO',
  BONUS = 'BONUS',
  RESULTS = 'RESULTS',
  SHOP = 'SHOP'
}

export interface QuizSettings {
  questionCount: number;
  textLength: number;
  topic: string;
  includeBonus: boolean;
}

export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: number;
  text: string;
  options: QuestionOption[];
  correctOptionIds: string[]; // Array to support multiple correct answers
  explanation: string;
  isMultipleChoice: boolean; // True if multiple answers are correct
}

export interface BonusQuestion {
  id: number;
  text: string;
  parentGuide: string; // Tips for parents to check the answer
}

export interface QuizData {
  title: string;
  content: string; // The main reading text
  questions: Question[];
  bonusContent?: string;
  bonusQuestions?: BonusQuestion[];
}

export interface UserProgress {
  totalPoints: number;
  completedQuizzes: number;
  highScoresCount: number; // Scores > 80
  achievements: string[]; // IDs of unlocked achievements
  unlockedThemes: string[];
  currentTheme: string;
  unlockedIcons: string[];
  currentIcon: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  condition: (progress: UserProgress, currentScore?: number) => boolean;
}

export interface ShopItem {
  id: string;
  type: 'theme' | 'icon';
  name: string;
  value: string; // Hex code or class name or icon name
  cost: number;
}