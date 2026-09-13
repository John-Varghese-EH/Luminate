"use client";

import { useEffect, useState } from "react";

export interface PodcastTurn {
  speaker: "Host 1" | "Host 2";
  text: string;
}

interface PodcastScriptProps {
  script: PodcastTurn[];
}

export default function PodcastScript({ script }: PodcastScriptProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !script || script.length === 0) return null;

  return (
    <div className="bg-white dark:bg-[#111113] border border-gray-200 dark:border-white/[0.06] rounded-3xl p-5 sm:p-6 md:p-8 overflow-hidden relative shadow-lg dark:shadow-2xl transition-colors">
      {/* Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 border-b border-gray-200 dark:border-white/[0.06] pb-5 sm:pb-6 relative z-10">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center border border-orange-200 dark:border-orange-500/20 text-orange-500 dark:text-orange-400 shrink-0">
          <i className="fa-solid fa-podcast text-lg sm:text-xl"></i>
        </div>
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white tracking-tight">Audio Overview Script</h2>
          <p className="text-gray-500 dark:text-white/40 text-xs sm:text-sm truncate">A generated conversational breakdown of your notes.</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:gap-6 relative z-10 max-h-[500px] sm:max-h-[600px] overflow-y-auto pr-1 sm:pr-2" style={{ scrollbarWidth: 'thin' }}>
        {script.map((turn, i) => {
          const isHost1 = turn.speaker === "Host 1";
          return (
            <div key={i} className={`flex flex-col ${isHost1 ? 'items-start' : 'items-end'}`}>
              <div className="flex items-center gap-2 mb-1.5 px-1">
                <span className={`text-[10px] font-bold uppercase tracking-widest ${isHost1 ? 'text-blue-500 dark:text-blue-400' : 'text-purple-500 dark:text-purple-400'}`}>
                  {turn.speaker}
                </span>
              </div>
              <div 
                className={`max-w-[92%] sm:max-w-[85%] p-3.5 sm:p-4 md:p-5 rounded-2xl text-sm sm:text-[15px] leading-relaxed shadow-sm ${
                  isHost1 
                    ? 'bg-gray-50 dark:bg-[#18181b] border border-gray-200 dark:border-white/[0.06] text-gray-800 dark:text-white/90 rounded-tl-sm' 
                    : 'bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-500/10 dark:to-blue-500/10 border border-purple-200 dark:border-purple-500/20 text-gray-800 dark:text-white rounded-tr-sm'
                }`}
              >
                {turn.text}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
