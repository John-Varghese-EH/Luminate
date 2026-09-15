import { useState } from "react";
import { StyleConfig } from "./StyleSelector";

export interface SlideData {
  layoutType: string;
  title: string;
  content: string[];
  speakerNotes: string;
}

export default function PresentationViewer({ slides, styleConfig }: { slides: SlideData[], styleConfig: StyleConfig }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showNotes, setShowNotes] = useState(false);

  const slide = slides[currentSlide];
  if (!slide) return null;

  const palette = styleConfig.design_system?.global_style?.color_palette;
  const bg = palette?.background || "#ffffff";
  const textMain = palette?.text_main || "#000000";
  const primary = palette?.primary || palette?.primary_color || "#3b82f6";

  const nextSlide = () => setCurrentSlide(c => Math.min(c + 1, slides.length - 1));
  const prevSlide = () => setCurrentSlide(c => Math.max(c - 1, 0));

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Slide Canvas */}
      <div 
        className="w-full aspect-video rounded-3xl overflow-hidden relative shadow-2xl transition-colors duration-500 flex flex-col p-8 md:p-12"
        style={{ backgroundColor: bg, color: textMain }}
      >
        <div 
          className="absolute top-0 right-0 w-[50%] h-[100%] opacity-10 pointer-events-none"
          style={{ 
            background: `linear-gradient(135deg, transparent, ${primary})`
          }}
        ></div>

        <div className="flex-1 flex flex-col justify-center z-10 max-w-4xl mx-auto w-full">
          <div className="text-[10px] font-bold tracking-widest uppercase mb-4 opacity-50" style={{ color: primary }}>
            {slide.layoutType}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-8 leading-tight tracking-tight">
            {slide.title}
          </h1>
          <ul className="space-y-4">
            {slide.content.map((point, i) => (
              <li key={i} className="text-lg md:text-xl opacity-80 flex items-start gap-4">
                <span className="shrink-0 w-2.5 h-2.5 rounded-full mt-2" style={{ backgroundColor: primary }}></span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="absolute bottom-6 right-8 text-sm font-bold opacity-30">
          {currentSlide + 1} / {slides.length}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-2">
        <button 
          onClick={() => setShowNotes(!showNotes)}
          className="text-sm font-semibold text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <i className="fa-solid fa-note-sticky mr-2"></i>
          {showNotes ? "Hide Notes" : "Speaker Notes"}
        </button>
        
        <div className="flex gap-2">
          <button 
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="w-10 h-10 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-white/20 transition-all flex items-center justify-center"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <button 
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="w-10 h-10 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-white/20 transition-all flex items-center justify-center"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>

      {/* Speaker Notes */}
      {showNotes && slide.speakerNotes && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/50 rounded-2xl">
          <h4 className="text-xs font-bold text-yellow-800 dark:text-yellow-500 uppercase tracking-widest mb-2">Speaker Notes</h4>
          <p className="text-sm text-yellow-900 dark:text-yellow-100/80 leading-relaxed">{slide.speakerNotes}</p>
        </div>
      )}
    </div>
  );
}
