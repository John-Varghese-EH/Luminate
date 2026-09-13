"use client";

import { useState } from "react";
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { checkEmailValidity } from "@/lib/email-checker";

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
      const validation = await checkEmailValidity(email);
      if (!validation.isValid) {
        throw new Error(validation.error || "Please use a valid, non-temporary email address.");
      }

      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    });
  };

  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (!pass) return { segments: 0, label: "", color: "bg-transparent", textClass: "" };
    
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    
    let segments = 0;
    if (score <= 2) segments = 1;
    else if (score <= 3) segments = 2;
    else if (score <= 4) segments = 3;
    else segments = 4;
    
    if (segments === 1) return { segments, label: "Weak", color: "bg-red-500", textClass: "text-red-500" };
    if (segments === 2) return { segments, label: "Fair", color: "bg-yellow-500", textClass: "text-yellow-500" };
    if (segments === 3) return { segments, label: "Good", color: "bg-blue-400", textClass: "text-blue-400" };
    return { segments, label: "Strong", color: "bg-emerald-400", textClass: "text-emerald-400" };
  };

  const strength = getPasswordStrength(password);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xl animate-fade-in p-4" onClick={onClose}>
      <div 
        className="w-full max-w-[420px] md:max-w-[850px] bg-[#09090b] border border-white/10 rounded-[28px] shadow-[0_0_80px_-20px_rgba(59,130,246,0.15)] relative overflow-hidden group flex min-h-[500px]"
        style={{ animation: "revealPulse 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Side (Video - Desktop Only) */}
        <div className="hidden md:block relative w-1/2 bg-black overflow-hidden shrink-0 border-r border-white/5 group/video">
          
          {/* Animated Overlay Text */}
          <div className="absolute inset-0 z-10 flex flex-col justify-end p-10 bg-gradient-to-t from-[#09090b] via-[#09090b]/40 to-transparent pointer-events-none">
            <h3 className="text-4xl lg:text-5xl font-display uppercase leading-[1.1] mb-2 flex flex-col overflow-hidden">
              <span className="block text-white opacity-0 translate-y-[14px] animate-headline-fade" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>INTELLIGENCE</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400 opacity-0 translate-y-[14px] animate-headline-fade" style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}>DESIGNED TO</span>
              <span className="block text-white opacity-0 translate-y-[14px] animate-headline-fade" style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}>EVOLVE</span>
            </h3>
            <p className="text-white/40 text-sm mt-4 font-sans max-w-[280px] opacity-0 translate-y-[14px] animate-headline-fade" style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}>
              Synthesize dense lectures into neural knowledge graphs in seconds.
            </p>
          </div>

          <div className="absolute top-1/2 left-1/2 w-[800px] h-[425px] -translate-x-1/2 -translate-y-1/2 -rotate-90 pointer-events-none">
            <video 
              className="w-full h-full object-cover" 
              autoPlay 
              muted 
              loop 
              playsInline
            >
              <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260809_012548_ef22562c-c0ae-4816-ad9d-f8922af4e6a7.mp4" type="video/mp4" />
            </video>
          </div>
        </div>

        {/* Right Side (Form) */}
        <div className="w-full md:w-1/2 p-8 relative flex flex-col justify-center shrink-0">
          {/* Subtle top gradient glow inside modal */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-pink-500/30 to-transparent blur-2xl pointer-events-none rounded-full -mt-10 opacity-60"></div>
          
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-all z-10"
          >
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>

          <div className="flex flex-col items-center mb-8 relative z-10">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-[0_4px_24px_rgba(255,255,255,0.15)] mb-5">
              <Image src="/assets/logo.svg" alt="Logo" width={34} height={34} className="object-contain" />
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
              <i className="fa-solid fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/input:text-pink-500 transition-colors"></i>
              <input 
                id="auth-email"
                name="email"
                type="email" 
                placeholder="Email Address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full bg-[#18181b] border border-white/5 text-white placeholder:text-white/30 rounded-2xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-pink-500/50 focus:bg-[#18181b] transition-all text-[15px] shadow-inner"
                required
              />
            </div>
            <div className="relative group/input">
              <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/input:text-pink-500 transition-colors"></i>
              <input 
                id="auth-password"
                name="password"
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isSignUp ? "new-password" : "current-password"}
                className="w-full bg-[#18181b] border border-white/5 text-white placeholder:text-white/30 rounded-2xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-pink-500/50 focus:bg-[#18181b] transition-all text-[15px] shadow-inner"
                required
              />
            </div>
            
            {/* Password Strength Meter (Only on Sign Up) */}
            {isSignUp && password.length > 0 && (
              <div className="flex flex-col gap-1.5 mt-1 animate-fade-in px-1">
                <div className="flex gap-1.5 h-1 w-full">
                  {[...Array(4)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`flex-1 rounded-full transition-all duration-500 ${
                        i < strength.segments ? strength.color : 'bg-white/10'
                      }`} 
                    />
                  ))}
                </div>
                <div className="flex justify-between items-center text-[11px] uppercase tracking-widest font-semibold mt-0.5">
                  <span className="text-white/30">Security Level</span>
                  <span className={`${strength.textClass} transition-colors duration-300`}>{strength.label}</span>
                </div>
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="group w-full relative overflow-hidden bg-white text-black font-semibold rounded-2xl py-3.5 mt-2 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-[0_0_0_1px_rgba(255,255,255,0.15),_0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-70 disabled:hover:scale-100"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
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
              className="text-white font-medium hover:text-pink-500 transition-colors"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
