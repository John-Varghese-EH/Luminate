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
    <div className="bg-[#111113] border border-white/[0.06] rounded-[32px] p-6 md:p-8 overflow-hidden relative shadow-2xl">
      {/* Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="flex items-center gap-4 mb-8 border-b border-white/[0.06] pb-6 relative z-10">
        <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 text-orange-400">
          <i className="fa-solid fa-podcast text-xl"></i>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Audio Overview Script</h2>
          <p className="text-white/40 text-sm">A generated conversational breakdown of your notes.</p>
        </div>
      </div>

      <div className="flex flex-col gap-6 relative z-10 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        {script.map((turn, i) => {
          const isHost1 = turn.speaker === "Host 1";
          return (
            <div key={i} className={`flex flex-col ${isHost1 ? 'items-start' : 'items-end'}`}>
              <div className="flex items-center gap-2 mb-1.5 px-1">
                <span className={`text-[10px] font-bold uppercase tracking-widest ${isHost1 ? 'text-blue-400' : 'text-purple-400'}`}>
                  {turn.speaker}
                </span>
              </div>
              <div 
                className={`max-w-[85%] p-4 md:p-5 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                  isHost1 
                    ? 'bg-[#18181b] border border-white/[0.06] text-white/90 rounded-tl-sm' 
                    : 'bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 text-white rounded-tr-sm'
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
