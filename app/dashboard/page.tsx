"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import FileUpload from "@/components/ui/FileUpload";
import Flashcard from "@/components/study/Flashcard";
import Quiz from "@/components/study/Quiz";
import SocraticTutor from "@/components/study/SocraticTutor";
import KnowledgeGraph from "@/components/study/KnowledgeGraph";
import SettingsModal from "@/components/ui/SettingsModal";
import PodcastScript from "@/components/study/PodcastScript";
import EssayFeedback from "@/components/study/EssayFeedback";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import Image from "next/image";

import { StudySession, saveSession, getUserSessions, FlashcardData, QuizQuestion, PodcastTurn } from "@/lib/db";

// ─────────────────────────────────────────────
// Inline: Pomodoro Timer Component
// ─────────────────────────────────────────────
const PomodoroTimer = ({ onToggleFocus }: { onToggleFocus: (isFocus: boolean) => void }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [mode, setMode] = useState<"work" | "break">("work");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && !isPaused && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setIsPaused(false);
      if (mode === "work") {
        setMode("break");
        setTimeLeft(5 * 60);
      } else {
        setMode("work");
        setTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, isPaused, timeLeft, mode]);

  useEffect(() => {
    onToggleFocus(isActive && !isPaused);
  }, [isActive, isPaused, onToggleFocus]);

  const toggleTimer = () => {
    if (isActive) {
      setIsPaused(!isPaused);
    } else {
      setIsActive(true);
      setIsPaused(false);
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setMode("work");
    setTimeLeft(25 * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = mode === "work" ? ((25 * 60 - timeLeft) / (25 * 60)) * 100 : ((5 * 60 - timeLeft) / (5 * 60)) * 100;

  return (
    <div className="bg-white/80 dark:bg-[#111113]/80 backdrop-blur-3xl border border-gray-200/50 dark:border-white/[0.05] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] rounded-[24px] p-5 sm:p-6 flex flex-col items-center justify-center relative overflow-hidden group transition-colors">
      <div className={`absolute inset-0 bg-gradient-to-br ${mode === "work" ? "from-red-500/10 to-orange-500/5" : "from-emerald-500/10 to-teal-500/5"} transition-opacity duration-500 ${isActive && !isPaused ? 'opacity-100' : 'opacity-0'}`}></div>
      
      <div className="flex items-center gap-2 mb-3 relative z-10">
        <i className={`fa-solid ${mode === "work" ? "fa-stopwatch" : "fa-mug-hot"} text-lg ${isActive && !isPaused ? (mode === "work" ? "text-red-500" : "text-emerald-500") : "text-gray-400 dark:text-white/40"} transition-colors`}></i>
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-white/40">{mode === "work" ? "Focus Time" : "Break Time"}</span>
      </div>

      {/* Circular progress ring */}
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 mb-3 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="4" fill="none" className="text-gray-100 dark:text-white/5" />
          <circle cx="50" cy="50" r="42" stroke={mode === "work" ? "#ef4444" : "#10b981"} strokeWidth="4" fill="none"
            strokeDasharray={`${2 * Math.PI * 42}`}
            strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress / 100)}`}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-linear"
            style={{ filter: `drop-shadow(0 0 8px ${mode === "work" ? "rgba(239,68,68,0.5)" : "rgba(16,185,129,0.5)"})` }}
          />
        </svg>
        <div className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-gray-900 dark:text-white tabular-nums drop-shadow-sm">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
      </div>
      
      <div className="flex gap-2 relative z-10">
        <button 
          onClick={toggleTimer}
          className={`px-5 sm:px-6 py-2 rounded-full font-semibold text-sm transition-all duration-300 active:scale-[0.97] shadow-md ${
            mode === "work" 
              ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/20" 
              : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20"
          }`}
        >
          {isActive ? (isPaused ? 'Resume' : 'Pause') : 'Start Focus'}
        </button>
        {isActive && (
          <button 
            onClick={resetTimer}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-gray-600 dark:text-white flex items-center justify-center transition-all duration-300 active:scale-[0.97]"
          >
            <i className="fa-solid fa-rotate-right text-sm"></i>
          </button>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Inline: Quick Notes Component
// ─────────────────────────────────────────────
const QuickNotes = () => {
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedNotes = localStorage.getItem("luminate_quick_notes");
    if (savedNotes) setNotes(savedNotes);
  }, []);

  const handleSave = useCallback(() => {
    localStorage.setItem("luminate_quick_notes", notes);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [notes]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (notes) handleSave();
    }, 1500);
    return () => clearTimeout(timer);
  }, [notes, handleSave]);

  return (
    <div className="bg-white/80 dark:bg-[#111113]/80 backdrop-blur-3xl border border-gray-200/50 dark:border-white/[0.05] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] rounded-[24px] p-5 transition-colors relative group/notes">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-pen-nib text-amber-500 text-sm"></i>
          <span className="text-sm font-bold text-gray-900 dark:text-white">Quick Notes</span>
        </div>
        <span className={`text-[10px] font-medium transition-opacity duration-300 ${saved ? 'opacity-100 text-emerald-500' : 'opacity-0'}`}>
          <i className="fa-solid fa-check mr-1"></i>Saved
        </span>
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Jot down thoughts, key terms, or reminders..."
        className="w-full h-28 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/[0.04] rounded-2xl p-4 text-[13px] text-gray-800 dark:text-white/80 placeholder:text-gray-400 dark:placeholder:text-white/20 resize-none focus:outline-none focus:border-blue-400/50 dark:focus:border-blue-500/30 focus:shadow-[0_0_15px_rgba(59,130,246,0.1)] dark:focus:shadow-[0_0_15px_rgba(59,130,246,0.05)] transition-all duration-300"
      />
    </div>
  );
};

// ─────────────────────────────────────────────
// Inline: Study Stats Component
// ─────────────────────────────────────────────
const StudyStats = ({ metrics }: { metrics: { streak: number; mastered: number; sessions: number } }) => {
  const stats = [
    { icon: "fa-cards-blank", label: "Cards Mastered", value: metrics.mastered, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
    { icon: "fa-brain", label: "Study Sessions", value: metrics.sessions, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-500/10" },
    { icon: "fa-clock-rotate-left", label: "Avg. Session", value: "23m", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
    { icon: "fa-chart-line", label: "Week Growth", value: "+12%", color: "text-pink-500", bg: "bg-pink-50 dark:bg-pink-500/10" },
  ];

  return (
    <div className="bg-white/80 dark:bg-[#111113]/80 backdrop-blur-3xl border border-gray-200/50 dark:border-white/[0.05] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] rounded-[24px] p-5 transition-colors">
      <div className="flex items-center gap-2 mb-4">
        <i className="fa-solid fa-chart-simple text-[#3b82f6] text-sm"></i>
        <span className="text-sm font-bold text-gray-900 dark:text-white">Study Analytics</span>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {stats.map((stat, i) => (
          <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.04] transition-colors">
            <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center shrink-0`}>
              <i className={`fa-solid ${stat.icon} ${stat.color} text-xs`}></i>
            </div>
            <div className="min-w-0">
              <div className="text-sm sm:text-base font-bold text-gray-900 dark:text-white truncate tabular-nums tracking-tight">{stat.value}</div>
              <div className="text-[9px] sm:text-[10px] text-gray-500 dark:text-white/40 font-medium truncate uppercase tracking-wider">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [flashcards, setFlashcards] = useState<FlashcardData[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [podcastScript, setPodcastScript] = useState<PodcastTurn[]>([]);
  const [documentContext, setDocumentContext] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"flashcards" | "quiz" | "graph" | "podcast" | "feedback">("flashcards");
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<"upload" | "tools">("upload");
  
  const [history, setHistory] = useState<StudySession[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Metrics state
  const [metrics] = useState({ streak: 12, mastered: 428, sessions: 34 });

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    } else if (user) {
      // Fetch history when user loads
      setIsLoadingHistory(true);
      getUserSessions(user.uid, 6)
        .then(sessions => {
          setHistory(sessions);
          setIsLoadingHistory(false);
        })
        .catch(err => {
          console.error("Failed to load history:", err);
          setIsLoadingHistory(false);
        });
    }
  }, [user, loading, router]);

  const handleFileProcess = async (file: File) => {
    setIsGenerating(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const apiKey = localStorage.getItem("gemini_api_key") || "";
      const res = await fetch("/api/generate", {
        method: "POST",
        body: formData,
        headers: apiKey ? { "x-gemini-api-key": apiKey } : {},
      });
      if (!res.ok) throw new Error("Failed to process PDF");
      const data = await res.json();
      setFlashcards(data.flashcards || []);
      setQuizQuestions(data.quiz || []);
      setPodcastScript(data.podcastScript || []);
      if (data.extractedText) setDocumentContext(data.extractedText);
      setActiveTab("flashcards");

      if (user) {
        const newSessionData = {
          title: file.name,
          flashcards: data.flashcards || [],
          quizQuestions: data.quiz || [],
          podcastScript: data.podcastScript || [],
          documentContext: data.extractedText || "",
        };
        const savedSession = await saveSession(user.uid, newSessionData);
        setHistory(prev => [savedSession, ...prev]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTextProcess = async (text: string) => {
    setIsGenerating(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("text", text);
      const apiKey = localStorage.getItem("gemini_api_key") || "";
      const res = await fetch("/api/generate", {
        method: "POST",
        body: formData,
        headers: apiKey ? { "x-gemini-api-key": apiKey } : {},
      });
      if (!res.ok) throw new Error("Failed to process text");
      const data = await res.json();
      setFlashcards(data.flashcards || []);
      setQuizQuestions(data.quiz || []);
      setPodcastScript(data.podcastScript || []);
      if (data.extractedText) setDocumentContext(data.extractedText);
      setActiveTab("flashcards");

      if (user) {
        const newSessionData = {
          title: "Pasted Notes",
          flashcards: data.flashcards || [],
          quizQuestions: data.quiz || [],
          podcastScript: data.podcastScript || [],
          documentContext: data.extractedText || "",
        };
        const savedSession = await saveSession(user.uid, newSessionData);
        setHistory(prev => [savedSession, ...prev]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportCSV = () => {
    if (flashcards.length === 0) return;
    const csvContent = flashcards.map(card => {
      const esc = (f: string) => `"${f.replace(/"/g, '""')}"`;
      return `${esc(card.question)},${esc(card.answer)}`;
    }).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "luminate_deck.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#09090b] flex items-center justify-center transition-colors">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-gray-200 dark:border-white/10 border-t-[#3b82f6] rounded-full animate-spin"></div>
          <span className="text-sm text-gray-500 dark:text-white/40 font-medium">Loading Luminate...</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const hasContent = flashcards.length > 0 || quizQuestions.length > 0;

  const tabs = [
    { id: "flashcards" as const, icon: "fa-layer-group", label: "Cards", count: flashcards.length },
    { id: "quiz" as const, icon: "fa-clipboard-question", label: "Quiz", count: quizQuestions.length },
    { id: "graph" as const, icon: "fa-diagram-project", label: "Graph" },
    { id: "podcast" as const, icon: "fa-podcast", label: "Podcast" },
    { id: "feedback" as const, icon: "fa-feather", label: "Essay" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#09090b] text-gray-900 dark:text-white relative transition-colors duration-300 page-transition-enter overflow-x-hidden">
      {/* Background ambient light */}
      <div className="fixed top-0 left-0 w-[35%] h-[35%] bg-[#3b82f6]/8 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="fixed bottom-0 right-0 w-[35%] h-[35%] bg-[#8b5cf6]/6 blur-[150px] rounded-full pointer-events-none"></div>
      
      {/* ─── Header ─── */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-2xl border-b border-gray-200 dark:border-white/5 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 shadow-sm dark:shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-colors duration-300">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white border border-gray-200 dark:border-white/10 rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm">
              <Image src="/assets/logo.svg" alt="Logo" width={20} height={20} className="object-contain" />
            </div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-gray-900 dark:text-white">Luminate</h1>
          </div>
          
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="hidden md:flex items-center gap-2 bg-gray-100 dark:bg-[#18181b] px-3 py-1.5 rounded-full border border-gray-200 dark:border-white/5">
              <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></div>
              <span className="text-[11px] font-medium text-gray-600 dark:text-white/60 max-w-[180px] truncate">{user.email}</span>
            </div>
            <ThemeToggle />
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-all"
              title="API Settings"
            >
              <i className="fa-solid fa-gear text-xs sm:text-sm"></i>
            </button>
            <button 
              onClick={() => signOut(auth)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-gray-500 dark:text-white/50 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
              title="Sign Out"
            >
              <i className="fa-solid fa-right-from-bracket text-xs sm:text-sm"></i>
            </button>
          </div>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 pb-24 sm:py-6 relative z-10">
        
        {/* ─── Top Bento Grid ─── */}
        <div className={`grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-12 gap-2.5 sm:gap-3 mb-5 sm:mb-6 transition-all duration-700 ${isFocusMode ? 'opacity-10 pointer-events-none -translate-y-4' : 'opacity-100 translate-y-0'}`}>
          {/* Welcome Card */}
          <div className="col-span-2 sm:col-span-4 lg:col-span-7 bg-white/80 dark:bg-[#111113]/80 backdrop-blur-3xl border border-gray-200/50 dark:border-white/[0.05] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] rounded-[24px] p-4 sm:p-6 relative overflow-hidden flex flex-col justify-center min-h-[90px] sm:min-h-[110px] transition-colors group/welcome hover:shadow-lg dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] duration-500">
            <div className="absolute top-0 right-0 w-40 sm:w-56 h-40 sm:h-56 bg-gradient-to-br from-pink-500/20 to-purple-500/20 blur-3xl rounded-full pointer-events-none group-hover/welcome:scale-125 transition-transform duration-700 ease-out"></div>
            <h2 className="text-base sm:text-xl font-display font-bold text-gray-900 dark:text-white mb-0.5 sm:mb-1 relative z-10 tracking-tight">Welcome back, {user.email?.split('@')[0]} 👋</h2>
            <p className="text-gray-500 dark:text-white/50 text-[11px] sm:text-[13px] leading-relaxed relative z-10 max-w-md font-medium">Upload a PDF to generate flashcards, quizzes, podcasts, and knowledge graphs instantly.</p>
          </div>
          
          {/* Daily Goal Ring */}
          <div className="col-span-1 sm:col-span-1 lg:col-span-2 bg-white/80 dark:bg-[#111113]/80 backdrop-blur-3xl border border-gray-200/50 dark:border-white/[0.05] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] rounded-[24px] p-3 sm:p-4 flex flex-col items-center justify-center text-center transition-colors hover:scale-[1.02] duration-300">
            <div className="relative w-12 h-12 sm:w-16 sm:h-16 mb-1.5 sm:mb-2 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-gray-100 dark:text-white/5" />
                <circle cx="50" cy="50" r="40" stroke="#3b82f6" strokeWidth="8" fill="none" strokeDasharray="251" strokeDashoffset="62.75" strokeLinecap="round" className="drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all duration-1000 ease-out" />
              </svg>
              <div className="flex flex-col items-center tabular-nums">
                <span className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white leading-none tracking-tight">15</span>
                <span className="text-[7px] sm:text-[8px] font-bold text-gray-400 dark:text-white/40 uppercase tracking-widest">/20</span>
              </div>
            </div>
            <div className="text-gray-500 dark:text-white/50 text-[8px] sm:text-[9px] uppercase tracking-widest font-bold">Daily Goal</div>
          </div>

          {/* Streak */}
          <div className="col-span-1 sm:col-span-1 lg:col-span-1 bg-white/80 dark:bg-[#111113]/80 backdrop-blur-3xl border border-gray-200/50 dark:border-white/[0.05] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] rounded-[24px] p-3 sm:p-4 flex flex-col items-center justify-center text-center group transition-colors hover:scale-[1.02] duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[24px]"></div>
            <i className="fa-solid fa-fire text-orange-500 text-xl sm:text-2xl mb-1 group-hover:scale-125 transition-transform duration-300 relative z-10 drop-shadow-md"></i>
            <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white relative z-10 tabular-nums tracking-tight">{metrics.streak}</div>
            <div className="text-gray-500 dark:text-white/50 text-[8px] sm:text-[9px] uppercase tracking-widest font-bold relative z-10">Streak</div>
          </div>

          {/* Mastered */}
          <div className="hidden sm:flex col-span-1 lg:col-span-2 bg-white/80 dark:bg-[#111113]/80 backdrop-blur-3xl border border-gray-200/50 dark:border-white/[0.05] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] rounded-[24px] p-3 sm:p-4 flex-col items-center justify-center text-center group transition-colors hover:scale-[1.02] duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[24px]"></div>
            <i className="fa-solid fa-graduation-cap text-[#3b82f6] text-xl sm:text-2xl mb-1 group-hover:scale-125 transition-transform duration-300 relative z-10 drop-shadow-md"></i>
            <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white relative z-10 tabular-nums tracking-tight">{metrics.mastered}</div>
            <div className="text-gray-500 dark:text-white/50 text-[8px] sm:text-[9px] uppercase tracking-widest font-bold relative z-10">Mastered</div>
          </div>
        </div>

        {/* ─── Main Grid: Sidebar + Content ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5">
          
          {/* ─── Sidebar ─── */}
          <div className={`lg:col-span-4 xl:col-span-3 flex flex-col gap-3 sm:gap-4 transition-all duration-700 ${isFocusMode ? 'lg:opacity-30 lg:pointer-events-none lg:blur-[2px]' : ''} ${hasContent ? 'order-2 lg:order-1 mt-4 lg:mt-0' : 'order-1'}`}>
            
            {/* Sidebar Tab Switcher */}
            <div className="flex bg-gray-100/80 dark:bg-black/40 backdrop-blur-md border border-gray-200/80 dark:border-white/[0.04] rounded-[16px] p-1.5 transition-colors shadow-inner">
              <button onClick={() => setSidebarTab("upload")} className={`flex-1 py-2 rounded-[12px] text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${sidebarTab === 'upload' ? 'bg-white dark:bg-[#1f1f22] text-blue-600 dark:text-blue-400 shadow-[0_2px_10px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_15px_rgba(0,0,0,0.3)] scale-[1.02]' : 'text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white/80 hover:bg-black/5 dark:hover:bg-white/5 active:scale-[0.97]'}`}>
                <i className={`fa-solid fa-file-pdf text-[11px] ${sidebarTab === 'upload' ? 'text-blue-500 dark:text-blue-400 drop-shadow-sm' : ''}`}></i> Upload
              </button>
              <button onClick={() => setSidebarTab("tools")} className={`flex-1 py-2 rounded-[12px] text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${sidebarTab === 'tools' ? 'bg-white dark:bg-[#1f1f22] text-blue-600 dark:text-blue-400 shadow-[0_2px_10px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_15px_rgba(0,0,0,0.3)] scale-[1.02]' : 'text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white/80 hover:bg-black/5 dark:hover:bg-white/5 active:scale-[0.97]'}`}>
                <i className={`fa-solid fa-toolbox text-[11px] ${sidebarTab === 'tools' ? 'text-blue-500 dark:text-blue-400 drop-shadow-sm' : ''}`}></i> Tools
              </button>
            </div>

            {sidebarTab === "upload" ? (
              <>
                {/* Upload Section */}
                <div className="bg-white/80 dark:bg-[#111113]/80 backdrop-blur-3xl border border-gray-200/50 dark:border-white/[0.05] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] rounded-[24px] p-4 sm:p-5 relative overflow-hidden transition-colors">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#3b82f6] to-transparent opacity-30"></div>
                  <h2 className="text-sm font-bold mb-3 flex items-center gap-2 text-gray-900 dark:text-white">
                    <i className="fa-solid fa-file-pdf text-[#3b82f6] text-xs"></i>
                    Upload Lecture
                  </h2>
                  <FileUpload
                    isLoading={isGenerating}
                    onFileSelect={handleFileProcess}
                    onTextSubmit={handleTextProcess}
                  />
                  {error && (
                    <div className="mt-3 p-2.5 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs">
                      <i className="fa-solid fa-circle-exclamation mr-1.5"></i>
                      {error}
                    </div>
                  )}
                </div>

                {/* Pomodoro Timer */}
                <PomodoroTimer onToggleFocus={setIsFocusMode} />
              </>
            ) : (
              <>
                {/* Quick Notes */}
                <QuickNotes />
                
                {/* Study Stats */}
                <StudyStats metrics={metrics} />

                {/* Pomodoro Timer (also in tools) */}
                <PomodoroTimer onToggleFocus={setIsFocusMode} />
              </>
            )}
          </div>

          {/* ─── Main Content Area ─── */}
          <div className={`lg:col-span-8 xl:col-span-9 ${hasContent ? 'order-1 lg:order-2' : 'order-2'}`}>
            {!hasContent ? (
              /* ─── Empty State ─── */
              <div className="bg-white/80 dark:bg-[#111113]/80 backdrop-blur-3xl border border-gray-200/50 dark:border-white/[0.05] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] rounded-[32px] p-6 sm:p-8 flex items-center justify-center text-center relative overflow-hidden transition-colors min-h-[400px]">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-50 animate-pulse-slow"></div>
                <div className="flex flex-col gap-6 sm:gap-8 w-full justify-center">
                  <div className="text-center max-w-md mx-auto">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#3b82f6]/20 to-[#8b5cf6]/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-200 dark:border-white/[0.06] shadow-[0_0_30px_-10px_rgba(59,130,246,0.2)]">
                      <i className="fa-solid fa-layer-group text-xl sm:text-2xl text-gray-900 dark:text-white"></i>
                    </div>
                    <h3 className="text-lg sm:text-xl font-display font-bold mb-2 tracking-tight text-gray-900 dark:text-white">Ready to Synthesize?</h3>
                    <p className="text-gray-500 dark:text-white/50 text-[12px] sm:text-[13px] leading-relaxed">
                      Upload a PDF or paste notes to generate flashcards, quizzes, and a knowledge graph.
                    </p>
                  </div>

                  {/* Recent Sessions */}
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-3 px-1">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-white/40">Recent Sessions</h4>
                    </div>
                    
                    {isLoadingHistory ? (
                      <div className="flex items-center justify-center p-8">
                        <div className="w-6 h-6 border-2 border-gray-200 dark:border-white/10 border-t-[#3b82f6] rounded-full animate-spin"></div>
                      </div>
                    ) : history.length === 0 ? (
                      <div className="text-center p-6 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl">
                        <p className="text-[13px] text-gray-500 dark:text-white/40 font-medium">No previous sessions found. Create one above!</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5 sm:gap-3">
                        {history.map((session, idx) => {
                          // Rotate colors based on index
                          const colors = [
                            { bg: "bg-purple-100 dark:bg-purple-500/10", text: "text-purple-500", icon: "fa-atom" },
                            { bg: "bg-orange-100 dark:bg-orange-500/10", text: "text-orange-500", icon: "fa-book-open" },
                            { bg: "bg-emerald-100 dark:bg-emerald-500/10", text: "text-emerald-500", icon: "fa-landmark" },
                            { bg: "bg-blue-100 dark:bg-blue-500/10", text: "text-blue-500", icon: "fa-microscope" },
                          ];
                          const color = colors[idx % colors.length];

                          return (
                            <button 
                              key={session.id}
                              onClick={() => {
                                setFlashcards(session.flashcards || []);
                                setQuizQuestions(session.quizQuestions || []);
                                setPodcastScript(session.podcastScript || []);
                                setDocumentContext(session.documentContext || "");
                                setActiveTab("flashcards");
                              }}
                              className="text-left bg-white/50 dark:bg-black/20 hover:bg-white dark:hover:bg-white/10 border border-gray-100 dark:border-white/[0.04] p-3.5 sm:p-4 rounded-[16px] transition-all duration-300 group flex flex-col items-start min-w-[140px] sm:min-w-0 hover:shadow-md dark:hover:shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:scale-[1.02] active:scale-[0.97]"
                            >
                              <div className={`w-8 h-8 ${color.bg} rounded-lg flex items-center justify-center mb-2.5 ${color.text} group-hover:scale-110 transition-transform duration-300`}>
                                <i className={`fa-solid ${color.icon} text-sm`}></i>
                              </div>
                              <h5 className="font-bold text-gray-900 dark:text-white mb-0.5 text-[13px] truncate" title={session.title}>
                                {session.title}
                              </h5>
                              <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-white/40 font-medium mt-1.5">
                                <span><i className="fa-regular fa-clock mr-0.5"></i> {new Date(session.createdAt).toLocaleDateString()}</span>
                                {session.flashcards?.length > 0 && (
                                  <span><i className="fa-regular fa-clone mr-0.5"></i> {session.flashcards.length} Cards</span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* ─── Active Content ─── */
              <div className="flex flex-col gap-4 sm:gap-5">
                {/* Tab bar + actions */}
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2.5 sm:gap-3">
                  <div className="flex gap-1 bg-white/80 dark:bg-black/40 backdrop-blur-md border border-gray-200/80 dark:border-white/[0.04] p-1.5 rounded-[16px] transition-colors overflow-x-auto shadow-inner" style={{ scrollbarWidth: 'none' }}>
                    {tabs.map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-3 sm:px-4 py-2.5 rounded-[12px] text-[12px] sm:text-[13px] font-semibold transition-all duration-300 whitespace-nowrap flex items-center gap-1.5 ${
                          activeTab === tab.id 
                            ? 'bg-white dark:bg-[#1f1f22] text-blue-600 dark:text-blue-400 shadow-[0_2px_10px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_15px_rgba(0,0,0,0.3)] scale-[1.02]' 
                            : 'text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white/80 hover:bg-black/5 dark:hover:bg-white/5 active:scale-[0.97]'
                        }`}
                      >
                        <i className={`fa-solid ${tab.icon} text-[10px] ${activeTab === tab.id ? 'text-white' : 'text-gray-400 dark:text-white/40'}`}></i>
                        {tab.label}
                        {tab.count !== undefined && tab.count > 0 && (
                          <span className={`text-[9px] px-1.5 py-px rounded-full font-bold ${
                            activeTab === tab.id ? 'bg-white/20' : 'bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-white/60'
                          }`}>{tab.count}</span>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        setFlashcards([]);
                        setQuizQuestions([]);
                        setPodcastScript([]);
                        setDocumentContext("");
                      }}
                      className="px-4 py-2.5 rounded-[14px] bg-white/80 dark:bg-white/5 border border-gray-200/50 dark:border-white/[0.06] text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/10 transition-all duration-300 text-[11px] sm:text-[12px] font-bold flex items-center gap-1.5 active:scale-[0.97] shadow-sm backdrop-blur-md"
                    >
                      <i className="fa-solid fa-rotate-left text-[9px]"></i>
                      New
                    </button>
                    <button
                      className={`px-4 py-2.5 rounded-[14px] bg-[#10b981]/10 border border-[#10b981]/20 text-[#10b981] hover:bg-[#10b981]/20 transition-all duration-300 text-[11px] sm:text-[12px] font-bold flex items-center gap-1.5 active:scale-[0.97] shadow-sm backdrop-blur-md ${flashcards.length === 0 ? 'opacity-50 pointer-events-none' : ''}`}
                      onClick={handleExportCSV}
                    >
                      <i className="fa-solid fa-download text-[9px]"></i>
                      Export
                    </button>
                  </div>
                </div>

                {/* Tab Content */}
                {activeTab === "flashcards" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    {flashcards.map((card, i) => (
                      <Flashcard key={i} question={card.question} answer={card.answer} />
                    ))}
                  </div>
                )}

                {activeTab === "quiz" && <Quiz questions={quizQuestions} />}
                {activeTab === "graph" && <KnowledgeGraph />}
                {activeTab === "podcast" && <PodcastScript script={podcastScript} />}
                {activeTab === "feedback" && <EssayFeedback />}
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Agent */}
      <SocraticTutor documentContext={documentContext} />

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        initialKey={typeof window !== 'undefined' ? localStorage.getItem('gemini_api_key') || '' : ''}
        onSave={(key) => {
          if (key.trim()) {
            localStorage.setItem('gemini_api_key', key.trim());
          } else {
            localStorage.removeItem('gemini_api_key');
          }
        }}
      />
    </div>
  );
}
