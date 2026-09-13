"use client";

import { useEffect, useState, useRef, MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import AuthModal from "@/components/ui/AuthModal";

// --- Advanced Hooks & Components ---

function useScrambleText(originalText: string, scrambleSpeed: number = 50, duration: number = 800) {
  const [text, setText] = useState(originalText);
  const [isHovering, setIsHovering] = useState(false);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  
  const triggerScramble = () => {
    let iteration = 0;
    const maxIterations = duration / scrambleSpeed;
    
    const interval = setInterval(() => {
      setText(originalText
        .split("")
        .map((letter, index) => {
          if (index < (iteration / maxIterations) * originalText.length) {
            return originalText[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("")
      );
      
      iteration++;
      if (iteration >= maxIterations) {
        clearInterval(interval);
        setText(originalText);
      }
    }, scrambleSpeed);
  };

  useEffect(() => {
    // Initial scramble on mount
    const timeout = setTimeout(() => {
      triggerScramble();
    }, 500);
    return () => clearTimeout(timeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { text, triggerScramble };
}

function ScrambleHeader({ text, className, delay = 0 }: { text: string, className?: string, delay?: number }) {
  const { text: scrambledText, triggerScramble } = useScrambleText(text, 30, 800);
  const ref = useRef<HTMLHeadingElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setTimeout(() => triggerScramble(), delay);
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <span ref={ref} className={className} onMouseEnter={triggerScramble}>{scrambledText}</span>;
}

function MagneticButton({ children, onClick, className = "" }: { children: React.ReactNode, onClick: () => void, className?: string }) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    buttonRef.current.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px) scale(1.05)`;
  };
  
  const handleMouseLeave = () => {
    if (!buttonRef.current) return;
    buttonRef.current.style.transform = "translate(0px, 0px) scale(1)";
  };

  return (
    <button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`transition-transform duration-300 ease-out ${className}`}
    >
      {children}
    </button>
  );
}

function TiltCard({ children, className = "", withBorderTrace = false }: { children: React.ReactNode, className?: string, withBorderTrace?: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !glowRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    glowRef.current.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.08) 0%, transparent 40%)`;
  };
  
  const handleMouseLeave = () => {
    if (!cardRef.current || !glowRef.current) return;
    cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    glowRef.current.style.background = "transparent";
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative transition-all duration-500 ease-out group ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {withBorderTrace && (
        <div className="absolute inset-[-1px] rounded-[3rem] overflow-hidden z-0">
          <div className="absolute top-1/2 left-1/2 w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(255,255,255,0.6)_360deg)] animate-spin-slow opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      )}
      <div className="absolute inset-0 bg-[#09090b]/90 rounded-[3rem] z-[1]"></div>
      <div ref={glowRef} className="absolute inset-0 z-[2] pointer-events-none transition-colors duration-300 rounded-[3rem]"></div>
      
      <div className="relative z-[3] w-full h-full">
        {children}
      </div>
    </div>
  );
}

// --- Main Page Component ---

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const scrollObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    revealElements.forEach(el => scrollObserver.observe(el));

    const counters = document.querySelectorAll('.stat-val');
    const animateValue = (element: Element, start: number, end: number, duration: number, decimals: number) => {
        let startTimestamp: number | null = null;
        const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentVal = start + (end - start) * easeOutCubic(progress);
            element.innerHTML = currentVal.toFixed(decimals);
            if (progress < 1) window.requestAnimationFrame(step);
            else element.innerHTML = end.toFixed(decimals);
        };
        window.requestAnimationFrame(step);
    };

    const statObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const targetVal = parseFloat(element.getAttribute('data-target') || '0');
                const decimals = parseInt(element.getAttribute('data-decimals') || '0', 10);
                const domIndex = Array.from(counters).indexOf(element);
                const duration = 1500 + domIndex * 80;
                const delay = 480 + domIndex * 90;
                setTimeout(() => animateValue(element, 0, targetVal, duration, decimals), delay);
                observer.unobserve(element);
            }
        });
    }, { threshold: 0.25 });
    counters.forEach(counter => statObserver.observe(counter));

    return () => {
      scrollObserver.disconnect();
      statObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY || currentScrollY < 50) {
        setIsHeaderVisible(true);
      } else if (currentScrollY > 50 && currentScrollY > lastScrollY) {
        setIsHeaderVisible(false);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div className="w-full bg-black text-white font-sans overflow-x-hidden selection:bg-white/20 selection:text-white relative">
      
      <style dangerouslySetInnerHTML={{__html: `
        .scroll-reveal { opacity: 0; transform: translateY(40px) scale(0.97); filter: blur(12px); transition: opacity 1s cubic-bezier(0.22, 1, 0.36, 1), transform 1s cubic-bezier(0.22, 1, 0.36, 1), filter 1s cubic-bezier(0.22, 1, 0.36, 1); }
        .scroll-reveal.is-revealed { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
      `}} />

      {/* ========================================================= */}
      {/* 1) HERO VIEWPORT (100dvh)                                  */}
      {/* ========================================================= */}
      <div className="relative w-full h-[100dvh] flex flex-col items-center justify-between overflow-hidden px-[clamp(16px,2.4vh,28px)] pb-[clamp(14px,3vw,32px)] pt-[120px]">
        
        <div className="absolute inset-0 z-0 pointer-events-none bg-[#000]">
          <video className="absolute inset-0 w-full h-full object-cover" autoPlay muted loop playsInline>
            <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260809_012548_ef22562c-c0ae-4816-ad9d-f8922af4e6a7.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Original V1 Top Bar */}
        <header className={`fixed top-0 left-0 right-0 z-50 w-full flex justify-center pt-6 px-4 md:px-8 transition-transform duration-500 ease-in-out animate-slide-down ${isHeaderVisible ? 'translate-y-0' : '-translate-y-[150%]'}`}>
          <div className="w-full max-w-5xl flex items-center justify-between">
            <div className="flex items-center gap-3 bg-black/20 backdrop-blur-xl border border-white/10 rounded-full p-1.5 pr-5 cursor-pointer group shadow-2xl shrink-0 transition-colors hover:bg-black/40" aria-label="Home logo">
              <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.15)] group-hover:scale-105 transition-transform">
                <div className="w-[60%] h-[60%] relative flex items-center justify-center">
                  <Image src="/assets/logo.svg" fill alt="Luminate Logo" className="object-contain" />
                </div>
              </div>
              <span className="font-sans font-bold text-lg tracking-tight text-white hidden sm:block drop-shadow-md">Luminate</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-2 bg-black/20 backdrop-blur-xl border border-white/10 rounded-full px-2 py-1.5 shadow-2xl" aria-label="Main Navigation">
              <Link href="#how-it-works" className="px-6 py-2 rounded-full bg-white text-black font-semibold text-sm shadow-md transition-transform hover:scale-105 active:scale-95">How it works</Link>
              <Link href="#features" className="px-6 py-2 rounded-full text-white/90 hover:text-white hover:bg-white/10 font-semibold text-sm transition-all drop-shadow-md">Features</Link>
              <Link href="#compare" className="px-6 py-2 rounded-full text-white/90 hover:text-white hover:bg-white/10 font-semibold text-sm transition-all drop-shadow-md">Compare</Link>
            </nav>
            
            <div className="hidden md:block shrink-0">
              <button 
                onClick={() => setIsAuthOpen(true)}
                className="px-7 py-2.5 bg-[#18181b] hover:bg-[#27272a] text-white border border-white/10 rounded-full font-semibold text-sm transition-all hover:scale-105 active:scale-95 shadow-xl"
              >
                Sign In
              </button>
            </div>
            
            <button 
              className="md:hidden w-12 h-12 bg-black/20 backdrop-blur-md border border-white/10 rounded-full flex flex-col items-center justify-center gap-1.5 shrink-0 hover:bg-black/40 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className={`w-5 h-[2px] bg-white transition-transform ${isMenuOpen ? 'rotate-45 translate-y-[8px]' : ''}`}></span>
              <span className={`w-5 h-[2px] bg-white transition-opacity ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-5 h-[2px] bg-white transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-[8px]' : ''}`}></span>
            </button>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-40 bg-[rgba(0,0,0,0.62)] backdrop-blur-[6px] animate-overlay-in flex flex-col items-center pt-24 px-4" onClick={() => setIsMenuOpen(false)}>
            <div className="w-full max-w-[400px] bg-[#fff] rounded-[28px] p-[22px_18px_20px] shadow-[0_20px_60px_rgba(0,0,0,0.45)] animate-menu-in flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
              <Link href="#how-it-works" onClick={() => setIsMenuOpen(false)} className="text-black font-sans font-medium text-lg px-4 py-2 hover:bg-gray-100 rounded-xl transition-colors">How it works</Link>
              <Link href="#features" onClick={() => setIsMenuOpen(false)} className="text-black font-sans font-medium text-lg px-4 py-2 hover:bg-gray-100 rounded-xl transition-colors">Features</Link>
              <Link href="#compare" onClick={() => setIsMenuOpen(false)} className="text-black font-sans font-medium text-lg px-4 py-2 hover:bg-gray-100 rounded-xl transition-colors">Compare</Link>
              <button onClick={() => { setIsMenuOpen(false); setIsAuthOpen(true); }} className="mt-2 w-full text-white bg-black px-8 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors">Sign In</button>
            </div>
          </div>
        )}

        {/* Hero Content */}
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center max-w-[900px] w-full">
          
          {/* Trust Row */}
          <div className="inline-flex items-center mb-[clamp(16px,2.5vh,26px)] opacity-0 animate-reveal" style={{ animationDelay: '0.05s' }}>
             <div className="flex items-center">
                <div className="relative z-[4] w-[clamp(36px,4.5vw,42px)] h-[clamp(36px,4.5vw,42px)] bg-[#28282a] border border-white/40 rounded-full p-[5px] hover:-translate-y-[2px] transition-transform duration-350">
                   <div className="w-full h-full bg-[#fff] rounded-full flex items-center justify-center">
                     <i className="fa-brands fa-microsoft text-[#111]" style={{ fontSize: 'calc(clamp(36px,4.5vw,42px) * 0.34)' }}></i>
                   </div>
                </div>
                <div className="relative z-[2] w-[clamp(36px,4.5vw,42px)] h-[clamp(36px,4.5vw,42px)] bg-[#28282a] border border-white/40 rounded-full p-[5px] hover:-translate-y-[4px] transition-transform duration-350" style={{ marginLeft: 'calc(clamp(36px,4.5vw,42px) * -0.42)' }}>
                   <div className="w-full h-full bg-[#fff] rounded-full flex items-center justify-center">
                     <i className="fa-brands fa-amazon text-[#111]" style={{ fontSize: 'calc(clamp(36px,4.5vw,42px) * 0.34)' }}></i>
                   </div>
                </div>
                <div className="relative z-[1] w-[clamp(36px,4.5vw,42px)] h-[clamp(36px,4.5vw,42px)] bg-[#28282a] border border-white/40 rounded-full p-[5px] hover:-translate-y-[2px] transition-transform duration-350" style={{ marginLeft: 'calc(clamp(36px,4.5vw,42px) * -0.42)' }}>
                   <div className="w-full h-full bg-[#fff] rounded-full flex items-center justify-center">
                     <i className="fa-brands fa-google text-[#111]" style={{ fontSize: 'calc(clamp(36px,4.5vw,42px) * 0.34)' }}></i>
                   </div>
                </div>
                <div className="relative z-0 h-[clamp(36px,4.5vw,42px)] bg-[#28282a] border border-white/40 rounded-full flex items-center" style={{ marginLeft: 'calc(clamp(36px,4.5vw,42px) * -0.42)', paddingLeft: 'calc(clamp(36px,4.5vw,42px) * 0.58)', paddingRight: '16px' }}>
                   <span className="font-sans font-medium text-[#c4c2c3] text-[clamp(12px,1.4vw,13.5px)] whitespace-nowrap ml-1">Trusted by 10,000+ Top Students</span>
                </div>
             </div>
          </div>

          <h1 className="font-display text-[#fff] text-[clamp(28px,6.2vw,80px)] leading-[1.05] tracking-[-0.04em] flex flex-col whitespace-nowrap overflow-hidden">
            <span className="block opacity-0 translate-y-[14px] animate-headline-fade" style={{ animationDelay: '0.12s' }}>Intelligence</span>
            <span className="block opacity-0 translate-y-[14px] animate-headline-fade" style={{ animationDelay: '0.3s' }}>Designed To Evolve</span>
          </h1>

          <p className="font-sans font-normal text-[#d0d0d0] opacity-80 text-[clamp(calc(13.5px+2pt),calc(1.55vw+2pt),calc(16.5px+2pt))] leading-[1.55] max-w-[min(500px,92%)] mt-6 mb-10 opacity-0 animate-reveal" style={{ animationDelay: '0.28s' }}>
            Synthesize dense lectures into dynamic knowledge graphs using an advanced AI engine designed for ultimate retention.
          </p>

          <div className="opacity-0 animate-reveal-pulse" style={{ animationDelay: '0.4s' }}>
            <button onClick={() => setIsAuthOpen(true)} className="bg-[#fff] text-[#111] font-sans font-semibold text-[clamp(13.5px,1.5vw,14.5px)] px-[clamp(22px,3vw,28px)] py-[clamp(11px,1.6vh,13px)] rounded-full shadow-[0_0_0_1px_rgba(255,255,255,0.15),_0_0_22px_rgba(255,255,255,0.32),_0_0_44px_rgba(255,255,255,0.12)] hover:-translate-y-[2px] hover:scale-[1.02] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.25),_0_0_30px_rgba(255,255,255,0.45),_0_0_60px_rgba(255,255,255,0.2)] transition-all">
              Get Started
            </button>
          </div>
        </main>

        {/* Stats Footer */}
        <div className="relative z-10 w-full max-w-[920px] shrink-0 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex flex-col items-center opacity-0 animate-reveal" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="font-display text-[#fff] text-[clamp(22px,3vw,33px)]">&lt;</span>
              <span className="stat-val font-sans text-[#fff] text-[clamp(18px,2.2vw,26px)] tracking-[-0.025em]" data-target="120" data-decimals="0">0</span>
              <span className="font-sans text-[#fff] text-[clamp(18px,2.2vw,26px)]">ms</span>
            </div>
            <span className="font-sans text-[#8e8e8e] text-[clamp(11px,1.2vw,12.5px)]">Inference Time</span>
          </div>
          
          <div className="flex flex-col items-center opacity-0 animate-reveal" style={{ animationDelay: '0.58s' }}>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="font-display text-[#fff] text-[clamp(22px,3vw,33px)]">%</span>
              <span className="stat-val font-sans text-[#fff] text-[clamp(18px,2.2vw,26px)] tracking-[-0.025em]" data-target="99.99" data-decimals="2">0.00</span>
              <span className="font-sans text-[#fff] text-[clamp(18px,2.2vw,26px)]">%</span>
            </div>
            <span className="font-sans text-[#8e8e8e] text-[clamp(11px,1.2vw,12.5px)]">Platform Uptime</span>
          </div>
          
          <div className="flex flex-col items-center opacity-0 animate-reveal" style={{ animationDelay: '0.66s' }}>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="font-display text-[#fff] text-[clamp(22px,3vw,33px)]">*</span>
              <span className="stat-val font-sans text-[#fff] text-[clamp(18px,2.2vw,26px)] tracking-[-0.025em]" data-target="24" data-decimals="0">0</span>
              <span className="font-sans text-[#fff] text-[clamp(18px,2.2vw,26px)]">/7</span>
            </div>
            <span className="font-sans text-[#8e8e8e] text-[clamp(11px,1.2vw,12.5px)]">Autonomous Runtime</span>
          </div>

          <div className="flex flex-col items-center opacity-0 animate-reveal" style={{ animationDelay: '0.74s' }}>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="font-display text-[#fff] text-[clamp(22px,3vw,33px)]">#</span>
              <span className="stat-val font-sans text-[#fff] text-[clamp(18px,2.2vw,26px)] tracking-[-0.025em]" data-target="2.4" data-decimals="1">0.0</span>
              <span className="font-sans text-[#fff] text-[clamp(18px,2.2vw,26px)]">M</span>
            </div>
            <span className="font-sans text-[#8e8e8e] text-[clamp(11px,1.2vw,12.5px)]">Context Windows</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* Infinite Scrolling Marquee                                 */}
      {/* ========================================================= */}
      <div className="w-full bg-[#050505] border-y border-white/5 py-5 overflow-hidden relative z-20 flex shadow-[0_0_30px_rgba(244,63,94,0.03)]">
        {/* Subtle glow overlays on edges */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#050505] to-transparent z-10"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#050505] to-transparent z-10"></div>
        
        <div className="whitespace-nowrap animate-marquee flex items-center min-w-max">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-12 px-6">
              <span className="font-display bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-rose-400 text-2xl tracking-widest uppercase opacity-90">Gemini 2.5 Pro</span>
              <span className="w-2 h-2 rounded-full bg-white/10"></span>
              <span className="font-display bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-red-400 text-2xl tracking-widest uppercase opacity-90">Vector Embeddings</span>
              <span className="w-2 h-2 rounded-full bg-white/10"></span>
              <span className="font-display bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-pink-300 text-2xl tracking-widest uppercase opacity-90">Spatial Reasoning</span>
              <span className="w-2 h-2 rounded-full bg-white/10"></span>
              <span className="font-display bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-rose-400 text-2xl tracking-widest uppercase opacity-90">Active Recall</span>
              <span className="w-2 h-2 rounded-full bg-white/10"></span>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2) BELOW THE FOLD (PREMIUM BENTO AESTHETIC)                */}
      {/* ========================================================= */}
      <div className="relative z-20 bg-black w-full overflow-hidden">
        
        {/* Subtle Ambient Background Mesh (Strictly Constrained) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(244,63,94,0.04),transparent_50%)] pointer-events-none"></div>

        {/* --- How It Works Section --- */}
        <section id="how-it-works" className="py-32 px-6 max-w-[1200px] mx-auto w-full relative z-10">
          <div className="text-center mb-20 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-display text-white mb-6 font-bold tracking-tight">
              <ScrambleHeader text="The Synthesis Pipeline" delay={200} />
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto text-lg md:text-xl font-light">From raw lectures to pure mastery in seconds.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 scroll-reveal">
            {/* Card 1 */}
            <div className="bg-[#09090b] border border-white/5 rounded-[2rem] p-8 md:p-10 hover:bg-[#0c0c0e] hover:border-white/10 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 md:p-8 text-5xl md:text-6xl font-display font-bold text-white/[0.02] group-hover:text-white/[0.04] transition-colors">01</div>
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-[#1a1a1c] to-[#0d0d0f] border border-white/5 flex items-center justify-center mb-6 md:mb-8 shadow-inner">
                <i className="fa-solid fa-file-video text-lg md:text-xl text-pink-400"></i>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-3">Ingest</h3>
              <p className="text-white/50 text-[14px] md:text-[15px] leading-relaxed">Upload hour-long MP4 lectures, YouTube links, or massive PDF textbooks directly into the engine.</p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#09090b] border border-white/5 rounded-[2rem] p-8 md:p-10 hover:bg-[#0c0c0e] hover:border-white/10 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 md:p-8 text-5xl md:text-6xl font-display font-bold text-white/[0.02] group-hover:text-white/[0.04] transition-colors">02</div>
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-[#1a1a1c] to-[#0d0d0f] border border-white/5 flex items-center justify-center mb-6 md:mb-8 shadow-inner">
                <i className="fa-solid fa-microchip text-lg md:text-xl text-rose-400"></i>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-3">Synthesize</h3>
              <p className="text-white/50 text-[14px] md:text-[15px] leading-relaxed">Gemini 2.5 extracts the core curriculum, filters the noise, and maps conceptual relationships flawlessly.</p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#09090b] border border-white/5 rounded-[2rem] p-8 md:p-10 hover:bg-[#0c0c0e] hover:border-white/10 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 md:p-8 text-5xl md:text-6xl font-display font-bold text-white/[0.02] group-hover:text-white/[0.04] transition-colors">03</div>
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-[#1a1a1c] to-[#0d0d0f] border border-white/5 flex items-center justify-center mb-6 md:mb-8 shadow-inner">
                <i className="fa-solid fa-layer-group text-lg md:text-xl text-red-400"></i>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-3">Master</h3>
              <p className="text-white/50 text-[14px] md:text-[15px] leading-relaxed">Review auto-generated interactive flashcards spaced perfectly by our proprietary AI retention model.</p>
            </div>
          </div>
        </section>

        {/* --- Compare Section (The New Standard) --- */}
        <section id="compare" className="py-24 px-6 max-w-[1200px] mx-auto w-full relative z-10">
          <div className="w-full bg-[#09090b] border border-white/5 rounded-[3rem] p-2 md:p-4 overflow-hidden scroll-reveal">
            
            <div className="text-center mt-12 mb-16">
              <h2 className="text-3xl md:text-4xl font-display text-white font-bold tracking-tight">The New Standard</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Traditional (Grayscale) */}
              <div className="p-8 md:p-14 bg-black rounded-[2.5rem] border border-white/[0.02] flex flex-col justify-center">
                <h3 className="text-lg md:text-xl font-bold text-white/30 mb-6 md:mb-8 flex items-center gap-3 font-display">
                  <span className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center"><i className="fa-solid fa-xmark text-xs text-white/30"></i></span>
                  Traditional Study
                </h3>
                <ul className="flex flex-col gap-6 md:gap-8">
                  <li className="flex items-start gap-4">
                    <div className="w-1.5 h-1.5 mt-2 rounded-full bg-white/10 shrink-0"></div>
                    <p className="text-white/40 text-[14px] md:text-[15px] leading-relaxed">Hours wasted manually taking and organizing notes.</p>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-1.5 h-1.5 mt-2 rounded-full bg-white/10 shrink-0"></div>
                    <p className="text-white/40 text-[14px] md:text-[15px] leading-relaxed">Linear reading that fails to connect complex concepts.</p>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-1.5 h-1.5 mt-2 rounded-full bg-white/10 shrink-0"></div>
                    <p className="text-white/40 text-[14px] md:text-[15px] leading-relaxed">Sub-optimal review timing leading to rapid memory decay.</p>
                  </li>
                </ul>
              </div>

              {/* Luminate (Glossy Glass) */}
              <div className="p-8 md:p-14 bg-gradient-to-br from-[#121214] to-[#0a0a0c] rounded-[2.5rem] border border-white/10 shadow-[inset_0_0_80px_rgba(244,63,94,0.03)] relative overflow-hidden group flex flex-col justify-center">
                {/* Very subtle constrained gradient sweep */}
                <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/10 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                
                <h3 className="text-lg md:text-xl font-bold text-white mb-6 md:mb-8 flex items-center gap-3 relative z-10 font-display">
                  <span className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-[0_0_15px_rgba(244,63,94,0.4)]">
                    <i className="fa-solid fa-check text-xs text-white"></i>
                  </span>
                  Luminate AI
                </h3>
                <ul className="flex flex-col gap-6 md:gap-8 relative z-10">
                  <li className="flex items-start gap-4">
                    <div className="w-1.5 h-1.5 mt-2 rounded-full bg-pink-400 shrink-0 shadow-[0_0_8px_rgba(244,114,182,0.6)]"></div>
                    <p className="text-white/90 text-[14px] md:text-[15px] leading-relaxed font-medium">Instant synthesis of entire curriculums into active flashcards.</p>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-1.5 h-1.5 mt-2 rounded-full bg-rose-400 shrink-0 shadow-[0_0_8px_rgba(244,63,94,0.6)]"></div>
                    <p className="text-white/90 text-[14px] md:text-[15px] leading-relaxed font-medium">Multi-dimensional Knowledge Graphs that map relationships.</p>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-1.5 h-1.5 mt-2 rounded-full bg-red-400 shrink-0 shadow-[0_0_8px_rgba(248,113,113,0.6)]"></div>
                    <p className="text-white/90 text-[14px] md:text-[15px] leading-relaxed font-medium">Precision spaced repetition driven by adaptive machine learning.</p>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </section>

        {/* --- Features (Bento Grid) --- */}
        <section id="features" className="py-24 px-6 max-w-[1200px] mx-auto w-full relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Top Massive Card */}
            <div className="md:col-span-2 scroll-reveal group">
              <div className="w-full h-full bg-[#09090b] border border-white/5 rounded-[3rem] p-8 md:p-20 relative overflow-hidden transition-all duration-500 hover:border-white/10">
                {/* Soft gradient interior light */}
                <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.06),transparent_60%)] pointer-events-none"></div>
                
                <div className="relative z-10 max-w-3xl">
                  <div className="flex items-center gap-4 mb-6 md:mb-8">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                      <i className="fa-solid fa-diagram-project text-base md:text-lg text-rose-400"></i>
                    </div>
                    <span className="font-sans font-medium tracking-widest text-[10px] md:text-[11px] uppercase text-white/40">Core Feature</span>
                  </div>
                  
                  <h3 className="text-3xl md:text-6xl font-display font-bold text-white mb-4 md:mb-6 tracking-tight leading-[1.05]">
                    Dynamic <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-rose-400">Knowledge Graphs.</span>
                  </h3>
                  <p className="text-white/50 text-lg md:text-2xl leading-relaxed font-light max-w-2xl">
                    Luminate doesn't just extract text; it understands context. It builds a multi-dimensional map of your curriculum, showing you exactly how concepts interconnect before you even flip a card.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Left Card */}
            <div className="scroll-reveal group">
              <div className="h-full bg-[#09090b] border border-white/5 rounded-[3rem] p-8 md:p-12 relative overflow-hidden transition-all duration-500 hover:border-white/10">
                <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-[radial-gradient(circle_at_center,rgba(251,113,133,0.05),transparent_60%)] pointer-events-none"></div>
                
                <div className="relative z-10">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 md:mb-8">
                    <i className="fa-solid fa-brain text-base md:text-lg text-pink-400"></i>
                  </div>
                  <h3 className="text-xl md:text-3xl font-display font-bold text-white mb-3 md:mb-4 tracking-tight">AI Spaced Repetition</h3>
                  <p className="text-white/50 text-[15px] md:text-base leading-relaxed font-light">
                    The engine calculates your precise forgetting curve, scheduling review sessions at the exact moment necessary for permanent retention.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Right Card */}
            <div className="scroll-reveal group">
              <div className="h-full bg-[#09090b] border border-white/5 rounded-[3rem] p-8 md:p-12 relative overflow-hidden transition-all duration-500 hover:border-white/10">
                <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] bg-[radial-gradient(circle_at_center,rgba(248,113,113,0.05),transparent_60%)] pointer-events-none"></div>
                
                <div className="relative z-10">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 md:mb-8">
                    <i className="fa-solid fa-graduation-cap text-base md:text-lg text-red-400"></i>
                  </div>
                  <h3 className="text-xl md:text-3xl font-display font-bold text-white mb-3 md:mb-4 tracking-tight">Socratic Tutor</h3>
                  <p className="text-white/50 text-[15px] md:text-base leading-relaxed font-light">
                    Stuck on a complex flashcard? The integrated AI tutor engages in a Socratic dialogue, guiding you to the answer without giving it away.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* --- Final Magnetic CTA --- */}
        <section className="py-40 px-6 w-full relative flex flex-col items-center z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] to-black pointer-events-none z-0"></div>
          
          <div className="relative z-10 w-full max-w-5xl text-center scroll-reveal">
            <h2 className="text-5xl md:text-8xl font-display text-white mb-10 tracking-tight font-bold">
              <ScrambleHeader text="Ready to evolve?" delay={300} />
            </h2>
            
            <div className="flex justify-center">
              <div className="relative group inline-flex">
                {/* Very subtle glow around button */}
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 rounded-full blur-[8px] opacity-20 group-hover:opacity-40 transition duration-700"></div>
                <MagneticButton onClick={() => setIsAuthOpen(true)} className="relative px-12 py-5 bg-white text-black text-lg font-bold rounded-full shadow-xl overflow-hidden transition-all duration-300">
                  <span className="relative z-10 flex items-center gap-3">
                    Start Synthesizing <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform duration-300"></i>
                  </span>
                </MagneticButton>
              </div>
            </div>
          </div>
        </section>

        {/* --- Premium Footer --- */}
        <footer id="contact" className="relative w-full border-t border-white/10 pt-32 pb-16 px-6 overflow-hidden bg-black z-10 group">
          {/* Subtle colorful mesh at the bottom */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-gradient-to-t from-rose-900/20 via-pink-900/10 to-transparent blur-[100px] pointer-events-none"></div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 mb-20 md:mb-32">
              
              <div className="md:col-span-6">
                <div className="flex items-center gap-4 mb-6 md:mb-8 group/logo cursor-default">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-2xl flex items-center justify-center shadow-[0_0_24px_rgba(255,255,255,0.15)] group-hover/logo:scale-105 group-hover/logo:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-300">
                    <div className="w-[60%] h-[60%] relative flex items-center justify-center">
                      <Image src="/assets/logo.svg" fill alt="Luminate Logo" className="object-contain" />
                    </div>
                  </div>
                  <span className="text-xl md:text-2xl font-bold tracking-tight text-white drop-shadow-md">Luminate</span>
                </div>
                <p className="text-white/50 text-lg md:text-xl max-w-md leading-relaxed mb-8 md:mb-10">
                  The ultimate active recall engine. Synthesize lectures, build neural graphs, master your curriculum.
                </p>
                
                <form className="relative max-w-sm group/form" onSubmit={(e) => e.preventDefault()}>
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl blur opacity-0 group-hover/form:opacity-30 transition duration-500"></div>
                  <div className="relative flex items-center bg-[#121214] border border-white/10 rounded-2xl p-1.5 focus-within:border-pink-500/50 transition-colors">
                    <input 
                      type="email" 
                      placeholder="Subscribe for updates" 
                      className="w-full bg-transparent text-white text-[15px] pl-4 pr-2 focus:outline-none placeholder:text-white/30"
                    />
                    <button className="w-10 h-10 shrink-0 bg-white text-black rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all">
                      <i className="fa-solid fa-arrow-right text-sm"></i>
                    </button>
                  </div>
                </form>
              </div>

              <div className="md:col-span-3">
                <h4 className="text-white font-semibold text-base md:text-lg mb-6 md:mb-8">Product</h4>
                <ul className="flex flex-col gap-4 md:gap-5">
                  <li><a href="#" className="text-white/50 hover:text-pink-300 transition-colors group/link flex items-center gap-2"><span className="w-0 group-hover/link:w-2 h-[2px] bg-pink-400 transition-all duration-300 opacity-0 group-hover/link:opacity-100"></span>Flashcards</a></li>
                  <li><a href="#" className="text-white/50 hover:text-pink-300 transition-colors group/link flex items-center gap-2"><span className="w-0 group-hover/link:w-2 h-[2px] bg-pink-400 transition-all duration-300 opacity-0 group-hover/link:opacity-100"></span>Knowledge Graphs</a></li>
                  <li><a href="#" className="text-white/50 hover:text-pink-300 transition-colors group/link flex items-center gap-2"><span className="w-0 group-hover/link:w-2 h-[2px] bg-pink-400 transition-all duration-300 opacity-0 group-hover/link:opacity-100"></span>AI Tutor</a></li>
                  <li><a href="#" className="text-white/50 hover:text-pink-300 transition-colors group/link flex items-center gap-2"><span className="w-0 group-hover/link:w-2 h-[2px] bg-pink-400 transition-all duration-300 opacity-0 group-hover/link:opacity-100"></span>Pricing</a></li>
                </ul>
              </div>

              <div className="md:col-span-3">
                <h4 className="text-white font-semibold text-base md:text-lg mb-6 md:mb-8">Company</h4>
                <ul className="flex flex-col gap-4 md:gap-5">
                  <li><a href="#" className="text-white/50 hover:text-rose-300 transition-colors group/link flex items-center gap-2"><span className="w-0 group-hover/link:w-2 h-[2px] bg-rose-400 transition-all duration-300 opacity-0 group-hover/link:opacity-100"></span>About Us</a></li>
                  <li><a href="#" className="text-white/50 hover:text-rose-300 transition-colors group/link flex items-center gap-2"><span className="w-0 group-hover/link:w-2 h-[2px] bg-rose-400 transition-all duration-300 opacity-0 group-hover/link:opacity-100"></span>Careers</a></li>
                  <li><a href="#" className="text-white/50 hover:text-rose-300 transition-colors group/link flex items-center gap-2"><span className="w-0 group-hover/link:w-2 h-[2px] bg-rose-400 transition-all duration-300 opacity-0 group-hover/link:opacity-100"></span>Privacy Policy</a></li>
                  <li><a href="#" className="text-white/50 hover:text-rose-300 transition-colors group/link flex items-center gap-2"><span className="w-0 group-hover/link:w-2 h-[2px] bg-rose-400 transition-all duration-300 opacity-0 group-hover/link:opacity-100"></span>Terms of Service</a></li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between pt-8 md:pt-12 border-t border-white/10 gap-8">
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-white/40 text-sm md:text-base text-center md:text-left">
                  <p>&copy; {new Date().getFullYear()} Luminate. Designed to Evolve.</p>
                  <span className="hidden md:block w-1 h-1 rounded-full bg-white/20"></span>
                  <p>
                    Made with <span className="text-pink-500 inline-block mx-1 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)] text-lg animate-pulse hover:scale-125 transition-transform duration-300 cursor-default"><i className="fa-solid fa-heart"></i></span> by{" "}
                    <a 
                      href="https://www.linkedin.com/in/John--Varghese/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-white/60 hover:text-pink-400 font-medium transition-colors border-b border-transparent hover:border-pink-400/30"
                    >
                      John Varghese (J0X)
                    </a>
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 px-6 py-3 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md">
                <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all text-sm"><i className="fa-brands fa-twitter"></i></a>
                <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all text-sm"><i className="fa-brands fa-github"></i></a>
                <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all text-sm"><i className="fa-brands fa-discord"></i></a>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 text-[18vw] font-display whitespace-nowrap pointer-events-none select-none tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white/20 to-transparent transition-all duration-700 ease-out group-hover:scale-[1.02] group-hover:opacity-100 opacity-80">
            LUMINATE
          </div>
        </footer>

      </div>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
