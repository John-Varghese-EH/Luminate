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
    <div className="landing-wrapper">
      <div className="bg">
        <video className="bg-video" autoPlay muted loop playsInline>
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260809_012548_ef22562c-c0ae-4816-ad9d-f8922af4e6a7.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="page">
        <header className="header">
          <div className="logo">
            <Image src="/assets/logo.webp" width={52} height={52} alt="Logo" priority />
          </div>
          
          <nav className="nav-desktop">
            <Link href="/" className="active">Home</Link>
            <Link href="#">Product</Link>
            <Link href="#">Case Studies</Link>
            <Link href="#">Contact</Link>
          </nav>

          <button onClick={() => setIsAuthOpen(true)} className="sign-in-desktop block text-center" style={{ lineHeight: '44px', textDecoration: 'none' }}>
            Sign In
          </button>

          <button 
            className="burger-menu" 
            aria-expanded={isMenuOpen} 
            aria-label="Toggle menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="burger-bars">
              <span className="bar top"></span>
              <span className="bar middle"></span>
              <span className="bar bottom"></span>
            </div>
          </button>
        </header>

        <div className="mobile-overlay" hidden={!isMenuOpen} onClick={() => setIsMenuOpen(false)}></div>
        <div className="mobile-menu" hidden={!isMenuOpen}>
          <nav className="nav-mobile">
            <Link href="/" className="active anim-link" style={{ "--d": "0.1s" } as React.CSSProperties} onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link href="#" className="anim-link" style={{ "--d": "0.15s" } as React.CSSProperties} onClick={() => setIsMenuOpen(false)}>Product</Link>
            <Link href="#" className="anim-link" style={{ "--d": "0.2s" } as React.CSSProperties} onClick={() => setIsMenuOpen(false)}>Case Studies</Link>
            <Link href="#" className="anim-link" style={{ "--d": "0.25s" } as React.CSSProperties} onClick={() => setIsMenuOpen(false)}>Contact</Link>
            <button onClick={() => { setIsMenuOpen(false); setIsAuthOpen(true); }} className="sign-in-mobile anim-link block text-center" style={{ "--d": "0.3s", textDecoration: "none" } as React.CSSProperties}>Sign In</button>
          </nav>
        </div>

        <main className="hero">
          <div className="hero-content">
            <div className="trust-row anim" style={{ "--d": "0.05s" } as React.CSSProperties}>
              <div className="avatar-ring avatar-1"><div className="avatar-inner"><i className="fa-brands fa-microsoft"></i></div></div>
              <div className="avatar-ring avatar-2"><div className="avatar-inner"><i className="fa-brands fa-amazon"></i></div></div>
              <div className="avatar-ring avatar-3"><div className="avatar-inner"><i className="fa-brands fa-google"></i></div></div>
              <div className="trust-pill">Trusted by 2000+ Enterprises</div>
            </div>

            <h1 className="headline anim">
              <span className="line" style={{ "--d": "0.12s" } as React.CSSProperties}>Transform Lectures</span>
              <span className="line" style={{ "--d": "0.3s" } as React.CSSProperties}>Into Active Recall</span>
            </h1>

            <p className="subhead anim" style={{ "--d": "0.28s" } as React.CSSProperties}>
              Instantly convert your PDF study materials into interactive 3D flashcards and dynamic multiple-choice quizzes powered by Gemini AI.
            </p>

            <button className="cta anim" style={{ "--d": "0.4s" } as React.CSSProperties} onClick={() => setIsAuthOpen(true)}>Get Started</button>
          </div>
        </main>

        <footer className="stats">
          <div className="stat-item anim" style={{ "--d": "0.5s" } as React.CSSProperties}>
            <div className="stat-val-group">
              <span className="stat-icon">&lt;</span>
              <span className="stat-val" data-target="15" data-decimals="0">0</span>
              <span className="stat-suffix">s</span>
            </div>
            <div className="stat-label">Generation Time</div>
          </div>

          <div className="stat-item anim" style={{ "--d": "0.58s" } as React.CSSProperties}>
            <div className="stat-val-group">
              <span className="stat-icon">%</span>
              <span className="stat-val" data-target="99.9" data-decimals="1">0.0</span>
              <span className="stat-suffix">%</span>
            </div>
            <div className="stat-label">Concept Extraction</div>
          </div>

          <div className="stat-item anim" style={{ "--d": "0.66s" } as React.CSSProperties}>
            <div className="stat-val-group">
              <span className="stat-icon">*</span>
              <span className="stat-val" data-target="1000" data-decimals="0">0</span>
              <span className="stat-suffix">+</span>
            </div>
            <div className="stat-label">PDFs Processed</div>
          </div>

          <div className="stat-item anim" style={{ "--d": "0.74s" } as React.CSSProperties}>
            <div className="stat-val-group">
              <span className="stat-icon">#</span>
              <span className="stat-val" data-target="2.5" data-decimals="1">0.0</span>
              <span className="stat-suffix">M</span>
            </div>
            <div className="stat-label">Tokens Analyzed</div>
          </div>
        </footer>
      </div>

      {/* NEW SCROLLABLE CONTENT */}
      <div className="w-full relative z-10 bg-black/40 backdrop-blur-[20px] border-t border-white/10 mt-16 pb-24">
          <div className="max-w-6xl mx-auto px-8 pt-24">
            
            {/* Features Section */}
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white">Supercharge Your Study Flow</h2>
              <p className="text-white/50 max-w-2xl mx-auto text-[17px] leading-relaxed">Luminate uses advanced AI to break down complex materials into digestible, interactive formats instantly.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
              <div className="bg-[#18181b]/80 border border-white/10 rounded-[32px] p-8 hover:bg-white/10 transition-colors backdrop-blur-md relative overflow-hidden group hover:border-[#3b82f6]/30">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#3b82f6]/10 blur-[60px] rounded-full group-hover:bg-[#3b82f6]/30 transition-colors"></div>
                <div className="w-14 h-14 bg-black/50 rounded-[20px] flex items-center justify-center mb-6 border border-white/10 shadow-[0_4px_20px_rgba(59,130,246,0.15)] group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-bolt text-2xl text-[#3b82f6]"></i>
                </div>
                <h3 className="text-[22px] font-bold text-white mb-3 tracking-tight">Lightning Fast</h3>
                <p className="text-white/50 leading-relaxed text-[15px]">Powered by Gemini 2.5 Flash, Luminate parses entire PDF textbooks and generates study materials in milliseconds.</p>
              </div>
              
              <div className="bg-[#18181b]/80 border border-white/10 rounded-[32px] p-8 hover:bg-white/10 transition-colors backdrop-blur-md relative overflow-hidden group hover:border-[#8b5cf6]/30">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#8b5cf6]/10 blur-[60px] rounded-full group-hover:bg-[#8b5cf6]/30 transition-colors"></div>
                <div className="w-14 h-14 bg-black/50 rounded-[20px] flex items-center justify-center mb-6 border border-white/10 shadow-[0_4px_20px_rgba(139,92,246,0.15)] group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-layer-group text-2xl text-[#8b5cf6]"></i>
                </div>
                <h3 className="text-[22px] font-bold text-white mb-3 tracking-tight">3D Flashcards</h3>
                <p className="text-white/50 leading-relaxed text-[15px]">Engage active recall with physics-based, interactive 3D flashcards that make studying feel like magic.</p>
              </div>
              
              <div className="bg-[#18181b]/80 border border-white/10 rounded-[32px] p-8 hover:bg-white/10 transition-colors backdrop-blur-md relative overflow-hidden group hover:border-[#10b981]/30">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#10b981]/10 blur-[60px] rounded-full group-hover:bg-[#10b981]/30 transition-colors"></div>
                <div className="w-14 h-14 bg-black/50 rounded-[20px] flex items-center justify-center mb-6 border border-white/10 shadow-[0_4px_20px_rgba(16,185,129,0.15)] group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-clipboard-question text-2xl text-[#10b981]"></i>
                </div>
                <h3 className="text-[22px] font-bold text-white mb-3 tracking-tight">Dynamic Quizzes</h3>
                <p className="text-white/50 leading-relaxed text-[15px]">Test your knowledge with adaptive multiple-choice quizzes featuring instant color-coded feedback and detailed explanations.</p>
              </div>
            </div>

            {/* Final CTA */}
            <div className="bg-gradient-to-br from-[#18181b] to-black border border-white/10 rounded-[40px] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-[-50%] left-[-10%] w-[60%] h-[150%] bg-[#3b82f6]/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>
              <div className="absolute bottom-[-50%] right-[-10%] w-[60%] h-[150%] bg-[#8b5cf6]/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>
              
              <div className="relative z-10 max-w-2xl mx-auto">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                  <Image src="/assets/logo.webp" alt="Logo" width={40} height={40} className="object-contain" />
                </div>
                <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-white font-display leading-tight">Ready to Evolve<br/>Your Learning?</h2>
                <p className="text-white/60 text-[17px] mb-10 leading-relaxed">Join thousands of students and professionals learning 10x faster with AI-generated study materials.</p>
                <button 
                  onClick={() => setIsAuthOpen(true)}
                  className="px-10 py-4 bg-white text-black text-[15px] font-bold rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                >
                  Start For Free
                </button>
              </div>
            </div>

          </div>
      </div>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
