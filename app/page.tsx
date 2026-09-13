"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AuthModal from "@/components/ui/AuthModal";
import "./landing-style.css";

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    // Counting Animation (Stats)
    const counters = document.querySelectorAll('.stat-val');
    
    const animateValue = (element: Element, start: number, end: number, duration: number, decimals: number) => {
        let startTimestamp: number | null = null;
        
        // easeOutCubic
        const easeOutCubic = (t: number) => {
            return 1 - Math.pow(1 - t, 3);
        };

        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            const currentVal = start + (end - start) * easeOutCubic(progress);
            
            element.innerHTML = currentVal.toFixed(decimals);
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                element.innerHTML = end.toFixed(decimals);
            }
        };
        
        window.requestAnimationFrame(step);
    };

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const targetVal = parseFloat(element.getAttribute('data-target') || '0');
                    const decimals = parseInt(element.getAttribute('data-decimals') || '0', 10);
                    
                    const domIndex = Array.from(counters).indexOf(element);
                    
                    const duration = 1500 + domIndex * 80;
                    const delay = 480 + domIndex * 90;

                    setTimeout(() => {
                        animateValue(element, 0, targetVal, duration, decimals);
                    }, delay);
                    
                    observer.unobserve(element);
                }
            });
        }, { threshold: 0.25 });

        counters.forEach(counter => {
            observer.observe(counter);
        });
    } else {
        counters.forEach((element, domIndex) => {
            const targetVal = parseFloat(element.getAttribute('data-target') || '0');
            const decimals = parseInt(element.getAttribute('data-decimals') || '0', 10);
            
            const duration = 1500 + domIndex * 80;
            const delay = 480 + domIndex * 90;

            setTimeout(() => {
                animateValue(element, 0, targetVal, duration, decimals);
            }, delay);
        });
    }

    // Handle escape key
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsMenuOpen(false);
    };
    
    // Handle resize
    const handleResize = () => {
        if (window.innerWidth > 720) setIsMenuOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);

    return () => {
        document.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  }, [isMenuOpen]);

  return (
    <div className="min-h-screen bg-[#000000] text-white selection:bg-[#3b82f6]/30 overflow-x-hidden">
      {/* Background Video/Glows */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <video className="absolute inset-0 w-full h-full object-cover opacity-60" autoPlay muted loop playsInline>
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260809_012548_ef22562c-c0ae-4816-ad9d-f8922af4e6a7.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#000000]/40 via-[#000000]/80 to-[#000000]"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation */}
        <header className="w-full flex justify-center pt-6 px-4 md:px-8 animate-slide-down">
          <div className="w-full max-w-5xl flex items-center justify-between">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.15)] cursor-pointer hover:scale-105 transition-transform">
              <Image src="/assets/logo.webp" width={32} height={32} alt="Logo" priority className="object-contain" />
            </div>
            
            <nav className="hidden md:flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-2 py-1.5 shadow-2xl">
              <Link href="/" className="px-6 py-2 rounded-full bg-white text-black font-semibold text-sm">Home</Link>
              <Link href="#" className="px-6 py-2 rounded-full text-white/60 hover:text-white font-medium text-sm transition-colors">Product</Link>
              <Link href="#" className="px-6 py-2 rounded-full text-white/60 hover:text-white font-medium text-sm transition-colors">Features</Link>
              <Link href="#" className="px-6 py-2 rounded-full text-white/60 hover:text-white font-medium text-sm transition-colors">Pricing</Link>
            </nav>

            <button 
              onClick={() => setIsAuthOpen(true)}
              className="hidden md:block px-7 py-2.5 bg-[#18181b] hover:bg-[#27272a] text-white border border-white/10 rounded-full font-semibold text-sm transition-all hover:scale-105 active:scale-95 shadow-xl"
            >
              Sign In
            </button>

            <button 
              className="md:hidden w-12 h-12 bg-white/10 backdrop-blur-md border border-white/10 rounded-full flex flex-col items-center justify-center gap-1.5"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <span className={`w-5 h-[2px] bg-white transition-transform ${isMenuOpen ? 'rotate-45 translate-y-[8px]' : ''}`}></span>
              <span className={`w-5 h-[2px] bg-white transition-opacity ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-5 h-[2px] bg-white transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-[8px]' : ''}`}></span>
            </button>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl md:hidden flex flex-col items-center justify-center gap-8 animate-fade-in">
            <button className="absolute top-8 right-8 text-white/50" onClick={() => setIsMenuOpen(false)}>
              <i className="fa-solid fa-xmark text-2xl"></i>
            </button>
            <Link href="/" className="text-2xl font-bold text-white" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link href="#" className="text-2xl font-bold text-white/50" onClick={() => setIsMenuOpen(false)}>Product</Link>
            <Link href="#" className="text-2xl font-bold text-white/50" onClick={() => setIsMenuOpen(false)}>Features</Link>
            <button onClick={() => { setIsMenuOpen(false); setIsAuthOpen(true); }} className="px-8 py-3 bg-white text-black rounded-full font-bold text-xl mt-4">Sign In</button>
          </div>
        )}

        {/* Hero Section */}
        <main id="main-content" className="flex-1 flex flex-col items-center justify-center w-full px-4 pt-20 pb-16 md:pt-32 md:pb-24 text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-3 bg-[#18181b]/80 backdrop-blur-md border border-white/10 p-1.5 pr-5 rounded-full mb-10 animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg border-2 border-[#18181b] z-30"><i className="fa-brands fa-microsoft text-[#111] text-xs"></i></div>
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg border-2 border-[#18181b] z-20"><i className="fa-brands fa-amazon text-[#111] text-xs"></i></div>
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg border-2 border-[#18181b] z-10"><i className="fa-brands fa-google text-[#111] text-xs"></i></div>
            </div>
            <span className="text-sm font-semibold text-white/80">Trusted by 2000+ Enterprises</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-[84px] font-bold text-white tracking-tighter leading-[1.1] mb-8 font-display animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70">Transform Lectures</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">Into Active Recall</span>
          </h1>

          <p className="text-lg md:text-xl text-white/50 max-w-2xl leading-relaxed mb-12 animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
            Instantly convert your PDF study materials into interactive 3D flashcards and dynamic multiple-choice quizzes powered by Gemini 2.5 AI.
          </p>

          <button 
            onClick={() => setIsAuthOpen(true)}
            className="group relative px-10 py-4 bg-white text-black text-[15px] font-bold rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] animate-fade-in overflow-hidden"
            style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
            <span className="flex items-center gap-2">
              Get Started Free <i className="fa-solid fa-arrow-right text-xs transition-transform group-hover:translate-x-1"></i>
            </span>
          </button>
        </main>

        {/* Stats Strip */}
        <div className="w-full border-y border-white/10 bg-[#09090b]/80 backdrop-blur-xl animate-fade-in" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
          <div className="max-w-6xl mx-auto px-6 py-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center">
              <div className="flex flex-col items-center">
                <div className="flex items-baseline gap-1 text-3xl md:text-4xl font-bold text-white mb-2"><span className="text-[#3b82f6] text-xl">&lt;</span><span className="stat-val" data-target="15" data-decimals="0">0</span><span className="text-white/50 text-2xl">s</span></div>
                <span className="text-xs uppercase tracking-widest text-white/40 font-semibold">Generation Time</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-baseline gap-1 text-3xl md:text-4xl font-bold text-white mb-2"><span className="text-[#8b5cf6] text-xl">%</span><span className="stat-val" data-target="99.9" data-decimals="1">0.0</span><span className="text-white/50 text-2xl">%</span></div>
                <span className="text-xs uppercase tracking-widest text-white/40 font-semibold">Concept Extraction</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-baseline gap-1 text-3xl md:text-4xl font-bold text-white mb-2"><span className="text-[#10b981] text-xl">*</span><span className="stat-val" data-target="1000" data-decimals="0">0</span><span className="text-white/50 text-2xl">+</span></div>
                <span className="text-xs uppercase tracking-widest text-white/40 font-semibold">PDFs Processed</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-baseline gap-1 text-3xl md:text-4xl font-bold text-white mb-2"><span className="text-[#f59e0b] text-xl">#</span><span className="stat-val" data-target="2.5" data-decimals="1">0.0</span><span className="text-white/50 text-2xl">M</span></div>
                <span className="text-xs uppercase tracking-widest text-white/40 font-semibold">Tokens Analyzed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section className="w-full bg-[#000000] py-32 px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-white">Supercharge Your Study Flow</h2>
              <p className="text-white/50 max-w-2xl mx-auto text-lg leading-relaxed">Luminate uses advanced AI to break down complex materials into digestible, interactive formats instantly.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="group relative bg-[#09090b] border border-white/10 rounded-[32px] p-8 overflow-hidden hover:border-white/20 transition-all duration-500">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#3b82f6]/10 blur-[80px] rounded-full group-hover:bg-[#3b82f6]/20 transition-colors pointer-events-none"></div>
                <div className="w-14 h-14 bg-[#18181b] border border-white/10 rounded-2xl flex items-center justify-center mb-8 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                  <i className="fa-solid fa-bolt text-2xl text-[#3b82f6]"></i>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">Lightning Fast</h3>
                <p className="text-white/50 leading-relaxed text-[15px]">Powered by Gemini 2.5 Flash, Luminate parses entire PDF textbooks and generates study materials in milliseconds.</p>
              </div>
              
              {/* Card 2 */}
              <div className="group relative bg-[#09090b] border border-white/10 rounded-[32px] p-8 overflow-hidden hover:border-white/20 transition-all duration-500">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#8b5cf6]/10 blur-[80px] rounded-full group-hover:bg-[#8b5cf6]/20 transition-colors pointer-events-none"></div>
                <div className="w-14 h-14 bg-[#18181b] border border-white/10 rounded-2xl flex items-center justify-center mb-8 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                  <i className="fa-solid fa-layer-group text-2xl text-[#8b5cf6]"></i>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">3D Flashcards</h3>
                <p className="text-white/50 leading-relaxed text-[15px]">Engage active recall with physics-based, interactive 3D flashcards that make studying feel like magic.</p>
              </div>
              
              {/* Card 3 */}
              <div className="group relative bg-[#09090b] border border-white/10 rounded-[32px] p-8 overflow-hidden hover:border-white/20 transition-all duration-500">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#10b981]/10 blur-[80px] rounded-full group-hover:bg-[#10b981]/20 transition-colors pointer-events-none"></div>
                <div className="w-14 h-14 bg-[#18181b] border border-white/10 rounded-2xl flex items-center justify-center mb-8 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                  <i className="fa-solid fa-clipboard-question text-2xl text-[#10b981]"></i>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">Dynamic Quizzes</h3>
                <p className="text-white/50 leading-relaxed text-[15px]">Test your knowledge with adaptive multiple-choice quizzes featuring instant color-coded feedback and explanations.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="w-full bg-[#000000] pb-32 px-6 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="relative overflow-hidden bg-gradient-to-br from-[#18181b] to-[#09090b] border border-white/10 rounded-[48px] p-12 md:p-20 text-center shadow-2xl">
              <div className="absolute top-[-50%] left-[-10%] w-[60%] h-[150%] bg-[#3b82f6]/10 blur-[120px] rounded-full pointer-events-none"></div>
              <div className="absolute bottom-[-50%] right-[-10%] w-[60%] h-[150%] bg-[#8b5cf6]/10 blur-[120px] rounded-full pointer-events-none"></div>
              
              <div className="relative z-10">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                  <Image src="/assets/logo.webp" alt="Logo" width={48} height={48} className="object-contain" />
                </div>
                <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-white font-display leading-[1.1]">
                  Ready to Evolve<br/>Your Learning?
                </h2>
                <p className="text-white/50 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
                  Join thousands of students and professionals learning 10x faster with AI-generated study materials.
                </p>
                <button 
                  onClick={() => setIsAuthOpen(true)}
                  className="px-12 py-5 bg-white text-black text-[16px] font-bold rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                >
                  Start For Free
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
