import { Achievement, ShopItem } from './types';
import { Star, Trophy, BookOpen, Gamepad2, Rocket, Heart, Zap, Smile } from 'lucide-react';

export const THEMES = {
  blue: 'bg-blue-50 text-blue-900',
  green: 'bg-green-50 text-green-900',
  purple: 'bg-purple-50 text-purple-900',
  orange: 'bg-orange-50 text-orange-900',
  gray: 'bg-gray-50 text-gray-900',
};

export const ICONS: Record<string, any> = {
  star: Star,
  trophy: Trophy,
  book: BookOpen,
  game: Gamepad2,
  rocket: Rocket,
  heart: Heart,
  zap: Zap,
  smile: Smile
};

export const SHOP_ITEMS: ShopItem[] = [
  { id: 'theme_green', type: 'theme', name: 'ערכת טבע (ירוק)', value: 'green', cost: 50 },
  { id: 'theme_purple', type: 'theme', name: 'ערכת קסם (סגול)', value: 'purple', cost: 50 },
  { id: 'theme_orange', type: 'theme', name: 'ערכת שמש (כתום)', value: 'orange', cost: 80 },
  { id: 'icon_game', type: 'icon', name: 'אייקון גיימר', value: 'game', cost: 30 },
  { id: 'icon_rocket', type: 'icon', name: 'אייקון חלל', value: 'rocket', cost: 30 },
  { id: 'icon_zap', type: 'icon', name: 'אייקון אנרגיה', value: 'zap', cost: 40 },
];

export const ACHIEVEMENTS: Achievement[] = [
  { 
    id: 'first_quiz', 
    title: 'צעד ראשון', 
    description: 'סיימת מבדק ראשון בהצלחה!', 
    condition: (p) => p.completedQuizzes >= 1 
  },
  { 
    id: 'three_quizzes', 
    title: 'תולעת ספרים', 
    description: 'סיימת 3 מבדקים!', 
    condition: (p) => p.completedQuizzes >= 3 
  },
  { 
    id: 'score_80', 
    title: 'אלוף הקריאה', 
    description: 'קיבלת ציון מעל 80 במבדק.', 
    condition: (p, score) => (score ? score >= 80 : false) 
  },
  { 
    id: 'rich_kid', 
    title: 'אספן נקודות', 
    description: 'צברת מעל 200 נקודות.', 
    condition: (p) => p.totalPoints >= 200 
  },
];

export const DEFAULT_TOPICS = [
  "מיינקראפט",
  "לגו",
  "כדורגל",
  "יום בבית הספר",
  "טיול משפחתי",
  "חלל",
  "חיות",
  "גיבורי על"
];