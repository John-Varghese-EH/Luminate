"use client";

import React, { useCallback, useState } from "react";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onTextSubmit?: (text: string) => void;
  isLoading: boolean;
}

export default function FileUpload({ onFileSelect, onTextSubmit, isLoading }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [inputMode, setInputMode] = useState<"file" | "text">("file");
  const [textInput, setTextInput] = useState("");

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        onFileSelect(file);
      } else {
        alert("Please upload a PDF file.");
      }
    }
  }, [onFileSelect]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "application/pdf") {
        onFileSelect(file);
      } else {
        alert("Please upload a PDF file.");
      }
    }
  };

  const handleTextSubmit = () => {
    if (textInput.trim().length > 50 && onTextSubmit) {
      onTextSubmit(textInput);
    } else if (textInput.trim().length <= 50) {
      alert("Please paste more than 50 characters of text to generate good flashcards.");
    }
  };

  if (isLoading) {
    return (
      <div className="relative group overflow-hidden border-2 border-[#3b82f6]/30 bg-[#1e3a8a]/10 rounded-[32px] p-8 text-center transition-all duration-500 shadow-2xl">
        <div className="flex flex-col items-center justify-center py-6 relative z-10 animate-fade-in">
          <div className="relative w-16 h-16 mb-6">
            <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-[#3b82f6] rounded-full border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 border-4 border-[#60a5fa] rounded-full border-b-transparent animate-[spin_1.5s_reverse_infinite] opacity-50"></div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2 animate-pulse">Extracting Knowledge...</h3>
          <p className="text-sm font-medium text-[#3b82f6]">Processing with Gemini 2.5 Flash</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex bg-[#111113] border border-white/10 rounded-xl p-1">
        <button 
          onClick={() => setInputMode("file")}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${inputMode === 'file' ? 'bg-[#3b82f6] text-white' : 'text-white/50 hover:text-white/80'}`}
        >
          PDF Upload
        </button>
        <button 
          onClick={() => setInputMode("text")}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${inputMode === 'text' ? 'bg-[#3b82f6] text-white' : 'text-white/50 hover:text-white/80'}`}
        >
          Paste Text
        </button>
      </div>

      {inputMode === "file" ? (
        <div
          className={`relative group overflow-hidden border-2 border-dashed rounded-[32px] p-8 text-center transition-all duration-500 cursor-pointer shadow-2xl
            ${isDragging 
              ? "border-[#3b82f6] bg-[#3b82f6]/10 shadow-[0_0_60px_-15px_rgba(59,130,246,0.5)] scale-[1.02]" 
              : "border-white/10 bg-[#09090b] hover:bg-[#18181b] hover:border-[#3b82f6]/50 hover:shadow-[0_0_40px_-15px_rgba(59,130,246,0.3)]"}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input 
            type="file" 
            accept="application/pdf" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            onChange={handleChange}
          />
          
          {/* Shimmer gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer-slow pointer-events-none z-10"></div>
          
          <div className="flex flex-col items-center py-6 relative z-10">
            <div className={`w-20 h-20 rounded-[24px] flex items-center justify-center mb-6 transition-all duration-500
              ${isDragging ? "bg-[#3b82f6] shadow-[0_10px_30px_rgba(59,130,246,0.4)] scale-110" : "bg-[#18181b] shadow-inner group-hover:bg-[#27272a] group-hover:scale-105"}
            `}>
              <i className={`fa-solid fa-cloud-arrow-up text-3xl transition-colors duration-500
                ${isDragging ? "text-white" : "text-[#3b82f6] group-hover:text-[#60a5fa]"}
              `}></i>
            </div>
            <h3 className="text-[22px] font-bold text-white mb-2 tracking-tight">Upload Lecture PDF</h3>
            <p className="text-[15px] text-white/50 max-w-[200px]">Drag and drop your file here, or click to browse.</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Paste your notes or article here..."
            className="w-full h-48 bg-[#09090b] border-2 border-white/10 focus:border-[#3b82f6]/50 rounded-[24px] p-4 text-sm text-white/90 placeholder:text-white/30 resize-none transition-all focus:outline-none focus:shadow-[0_0_30px_-10px_rgba(59,130,246,0.2)]"
          ></textarea>
          <button 
            onClick={handleTextSubmit}
            className="w-full py-3 bg-white text-black hover:bg-gray-100 rounded-xl text-[14px] font-bold shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] transition-all active:scale-95"
          >
            Generate Flashcards
          </button>
        </div>
      )}
    </div>
  );
}
