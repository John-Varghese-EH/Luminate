"use client";

import { useState } from "react";
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onClose();
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred";
      setError(msg);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onClose();
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred";
      setError(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div 
        className="w-full max-w-md bg-[#141416] border border-white/10 rounded-3xl p-8 shadow-2xl relative"
        style={{ animation: "revealPulse 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors"
        >
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>

        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
          {isSignUp ? "Create Account" : "Welcome Back"}
        </h2>
        <p className="text-[#a1a1aa] text-sm mb-6">
          {isSignUp ? "Sign up to start transforming your lectures." : "Sign in to access your Luminate dashboard."}
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="flex flex-col gap-4">
          <div>
            <input 
              type="email" 
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#1e1e22] border border-white/5 text-white placeholder:text-white/30 rounded-xl px-4 py-3 focus:outline-none focus:border-[#3b82f6]/50 transition-colors"
              required
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1e1e22] border border-white/5 text-white placeholder:text-white/30 rounded-xl px-4 py-3 focus:outline-none focus:border-[#3b82f6]/50 transition-colors"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-white text-black font-semibold rounded-xl py-3 mt-2 hover:bg-gray-100 transition-colors"
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <div className="flex items-center gap-4 my-6">
          <div className="h-px bg-white/10 flex-1"></div>
          <span className="text-white/30 text-xs uppercase tracking-wider font-medium">Or</span>
          <div className="h-px bg-white/10 flex-1"></div>
        </div>

        <button 
          onClick={handleGoogleSignIn}
          className="w-full bg-[#1e1e22] hover:bg-[#28282a] border border-white/10 text-white font-medium rounded-xl py-3 flex items-center justify-center gap-3 transition-colors"
        >
          <i className="fa-brands fa-google"></i>
          Continue with Google
        </button>

        <p className="text-center text-[#a1a1aa] text-sm mt-6">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-white font-medium hover:underline"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}
