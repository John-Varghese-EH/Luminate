"use client";

import React, { useCallback, useState } from "react";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

export default function FileUpload({ onFileSelect, isLoading }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

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

  return (
    <div
      className={`border-2 border-dashed rounded-[var(--radius-xl)] p-8 text-center transition-all duration-300 relative cursor-pointer
        ${isDragging 
          ? "border-[#3b82f6] bg-[#3b82f6]/10" 
          : "border-white/10 bg-black/50 hover:bg-white/5 hover:border-white/20"}
        ${isLoading ? "opacity-50 pointer-events-none" : ""}
      `}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        accept="application/pdf" 
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={handleChange}
        disabled={isLoading}
      />
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-4 animate-pulse-subtle">
          <div className="w-8 h-8 border-2 border-white/20 border-t-[#3b82f6] rounded-full animate-spin mb-4"></div>
          <p className="text-sm font-medium text-white/70">Analyzing Lecture...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center py-2">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
            <i className={`fa-solid fa-cloud-arrow-up text-3xl ${isDragging ? "text-[#3b82f6]" : "text-white/40"} transition-colors`}></i>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Upload PDF Lecture</h3>
          <p className="text-sm text-white/50">Drag and drop or click to browse</p>
        </div>
      )}
    </div>
  );
}
