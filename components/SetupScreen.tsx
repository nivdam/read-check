import React, { useState } from 'react';
import { QuizSettings } from '../types';
import { suggestTopic } from '../services/geminiService';
import { Sparkles, Loader2 } from 'lucide-react';

interface SetupScreenProps {
  onStart: (settings: QuizSettings) => void;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onStart }) => {
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [textLength, setTextLength] = useState<number>(40);
  const [topic, setTopic] = useState<string>('');
  const [includeBonus, setIncludeBonus] = useState<boolean>(false);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const handleSuggestTopic = async () => {
    setIsSuggesting(true);
    try {
      const suggestion = await suggestTopic();
      setTopic(suggestion);
    } catch (e) {
      setTopic("הרפתקה בבית הספר");
    } finally {
      setIsSuggesting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-8">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">הגדרות המבדק</h1>
      
      {/* Questions Count */}
      <div className="space-y-3">
        <label
          id="question-count-label"
          htmlFor="question-count-slider"
          className="block text-lg font-medium text-gray-700"
        >
          מספר השאלות במבדק ({questionCount})
        </label>
        <input 
          type="range" 
          min="1" 
          max="20" 
          value={questionCount} 
          id="question-count-slider"
          onChange={(e) => setQuestionCount(parseInt(e.target.value))}
          className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
        />
        <input
          type="number"
          min="1"
          max="20"
          value={questionCount}
          aria-labelledby="question-count-label"
          onChange={(e) => setQuestionCount(parseInt(e.target.value))}
          className="w-20 p-2 border border-gray-300 rounded-md text-center text-white"
        />
      </div>

      {/* Text Length */}
      <div className="space-y-3">
        <label
          id="text-length-label"
          htmlFor="text-length-slider"
          className="block text-lg font-medium text-gray-700"
        >
          אורך טקסט הקריאה ({textLength} שורות)
        </label>
        <p className="text-sm text-gray-500">עמוד מלא הוא בערך 40 שורות</p>
        <input 
          type="range" 
          min="2" 
          max="160" 
          value={textLength} 
          id="text-length-slider"
          onChange={(e) => setTextLength(parseInt(e.target.value))}
          className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
        />
        <input
          type="number"
          min="2"
          max="160"
          value={textLength}
          aria-labelledby="text-length-label"
          onChange={(e) => setTextLength(parseInt(e.target.value))}
          className="w-20 p-2 border border-gray-300 rounded-md text-center text-white"
        />
      </div>

      {/* Topic Selection */}
      <div className="space-y-3">
        <label htmlFor="topic-input" className="block text-lg font-medium text-gray-700">
          נושא המבדק
        </label>
        <div className="flex gap-3">
          <input 
            type="text" 
            value={topic}
            id="topic-input"
            onChange={(e) => setTopic(e.target.value)}
            placeholder="למשל: מיינקראפט, לגו, חלל..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-white"
          />
          <button 
            onClick={handleSuggestTopic}
            disabled={isSuggesting}
            className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
          >
            {isSuggesting ? <Loader2 className="animate-spin h-5 w-5"/> : <Sparkles className="h-5 w-5"/>}
            הצע לי נושא
          </button>
        </div>
      </div>

      {/* Bonus Toggle */}
      <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg border border-purple-100">
        <input 
          type="checkbox" 
          id="bonus"
          checked={includeBonus}
          onChange={(e) => setIncludeBonus(e.target.checked)}
          className="w-6 h-6 text-purple-600 rounded focus:ring-purple-500 border-gray-300"
        />
        <label htmlFor="bonus" className="text-lg text-purple-900 cursor-pointer select-none">
          להוסיף שאלות בונוס? (למתקדמים!)
        </label>
      </div>

      {/* Info Box */}
      <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
        <strong>שים לב:</strong> השאלות במבדק הראשי הן שאלות אמריקאיות. שאלות הבונוס הן שאלות פתוחות.
      </div>

      <button 
        onClick={() => onStart({ questionCount, textLength, topic, includeBonus })}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold py-4 rounded-xl shadow-lg transform transition active:scale-95"
      >
        צור מבדק
      </button>
    </div>
  );
};

export default SetupScreen;
