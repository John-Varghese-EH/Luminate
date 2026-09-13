"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import FileUpload from "@/components/ui/FileUpload";
import Flashcard from "@/components/study/Flashcard";
import Quiz, { QuizQuestion } from "@/components/study/Quiz";
import SocraticTutor from "@/components/study/SocraticTutor";
import KnowledgeGraph from "@/components/study/KnowledgeGraph";
import Image from "next/image";

interface FlashcardData {
  question: string;
  answer: string;
}

const PomodoroTimer = ({ onToggleFocus }: { onToggleFocus: (isFocus: boolean) => void }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  useEffect(() => {
    onToggleFocus(isActive);
  }, [isActive, onToggleFocus]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  return (
    <div className="bg-[#111113] border border-white/[0.06] rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden group">
      <div className={`absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/5 transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}></div>
      <i className="fa-solid fa-stopwatch text-white/40 mb-3 text-xl group-hover:text-red-400 transition-colors"></i>
      <div className="text-4xl font-display font-bold tracking-tight text-white mb-4">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      <button 
        onClick={() => setIsActive(!isActive)}
        className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all shadow-md ${isActive ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-red-500 text-white hover:bg-red-600 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]'}`}
      >
        {isActive ? 'Pause Focus' : 'Start Focus'}
      </button>
    </div>
  );
};

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [isGenerating, setIsGenerating] = useState(false);
  const [flashcards, setFlashcards] = useState<FlashcardData[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"flashcards" | "quiz" | "graph">("flashcards");
  const [isFocusMode, setIsFocusMode] = useState(false);
  
  // Metrics state (mocked for visual preview)
  const [metrics] = useState({ streak: 12, mastered: 428, nodes: 84 });

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#09090b] text-white animate-fade-in relative">
      {/* Background ambient light */}
      <div className="fixed top-[-20%] left-[-10%] w-[40%] h-[40%] bg-[#3b82f6]/10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-[#8b5cf6]/8 blur-[150px] rounded-full pointer-events-none"></div>
      
      <header className="sticky top-0 z-50 bg-[#09090b]/80 backdrop-blur-2xl border-b border-white/5 px-4 sm:px-8 py-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-[0_2px_12px_rgba(255,255,255,0.1)]">
              <Image src="/assets/logo.webp" alt="Logo" width={26} height={26} className="object-contain" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">Luminate</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-[#18181b] px-3 py-1.5 rounded-full border border-white/5">
              <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></div>
              <span className="text-[12px] font-medium text-white/60">{user.email}</span>
            </div>
            <button 
              onClick={() => signOut(auth)}
              className="text-sm font-medium text-white/50 hover:text-white transition-colors px-4 py-2 rounded-full hover:bg-white/5 active:scale-95"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8 pb-20 relative z-10">
        
        {/* Bento Grid Header (Hidden during Focus Mode) */}
        <div className={`grid grid-cols-1 md:grid-cols-12 gap-4 mb-8 transition-all duration-700 ${isFocusMode ? 'opacity-10 pointer-events-none -translate-y-4' : 'opacity-100 translate-y-0'}`}>
           <div className="md:col-span-6 lg:col-span-8 bg-[#111113] border border-white/[0.06] rounded-3xl p-8 relative overflow-hidden flex flex-col justify-end min-h-[160px]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-500/20 to-purple-500/20 blur-3xl rounded-full pointer-events-none"></div>
              <h2 className="text-2xl font-display font-bold text-white mb-1">Welcome back, {user.email?.split('@')[0]}</h2>
              <p className="text-white/50 text-[13px] max-w-sm leading-relaxed">Ready to synthesize today's lectures? You have 3 recent documents waiting for review.</p>
           </div>
           
           <div className="md:col-span-6 lg:col-span-4 grid grid-cols-2 gap-4">
             {/* Daily Goal Ring */}
             <div className="bg-[#111113] border border-white/[0.06] rounded-3xl p-5 relative overflow-hidden flex flex-col items-center justify-center text-center">
               <div className="relative w-20 h-20 mb-3 flex items-center justify-center">
                 <svg className="absolute inset-0 w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                   <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
                   <circle cx="50" cy="50" r="40" stroke="#3b82f6" strokeWidth="8" fill="none" strokeDasharray="251" strokeDashoffset="62.75" strokeLinecap="round" className="drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
                 </svg>
                 <div className="flex flex-col items-center justify-center">
                   <span className="text-xl font-bold text-white">15</span>
                   <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-[-2px]">/ 20</span>
                 </div>
               </div>
               <div className="text-white/50 text-[10px] uppercase tracking-widest font-bold">Daily Goal</div>
             </div>

             {/* Streak */}
             <div className="bg-[#111113] border border-white/[0.06] rounded-3xl p-5 relative overflow-hidden flex flex-col items-center justify-center text-center group">
               <div className="absolute inset-0 bg-gradient-to-t from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
               <i className="fa-solid fa-fire text-orange-500 text-3xl mb-3 drop-shadow-[0_0_15px_rgba(249,115,22,0.4)] group-hover:scale-110 transition-transform duration-500"></i>
               <div className="text-3xl font-display font-bold text-white mb-0.5">{metrics.streak}</div>
               <div className="text-white/40 text-[10px] uppercase tracking-widest font-semibold">Day Streak</div>
             </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 transition-all duration-700">
          {/* Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-6 transition-all duration-700">
            <div className={`bg-[#111113] border border-white/[0.06] rounded-2xl p-6 relative overflow-hidden transition-all duration-700 ${isFocusMode ? 'opacity-30 pointer-events-none blur-[2px]' : 'opacity-100'}`}>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#3b82f6] to-transparent opacity-30"></div>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <i className="fa-solid fa-file-pdf text-[#3b82f6]"></i>
                Upload Lecture
              </h2>
              
              <FileUpload
                isLoading={isGenerating}
                onFileSelect={async (file) => {
                  setIsGenerating(true);
                  setError("");
                  try {
                    const formData = new FormData();
                    formData.append("file", file);
                    const res = await fetch("/api/generate", {
                      method: "POST",
                      body: formData,
                    });
                    if (!res.ok) throw new Error("Failed to process PDF");
                    
                    const data = await res.json();
                    setFlashcards(data.flashcards || []);
                    setQuizQuestions(data.quiz || []);
                    setActiveTab("flashcards");
                  } catch (err) {
                    const msg = err instanceof Error ? err.message : "An error occurred";
                    setError(msg);
                  } finally {
                    setIsGenerating(false);
                  }
                }}
                onTextSubmit={async (text) => {
                  setIsGenerating(true);
                  setError("");
                  try {
                    const formData = new FormData();
                    formData.append("text", text);
                    const res = await fetch("/api/generate", {
                      method: "POST",
                      body: formData,
                    });
                    if (!res.ok) throw new Error("Failed to process text");
                    
                    const data = await res.json();
                    setFlashcards(data.flashcards || []);
                    setQuizQuestions(data.quiz || []);
                    setActiveTab("flashcards");
                  } catch (err) {
                    const msg = err instanceof Error ? err.message : "An error occurred";
                    setError(msg);
                  } finally {
                    setIsGenerating(false);
                  }
                }}
              />

              {error && (
                <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}
            </div>

            {/* Pomodoro Timer */}
            <PomodoroTimer onToggleFocus={setIsFocusMode} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8">
            {!flashcards.length && !quizQuestions.length ? (
              <div className="bg-[#111113] border border-white/[0.06] rounded-2xl p-8 md:p-12 min-h-[400px] flex items-center justify-center text-center relative overflow-hidden">
                <div className="flex flex-col gap-8 animate-fade-in w-full h-full justify-center">
                  <div className="text-center max-w-lg mx-auto mb-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#3b82f6]/20 to-[#8b5cf6]/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/[0.06] shadow-[0_0_40px_-10px_rgba(59,130,246,0.2)]">
                      <i className="fa-solid fa-layer-group text-3xl text-white"></i>
                    </div>
                    <h3 className="text-2xl font-display font-bold mb-3 tracking-tight text-white">Ready to Synthesize?</h3>
                    <p className="text-white/50 text-[15px] leading-relaxed">
                      Upload a PDF lecture or paste your notes to generate intelligent flashcards, quizzes, and a dynamic knowledge graph.
                    </p>
                  </div>

                  <div className="w-full max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-4 px-2">
                      <h4 className="text-sm font-bold uppercase tracking-widest text-white/40">Recent Sessions</h4>
                      <button className="text-[#3b82f6] text-xs font-semibold hover:text-[#60a5fa] transition-colors">View All</button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Mock Card 1 */}
                      <div 
                        onClick={() => {
                          setFlashcards([
                            { question: "What is a Qubit?", answer: "The fundamental unit of quantum information, capable of existing in multiple states simultaneously due to superposition." },
                            { question: "What is Quantum Entanglement?", answer: "A physical phenomenon where particles become interconnected such that the quantum state of one cannot be described independently of the state of the others." }
                          ]);
                          setQuizQuestions([
                            {
                              question: "Which quantum phenomenon allows a qubit to represent both 0 and 1 at the same time?",
                              options: ["Entanglement", "Superposition", "Decoherence", "Interference"],
                              correctAnswer: "Superposition",
                              explanation: "Superposition is the principle that allows a quantum system to exist in multiple states simultaneously until it is measured."
                            }
                          ]);
                          setActiveTab("flashcards");
                        }}
                        className="bg-[#111113] border border-white/[0.06] p-5 rounded-3xl hover:bg-[#18181b] hover:border-[#3b82f6]/30 transition-all cursor-pointer group shadow-sm hover:shadow-[0_10px_30px_rgba(59,130,246,0.1)] hover:-translate-y-1"
                      >
                        <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 text-purple-400 group-hover:scale-110 transition-transform">
                          <i className="fa-solid fa-atom"></i>
                        </div>
                        <h5 className="font-bold text-white mb-1">Quantum Physics 101</h5>
                        <div className="flex items-center gap-3 text-[11px] text-white/40 font-semibold tracking-wide">
                          <span><i className="fa-regular fa-clone mr-1"></i> 24 Cards</span>
                          <span><i className="fa-solid fa-check-double text-green-500/70 mr-1"></i> 80% Mastery</span>
                        </div>
                      </div>

                      {/* Mock Card 2 */}
                      <div className="bg-[#111113] border border-white/[0.06] p-5 rounded-3xl hover:bg-[#18181b] hover:border-[#3b82f6]/30 transition-all cursor-pointer group shadow-sm hover:shadow-[0_10px_30px_rgba(59,130,246,0.1)] hover:-translate-y-1 opacity-60">
                        <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center mb-4 text-orange-400 group-hover:scale-110 transition-transform">
                          <i className="fa-solid fa-dna"></i>
                        </div>
                        <h5 className="font-bold text-white mb-1">Cellular Biology</h5>
                        <div className="flex items-center gap-3 text-[11px] text-white/40 font-semibold tracking-wide">
                          <span><i className="fa-regular fa-clone mr-1"></i> 112 Cards</span>
                          <span><i className="fa-solid fa-check-double text-green-500/70 mr-1"></i> 45% Mastery</span>
                        </div>
                      </div>

                      {/* Mock Card 3 */}
                      <div className="bg-[#111113] border border-white/[0.06] p-5 rounded-3xl hover:bg-[#18181b] hover:border-[#3b82f6]/30 transition-all cursor-pointer group shadow-sm hover:shadow-[0_10px_30px_rgba(59,130,246,0.1)] hover:-translate-y-1 opacity-60">
                        <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 text-emerald-400 group-hover:scale-110 transition-transform">
                          <i className="fa-solid fa-landmark"></i>
                        </div>
                        <h5 className="font-bold text-white mb-1">Roman History</h5>
                        <div className="flex items-center gap-3 text-[11px] text-white/40 font-semibold tracking-wide">
                          <span><i className="fa-regular fa-clone mr-1"></i> 48 Cards</span>
                          <span><i className="fa-solid fa-check-double text-green-500/70 mr-1"></i> 12% Mastery</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex bg-[#111113] border border-white/[0.06] p-1 rounded-xl">
                    <button 
                      onClick={() => setActiveTab("flashcards")}
                      className={`px-5 py-2 rounded-lg text-[13px] font-semibold transition-all duration-200 ${activeTab === 'flashcards' ? 'bg-[#3b82f6] text-white shadow-md' : 'text-white/50 hover:text-white/80'}`}
                    >
                      <i className={`fa-solid fa-layer-group mr-1.5 ${activeTab === 'flashcards' ? 'text-white' : 'text-white/40'}`}></i>
                      Flashcards
                    </button>
                    <button 
                      onClick={() => setActiveTab("quiz")}
                      className={`px-5 py-2 rounded-lg text-[13px] font-semibold transition-all duration-200 ${activeTab === 'quiz' ? 'bg-[#3b82f6] text-white shadow-md' : 'text-white/50 hover:text-white/80'}`}
                    >
                      <i className={`fa-solid fa-clipboard-question mr-1.5 ${activeTab === 'quiz' ? 'text-white' : 'text-white/40'}`}></i>
                      Quiz
                    </button>
                    <button 
                      onClick={() => setActiveTab("graph")}
                      className={`px-5 py-2 rounded-lg text-[13px] font-semibold transition-all duration-200 ${activeTab === 'graph' ? 'bg-[#3b82f6] text-white shadow-md' : 'text-white/50 hover:text-white/80'}`}
                    >
                      <i className={`fa-solid fa-diagram-project mr-1.5 ${activeTab === 'graph' ? 'text-white' : 'text-white/40'}`}></i>
                      Graph
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        setFlashcards([]);
                        setQuizQuestions([]);
                      }}
                      className="px-3 py-2 rounded-lg bg-white/5 border border-white/[0.06] text-white/60 hover:text-white hover:bg-white/10 transition-colors text-[12px] font-medium flex items-center gap-1.5 active:scale-95"
                    >
                      <i className="fa-solid fa-rotate-left text-[10px]"></i>
                      New
                    </button>
                    <button
                      className={`px-3 py-2 rounded-lg bg-[#10b981]/10 border border-[#10b981]/20 text-[#10b981] hover:bg-[#10b981]/20 transition-colors text-[12px] font-medium flex items-center gap-1.5 active:scale-95 ${flashcards.length === 0 ? 'opacity-50 pointer-events-none' : ''}`}
                      onClick={() => {
                        if (flashcards.length === 0) return;
                        
                        // Generate CSV for Anki (Question\tAnswer)
                        const csvContent = flashcards.map(card => {
                          const escapeField = (field: string) => `"${field.replace(/"/g, '""')}"`;
                          return `${escapeField(card.question)},${escapeField(card.answer)}`;
                        }).join('\n');
                        
                        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.setAttribute("href", url);
                        link.setAttribute("download", "luminate_deck.csv");
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                    >
                      <i className="fa-solid fa-download text-[10px]"></i>
                      Export CSV
                    </button>
                  </div>
                </div>

                {activeTab === "flashcards" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {flashcards.map((card, i) => (
                      <Flashcard key={i} question={card.question} answer={card.answer} />
                    ))}
                  </div>
                )}

                {activeTab === "quiz" && (
                  <Quiz questions={quizQuestions} />
                )}

                {activeTab === "graph" && (
                  <KnowledgeGraph />
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Premium Feature: Socratic Tutor */}
      <SocraticTutor />
    </div>
  );
}
