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

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
