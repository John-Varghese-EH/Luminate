"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import FileUpload from "@/components/ui/FileUpload";
import Flashcard from "@/components/study/Flashcard";
import Quiz, { QuizQuestion } from "@/components/study/Quiz";
import Image from "next/image";

interface FlashcardData {
  question: string;
  answer: string;
}

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [isGenerating, setIsGenerating] = useState(false);
  const [flashcards, setFlashcards] = useState<FlashcardData[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"flashcards" | "quiz">("flashcards");

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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-[#111113] border border-white/[0.06] rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-[#3b82f6]/40 via-[#3b82f6]/10 to-transparent"></div>
              <h2 className="text-lg font-bold mb-2 text-white tracking-tight flex items-center gap-2.5">
                <i className="fa-solid fa-layer-group text-[#3b82f6] text-base"></i>
                Study Material
              </h2>
              <p className="text-white/40 text-sm mb-6 leading-relaxed">Drop a PDF lecture here to generate flashcards and quizzes.</p>
              
              <FileUpload 
                isLoading={isGenerating} 
                onFileSelect={async (file) => {
                  setIsGenerating(true);
                  setError("");
                  
                  const formData = new FormData();
                  formData.append("file", file);

                  try {
                    const res = await fetch("/api/generate", {
                      method: "POST",
                      body: formData,
                    });
                    
                    const data = await res.json();
                    
                    if (!res.ok) throw new Error(data.error || "Generation failed");

                    setFlashcards(data.flashcards || []);
                    setQuizQuestions(data.quiz || []);
                    setActiveTab("flashcards");
                  } catch (err: unknown) {
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
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8">
            {!flashcards.length && !quizQuestions.length ? (
              <div className="bg-[#111113] border border-white/[0.06] rounded-2xl p-8 md:p-12 min-h-[400px] flex items-center justify-center text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#3b82f6]/5 blur-[80px] rounded-full pointer-events-none"></div>
                
                <div className="relative z-10 max-w-sm mx-auto">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#3b82f6]/15 to-[#8b5cf6]/15 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-white/[0.06]">
                    <i className="fa-solid fa-bolt text-2xl text-white/80"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-2 tracking-tight text-white">No Active Session</h3>
                  <p className="text-white/40 text-sm mb-6 leading-relaxed">
                    Upload a PDF lecture to generate intelligent flashcards and a dynamic quiz.
                  </p>
                  
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-[10px] uppercase tracking-[0.15em] text-white/25 font-semibold">Or try it out</span>
                    <button 
                      onClick={() => {
                        setFlashcards([
                          { question: "What is a Qubit?", answer: "The fundamental unit of quantum information, capable of existing in multiple states simultaneously due to superposition." },
                          { question: "What is Quantum Entanglement?", answer: "A physical phenomenon where particles become interconnected such that the quantum state of one cannot be described independently of the state of the others." },
                          { question: "Why are Quantum Computers faster for certain tasks?", answer: "They use quantum algorithms (like Shor's or Grover's) that leverage superposition and interference to evaluate many possibilities simultaneously." }
                        ]);
                        setQuizQuestions([
                          {
                            question: "Which quantum phenomenon allows a qubit to represent both 0 and 1 at the same time?",
                            options: ["Entanglement", "Superposition", "Decoherence", "Interference"],
                            correctAnswer: "Superposition",
                            explanation: "Superposition is the principle that allows a quantum system to exist in multiple states simultaneously until it is measured."
                          },
                          {
                            question: "What happens when a quantum state collapses?",
                            options: ["It becomes entangled", "It loses energy", "It resolves to a single classical state upon measurement", "It duplicates itself"],
                            correctAnswer: "It resolves to a single classical state upon measurement",
                            explanation: "Measurement forces a superposition state to collapse into one definite classical state (0 or 1)."
                          }
                        ]);
                        setActiveTab("flashcards");
                      }}
                      className="px-5 py-2.5 bg-white text-black hover:bg-gray-100 rounded-xl text-[13px] font-semibold transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_-5px_rgba(255,255,255,0.2)] flex items-center gap-2"
                    >
                      <i className="fa-solid fa-wand-magic-sparkles"></i>
                      Load Demo
                    </button>
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
                      className="px-3 py-2 rounded-lg bg-[#10b981]/10 border border-[#10b981]/20 text-[#10b981] hover:bg-[#10b981]/20 transition-colors text-[12px] font-medium flex items-center gap-1.5 active:scale-95"
                      onClick={() => alert("Export feature unlocked in Pro version!")}
                    >
                      <i className="fa-solid fa-download text-[10px]"></i>
                      Export
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
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
