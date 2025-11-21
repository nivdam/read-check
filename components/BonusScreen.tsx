import React, { useState } from 'react';
import { QuizData } from '../types';
import { Star } from 'lucide-react';

interface BonusScreenProps {
  data: QuizData;
  onFinish: () => void;
}

const BonusScreen: React.FC<BonusScreenProps> = ({ data, onFinish }) => {
  const [showGuides, setShowGuides] = useState(false);

  if (!data.bonusQuestions || data.bonusQuestions.length === 0) {
    return (
      <div className="text-center p-10">
        <h2 className="text-2xl font-bold">אין שאלות בונוס הפעם.</h2>
        <button onClick={onFinish} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded">סיום</button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      <div className="bg-purple-100 border-2 border-purple-300 p-6 rounded-2xl shadow-sm">
        <h2 className="text-2xl font-bold text-purple-900 mb-2 flex items-center gap-2">
          <Star className="fill-purple-500 text-purple-600" />
          משימת בונוס למתקדמים!
        </h2>
        <p className="text-purple-800 text-lg">
          קראו את הקטע הקצר וענו על השאלות. כאן אין בדיקה אוטומטית - המטרה היא לחשוב ולדבר על הסיפור.
        </p>
      </div>

      {data.bonusContent && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-xl font-bold mb-3 text-gray-700">המשך הסיפור...</h3>
          <div className="text-lg leading-relaxed whitespace-pre-wrap text-gray-800">
            {data.bonusContent}
          </div>
        </div>
      )}

      <div className="space-y-6">
        {data.bonusQuestions.map((q) => (
          <div key={q.id} className="bg-white p-6 rounded-xl shadow-md">
            <h4 className="text-lg font-bold text-gray-800 mb-3">{q.text}</h4>
            <textarea 
              className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none resize-none text-lg"
              placeholder="כתוב את התשובה שלך כאן..."
            ></textarea>
            
            {showGuides && (
              <div className="mt-4 bg-yellow-50 p-4 rounded-lg border border-yellow-200 animate-in fade-in duration-500">
                <p className="font-bold text-yellow-800 text-sm mb-1">הכוונה להורים (רעיונות לתשובה):</p>
                <p className="text-yellow-900">{q.parentGuide}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-xl shadow-lg fixed bottom-0 left-0 right-0 md:relative md:bg-transparent md:shadow-none md:p-0 flex flex-col md:flex-row gap-4 items-center justify-between">
        <button 
          onClick={() => setShowGuides(!showGuides)}
          className="w-full md:w-auto text-purple-700 font-bold underline hover:text-purple-900 transition"
        >
          {showGuides ? "הסתר הדרכה להורים" : "להורה: בדקו יחד את התשובות"}
        </button>

        <button 
          onClick={onFinish}
          className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white text-xl font-bold px-8 py-3 rounded-xl shadow-lg transition transform active:scale-95"
        >
          סיימתי את הבונוס!
        </button>
      </div>
    </div>
  );
};

export default BonusScreen;