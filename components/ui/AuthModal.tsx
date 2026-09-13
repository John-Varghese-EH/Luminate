"use client";

import { useState } from "react";
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  if (!isOpen) return null;

  const handleAuthAction = async (action: () => Promise<void>) => {
    setError("");
    setIsLoading(true);
    try {
      await action();
      onClose();
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred";
      setError(msg.replace("Firebase: ", ""));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    handleAuthAction(async () => {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    });
  };

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    handleAuthAction(async () => {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xl animate-fade-in p-4" onClick={onClose}>
      <div 
        className="w-full max-w-[420px] bg-[#09090b] border border-white/10 rounded-[28px] p-8 shadow-[0_0_80px_-20px_rgba(59,130,246,0.15)] relative overflow-hidden group"
        style={{ animation: "revealPulse 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle top gradient glow inside modal */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-[#3b82f6]/20 to-transparent blur-2xl pointer-events-none rounded-full -mt-10 opacity-60"></div>
        
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-all z-10"
        >
          <i className="fa-solid fa-xmark text-sm"></i>
        </button>

        <div className="flex flex-col items-center mb-8 relative z-10">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-[0_4px_24px_rgba(255,255,255,0.15)] mb-5">
            <Image src="/assets/logo.webp" alt="Logo" width={34} height={34} className="object-contain" />
          </div>
          <h2 className="text-[28px] leading-tight font-bold text-white tracking-tight text-center">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="text-[#a1a1aa] text-[15px] mt-2 text-center max-w-[280px]">
            {isSignUp ? "Join Luminate to start transforming your lectures into active recall." : "Sign in to access your AI-powered study dashboard."}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[13px] p-3.5 rounded-2xl mb-6 flex items-start gap-2.5 animate-fade-in relative z-10">
            <i className="fa-solid fa-circle-exclamation mt-0.5"></i>
            <span className="leading-snug">{error}</span>
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="flex flex-col gap-4 relative z-10">
          <div className="relative group/input">
            <i className="fa-regular fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/input:text-[#3b82f6] transition-colors"></i>
            <input 
              type="email" 
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#18181b] border border-white/5 text-white placeholder:text-white/30 rounded-2xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-[#3b82f6]/50 focus:bg-[#18181b] transition-all text-[15px] shadow-inner"
              required
            />
          </div>
          <div className="relative group/input">
            <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/input:text-[#3b82f6] transition-colors"></i>
            <input 
              type="password" 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#18181b] border border-white/5 text-white placeholder:text-white/30 rounded-2xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-[#3b82f6]/50 focus:bg-[#18181b] transition-all text-[15px] shadow-inner"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full relative overflow-hidden bg-white text-black font-semibold rounded-2xl py-3.5 mt-2 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-[0_0_0_1px_rgba(255,255,255,0.15),_0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-70 disabled:hover:scale-100"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
            {isLoading ? (
              <i className="fa-solid fa-circle-notch animate-spin"></i>
            ) : (
              isSignUp ? "Create Account" : "Sign In"
            )}
          </button>
        </form>

        <div className="flex items-center gap-4 my-6 relative z-10">
          <div className="h-px bg-white/10 flex-1"></div>
          <span className="text-white/30 text-[11px] uppercase tracking-widest font-semibold">Or</span>
          <div className="h-px bg-white/10 flex-1"></div>
        </div>

        <button 
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full bg-[#18181b] hover:bg-[#27272a] border border-white/10 text-white font-medium text-[15px] rounded-2xl py-3.5 flex items-center justify-center gap-3 transition-colors hover:border-white/20 disabled:opacity-70 relative z-10"
        >
          <Image src="https://www.svgrepo.com/show/475656/google-color.svg" width={18} height={18} alt="Google" />
          Continue with Google
        </button>

        <p className="text-center text-[#a1a1aa] text-[14px] mt-8 relative z-10">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-white font-medium hover:text-[#3b82f6] transition-colors"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}
