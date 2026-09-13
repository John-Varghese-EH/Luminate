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
    if (showFeedback) return; // Prevent changing answer after selection
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
      <div className="bg-[#1e1e22] border border-white/10 rounded-[var(--radius-3xl)] p-10 text-center animate-fade-in shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#3b82f6] to-transparent opacity-50"></div>
        <div className="w-20 h-20 bg-[#3b82f6]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="fa-solid fa-trophy text-3xl text-[#3b82f6]"></i>
        </div>
        <h2 className="text-2xl font-bold mb-2 text-white">Quiz Completed!</h2>
        <p className="text-white/50 mb-8">You scored {score} out of {questions.length} ({percentage}%)</p>
        
        <button 
          onClick={() => {
            setCurrentIndex(0);
            setScore(0);
            setSelectedOption(null);
            setShowFeedback(false);
          }}
          className="bg-white text-black font-semibold rounded-xl px-8 py-3 hover:bg-gray-100 transition-colors"
        >
          Retake Quiz
        </button>
      </div>
    );
  }

  return (
  return (
    <div className="bg-gradient-to-b from-[#18181b] to-[#09090b] border border-white/10 rounded-[32px] p-8 md:p-10 shadow-[0_0_80px_-20px_rgba(59,130,246,0.1)] relative animate-fade-in overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#3b82f6] blur-[120px] opacity-10 rounded-full pointer-events-none"></div>

      <div className="flex justify-between items-center mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#3b82f6]/10 flex items-center justify-center border border-[#3b82f6]/20">
            <span className="text-[#3b82f6] text-xs font-bold">{currentIndex + 1}</span>
          </div>
          <span className="text-[12px] uppercase tracking-[0.15em] font-bold text-white/50">of {questions.length}</span>
        </div>
        <div className="flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
          <i className="fa-solid fa-star text-[#f59e0b] text-xs"></i>
          <span className="text-sm font-bold text-white">{score}</span>
        </div>
      </div>

      <div className="w-full h-1 bg-white/5 rounded-full mb-8 overflow-hidden relative z-10">
        <div 
          className="h-full bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
        ></div>
      </div>

      <h3 className="text-[22px] font-medium text-white mb-10 leading-relaxed tracking-tight relative z-10">
        {currentQ.question}
      </h3>

      <div className="flex flex-col gap-4 relative z-10">
        {currentQ.options.map((opt, i) => {
          const isSelected = selectedOption === opt;
          const isCorrect = opt === currentQ.correctAnswer;
          
          let stateClass = "border-white/10 bg-[#18181b] hover:bg-[#27272a] hover:border-[#3b82f6]/50 text-white/80 hover:text-white shadow-sm hover:shadow-[0_0_20px_-5px_rgba(59,130,246,0.2)] hover:scale-[1.01]";
          
          if (showFeedback) {
            if (isCorrect) {
              stateClass = "border-[#10b981]/50 bg-gradient-to-r from-[#10b981]/20 to-[#10b981]/5 text-white shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)] scale-[1.02]";
            } else if (isSelected && !isCorrect) {
              stateClass = "border-[#ef4444]/50 bg-gradient-to-r from-[#ef4444]/20 to-[#ef4444]/5 text-white shadow-[0_0_30px_-5px_rgba(239,68,68,0.2)]";
            } else {
              stateClass = "border-white/5 bg-[#09090b] text-white/30 opacity-40 scale-[0.98]";
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(opt)}
              disabled={showFeedback}
              className={`w-full text-left p-5 rounded-[20px] border transition-all duration-500 ease-out relative overflow-hidden flex items-center gap-4 group ${stateClass}`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors
                ${showFeedback && isCorrect ? "border-[#10b981] bg-[#10b981]" : 
                  showFeedback && isSelected && !isCorrect ? "border-[#ef4444] bg-[#ef4444]" : 
                  "border-white/20 group-hover:border-[#3b82f6]"}
              `}>
                {showFeedback && isCorrect && <i className="fa-solid fa-check text-black text-[10px]"></i>}
                {showFeedback && isSelected && !isCorrect && <i className="fa-solid fa-xmark text-black text-[10px]"></i>}
              </div>
              <span className="font-medium text-[16px] flex-1">{opt}</span>
            </button>
          );
        })}
      </div>

      {showFeedback && (
        <div className="mt-8 p-6 rounded-[24px] bg-[#09090b] border border-white/10 animate-slide-down relative overflow-hidden z-10 shadow-inner">
          {/* Status glow */}
          <div className={`absolute top-0 left-0 w-1 h-full ${selectedOption === currentQ.correctAnswer ? "bg-[#10b981]" : "bg-[#ef4444]"}`}></div>
          
          <div className="pl-3">
            <h4 className={`text-lg font-bold mb-2 flex items-center gap-2 ${selectedOption === currentQ.correctAnswer ? "text-[#10b981]" : "text-[#ef4444]"}`}>
              {selectedOption === currentQ.correctAnswer ? (
                <><i className="fa-solid fa-check-circle"></i> Brilliant!</>
              ) : (
                <><i className="fa-solid fa-xmark-circle"></i> Not quite.</>
              )}
            </h4>
            <p className="text-white/70 text-[15px] leading-relaxed mb-6">{currentQ.explanation}</p>
            
            <div className="flex justify-end">
              <button 
                onClick={nextQuestion}
                className="bg-white text-black font-bold rounded-xl px-7 py-3.5 hover:bg-gray-200 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
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
