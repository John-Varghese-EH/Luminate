"use client";

import { useState } from "react";

interface FlashcardProps {
  question: string;
  answer: string;
}

export default function Flashcard({ question, answer }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="group h-64 w-full cursor-pointer animate-fade-in"
      style={{ perspective: "1000px" }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative h-full w-full rounded-[var(--radius-2xl)] shadow-2xl transition-all duration-[600ms] ${
          isFlipped ? "rotate-y-180" : ""
        }`}
        style={{ transformStyle: "preserve-3d", transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
      >
        {/* Front */}
        <div 
          className="absolute inset-0 flex items-center justify-center rounded-[var(--radius-2xl)] bg-[#1e1e22] border border-white/5 p-8 text-center"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="absolute top-4 right-4 flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
          </div>
          <p className="text-lg font-medium text-white/90">{question}</p>
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <span className="text-[10px] uppercase tracking-widest text-white/30 font-semibold">Tap to flip</span>
          </div>
        </div>

        {/* Back */}
        <div 
          className="absolute inset-0 flex items-center justify-center rounded-[var(--radius-2xl)] bg-[#3b82f6]/10 border border-[#3b82f6]/20 p-8 text-center rotate-y-180"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="absolute top-4 left-4">
            <i className="fa-solid fa-lightbulb text-[#3b82f6]/70"></i>
          </div>
          <p className="text-lg text-white/90 leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  );
}
