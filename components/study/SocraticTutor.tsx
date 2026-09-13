"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
}

export default function SocraticTutor() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      content: "I noticed you've been reviewing Quantum Superposition. Are you clear on why it allows quantum computers to process multiple possibilities simultaneously?",
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newUserMsg: Message = { id: Date.now().toString(), role: "user", content: inputMessage };
    setMessages((prev) => [...prev, newUserMsg]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate Socratic AI response
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "ai",
          content: "That's a good start. But think about classical bits—they must be in one state at a time (0 or 1). If a qubit can be in a superposition of both, what happens when you have two qubits entangled together? How many states can they represent at once?",
        }
      ]);
    }, 1500);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-[0_8px_32px_rgba(244,114,182,0.4)] flex items-center justify-center text-white text-xl hover:scale-110 active:scale-95 transition-all duration-300 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <i className="fa-solid fa-sparkles"></i>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Slide-over Panel */}
      <div 
        className={`fixed top-0 right-0 z-50 w-full sm:w-[400px] h-full bg-[#0a0a0c]/90 backdrop-blur-2xl border-l border-white/10 shadow-[-20px_0_60px_rgba(0,0,0,0.5)] transform transition-transform duration-500 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
      >
        {/* Header */}
        <div className="h-20 border-b border-white/10 flex items-center justify-between px-6 bg-[#0a0a0c]/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 p-px shadow-[0_0_15px_rgba(244,114,182,0.3)]">
              <div className="w-full h-full bg-[#121214] rounded-[11px] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-transparent"></div>
                <Image src="/assets/logo.svg" alt="Luminate AI" width={20} height={20} className="relative z-10 brightness-200" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-white tracking-tight">Socratic Tutor</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-green-500/80">Online</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6" style={{ scrollbarWidth: 'none' }}>
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              {msg.role === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
                  <Image src="/assets/logo.svg" alt="AI" width={14} height={14} className="brightness-200 opacity-80" />
                </div>
              )}
              <div className={`p-4 rounded-2xl text-[14.5px] leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-sm' 
                  : 'bg-white/5 border border-white/10 text-white/90 rounded-tl-sm backdrop-blur-md'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
                <Image src="/assets/logo.svg" alt="AI" width={14} height={14} className="brightness-200 opacity-80 animate-pulse" />
              </div>
              <div className="p-4 py-5 rounded-2xl rounded-tl-sm bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-gradient-to-t from-[#0a0a0c] to-transparent border-t border-white/5 shrink-0">
          <form 
            onSubmit={handleSendMessage}
            className="relative flex items-center bg-[#18181b] rounded-2xl border border-white/10 p-1.5 focus-within:border-pink-500/50 focus-within:shadow-[0_0_15px_rgba(244,114,182,0.15)] transition-all"
          >
            <input 
              type="text" 
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask a question..." 
              className="flex-1 bg-transparent text-white text-[14px] pl-4 pr-2 focus:outline-none placeholder:text-white/30"
            />
            <button 
              type="submit"
              disabled={!inputMessage.trim()}
              className="w-10 h-10 shrink-0 bg-white text-black rounded-xl flex items-center justify-center hover:bg-gray-200 active:scale-95 disabled:opacity-30 disabled:hover:bg-white disabled:active:scale-100 transition-all"
            >
              <i className="fa-solid fa-arrow-up"></i>
            </button>
          </form>
          <div className="text-center mt-3">
            <span className="text-[10px] text-white/30 font-medium">Luminate AI can make mistakes. Check important info.</span>
          </div>
        </div>
      </div>
    </>
  );
}
