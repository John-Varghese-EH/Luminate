import { useState, useEffect } from "react";

export interface StyleConfig {
  id: string;
  name: string;
  description?: string;
  design_system?: {
    global_style?: {
      theme?: string;
      typography?: {
        primary_heading?: string;
        secondary_heading?: string;
        body_text?: string;
      };
      color_palette?: {
        primary?: string;
        primary_color?: string;
        secondary?: string;
        secondary_color?: string;
        background?: string;
        surface?: string;
        text_main?: string;
        text_secondary?: string;
        accent_color?: string;
      };
      key_visual_elements?: string[];
    };
  };
  slide_layout_templates?: Array<{ type: string; usage: string }>;
}

export default function StyleSelector({ onSelect }: { onSelect: (style: StyleConfig) => void }) {
  const [styles, setStyles] = useState<StyleConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/presentation-styles.json")
      .then((res) => res.json())
      .then((data) => {
        setStyles(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load styles", err);
        setLoading(false);
      });
  }, []);

  const filteredStyles = styles.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="w-8 h-8 border-2 border-[#3b82f6] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4">
        <input 
          type="text" 
          placeholder="Search for a presentation style..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto p-1" style={{ scrollbarWidth: 'thin' }}>
        {filteredStyles.map((style) => {
          const palette = style.design_system?.global_style?.color_palette;
          const bg = palette?.background || "#ffffff";
          const text = palette?.text_main || "#000000";
          const primary = palette?.primary || palette?.primary_color || "#3b82f6";
          const surface = palette?.surface || "#f3f4f6";

          return (
            <button
              key={style.id}
              onClick={() => onSelect(style)}
              className="text-left group relative flex flex-col h-[260px] rounded-[20px] overflow-hidden border border-gray-200 dark:border-white/10 hover:shadow-lg transition-all hover:scale-[1.02] duration-300"
              style={{ backgroundColor: bg, color: text }}
            >
              <div className="w-full h-[140px] relative overflow-hidden bg-black/5 dark:bg-white/5 border-b border-black/5 dark:border-white/5">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('/previews/${style.id}/${style.id}_1.webp')` }}
                ></div>
              </div>
              <div className="p-4 flex-1 z-10 flex flex-col justify-between h-full relative">
                <div>
                  <h3 className="font-bold text-sm mb-1 line-clamp-1">{style.name}</h3>
                  <p className="text-[10px] opacity-80 line-clamp-2 leading-tight font-medium">
                    {style.description || style.design_system?.global_style?.theme || "A custom presentation style."}
                  </p>
                </div>
                <div className="flex gap-1.5 mt-2">
                  <div className="w-4 h-4 rounded-full border border-black/20 dark:border-white/20 shadow-sm" style={{ backgroundColor: primary }}></div>
                  <div className="w-4 h-4 rounded-full border border-black/20 dark:border-white/20 shadow-sm" style={{ backgroundColor: surface }}></div>
                  <div className="w-4 h-4 rounded-full border border-black/20 dark:border-white/20 shadow-sm" style={{ backgroundColor: text }}></div>
                </div>
                <div 
                  className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 -mr-6 -mt-6 transition-transform group-hover:scale-150 duration-500 pointer-events-none"
                  style={{ backgroundColor: primary }}
                ></div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
