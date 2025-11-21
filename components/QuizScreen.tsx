import React, { useState, useEffect } from 'react';
import { QuizData, Question } from '../types';
import { BookOpen, CheckCircle2, XCircle, Eye } from 'lucide-react';

interface QuizScreenProps {
  data: QuizData;
  onComplete: (score: number, totalQuestions: number, pointsEarned: number) => void;
}

const QuizScreen: React.FC<QuizScreenProps> = ({ data, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [showTextModal, setShowTextModal] = useState(false);
  const [scoreHistory, setScoreHistory] = useState<boolean[]>([]);

  const currentQuestion = data.questions[currentQuestionIndex];

  const handleOptionSelect = (optionId: string) => {
    if (isSubmitted) return;

    if (currentQuestion.isMultipleChoice) {
      if (selectedOptionIds.includes(optionId)) {
        setSelectedOptionIds(prev => prev.filter(id => id !== optionId));
      } else {
        setSelectedOptionIds(prev => [...prev, optionId]);
      }
    } else {
      setSelectedOptionIds([optionId]);
    }
  };

  const checkAnswer = () => {
    if (selectedOptionIds.length === 0) return;

    // Sort arrays to compare contents regardless of order
    const selectedSorted = [...selectedOptionIds].sort();
    const correctSorted = [...currentQuestion.correctOptionIds].sort();

    const correct = JSON.stringify(selectedSorted) === JSON.stringify(correctSorted);
    
    setIsCorrect(correct);
    setIsSubmitted(true);
    
    if (correct) {
      setCorrectCount(prev => prev + 1);
      setScoreHistory(prev => [...prev, true]);
    } else {
      setScoreHistory(prev => [...prev, false]);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < data.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setIsSubmitted(false);
      setSelectedOptionIds([]);
      setIsCorrect(false);
    } else {
      // Finish Quiz (10 points per correct answer)
      const finalScore = Math.round((correctCount + (isCorrect ? 0 : 0)) / data.questions.length * 100); // Wait, scoreHistory tracks past.
      // Using correctCount directly is safer. If last was correct, it's already in correctCount state update? 
      // React state updates are async. Let's use the computed history length.
      const finalCorrect = scoreHistory.filter(Boolean).length;
      onComplete(Math.round((finalCorrect / data.questions.length) * 100), data.questions.length, finalCorrect * 10);
    }
  };

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto">
      {/* Top Bar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm mb-4">
        <div className="text-lg font-bold text-gray-700">
          שאלה {currentQuestionIndex + 1} מתוך {data.questions.length}
        </div>
        <button 
          onClick={() => setShowTextModal(true)}
          className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full hover:bg-blue-200 transition font-medium"
        >
          <BookOpen className="w-5 h-5" />
          הצג את הטקסט המלא
        </button>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 flex-1 flex flex-col">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{currentQuestion.text}</h2>
        {currentQuestion.isMultipleChoice && (
          <p className="text-sm text-orange-600 font-bold mb-4">* יש לבחור את כל התשובות הנכונות</p>
        )}

        <div className="space-y-4 mt-4 flex-1">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedOptionIds.includes(option.id);
            const isCorrectOption = currentQuestion.correctOptionIds.includes(option.id);
            
            let cardClass = "border-2 rounded-xl p-4 cursor-pointer transition-all flex items-center gap-4 ";
            if (isSubmitted) {
               if (isCorrectOption) {
                 cardClass += "bg-green-50 border-green-500";
               } else if (isSelected && !isCorrectOption) {
                 cardClass += "bg-red-50 border-red-500";
               } else {
                 cardClass += "bg-gray-50 border-gray-200 opacity-60";
               }
            } else {
              if (isSelected) {
                cardClass += "bg-blue-50 border-blue-500 shadow-md";
              } else {
                cardClass += "border-gray-200 hover:border-blue-300 hover:bg-gray-50";
              }
            }

            return (
              <div 
                key={option.id} 
                onClick={() => handleOptionSelect(option.id)}
                className={cardClass}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg shrink-0
                  ${isSelected || (isSubmitted && isCorrectOption) ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}
                  ${isSubmitted && isCorrectOption ? '!bg-green-500' : ''}
                  ${isSubmitted && isSelected && !isCorrectOption ? '!bg-red-500' : ''}
                `}>
                  {option.id}
                </div>
                <span className="text-lg md:text-xl text-gray-800">{option.text}</span>
              </div>
            );
          })}
        </div>

        {/* Action Area */}
        <div className="mt-8 border-t pt-6">
          {!isSubmitted ? (
            <button 
              onClick={checkAnswer}
              disabled={selectedOptionIds.length === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white text-xl font-bold py-3 rounded-xl transition"
            >
              בדוק תשובה
            </button>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className={`p-4 rounded-xl mb-4 flex items-start gap-3 ${isCorrect ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-900'}`}>
                {isCorrect ? <CheckCircle2 className="w-6 h-6 shrink-0 text-green-600" /> : <XCircle className="w-6 h-6 shrink-0 text-red-600" />}
                <div>
                  <p className="font-bold text-lg">{isCorrect ? "כל הכבוד! ענית נכון." : "לא נורא, זאת לא התשובה הנכונה."}</p>
                  <p className="mt-1 text-base">{currentQuestion.explanation}</p>
                </div>
              </div>
              <button 
                onClick={nextQuestion}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
              >
                המשך לשאלה הבאה
                <span className="transform rotate-180">➔</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Text Modal */}
      {showTextModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl max-h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden relative">
            <div className="bg-gray-100 p-4 border-b flex justify-between items-center sticky top-0 z-10">
              <h2 className="text-xl font-bold text-gray-800">{data.title}</h2>
              <button onClick={() => setShowTextModal(false)} className="bg-gray-200 hover:bg-gray-300 rounded-full p-2">
                <XCircle className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            <div className="p-6 md:p-8 overflow-y-auto text-lg leading-relaxed text-gray-800 whitespace-pre-wrap">
              {data.content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizScreen;