"use client";

import { useState } from "react";

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface QuizProps {
  questions: QuizQuestion[];
}

export default function Quiz({ questions }: QuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);

  const currentQ = questions[currentIndex];
  const isFinished = currentIndex >= questions.length;

  if (!questions || questions.length === 0) return null;

  const handleSelect = (opt: string) => {
    if (showFeedback) return;
    setSelectedOption(opt);
    setShowFeedback(true);
    if (opt === currentQ.correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    setShowFeedback(false);
    setSelectedOption(null);
    setCurrentIndex(i => i + 1);
  };

  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="bg-white dark:bg-[#1e1e22] border border-gray-200 dark:border-white/10 rounded-3xl p-8 sm:p-10 text-center animate-fade-in shadow-lg dark:shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#3b82f6] to-transparent opacity-50"></div>
        <div className="w-20 h-20 bg-blue-50 dark:bg-[#3b82f6]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="fa-solid fa-trophy text-3xl text-[#3b82f6]"></i>
        </div>
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Quiz Completed!</h2>
        <p className="text-gray-500 dark:text-white/50 mb-8">You scored {score} out of {questions.length} ({percentage}%)</p>
        
        <button 
          onClick={() => {
            setCurrentIndex(0);
            setScore(0);
            setSelectedOption(null);
            setShowFeedback(false);
          }}
          className="bg-[#3b82f6] text-white font-semibold rounded-[16px] px-8 py-3.5 hover:bg-[#60a5fa] transition-all duration-300 shadow-[0_8px_20px_-6px_rgba(59,130,246,0.5)] active:scale-[0.97] hover:-translate-y-0.5"
        >
          Retake Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/90 dark:bg-gradient-to-b dark:from-[#18181b]/90 dark:to-[#09090b]/90 backdrop-blur-2xl border border-gray-200/50 dark:border-white/10 rounded-[32px] p-5 sm:p-8 md:p-10 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] shadow-lg dark:shadow-[0_0_80px_-20px_rgba(59,130,246,0.1)] relative animate-fade-in overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#3b82f6] blur-[120px] opacity-5 dark:opacity-10 rounded-full pointer-events-none"></div>

      <div className="flex justify-between items-center mb-4 sm:mb-6 relative z-10">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-[#3b82f6]/10 flex items-center justify-center border border-blue-200 dark:border-[#3b82f6]/20">
            <span className="text-[#3b82f6] text-xs font-bold">{currentIndex + 1}</span>
          </div>
          <span className="text-[12px] uppercase tracking-[0.15em] font-bold text-gray-400 dark:text-white/50">of {questions.length}</span>
        </div>
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-white/5 px-3 sm:px-4 py-1.5 rounded-full border border-gray-200 dark:border-white/10">
          <i className="fa-solid fa-star text-[#f59e0b] text-xs"></i>
          <span className="text-sm font-bold text-gray-900 dark:text-white">{score}</span>
        </div>
      </div>

      <div className="w-full h-1 bg-gray-100 dark:bg-white/5 rounded-full mb-6 sm:mb-8 overflow-hidden relative z-10">
        <div 
          className="h-full bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
        ></div>
      </div>

      <h3 className="text-lg sm:text-[22px] font-medium text-gray-900 dark:text-white mb-6 sm:mb-10 leading-relaxed tracking-tight relative z-10">
        {currentQ.question}
      </h3>

      <div className="flex flex-col gap-3 sm:gap-4 relative z-10">
        {currentQ.options.map((opt, i) => {
          const isSelected = selectedOption === opt;
          const isCorrect = opt === currentQ.correctAnswer;
          
          let stateClass = "border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#18181b] hover:bg-blue-50 dark:hover:bg-[#27272a] hover:border-blue-300 dark:hover:border-[#3b82f6]/50 text-gray-800 dark:text-white/80 hover:text-gray-900 dark:hover:text-white shadow-sm hover:shadow-md dark:hover:shadow-[0_0_20px_-5px_rgba(59,130,246,0.2)] hover:scale-[1.01]";
          
          if (showFeedback) {
            if (isCorrect) {
              stateClass = "border-emerald-400 dark:border-[#10b981]/50 bg-emerald-50 dark:bg-gradient-to-r dark:from-[#10b981]/20 dark:to-[#10b981]/5 text-emerald-800 dark:text-white shadow-md dark:shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)] scale-[1.02]";
            } else if (isSelected && !isCorrect) {
              stateClass = "border-red-400 dark:border-[#ef4444]/50 bg-red-50 dark:bg-gradient-to-r dark:from-[#ef4444]/20 dark:to-[#ef4444]/5 text-red-800 dark:text-white shadow-md dark:shadow-[0_0_30px_-5px_rgba(239,68,68,0.2)]";
            } else {
              stateClass = "border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#09090b] text-gray-400 dark:text-white/30 opacity-40 scale-[0.98]";
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(opt)}
              disabled={showFeedback}
              className={`w-full text-left p-4 sm:p-5 rounded-[24px] border transition-all duration-500 ease-out relative overflow-hidden flex items-center gap-3 sm:gap-4 group ${stateClass}`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors
                ${showFeedback && isCorrect ? "border-emerald-500 bg-emerald-500" : 
                  showFeedback && isSelected && !isCorrect ? "border-red-500 bg-red-500" : 
                  "border-gray-300 dark:border-white/20 group-hover:border-[#3b82f6]"}
              `}>
                {showFeedback && isCorrect && <i className="fa-solid fa-check text-white text-[10px]"></i>}
                {showFeedback && isSelected && !isCorrect && <i className="fa-solid fa-xmark text-white text-[10px]"></i>}
              </div>
              <span className="font-medium text-[14px] sm:text-[16px] flex-1">{opt}</span>
            </button>
          );
        })}
      </div>

      {showFeedback && (
        <div className="mt-6 sm:mt-8 p-4 sm:p-6 rounded-2xl bg-gray-50 dark:bg-[#09090b] border border-gray-200 dark:border-white/10 animate-slide-down relative overflow-hidden z-10">
          {/* Status glow */}
          <div className={`absolute top-0 left-0 w-1 h-full ${selectedOption === currentQ.correctAnswer ? "bg-emerald-500" : "bg-red-500"}`}></div>
          
          <div className="pl-3">
            <h4 className={`text-base sm:text-lg font-bold mb-2 flex items-center gap-2 ${selectedOption === currentQ.correctAnswer ? "text-emerald-600 dark:text-[#10b981]" : "text-red-600 dark:text-[#ef4444]"}`}>
              {selectedOption === currentQ.correctAnswer ? (
                <><i className="fa-solid fa-check-circle"></i> Brilliant!</>
              ) : (
                <><i className="fa-solid fa-xmark-circle"></i> Not quite.</>
              )}
            </h4>
            <p className="text-gray-600 dark:text-white/70 text-sm sm:text-[15px] leading-relaxed mb-4 sm:mb-6">{currentQ.explanation}</p>
            
            <div className="flex justify-end">
              <button 
                onClick={nextQuestion}
                className="bg-[#3b82f6] text-white font-bold rounded-[16px] px-5 sm:px-7 py-2.5 sm:py-3.5 hover:bg-[#60a5fa] hover:scale-105 active:scale-[0.97] transition-all duration-300 flex items-center gap-2 shadow-[0_8px_20px_-6px_rgba(59,130,246,0.5)] text-sm sm:text-base hover:-translate-y-0.5"
              >
                Next Question
                <i className="fa-solid fa-arrow-right text-sm"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
