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
    <div className="min-h-screen bg-[#09090b] text-white animate-fade-in relative overflow-hidden">
      {/* Background ambient light mesh */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#3b82f6]/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#8b5cf6]/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>
      
      <header className="sticky top-0 z-50 bg-[#09090b]/80 backdrop-blur-2xl border-b border-white/5 px-8 py-5 mb-12 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-11 h-11 bg-white rounded-[14px] flex items-center justify-center shadow-[0_4px_24px_rgba(255,255,255,0.15)] group-hover:shadow-[0_4px_30px_rgba(255,255,255,0.3)] transition-all group-hover:scale-105">
              <Image src="/assets/logo.webp" alt="Logo" width={28} height={28} className="object-contain" />
            </div>
            <h1 className="text-2xl font-bold font-display tracking-tight text-white group-hover:text-[#3b82f6] transition-colors">Luminate</h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 bg-[#18181b] px-4 py-2 rounded-full border border-white/5">
              <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></div>
              <span className="text-[13px] font-medium text-white/70">{user.email}</span>
            </div>
            <button 
              onClick={() => signOut(auth)}
              className="text-sm font-semibold text-white/50 hover:text-white transition-colors px-5 py-2.5 rounded-full hover:bg-white/10 active:scale-95"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 pb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <div className="bg-[#18181b]/50 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-2xl relative overflow-hidden group hover:border-[#3b82f6]/30 transition-colors duration-500">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#3b82f6] to-transparent opacity-50"></div>
              <h2 className="text-xl font-bold mb-3 text-white tracking-tight flex items-center gap-3">
                <i className="fa-solid fa-layer-group text-[#3b82f6]"></i>
                Study Material
              </h2>
              <p className="text-white/50 text-[15px] mb-8 leading-relaxed">Drop a PDF lecture here to instantly transform it into 3D flashcards and an interactive quiz.</p>
              
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

          <div className="lg:col-span-8">
            {!flashcards.length && !quizQuestions.length ? (
              <div className="bg-[#18181b]/30 backdrop-blur-md border border-white/5 rounded-[32px] p-8 md:p-12 shadow-2xl min-h-[450px] flex items-center justify-center text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#3b82f6]/10 blur-[100px] rounded-full pointer-events-none"></div>
                
                <div className="relative z-10 max-w-sm mx-auto">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#3b82f6]/20 to-[#8b5cf6]/20 rounded-[24px] flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-[0_0_40px_-10px_rgba(59,130,246,0.2)]">
                    <i className="fa-solid fa-bolt text-3xl text-white"></i>
                  </div>
                  <h3 className="text-[24px] font-bold mb-3 tracking-tight text-white">No Active Session</h3>
                  <p className="text-white/50 text-[15px] mb-8 leading-relaxed">
                    Upload a PDF lecture to automatically generate intelligent flashcards and a dynamic quiz.
                  </p>
                  
                  <div className="flex flex-col items-center gap-4">
                    <span className="text-[11px] uppercase tracking-widest text-white/30 font-semibold">Or try it out</span>
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
                      className="px-6 py-3 bg-white text-black hover:bg-gray-100 rounded-2xl text-[14px] font-semibold transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)] flex items-center gap-2"
                    >
                      <i className="fa-solid fa-wand-magic-sparkles"></i>
                      Load Demo (Quantum Computing)
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-8 animate-fade-in">
                <div className="flex bg-[#18181b]/80 backdrop-blur-md border border-white/10 p-1.5 rounded-full w-fit mx-auto shadow-2xl relative z-20">
                  <button 
                    onClick={() => setActiveTab("flashcards")}
                    className={`px-8 py-2.5 rounded-full text-[14px] font-semibold transition-all duration-300 ${activeTab === 'flashcards' ? 'bg-[#3b82f6] text-white shadow-[0_4px_14px_rgba(59,130,246,0.4)]' : 'text-white/50 hover:text-white/80'}`}
                  >
                    <i className={`fa-solid fa-layer-group mr-2 ${activeTab === 'flashcards' ? 'text-white' : 'text-white/40'}`}></i>
                    Flashcards
                  </button>
                  <button 
                    onClick={() => setActiveTab("quiz")}
                    className={`px-8 py-2.5 rounded-full text-[14px] font-semibold transition-all duration-300 ${activeTab === 'quiz' ? 'bg-[#3b82f6] text-white shadow-[0_4px_14px_rgba(59,130,246,0.4)]' : 'text-white/50 hover:text-white/80'}`}
                  >
                    <i className={`fa-solid fa-clipboard-question mr-2 ${activeTab === 'quiz' ? 'text-white' : 'text-white/40'}`}></i>
                    Quiz
                  </button>
                </div>

                {activeTab === "flashcards" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
