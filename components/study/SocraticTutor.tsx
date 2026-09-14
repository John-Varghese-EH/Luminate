"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface SocraticTutorProps {
  documentContext?: string;
  aiSettings: { provider: string; apiKey?: string; model?: string; baseUrl?: string };
}

const AGENT_PHASES = [
  { label: "Analyzing", icon: "fa-magnifying-glass-chart", color: "text-violet-400", bg: "bg-violet-500" },
  { label: "Reasoning", icon: "fa-brain", color: "text-blue-400", bg: "bg-blue-500" },
  { label: "Composing", icon: "fa-feather", color: "text-emerald-400", bg: "bg-emerald-500" },
];

const CAPABILITIES = [
  { icon: "fa-lightbulb", label: "Explain Concepts", desc: "Break down complex topics", gradient: "from-amber-500 to-orange-500" },
  { icon: "fa-clipboard-question", label: "Quiz & Test Me", desc: "Practice questions on demand", gradient: "from-blue-500 to-cyan-500" },
  { icon: "fa-code", label: "Step-by-Step", desc: "Walk through any problem", gradient: "from-emerald-500 to-teal-500" },
  { icon: "fa-language", label: "Simplify Jargon", desc: "Everyday language translations", gradient: "from-pink-500 to-rose-500" },
];

const PROMPT_CHIPS = [
  { icon: "fa-wand-magic-sparkles", label: "Explain simply" },
  { icon: "fa-clipboard-question", label: "Quiz me" },
  { icon: "fa-arrows-rotate", label: "Give an analogy" },
  { icon: "fa-list-check", label: "Key takeaways" },
  { icon: "fa-bug", label: "Find mistakes" },
  { icon: "fa-sitemap", label: "Mind map this" },
];

export default function SocraticTutor({ documentContext, aiSettings }: SocraticTutorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [agentPhase, setAgentPhase] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      content: "Hey! 👋 I'm **Luminate**, your Socratic study companion.\n\nI won't just hand you the answers — I'll guide you to *discover* them yourself. That's how real learning happens.\n\n> *\"The only true wisdom is in knowing you know nothing.\"* — Socrates\n\nUpload a document or ask me anything to begin.",
      timestamp: new Date(),
    }
  ]);
  const [error, setError] = useState<string | null>(null);

  const scrollToBottom = useCallback(() => {
    const chatArea = chatAreaRef.current;
    if (!chatArea) return;

    // Do not scroll the document toward a hidden, off-canvas message endpoint.
    chatArea.scrollTo({ top: chatArea.scrollHeight, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    scrollToBottom();
  }, [messages, isTyping, isOpen, error, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 400);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isTyping) { setAgentPhase(0); return; }
    const interval = setInterval(() => {
      setAgentPhase(prev => Math.min(prev + 1, AGENT_PHASES.length - 1));
    }, 1600);
    return () => clearInterval(interval);
  }, [isTyping]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") setIsOpen(false); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([{
      id: Date.now().toString(), role: "ai",
      content: "Chat cleared! 🧹 I'm ready for a fresh conversation. What would you like to explore?",
      timestamp: new Date(),
    }]);
    setError(null);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newUserMsg: Message = {
      id: Date.now().toString(), role: "user", content: inputMessage, timestamp: new Date(),
    };
    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setInputMessage("");
    setIsTyping(true);
    setAgentPhase(0);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-luminate-provider": aiSettings.provider,
          ...(aiSettings.apiKey ? { "x-luminate-api-key": aiSettings.apiKey } : {}),
          ...(aiSettings.model ? { "x-luminate-model": aiSettings.model } : {}),
          ...(aiSettings.baseUrl ? { "x-luminate-base-url": aiSettings.baseUrl } : {}),
        },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
          documentContext
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to get AI response");
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(), role: "ai", content: data.response, timestamp: new Date(),
      }]);
    } catch (err: unknown) {
      console.error("DEVELOPMENT ERROR [Socratic Tutor]:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleChipClick = (label: string) => {
    setInputMessage(label);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const showCapabilities = messages.length <= 1 && !isTyping;

  return (
    <>
      {/* ─── FAB ─── */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 group transition-all duration-500 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
        aria-label="Open Luminate AI Assistant"
      >
        {/* Ambient glow */}
        <span className="absolute inset-[-8px] rounded-[22px] bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 opacity-30 blur-xl group-hover:opacity-50 group-hover:inset-[-12px] transition-all duration-500" />
        
        {/* Pulsing ring */}
        <span className="absolute inset-[-4px] rounded-[20px] border-2 border-violet-400/40 opacity-0 group-hover:opacity-100 group-hover:inset-[-8px] group-hover:border-violet-400/20 transition-all duration-700 animate-[ping_2s_ease-in-out_infinite]" />
        
        {/* Main button body */}
        <span className="relative flex items-center gap-2.5 px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600 text-white shadow-[0_8px_32px_rgba(139,92,246,0.35),0_2px_8px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_44px_rgba(139,92,246,0.5),0_4px_12px_rgba(0,0,0,0.3)] hover:scale-[1.08] active:scale-[0.94] transition-all duration-300 border border-white/15">
          
          {/* Icon with orbit ring */}
          <span className="relative w-7 h-7 flex items-center justify-center">
            {/* Orbit ring */}
            <span className="absolute inset-[-3px] rounded-full border border-white/20 border-t-white/60 animate-[spin_3s_linear_infinite]" />
            <i className="fa-solid fa-robot text-[15px] drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]"></i>
            {/* Live status dot */}
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-[1.5px] border-purple-700 shadow-[0_0_8px_rgba(16,185,129,0.6)]">
              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75"></span>
            </span>
          </span>
          
          <span className="font-bold text-[13px] tracking-wide hidden sm:inline drop-shadow-sm">Ask Luminate</span>
          
          {/* Shimmer effect */}
          <span className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
          </span>
        </span>
      </button>

      {/* ─── Backdrop ─── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          style={{ animation: 'fadeIn 0.2s ease' }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ─── Agent Panel ─── */}
      <div
        ref={panelRef}
        className={`fixed inset-y-0 right-0 z-50 w-[min(420px,100dvw)] max-w-full flex flex-col transform transition-all duration-500 ${
          isOpen ? "translate-x-0 opacity-100 pointer-events-auto" : "translate-x-full opacity-0 pointer-events-none"
        }`}
        style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
      >
        {/* Glass background */}
        <div className="absolute inset-0 bg-white/95 dark:bg-[#0c0c0e]/95 backdrop-blur-2xl border-l border-gray-200/60 dark:border-white/[0.06] shadow-[-20px_0_60px_rgba(0,0,0,0.08)] dark:shadow-[-20px_0_60px_rgba(0,0,0,0.6)]" />
        
        {/* ─── Header ─── */}
        <div className="relative shrink-0 z-10">
          {/* Animated gradient accent bar */}
          <div className="h-[2px] w-full overflow-hidden">
            <div className="h-full w-[200%] bg-gradient-to-r from-violet-500 via-pink-500 via-blue-500 to-violet-500 animate-[gradient-x_4s_linear_infinite]" style={{ backgroundSize: '50% 100%' }} />
          </div>

          <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 border-b border-gray-200/80 dark:border-white/[0.06]">
            <div className="flex items-center gap-3">
              {/* Avatar with status ring */}
              <div className="relative">
                <div className="w-10 h-10 rounded-[14px] bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600 p-[1.5px] shadow-lg shadow-purple-500/20">
                  <div className="w-full h-full bg-white dark:bg-[#121214] rounded-[12.5px] flex items-center justify-center overflow-hidden">
                    <i className="fa-solid fa-robot text-transparent bg-gradient-to-br from-violet-500 to-pink-500 bg-clip-text text-lg" style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}></i>
                  </div>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-[#0c0c0e] shadow-sm overflow-hidden">
                  <div className={`w-full h-full ${isTyping ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`} />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-gray-900 dark:text-white text-[15px] tracking-tight">Luminate</h3>
                  <span className="px-1.5 py-px rounded-md bg-gradient-to-r from-violet-500/10 to-pink-500/10 border border-violet-500/20 text-[8px] font-extrabold uppercase tracking-[0.1em] text-violet-600 dark:text-violet-400">Agent</span>
                </div>
                {isTyping ? (
                  <span className={`text-[10px] font-semibold tracking-wide ${AGENT_PHASES[agentPhase].color} flex items-center gap-1 mt-0.5`}>
                    <i className={`fa-solid ${AGENT_PHASES[agentPhase].icon} text-[8px] animate-pulse`}></i>
                    {AGENT_PHASES[agentPhase].label}...
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold tracking-wide text-emerald-600 dark:text-emerald-500/80 flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                    Ready to help
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button onClick={handleClearChat} title="New conversation"
                className="w-8 h-8 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 flex items-center justify-center text-gray-400 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/70 transition-all active:scale-90">
                <i className="fa-solid fa-broom text-xs"></i>
              </button>
              <button onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 flex items-center justify-center text-gray-400 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/70 transition-all active:scale-90">
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>
          </div>

          {/* Document grounding badge */}
          {documentContext && (
            <div className="px-4 sm:px-5 py-2 border-b border-gray-200/60 dark:border-white/[0.04]">
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200/60 dark:border-blue-500/20">
                <i className="fa-solid fa-file-lines text-blue-500 text-[10px]"></i>
                <span className="text-[11px] font-medium text-blue-700 dark:text-blue-400 truncate">Grounded on your uploaded document</span>
              </div>
            </div>
          )}
        </div>

        {/* ─── Chat Area ─── */}
        <div ref={chatAreaRef} className="relative flex-1 overflow-y-auto overscroll-contain px-4 sm:px-5 py-4 sm:py-5 flex flex-col gap-4 sm:gap-5 z-10" style={{ scrollbarWidth: 'none' }}>

          {/* Capabilities grid — first load only */}
          {showCapabilities && (
            <div className="flex flex-col gap-3 animate-fade-in">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 dark:text-white/25 px-0.5">What I can do</p>
              <div className="grid grid-cols-2 gap-2">
                {CAPABILITIES.map((cap, i) => (
                  <button key={i} onClick={() => handleChipClick(cap.label)}
                    className="text-left p-3 sm:p-3.5 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200/80 dark:border-white/[0.06] hover:border-violet-300 dark:hover:border-violet-500/30 hover:bg-white dark:hover:bg-white/[0.05] transition-all group active:scale-[0.97]">
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br ${cap.gradient} flex items-center justify-center mb-2 group-hover:scale-110 group-hover:shadow-lg transition-all`}>
                      <i className={`fa-solid ${cap.icon} text-white text-[11px] sm:text-xs`}></i>
                    </div>
                    <div className="text-[12px] sm:text-[13px] font-semibold text-gray-800 dark:text-white/90 mb-0.5">{cap.label}</div>
                    <div className="text-[10px] sm:text-[11px] text-gray-500 dark:text-white/35 leading-snug">{cap.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-2.5 sm:gap-3 ${msg.role === 'user' ? 'ml-auto flex-row-reverse max-w-[88%]' : 'max-w-[92%]'} group/msg`}
              style={{ animation: 'fadeIn 0.3s ease' }}>
              {msg.role === 'ai' && (
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gradient-to-br from-violet-500/20 to-pink-500/10 flex items-center justify-center shrink-0 border border-violet-200/50 dark:border-violet-500/20 mt-0.5">
                  <i className="fa-solid fa-robot text-violet-500 dark:text-violet-400 text-[9px] sm:text-[10px]"></i>
                </div>
              )}
              <div className="flex flex-col gap-0.5">
                <div className={`px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl text-[13px] sm:text-[14px] leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-violet-600 to-purple-700 text-white rounded-tr-md shadow-md shadow-violet-500/10'
                    : 'bg-gray-50 dark:bg-white/[0.04] border border-gray-200/80 dark:border-white/[0.07] text-gray-800 dark:text-white/90 rounded-tl-md prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:mb-2 prose-p:last:mb-0 prose-pre:bg-gray-100 dark:prose-pre:bg-black/40 prose-pre:border prose-pre:border-gray-200 dark:prose-pre:border-white/10 prose-pre:rounded-xl prose-code:text-violet-600 dark:prose-code:text-violet-400 prose-headings:font-bold prose-blockquote:border-violet-300 dark:prose-blockquote:border-violet-500/40 prose-blockquote:bg-violet-50/50 dark:prose-blockquote:bg-violet-500/5 prose-blockquote:rounded-r-xl prose-blockquote:py-0.5 prose-strong:text-gray-900 dark:prose-strong:text-white prose-li:marker:text-violet-400'
                }`}>
                  {msg.role === 'ai' ? <ReactMarkdown>{msg.content}</ReactMarkdown> : msg.content}
                </div>
                <div className={`flex items-center gap-2 px-1 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <span className="text-[9px] sm:text-[10px] text-gray-400 dark:text-white/20 font-medium">{formatTime(msg.timestamp)}</span>
                  {msg.role === 'ai' && msg.id !== '1' && (
                    <button onClick={() => handleCopy(msg.content, msg.id)}
                      className="opacity-0 group-hover/msg:opacity-100 transition-opacity text-[9px] sm:text-[10px] text-gray-400 dark:text-white/25 hover:text-gray-600 dark:hover:text-white/60 flex items-center gap-1">
                      <i className={`fa-solid ${copiedId === msg.id ? 'fa-check text-emerald-500' : 'fa-copy'}`}></i>
                      {copiedId === msg.id ? 'Copied' : 'Copy'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Agent thinking pipeline */}
          {isTyping && (
            <div className="flex gap-2.5 sm:gap-3 max-w-[85%]" style={{ animation: 'fadeIn 0.3s ease' }}>
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gradient-to-br from-violet-500/20 to-pink-500/10 flex items-center justify-center shrink-0 border border-violet-200/50 dark:border-violet-500/20 mt-0.5">
                <i className="fa-solid fa-robot text-violet-500 dark:text-violet-400 text-[9px] sm:text-[10px] animate-pulse"></i>
              </div>
              <div className="px-3.5 sm:px-4 py-3 rounded-2xl rounded-tl-md bg-gray-50 dark:bg-white/[0.04] border border-gray-200/80 dark:border-white/[0.07]">
                <div className="flex flex-col gap-2">
                  {AGENT_PHASES.map((phase, i) => (
                    <div key={i} className={`flex items-center gap-2 transition-all duration-500 ${i <= agentPhase ? 'opacity-100' : 'opacity-15'}`}>
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                        i < agentPhase ? 'bg-emerald-100 dark:bg-emerald-500/20' :
                        i === agentPhase ? `${phase.bg}/20` : 'bg-gray-100 dark:bg-white/5'
                      }`}>
                        {i < agentPhase ? (
                          <i className="fa-solid fa-check text-emerald-500 text-[7px]"></i>
                        ) : i === agentPhase ? (
                          <div className={`w-1.5 h-1.5 rounded-full ${phase.bg} animate-pulse`}></div>
                        ) : (
                          <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-white/20"></div>
                        )}
                      </div>
                      <span className={`text-[11px] font-medium ${
                        i === agentPhase ? phase.color :
                        i < agentPhase ? 'text-emerald-500/70' : 'text-gray-400 dark:text-white/25'
                      }`}>
                        {phase.label}{i === agentPhase && <span className="animate-pulse">...</span>}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm max-w-[85%]" style={{ animation: 'fadeIn 0.3s ease' }}>
              <div className="flex items-center gap-2 mb-1">
                <i className="fa-solid fa-triangle-exclamation text-xs"></i>
                <span className="font-bold text-[12px]">Connection Error</span>
              </div>
              <p className="text-[11px] opacity-80">{error}</p>
              <button onClick={() => setError(null)} className="mt-1.5 text-[11px] font-semibold text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">Dismiss</button>
            </div>
          )}

        </div>

        {/* ─── Input Area ─── */}
        <div className="relative shrink-0 z-10 border-t border-gray-200/80 dark:border-white/[0.06] bg-white/80 dark:bg-[#0c0c0e]/80 backdrop-blur-xl">
          {/* Prompt chips */}
          <div className="px-3 sm:px-4 pt-2.5 sm:pt-3 pb-1">
            <div className="flex gap-1.5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              {PROMPT_CHIPS.map((chip, i) => (
                <button key={i} onClick={() => handleChipClick(chip.label)}
                  className="whitespace-nowrap px-2.5 py-1.5 rounded-xl bg-gray-50 dark:bg-white/[0.04] border border-gray-200/80 dark:border-white/[0.07] text-[10px] sm:text-[11px] font-medium text-gray-600 dark:text-white/50 hover:bg-gray-100 dark:hover:bg-white/[0.08] hover:text-gray-900 dark:hover:text-white hover:border-violet-300 dark:hover:border-violet-500/30 transition-all active:scale-95 flex items-center gap-1.5">
                  <i className={`fa-solid ${chip.icon} text-[8px] sm:text-[9px] text-violet-400/60`}></i>
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input form */}
          <div className="px-3 sm:px-4 pb-2.5 sm:pb-3 pt-1.5">
            <form onSubmit={handleSendMessage}
              className="relative flex items-center bg-gray-50 dark:bg-[#18181b] rounded-2xl border border-gray-200 dark:border-white/[0.08] p-1 focus-within:border-violet-400/60 dark:focus-within:border-violet-500/40 focus-within:shadow-[0_0_0_3px_rgba(139,92,246,0.08)] dark:focus-within:shadow-[0_0_0_3px_rgba(139,92,246,0.1)] transition-all duration-200">
              <input
                id="agent-chat-input"
                name="agent-chat-input"
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask anything..."
                className="flex-1 bg-transparent text-gray-900 dark:text-white text-[13px] sm:text-[14px] pl-3 sm:pl-4 pr-2 py-2 focus:outline-none placeholder:text-gray-400 dark:placeholder:text-white/25"
              />
              <button type="submit" disabled={!inputMessage.trim() || isTyping}
                className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 bg-gradient-to-br from-violet-600 to-purple-700 text-white rounded-xl flex items-center justify-center hover:from-violet-700 hover:to-purple-800 active:scale-90 disabled:opacity-30 disabled:hover:from-violet-600 disabled:hover:to-purple-700 transition-all shadow-sm shadow-violet-500/20">
                <i className="fa-solid fa-arrow-up text-xs sm:text-sm"></i>
              </button>
            </form>
          </div>

          <div className="text-center pb-2.5 sm:pb-3">
            <span className="text-[9px] sm:text-[10px] text-gray-400/80 dark:text-white/20 font-medium">
              Luminate AI · Powered by Gemini
            </span>
          </div>
        </div>
      </div>

      {/* Inline keyframes */}
      <style jsx>{`
        @keyframes gradient-x {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </>
  );
}
