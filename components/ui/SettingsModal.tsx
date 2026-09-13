"use client";

import { useState, useEffect } from "react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: string) => void;
  initialKey: string;
}

export default function SettingsModal({ isOpen, onClose, onSave, initialKey }: SettingsModalProps) {
  const [apiKey, setApiKey] = useState(initialKey);

  useEffect(() => {
    if (isOpen) {
      setApiKey(initialKey);
    }
  }, [isOpen, initialKey]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#111113] border border-gray-200 dark:border-white/[0.06] rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#3b82f6] blur-[120px] opacity-5 dark:opacity-10 rounded-full pointer-events-none"></div>

        <div className="flex justify-between items-center mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 dark:bg-white/5 rounded-xl border border-blue-200 dark:border-white/10 flex items-center justify-center text-blue-600 dark:text-white/80">
              <i className="fa-solid fa-key"></i>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">API Settings</h2>
              <p className="text-gray-500 dark:text-white/40 text-xs">Bring Your Own Key (BYOK)</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="relative z-10 mb-8">
          <label className="block text-sm font-semibold text-gray-700 dark:text-white/70 mb-2">Google Gemini API Key</label>
          <div className="relative">
            <input 
              id="settings-api-key"
              name="api-key"
              type="password" 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..." 
              className="w-full bg-gray-50 dark:bg-[#09090b] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/20 rounded-xl pl-4 pr-10 py-3.5 focus:outline-none focus:border-[#3b82f6]/50 focus:ring-2 focus:ring-blue-500/10 dark:focus:bg-white/[0.02] transition-all text-sm"
            />
            <i className="fa-solid fa-lock absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-white/20"></i>
          </div>
          <p className="text-[11px] text-gray-500 dark:text-white/40 mt-3 leading-relaxed">
            Your key is stored securely in your browser&apos;s local storage and is never saved on our servers. Overrides the default system key.
          </p>
        </div>

        <div className="flex justify-end gap-3 relative z-10">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-semibold text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-sm"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              onSave(apiKey);
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl font-bold bg-[#3b82f6] text-white hover:bg-[#60a5fa] transition-all shadow-lg shadow-blue-500/20 text-sm flex items-center gap-2 hover:scale-105 active:scale-95"
          >
            <i className="fa-solid fa-check"></i>
            Save Key
          </button>
        </div>
      </div>
    </div>
  );
}
