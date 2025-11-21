import React, { useEffect, useState } from 'react';
import { Trophy, Home, ShoppingBag } from 'lucide-react';

interface ResultsScreenProps {
  score: number;
  pointsEarned: number;
  onHome: () => void;
  onShop: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ score, pointsEarned, onHome, onShop }) => {
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getFeedbackMessage = () => {
    if (score >= 90) return "וואו! אלוף הקריאה! ביצוע מושלם.";
    if (score >= 80) return "כל הכבוד! הבנה מצוינת של הטקסט.";
    if (score >= 60) return "עבודה טובה! רואים שאתה משתפר.";
    return "התחלה טובה! כל שורה שאתה קורא מחזקת את המוח.";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8 relative">
      
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border-4 border-blue-100 max-w-2xl w-full animate-fade-in-up">
        <div className="flex justify-center mb-6">
          <div className={`p-6 rounded-full ${score > 80 ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'} animate-bounce`}>
            <Trophy className="w-16 h-16 md:w-20 md:h-20" />
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">הציון שלך: {score}</h1>
        <p className="text-xl md:text-2xl text-gray-600 font-medium mb-8">{getFeedbackMessage()}</p>

        <div className="bg-green-50 rounded-xl p-6 mb-8 border border-green-100 flex flex-col items-center transform transition-all hover:scale-105">
          <span className="text-gray-600 text-lg">צברת במבדק זה</span>
          <span className="text-4xl font-bold text-green-600 flex items-center gap-2 mt-2">
            +{pointsEarned} <span className="text-2xl">נקודות</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <button 
            onClick={onShop}
            className="flex items-center justify-center gap-2 bg-purple-100 hover:bg-purple-200 text-purple-800 py-4 rounded-xl font-bold text-lg transition shadow-sm"
          >
            <ShoppingBag className="w-6 h-6" />
            לחנות ההפתעות
          </button>
          <button 
            onClick={onHome}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg transition shadow-lg shadow-blue-200"
          >
            <Home className="w-6 h-6" />
            חזרה למסך הראשי
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;