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
    <div className="bg-[#1e1e22] border border-white/10 rounded-[var(--radius-3xl)] p-8 shadow-2xl relative animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <span className="text-[11px] uppercase tracking-widest font-semibold text-[#3b82f6]">Question {currentIndex + 1} of {questions.length}</span>
        <span className="text-xs font-medium text-white/40">Score: {score}</span>
      </div>

      <h3 className="text-xl font-medium text-white/90 mb-8 leading-relaxed">
        {currentQ.question}
      </h3>

      <div className="flex flex-col gap-3">
        {currentQ.options.map((opt, i) => {
          const isSelected = selectedOption === opt;
          const isCorrect = opt === currentQ.correctAnswer;
          
          let stateClass = "border-white/10 bg-black/30 hover:border-white/30 text-white/70 hover:text-white";
          
          if (showFeedback) {
            if (isCorrect) {
              stateClass = "border-[#10b981]/50 bg-[#10b981]/10 text-[#10b981]";
            } else if (isSelected && !isCorrect) {
              stateClass = "border-[#ef4444]/50 bg-[#ef4444]/10 text-[#ef4444]";
            } else {
              stateClass = "border-white/5 bg-black/10 text-white/30 opacity-50";
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(opt)}
              disabled={showFeedback}
              className={`w-full text-left p-5 rounded-[var(--radius-xl)] border transition-all duration-300 ${stateClass} relative overflow-hidden flex items-center justify-between group`}
            >
              <span className="font-medium pr-6">{opt}</span>
              {showFeedback && isCorrect && <i className="fa-solid fa-circle-check text-xl"></i>}
              {showFeedback && isSelected && !isCorrect && <i className="fa-solid fa-circle-xmark text-xl"></i>}
            </button>
          );
        })}
      </div>

      {showFeedback && (
        <div className="mt-8 p-6 rounded-[var(--radius-xl)] bg-[#141416] border border-white/5 animate-slide-down">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              {selectedOption === currentQ.correctAnswer ? (
                <i className="fa-solid fa-check text-[#10b981]"></i>
              ) : (
                <i className="fa-solid fa-xmark text-[#ef4444]"></i>
              )}
            </div>
            <div>
              <h4 className="font-semibold text-white/90 mb-1">
                {selectedOption === currentQ.correctAnswer ? "Correct!" : "Incorrect"}
              </h4>
              <p className="text-white/60 text-sm leading-relaxed">{currentQ.explanation}</p>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button 
              onClick={nextQuestion}
              className="bg-white text-black font-semibold rounded-xl px-6 py-2.5 hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              Next Question
              <i className="fa-solid fa-arrow-right text-sm"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
