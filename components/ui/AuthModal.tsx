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
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xl animate-fade-in p-4" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div 
        className="w-full max-w-[420px] bg-[#09090b] border border-white/10 rounded-[28px] p-8 shadow-[0_0_80px_-20px_rgba(59,130,246,0.15)] relative overflow-hidden group"
        style={{ animation: "revealPulse 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle top gradient glow inside modal */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-[#3b82f6]/20 to-transparent blur-2xl pointer-events-none rounded-full -mt-10 opacity-60"></div>
        
        <button 
          onClick={onClose}
          aria-label="Close authentication dialog"
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-all z-10"
        >
          <i className="fa-solid fa-xmark text-sm" aria-hidden="true"></i>
        </button>

        <div className="flex flex-col items-center mb-8 relative z-10">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-[0_4px_24px_rgba(255,255,255,0.15)] mb-5">
            <Image src="/assets/logo.webp" alt="Luminate logo" width={34} height={34} className="object-contain" />
          </div>
          <h2 id="auth-modal-title" className="text-[28px] leading-tight font-bold text-white tracking-tight text-center">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="text-[#a1a1aa] text-[15px] mt-2 text-center max-w-[280px]">
            {isSignUp ? "Join Luminate to start transforming your lectures into active recall." : "Sign in to access your AI-powered study dashboard."}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[13px] p-3.5 rounded-2xl mb-6 flex items-start gap-2.5 animate-fade-in relative z-10" role="alert">
            <i className="fa-solid fa-circle-exclamation mt-0.5" aria-hidden="true"></i>
            <span className="leading-snug">{error}</span>
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="flex flex-col gap-4 relative z-10" aria-label="Sign in form">
          <div className="relative group/input">
            <label htmlFor="auth-email" className="sr-only">Email address</label>
            <i className="fa-regular fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/input:text-[#3b82f6] transition-colors" aria-hidden="true"></i>
            <input 
              id="auth-email"
              type="email" 
              placeholder="Email address"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#18181b] border border-white/5 text-white placeholder:text-white/30 rounded-2xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-[#3b82f6]/50 focus:bg-[#18181b] transition-all text-[15px] shadow-inner"
              required
            />
          </div>
          <div className="relative group/input">
            <label htmlFor="auth-password" className="sr-only">Password</label>
            <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/input:text-[#3b82f6] transition-colors" aria-hidden="true"></i>
            <input 
              id="auth-password"
              type="password" 
              placeholder="Password"
              autoComplete={isSignUp ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#18181b] border border-white/5 text-white placeholder:text-white/30 rounded-2xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-[#3b82f6]/50 focus:bg-[#18181b] transition-all text-[15px] shadow-inner"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="group w-full relative overflow-hidden bg-white text-black font-semibold rounded-2xl py-3.5 mt-2 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-[0_0_0_1px_rgba(255,255,255,0.15),_0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-70 disabled:hover:scale-100"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
            {isLoading ? (
              <i className="fa-solid fa-circle-notch animate-spin" aria-hidden="true"></i>
            ) : (
              isSignUp ? "Create Account" : "Sign In"
            )}
          </button>
        </form>

        <div className="flex items-center gap-4 my-6 relative z-10" role="separator">
          <div className="h-px bg-white/10 flex-1"></div>
          <span className="text-white/30 text-[11px] uppercase tracking-widest font-semibold">Or</span>
          <div className="h-px bg-white/10 flex-1"></div>
        </div>

        <button 
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full bg-[#18181b] hover:bg-[#27272a] border border-white/10 text-white font-medium text-[15px] rounded-2xl py-3.5 flex items-center justify-center gap-3 transition-colors hover:border-white/20 disabled:opacity-70 relative z-10"
        >
          {/* Inline Google SVG to avoid remote image 400 errors */}
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
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
