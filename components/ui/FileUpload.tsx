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
      <div className="relative group overflow-hidden border-2 border-blue-400/30 dark:border-[#3b82f6]/30 bg-blue-50 dark:bg-[#1e3a8a]/10 rounded-[32px] p-8 text-center transition-all duration-500 shadow-xl">
        <div className="flex flex-col items-center justify-center py-6 relative z-10 animate-fade-in">
          <div className="relative w-16 h-16 mb-6">
            <div className="absolute inset-0 border-4 border-gray-200 dark:border-white/10 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-[#3b82f6] rounded-full border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 border-4 border-[#60a5fa] rounded-full border-b-transparent animate-[spin_1.5s_reverse_infinite] opacity-50"></div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 animate-pulse">Extracting Knowledge...</h3>
          <p className="text-sm font-medium text-[#3b82f6]">Processing with Gemini 2.5 Flash</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex bg-gray-100/80 dark:bg-black/40 backdrop-blur-md border border-gray-200/80 dark:border-white/[0.04] rounded-[16px] p-1.5 transition-colors shadow-inner">
        <button 
          onClick={() => setInputMode("file")}
          className={`flex-1 py-2 rounded-[12px] text-xs font-semibold transition-all duration-300 ${inputMode === 'file' ? 'bg-white dark:bg-[#1f1f22] text-blue-600 dark:text-blue-400 shadow-[0_2px_10px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_15px_rgba(0,0,0,0.3)] scale-[1.02]' : 'text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white/80 hover:bg-black/5 dark:hover:bg-white/5 active:scale-[0.97]'}`}
        >
          PDF Upload
        </button>
        <button 
          onClick={() => setInputMode("text")}
          className={`flex-1 py-2 rounded-[12px] text-xs font-semibold transition-all duration-300 ${inputMode === 'text' ? 'bg-white dark:bg-[#1f1f22] text-blue-600 dark:text-blue-400 shadow-[0_2px_10px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_15px_rgba(0,0,0,0.3)] scale-[1.02]' : 'text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white/80 hover:bg-black/5 dark:hover:bg-white/5 active:scale-[0.97]'}`}
        >
          Paste Text
        </button>
      </div>

      {inputMode === "file" ? (
        <div
          className={`relative group overflow-hidden border-2 border-dashed rounded-[32px] p-8 text-center transition-all duration-500 cursor-pointer backdrop-blur-md
            ${isDragging 
              ? "border-[#3b82f6] bg-blue-50/80 dark:bg-[#3b82f6]/10 shadow-[0_0_60px_-15px_rgba(59,130,246,0.5)] scale-[1.02]" 
              : "border-gray-300 dark:border-white/10 bg-white/50 dark:bg-white/5 hover:bg-white dark:hover:bg-[#18181b]/80 hover:border-blue-400 dark:hover:border-[#3b82f6]/50 hover:shadow-lg dark:hover:shadow-[0_0_40px_-15px_rgba(59,130,246,0.3)]"}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input 
            id="file-upload-input"
            name="file-upload"
            type="file" 
            accept="application/pdf" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            onChange={handleChange}
          />
          
          {/* Shimmer gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer-slow pointer-events-none z-10"></div>
          
          <div className="flex flex-col items-center py-4 sm:py-6 relative z-10">
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-[24px] flex items-center justify-center mb-4 sm:mb-6 transition-all duration-500
              ${isDragging ? "bg-[#3b82f6] shadow-[0_10px_30px_rgba(59,130,246,0.4)] scale-110" : "bg-gray-100 dark:bg-[#18181b] shadow-inner group-hover:bg-blue-50 dark:group-hover:bg-[#27272a] group-hover:scale-105"}
            `}>
              <i className={`fa-solid fa-cloud-arrow-up text-2xl sm:text-3xl transition-colors duration-500
                ${isDragging ? "text-white" : "text-[#3b82f6] group-hover:text-[#60a5fa]"}
              `}></i>
            </div>
            <h3 className="text-lg sm:text-[22px] font-bold text-gray-900 dark:text-white mb-2 tracking-tight">Upload Lecture PDF</h3>
            <p className="text-sm sm:text-[15px] text-gray-500 dark:text-white/50 max-w-[200px]">Drag and drop your file here, or click to browse.</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <textarea
            id="text-upload-input"
            name="text-upload"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Paste your notes or article here..."
            className="w-full h-48 bg-white/50 dark:bg-white/5 backdrop-blur-sm border-2 border-gray-200 dark:border-white/10 focus:border-blue-400 dark:focus:border-[#3b82f6]/50 rounded-[24px] p-4 text-sm text-gray-900 dark:text-white/90 placeholder:text-gray-400 dark:placeholder:text-white/30 resize-none transition-all duration-300 focus:outline-none focus:shadow-lg dark:focus:shadow-[0_0_30px_-10px_rgba(59,130,246,0.2)]"
          ></textarea>
          <button 
            onClick={handleTextSubmit}
            className="w-full py-3 bg-[#3b82f6] hover:bg-[#60a5fa] text-white rounded-[16px] text-[14px] font-bold shadow-[0_8px_20px_-6px_rgba(59,130,246,0.5)] transition-all duration-300 active:scale-[0.97] hover:-translate-y-0.5"
          >
            Generate Flashcards
          </button>
        </div>
      )}
    </div>
  );
}
