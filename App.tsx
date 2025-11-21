import React, { useState, useEffect } from 'react';
import { AppState, QuizData, QuizSettings, UserProgress, ShopItem } from './types';
import { ACHIEVEMENTS, THEMES, ICONS } from './constants';
import { generateQuiz } from './services/geminiService';
import SetupScreen from './components/SetupScreen';
import QuizScreen from './components/QuizScreen';
import BonusScreen from './components/BonusScreen';
import ResultsScreen from './components/ResultsScreen';
import GamificationHub from './components/GamificationHub';
import { Loader2, AlertCircle } from 'lucide-react';

const INITIAL_PROGRESS: UserProgress = {
  totalPoints: 0,
  completedQuizzes: 0,
  highScoresCount: 0,
  achievements: [],
  unlockedThemes: ['blue'],
  currentTheme: 'blue',
  unlockedIcons: ['star'],
  currentIcon: 'star'
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.SETUP);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [progress, setProgress] = useState<UserProgress>(INITIAL_PROGRESS);
  const [lastScore, setLastScore] = useState(0);
  const [lastPointsEarned, setLastPointsEarned] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Load progress from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('readingHeroProgress');
    if (saved) {
      try {
        setProgress(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse progress", e);
      }
    }
  }, []);

  // Save progress whenever it changes
  useEffect(() => {
    localStorage.setItem('readingHeroProgress', JSON.stringify(progress));
  }, [progress]);

  const handleStartQuiz = async (settings: QuizSettings) => {
    setState(AppState.LOADING);
    setError(null);
    try {
      const data = await generateQuiz(settings);
      setQuizData(data);
      setState(AppState.QUIZ);
    } catch (err) {
      console.error(err);
      setError("אופס, הייתה בעיה ביצירת המבדק. נסה שוב, אולי עם נושא אחר?");
      setState(AppState.SETUP);
    }
  };

  const handleQuizComplete = (score: number, totalQuestions: number, pointsEarned: number) => {
    setLastScore(score);
    setLastPointsEarned(pointsEarned);

    // Update stats and check achievements
    setProgress(prev => {
      const newProgress = {
        ...prev,
        totalPoints: prev.totalPoints + pointsEarned,
        completedQuizzes: prev.completedQuizzes + 1,
        highScoresCount: score >= 80 ? prev.highScoresCount + 1 : prev.highScoresCount
      };

      // Check for new achievements
      ACHIEVEMENTS.forEach(ach => {
        if (!newProgress.achievements.includes(ach.id) && ach.condition(newProgress, score)) {
          newProgress.achievements.push(ach.id);
          // Could add a toast here for "New Achievement!"
        }
      });

      return newProgress;
    });

    if (quizData?.bonusQuestions && quizData.bonusQuestions.length > 0) {
      setState(AppState.BONUS);
    } else {
      setState(AppState.RESULTS);
    }
  };

  const handleBuyItem = (item: ShopItem) => {
    if (progress.totalPoints >= item.cost) {
      setProgress(prev => ({
        ...prev,
        totalPoints: prev.totalPoints - item.cost,
        unlockedThemes: item.type === 'theme' ? [...prev.unlockedThemes, item.value] : prev.unlockedThemes,
        unlockedIcons: item.type === 'icon' ? [...prev.unlockedIcons, item.value] : prev.unlockedIcons
      }));
    }
  };

  const handleEquipTheme = (theme: string) => {
    setProgress(prev => ({ ...prev, currentTheme: theme }));
  };

  const handleEquipIcon = (icon: string) => {
    setProgress(prev => ({ ...prev, currentIcon: icon }));
  };

  const CurrentUserIcon = ICONS[progress.currentIcon] || ICONS.star;
  const currentThemeClasses = THEMES[progress.currentTheme as keyof typeof THEMES] || THEMES.blue;

  return (
    <div className={`min-h-screen transition-colors duration-500 ${currentThemeClasses} p-4 md:p-6`}>
      {/* Header */}
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-full shadow-sm">
            <CurrentUserIcon size={28} className="text-blue-600" />
          </div>
          <div>
            <h1 className="font-bold text-xl md:text-2xl leading-none">גיבור הקריאה</h1>
            <p className="text-sm opacity-80">שלום לרן!</p>
          </div>
        </div>
        
        {state !== AppState.SHOP && (
          <button 
            onClick={() => setState(AppState.SHOP)}
            className="bg-white/80 hover:bg-white px-4 py-2 rounded-xl font-bold shadow-sm transition flex items-center gap-2"
          >
            <span className="text-yellow-600">{progress.totalPoints}</span>
            <span className="text-xs text-gray-500">נקודות</span>
          </button>
        )}
      </header>

      <main className="max-w-6xl mx-auto">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-r mb-6 flex items-center gap-3">
            <AlertCircle />
            <p>{error}</p>
          </div>
        )}

        {state === AppState.SETUP && (
          <SetupScreen onStart={handleStartQuiz} />
        )}

        {state === AppState.LOADING && (
          <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
            <Loader2 className="w-16 h-16 animate-spin text-blue-500" />
            <p className="text-2xl font-medium animate-pulse">כותב סיפור במיוחד בשבילך...</p>
            <p className="text-gray-500">זה לוקח כמה שניות</p>
          </div>
        )}

        {state === AppState.QUIZ && quizData && (
          <QuizScreen 
            data={quizData} 
            onComplete={handleQuizComplete} 
          />
        )}

        {state === AppState.BONUS && quizData && (
          <BonusScreen 
            data={quizData} 
            onFinish={() => setState(AppState.RESULTS)} 
          />
        )}

        {state === AppState.RESULTS && (
          <ResultsScreen 
            score={lastScore} 
            pointsEarned={lastPointsEarned}
            onHome={() => setState(AppState.SETUP)}
            onShop={() => setState(AppState.SHOP)}
          />
        )}

        {state === AppState.SHOP && (
          <GamificationHub 
            progress={progress}
            onBuy={handleBuyItem}
            onEquipTheme={handleEquipTheme}
            onEquipIcon={handleEquipIcon}
            onBack={() => setState(AppState.SETUP)}
          />
        )}
      </main>
    </div>
  );
};

export default App;