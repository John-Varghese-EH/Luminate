"use client";

import { useState } from "react";

interface FlashcardProps {
  question: string;
  answer: string;
  onRate?: (rating: "hard" | "good" | "easy") => void;
}

export default function Flashcard({ question, answer, onRate }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [rating, setRating] = useState<"hard" | "good" | "easy" | null>(null);

  const handleRating = (e: React.MouseEvent, type: "hard" | "good" | "easy") => {
    e.stopPropagation();
    setRating(type);
    setIsFlipped(false);
    onRate?.(type);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Flashcard"
      className="group h-[260px] sm:h-[280px] w-full cursor-pointer animate-fade-in focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-[32px]"
      style={{ perspective: "1200px" }}
      onClick={() => setIsFlipped(!isFlipped)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsFlipped(!isFlipped);
        }
      }}
    >
      <div
        className={`relative h-full w-full rounded-[28px] sm:rounded-[32px] shadow-lg dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] transition-all duration-700 ease-out ${
          isFlipped ? "rotate-y-180" : "group-hover:translate-y-[-4px] group-hover:shadow-xl dark:group-hover:shadow-[0_20px_40px_rgba(59,130,246,0.15)]"
        }`}
        style={{ transformStyle: "preserve-3d", transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
      >
        {/* Front */}
        <div 
          className="absolute inset-0 flex flex-col rounded-[28px] sm:rounded-[32px] bg-white/90 dark:bg-gradient-to-b dark:from-[#18181b]/90 dark:to-[#09090b]/90 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 p-6 sm:p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Subtle top inner glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-[#3b82f6] blur-md opacity-20"></div>
          
          <div className="absolute top-5 sm:top-6 right-5 sm:right-6 flex gap-1.5 opacity-50">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-white/40"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-white/40"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-white/40"></span>
          </div>

          {rating && (
            <div className="absolute top-5 sm:top-6 left-5 sm:left-6 animate-fade-in">
              <div className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg ${
                rating === 'hard' ? 'bg-red-500/10 border-red-500/30 text-red-500 dark:text-red-400' :
                rating === 'good' ? 'bg-blue-500/10 border-blue-500/30 text-blue-500 dark:text-blue-400' :
                'bg-green-500/10 border-green-500/30 text-green-500 dark:text-green-400'
              }`}>
                {rating === 'hard' && <><i className="fa-solid fa-rotate-left"></i> Review Again</>}
                {rating === 'good' && <><i className="fa-solid fa-check"></i> Getting There</>}
                {rating === 'easy' && <><i className="fa-solid fa-star"></i> Mastered</>}
              </div>
            </div>
          )}
          
          <div className="flex-1 flex items-center justify-center mt-4">
            <p className="text-lg sm:text-xl font-medium text-gray-800 dark:text-white/90 text-center leading-relaxed">{question}</p>
          </div>
          
          <div className="text-center pb-2">
            <span className="text-[11px] uppercase tracking-[0.2em] text-gray-400 dark:text-white/30 font-bold group-hover:text-[#3b82f6]/70 transition-colors">Tap to flip</span>
          </div>
        </div>

        {/* Back */}
        <div 
          className="absolute inset-0 flex flex-col rounded-[28px] sm:rounded-[32px] bg-gradient-to-br from-blue-600 to-blue-900 dark:from-[#1e3a8a] dark:to-[#0f172a] border border-blue-400/30 dark:border-[#3b82f6]/30 p-6 sm:p-8 shadow-[inset_0_0_80px_rgba(59,130,246,0.15)] rotate-y-180"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="absolute top-5 sm:top-6 left-5 sm:left-6 w-9 h-9 sm:w-10 sm:h-10 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 backdrop-blur-md">
            <i className="fa-solid fa-lightbulb text-white"></i>
          </div>
          
          <div className="flex-1 flex items-center justify-center mt-8 mb-12">
            <p className="text-[15px] sm:text-[17px] text-white leading-relaxed font-medium text-center">{answer}</p>
          </div>

          {/* Spaced Repetition Action Bar */}
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 w-[90%] sm:w-[85%] flex items-center justify-between gap-2 sm:gap-3 p-1.5 bg-black/40 dark:bg-[#09090b]/80 backdrop-blur-xl border border-white/10 rounded-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.5)]" onClick={(e) => e.stopPropagation()}>
            <button onClick={(e) => handleRating(e, "hard")} className={`flex-1 py-2 sm:py-2.5 rounded-[16px] text-xs font-semibold tracking-wide hover:text-white hover:bg-red-500/20 hover:shadow-[inset_0_0_12px_rgba(239,68,68,0.3)] transition-all duration-300 active:scale-[0.97] group/btn ${rating === 'hard' ? 'text-white bg-red-500/20' : 'text-red-400'}`}>
              <span className="flex items-center justify-center gap-1.5">
                <i className="fa-solid fa-rotate-left text-[10px] opacity-70 group-hover/btn:opacity-100"></i> Hard
              </span>
            </button>
            <div className="w-px h-5 sm:h-6 bg-white/10"></div>
            <button onClick={(e) => handleRating(e, "good")} className={`flex-1 py-2 sm:py-2.5 rounded-[16px] text-xs font-semibold tracking-wide hover:text-white hover:bg-blue-500/20 hover:shadow-[inset_0_0_12px_rgba(59,130,246,0.3)] transition-all duration-300 active:scale-[0.97] group/btn ${rating === 'good' ? 'text-white bg-blue-500/20' : 'text-blue-400'}`}>
              <span className="flex items-center justify-center gap-1.5">
                <i className="fa-solid fa-check text-[10px] opacity-70 group-hover/btn:opacity-100"></i> Good
              </span>
            </button>
            <div className="w-px h-5 sm:h-6 bg-white/10"></div>
            <button onClick={(e) => handleRating(e, "easy")} className={`flex-1 py-2 sm:py-2.5 rounded-[16px] text-xs font-semibold tracking-wide hover:text-white hover:bg-green-500/20 hover:shadow-[inset_0_0_12px_rgba(34,197,94,0.3)] transition-all duration-300 active:scale-[0.97] group/btn ${rating === 'easy' ? 'text-white bg-green-500/20' : 'text-green-400'}`}>
              <span className="flex items-center justify-center gap-1.5">
                <i className="fa-solid fa-forward-step text-[10px] opacity-70 group-hover/btn:opacity-100"></i> Easy
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
