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
    <div className="min-h-screen bg-black text-white p-8 animate-fade-in">
      <header className="flex justify-between items-center mb-12 max-w-5xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-[0_4px_14px_rgba(255,255,255,0.16)]">
            <Image src="/assets/logo.webp" alt="Logo" width={28} height={28} className="object-contain" />
          </div>
          <h1 className="text-xl font-bold font-display tracking-tight">Luminate</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-white/50">{user.email}</span>
          <button 
            onClick={() => signOut(auth)}
            className="text-sm text-white/50 hover:text-white transition-colors px-3 py-1.5 rounded-full hover:bg-white/10"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="bg-[#141416] border border-white/10 rounded-[var(--radius-3xl)] p-6 shadow-2xl relative overflow-hidden group hover:border-white/20 transition-colors">
              <h2 className="text-lg font-semibold mb-2">Upload Lecture</h2>
              <p className="text-white/50 text-sm mb-6">Drop a PDF here to instantly transform it into a study guide.</p>
              
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

          <div className="md:col-span-2">
            {!flashcards.length && !quizQuestions.length ? (
              <div className="bg-[#141416] border border-white/10 rounded-[var(--radius-3xl)] p-8 shadow-2xl min-h-[400px] flex items-center justify-center text-center">
                <div>
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
                    <i className="fa-solid fa-bolt text-2xl text-white/50"></i>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Active Study Session</h3>
                  <p className="text-white/40 max-w-xs mx-auto text-sm mb-6">
                    Upload a PDF lecture to generate flashcards and a quiz to test your knowledge.
                  </p>
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
                    className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-[var(--radius-lg)] text-sm font-medium transition-colors border border-white/10"
                  >
                    Load Demo Topic (Quantum Computing)
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6 animate-fade-in">
                <div className="flex bg-[#141416] border border-white/10 p-1.5 rounded-[var(--radius-xl)] w-fit mx-auto">
                  <button 
                    onClick={() => setActiveTab("flashcards")}
                    className={`px-6 py-2 rounded-[var(--radius-sm)] text-sm font-medium transition-all ${activeTab === 'flashcards' ? 'bg-[#28282a] text-white shadow-sm' : 'text-white/50 hover:text-white/80'}`}
                  >
                    <i className="fa-solid fa-layer-group mr-2"></i>Flashcards
                  </button>
                  <button 
                    onClick={() => setActiveTab("quiz")}
                    className={`px-6 py-2 rounded-[var(--radius-sm)] text-sm font-medium transition-all ${activeTab === 'quiz' ? 'bg-[#28282a] text-white shadow-sm' : 'text-white/50 hover:text-white/80'}`}
                  >
                    <i className="fa-solid fa-clipboard-question mr-2"></i>Quiz
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
