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
      className="group h-[280px] w-full cursor-pointer animate-fade-in"
      style={{ perspective: "1200px" }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative h-full w-full rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.4)] transition-all duration-700 ease-out ${
          isFlipped ? "rotate-y-180" : "group-hover:translate-y-[-4px] group-hover:shadow-[0_20px_40px_rgba(59,130,246,0.15)]"
        }`}
        style={{ transformStyle: "preserve-3d", transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
      >
        {/* Front */}
        <div 
          className="absolute inset-0 flex flex-col rounded-[32px] bg-gradient-to-b from-[#18181b] to-[#09090b] border border-white/10 p-8"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Subtle top inner glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-[#3b82f6] blur-md opacity-20"></div>
          
          <div className="absolute top-6 right-6 flex gap-1.5 opacity-50">
            <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <p className="text-xl font-medium text-white/90 text-center leading-relaxed">{question}</p>
          </div>
          
          <div className="text-center pb-2">
            <span className="text-[11px] uppercase tracking-[0.2em] text-white/30 font-bold group-hover:text-[#3b82f6]/70 transition-colors">Tap to flip</span>
          </div>
        </div>

        {/* Back */}
        <div 
          className="absolute inset-0 flex flex-col rounded-[32px] bg-gradient-to-br from-[#1e3a8a] to-[#0f172a] border border-[#3b82f6]/30 p-8 shadow-[inset_0_0_80px_rgba(59,130,246,0.15)] rotate-y-180"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="absolute top-6 left-6 w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 backdrop-blur-md">
            <i className="fa-solid fa-lightbulb text-white"></i>
          </div>
          
          <div className="flex-1 flex items-center justify-center mt-6">
            <p className="text-[17px] text-white leading-relaxed font-medium text-center">{answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
