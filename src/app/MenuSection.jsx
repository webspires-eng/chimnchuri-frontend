"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* ─── Steak SVG shared across all 3 slices ─── */
function SteakSVG({ id }) {
  return (
    <svg
      viewBox="0 35 440 260"
      xmlns="http://www.w3.org/2000/svg"
      className="steak-vector"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={`${id}-side`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8b6914" />
          <stop offset="100%" stopColor="#6b4e10" />
        </linearGradient>
        <linearGradient id={`${id}-grill`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2a1a08" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#1a0f05" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      {/* 3D side/thickness */}
      <path
        d="M110,265 C75,250 45,220 38,185 L35,200 C42,235 72,262 108,278 C155,295 220,300 280,292 C340,282 375,258 390,228 L392,215 C378,248 342,270 282,280 C222,290 158,282 110,265 Z"
        fill={`url(#${id}-side)`}
      />
      {/* Fat border / seared crust */}
      <path
        d="M220,45 C280,38 348,50 388,95 C418,130 415,185 392,225 C368,262 325,282 275,288 C225,294 170,290 125,272 C78,252 42,222 38,180 C34,138 58,100 98,72 C138,48 180,42 220,45 Z"
        fill="#a07040"
      />
      {/* Inner cooked meat */}
      <path
        d="M220,72 C272,66 332,76 365,110 C392,138 390,180 378,212 C364,242 334,260 290,268 C248,274 200,272 160,258 C120,242 90,218 86,182 C82,148 100,118 130,98 C160,78 192,70 220,72 Z"
        fill="#5c3018"
      />
      {/* Darker seared surface */}
      <path
        d="M220,85 C265,80 318,88 348,118 C372,142 370,178 360,205 C348,232 322,248 284,254 C246,260 205,258 170,246 C135,232 108,212 105,182 C102,152 116,128 142,110 C168,92 196,84 220,85 Z"
        fill="#4a2512"
      />
      {/* Grill marks */}
      <line
        x1="120" y1="92" x2="320" y2="108"
        stroke={`url(#${id}-grill)`} strokeWidth="8" strokeLinecap="round"
      />
      <line
        x1="110" y1="135" x2="330" y2="148"
        stroke={`url(#${id}-grill)`} strokeWidth="8" strokeLinecap="round"
      />
      <line
        x1="105" y1="178" x2="340" y2="188"
        stroke={`url(#${id}-grill)`} strokeWidth="8" strokeLinecap="round"
      />
      <line
        x1="115" y1="218" x2="325" y2="230"
        stroke={`url(#${id}-grill)`} strokeWidth="7" strokeLinecap="round"
      />
      {/* Fat marbling */}
      <path
        d="M190,120 C208,135 218,160 222,190 C225,215 238,235 258,248"
        stroke="#c9a06e" strokeWidth="5" fill="none" opacity="0.5"
        strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M222,190 C242,178 268,182 290,195"
        stroke="#c9a06e" strokeWidth="4" fill="none" opacity="0.4"
        strokeLinecap="round"
      />
      <path
        d="M222,190 C210,205 208,225 215,242"
        stroke="#c9a06e" strokeWidth="3.5" fill="none" opacity="0.35"
        strokeLinecap="round"
      />
      <path
        d="M155,148 C172,138 185,125 190,120"
        stroke="#c9a06e" strokeWidth="3" fill="none" opacity="0.35"
        strokeLinecap="round"
      />
      <path
        d="M295,135 C305,155 300,180 290,195"
        stroke="#c9a06e" strokeWidth="3" fill="none" opacity="0.3"
        strokeLinecap="round"
      />
      {/* Warm sear highlights */}
      <ellipse cx="195" cy="155" rx="35" ry="22" fill="#6b3a1a" opacity="0.4" />
      <ellipse cx="290" cy="170" rx="28" ry="18" fill="#7a4422" opacity="0.3" />
      <ellipse cx="165" cy="200" rx="20" ry="14" fill="#6b3a1a" opacity="0.2" />
    </svg>
  );
}

/* ─── Knife SVG ─── */
function KnifeSVG() {
  return (
    <svg
      viewBox="0 0 40 350"
      xmlns="http://www.w3.org/2000/svg"
      className="knife-svg"
    >
      <defs>
        <linearGradient id="bladeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#bbb" />
          <stop offset="25%" stopColor="#e8e8e8" />
          <stop offset="50%" stopColor="#ffffff" />
          <stop offset="75%" stopColor="#ddd" />
          <stop offset="100%" stopColor="#aaa" />
        </linearGradient>
        <linearGradient id="handleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2c1810" />
          <stop offset="30%" stopColor="#4a2e1c" />
          <stop offset="70%" stopColor="#3d2415" />
          <stop offset="100%" stopColor="#1e100a" />
        </linearGradient>
      </defs>
      <path d="M20,0 L25,5 L26,200 L20,210 L14,200 L15,5 Z" fill="url(#bladeGrad)" />
      <line x1="20" y1="5" x2="20" y2="205" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
      <rect x="12" y="200" width="16" height="12" rx="2" fill="#999" />
      <rect x="13" y="212" width="14" height="120" rx="4" fill="url(#handleGrad)" />
      <circle cx="20" cy="235" r="2.5" fill="#c0a060" stroke="#8a7040" strokeWidth="0.5" />
      <circle cx="20" cy="270" r="2.5" fill="#c0a060" stroke="#8a7040" strokeWidth="0.5" />
      <circle cx="20" cy="305" r="2.5" fill="#c0a060" stroke="#8a7040" strokeWidth="0.5" />
    </svg>
  );
}

/* ─── Particle data ─── */
const particles = [
  { x: "10%", y: "20%", duration: "6s", delay: "0s" },
  { x: "85%", y: "15%", duration: "8s", delay: "1s" },
  { x: "20%", y: "70%", duration: "7s", delay: "2s" },
  { x: "75%", y: "80%", duration: "9s", delay: "0.5s" },
  { x: "50%", y: "30%", duration: "5s", delay: "3s" },
  { x: "30%", y: "55%", duration: "7s", delay: "1.5s" },
  { x: "90%", y: "50%", duration: "6s", delay: "2.5s" },
];

/* ─── Steam data ─── */
const steamWisps = [
  { offset: "-30px", delay: "0s" },
  { offset: "0px", delay: "0.8s" },
  { offset: "25px", delay: "1.6s" },
  { offset: "-15px", delay: "2.4s" },
];

/* ─── Slice data ─── */
const slicesData = [
  { id: "s1", label: "MENU", href: "/categories/1" },
  { id: "s2", label: "ORDER", href: "/categories/1" },
  { id: "s3", label: "TEAM", href: "/team" },
];

export default function MenuSection() {
  const [isOpen, setIsOpen] = useState(false);
  const knifeRef = useRef(null);
  const heroRef = useRef(null);
  const plateGlowRef = useRef(null);

  /* Auto-slice when section scrolls into view */
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsOpen(true);
        } else {
          setIsOpen(false);
          const knife = knifeRef.current;
          if (knife) {
            knife.style.animation = "none";
            // Use rAF instead of forced reflow (offsetHeight) to reset animation
            requestAnimationFrame(() => {
              knife.style.animation = "";
            });
          }
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  /* Subtle parallax on hero mouse-move — throttled to 60fps via rAF */
  useEffect(() => {
    const hero = heroRef.current;
    const glow = plateGlowRef.current;
    if (!hero || !glow) return;

    let ticking = false;

    const handleMove = (e) => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
        glow.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        ticking = false;
      });
    };

    hero.addEventListener("mousemove", handleMove, { passive: true });
    return () => hero.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <section className={`hero-steak py-20 ${isOpen ? "is-open" : ""}`} id="hero" ref={heroRef}>
      <style>{`
        .hero-steak {
          position: relative;
          min-height: 80vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: transparent;
          overflow: hidden;
          --color-bg: #0c0a09;
          --color-bg-warm: #1a1210;
          --color-gold: #c9a96e;
          --color-gold-light: #e2c992;
          --color-cream: #f5efe6;
          --color-meat: #8b2020;
          --color-meat-light: #c0392b;
          --color-text: #f5efe6;
          --color-text-dim: rgba(245, 239, 230, 0.4);
          --transition-smooth: cubic-bezier(0.34, 1.56, 0.64, 1);
          --transition-ease: cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .steak-stage {
          position: relative;
          width: 460px;
          height: 440px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          cursor: pointer;
          touch-action: manipulation;
        }

        .plate-glow {
          position: absolute;
          width: 380px;
          height: 380px;
          border-radius: 50%;
          background: radial-gradient(circle,
              rgba(201, 169, 110, 0.06) 0%,
              rgba(201, 169, 110, 0.02) 40%,
              transparent 70%);
          transition: transform 0.8s ease, background 0.8s ease;
          will-change: transform;
          transform: translateZ(0);
          backface-visibility: hidden;
          z-index: 0;
        }

        .is-open .plate-glow {
          transform: scale(1.45) translateZ(0);
          background: radial-gradient(circle,
              rgba(201, 169, 110, 0.1) 0%,
              rgba(139, 32, 32, 0.05) 40%,
              transparent 70%);
        }

        .steam-group {
          position: absolute;
          top: 50px;
          left: 50%;
          transform: translateX(-50%);
          width: 120px;
          height: 60px;
          z-index: 25;
          pointer-events: none;
          transition: opacity 0.6s ease;
        }

        .is-open .steam-group {
          opacity: 0;
          transition-delay: 0.2s;
        }

        .steam-wisp {
          position: absolute;
          bottom: 0;
          left: calc(50% + var(--offset));
          width: 2px;
          height: 40px;
          background: linear-gradient(to top, rgba(255, 255, 255, 0.08), transparent);
          border-radius: 50%;
          animation: steamWisp 3s ease-in-out var(--delay) infinite;
          filter: blur(2px);
          will-change: transform, opacity;
          transform: translateZ(0);
          backface-visibility: hidden;
        }

        @keyframes steamWisp {
          0% { transform: translateY(0) scaleX(1); opacity: 0; }
          20% { opacity: 0.5; }
          100% { transform: translateY(-80px) scaleX(3); opacity: 0; }
        }

        .knife {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translate3d(-50%, -80px, 0);
          z-index: 30;
          opacity: 0;
          pointer-events: none;
          will-change: transform, opacity;
          backface-visibility: hidden;
        }

        .knife-svg {
          width: 30px;
          height: auto;
          filter: drop-shadow(2px 4px 8px rgba(0, 0, 0, 0.6));
        }

        .is-open .knife {
          animation: knifeSlice 1.4s var(--transition-ease) 0.1s forwards;
        }

        @keyframes knifeSlice {
          0% { opacity: 0; transform: translate3d(-50%, -80px, 0); }
          30% { opacity: 1; transform: translate3d(-50%, -20px, 0); }
          50% { transform: translate3d(-50%, -20px, 0); }
          75% { transform: translate3d(-50%, calc(100vh + 80px), 0); }
          85% { opacity: 1; }
          100% { opacity: 0; transform: translate3d(-50%, calc(100vh + 120px), 0); }
        }

        .steak-container {
          position: relative;
          width: 400px;
          height: 320px;
          z-index: 15;
          overflow: visible;
        }

        .steak-graphic {
          width: 100%;
          height: 100%;
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .steak-vector {
          width: 100%;
          height: 100%;
          transition: opacity 0.5s ease;
        }

        .steak-slice {
          position: absolute;
          inset: 0;
          transition: transform 0.7s var(--transition-smooth), clip-path 0.5s var(--transition-ease);
          overflow: hidden;
          will-change: transform;
          transform: translateZ(0);
          backface-visibility: hidden;
        }

        /* Horizontal bands: top / middle / bottom */
        .slice-1 { clip-path: inset(0 0 66.66% 0); z-index: 3; }
        .slice-2 { clip-path: inset(33.33% 0 33.33% 0); z-index: 2; }
        .slice-3 { clip-path: inset(66.66% 0 0 0); z-index: 1; }

        .is-open .slice-1 { transform: translateY(-35px) scale(1.02); transition-delay: 0.5s; }
        .is-open .slice-2 { transform: translateY(0px) scale(1.02); transition-delay: 0.6s; }
        .is-open .slice-3 { transform: translateY(35px) scale(1.02); transition-delay: 0.7s; }

        .is-open .steak-vector { opacity: 0.3; transition-delay: 0.6s; }

        .slice-card {
          position: absolute;
          left: 0;
          right: 0;
          height: 33.33%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          opacity: 0;
          transform: translate3d(0, 20px, 0);
          transition: opacity 0.4s ease, transform 0.5s var(--transition-ease);
          pointer-events: none;
          z-index: 5;
          will-change: transform, opacity;
          backface-visibility: hidden;
        }

        .is-open .slice-1 .card-label{
        transform: translateY(10px);
        }
        .is-open .slice-3 .card-label{
        transform: translateY(-10px);
        }
        .is-open .slice-2 .card-label{
        font-size: 4rem;
        color: #396430; 
        }



        .slice-1 .slice-card { top: 0; }
        .slice-2 .slice-card { top: 33.33%; }
        .slice-3 .slice-card { top: 66.66%; }

        .is-open .slice-card {
          opacity: 1;
          transform: translateY(0);
          pointer-events: all;
        }

        .is-open .slice-1 .slice-card { transition-delay: 0.8s; }
        .is-open .slice-2 .slice-card { transition-delay: 0.9s; }
        .is-open .slice-3 .slice-card { transition-delay: 1.0s; }

        .card-label {
          font-family: inherit;
          font-weight: 900;
          font-size: 3rem;
          letter-spacing: 3px;
          color: var(--color-cream);
          transition: all 0.3s ease;
          text-shadow: 0 2px 15px rgba(0, 0, 0, 0.8);
          text-align: center;
          white-space: nowrap;
          display: block;
        }

        .steak-slice:hover .card-label {
          color: var(--color-gold-light);
          letter-spacing: 8px;
        }

        .steak-slice:hover .steak-vector {
          opacity: 0.15 !important;
        }

        /* Horizontal cut lines */
        .cut-line {
          position: absolute;
          left: 8%;
          height: 2px;
          width: 84%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), rgba(201, 169, 110, 0.4), transparent);
          opacity: 0;
          z-index: 20;
          pointer-events: none;
          filter: blur(0.5px);
          will-change: transform, opacity;
          transform: translateZ(0);
          backface-visibility: hidden;
        }

        .cut-line-1 { top: calc(33.33% - 1px); }
        .cut-line-2 { top: calc(66.66% - 1px); }

        .is-open .cut-line-1 { animation: cutFlash 0.6s ease 0.55s forwards; }
        .is-open .cut-line-2 { animation: cutFlash 0.6s ease 0.65s forwards; }

        @keyframes cutFlash {
          0% { opacity: 0; transform: scaleX(0); }
          30% { opacity: 1; transform: scaleX(1); }
          100% { opacity: 0; transform: scaleX(1.2); }
        }




        @media (max-width: 768px) {
          .hero-steak {
            min-height: 80vh;
            padding: 0;
          }
          .steak-stage { 
            width: 90vw; 
            height: auto; 
          }
          .steak-container { 
            width: 85vw; 
            height: auto;
            aspect-ratio: 440 / 420;
          }
          .card-label { 
            font-size: 3rem; 
            letter-spacing: 6px; 
          }
          .is-open .slice-1 { transform: translateY(-25px) scale(1.02); }
          .is-open .slice-3 { transform: translateY(25px) scale(1.02); }
          .plate-glow {
            width: 80vw;
            height: 80vw;
          }
          .is-open .plate-glow {
            transform: scale(1.2) translateZ(0);
          }
        }

        @media (max-width: 480px) {
          .steak-stage { 
            width: 95vw; 
            height: auto; 
          }
          .steak-container { 
            width: 90vw; 
            height: auto;
            aspect-ratio: 440 / 420;
          }
          .is-open .slice-1 .card-label{
          transform: translateY(10px);
          }
          .is-open .slice-3 .card-label{
          transform: translateY(-10px);
          }
          .card-label { 
            font-size: 2.5rem; 
            letter-spacing: 5px; 
            }
            .is-open .slice-2 .card-label{
            font-size: 3rem;
            color: #396430; 
            }
          .is-open .slice-1 { transform: translateY(-15px) scale(1.02); }
          .is-open .slice-3 { transform: translateY(15px) scale(1.02); }
        }

        @media (max-width: 360px) {
          .steak-stage { 
            width: 98vw;
            height: auto;
          }
          .steak-container {
            width: 92vw;
          }
          .card-label { 
            font-size: 2.2rem; 
            letter-spacing: 4px; 
          }
        }
      `}</style>

      {/* Steak interactive area */}
      <div
        className="steak-stage"
        id="steak-stage"
      >
        {/* Plate / glow behind steak */}
        <div className="plate-glow" ref={plateGlowRef} />

        {/* Steam rising */}
        <div className="steam-group">
          {steamWisps.map((s, i) => (
            <div
              key={i}
              className="steam-wisp"
              style={{ "--offset": s.offset, "--delay": s.delay }}
            />
          ))}
        </div>

        {/* The knife */}
        <div className="knife" id="knife" ref={knifeRef}>
          <KnifeSVG />
        </div>

        {/* STEAK: 3 slices */}
        <div className="steak-container" id="steak-container">
          {slicesData.map((slice, i) => (
            <div
              key={slice.id}
              className={`steak-slice slice-${i + 1}`}
              id={`slice-${i + 1}`}
            >
              {/* We wrap the link ONLY inside the slice-card to avoid immediate triggering */}
              <div className="steak-graphic">
                <SteakSVG id={slice.id} />
              </div>

              <div className="slice-card">
                <Link
                  href={slice.href}
                  className="card-label text-brand"
                  onClick={(e) => {
                    // If steak isn't open, prevent the link click
                    if (!isOpen) {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsOpen(true);
                    }
                  }}
                  style={{
                    // Only handle clicks when open, but the Link needs to be interactive
                    pointerEvents: isOpen ? "auto" : "none"
                  }}
                >
                  {slice.label}
                </Link>
              </div>

              {/* Transparent overlay to catch first tap on mobile */}
              {!isOpen && (
                <div
                  className="absolute inset-0 z-40"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsOpen(true);
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Cut lines (flash during slice) */}
        <div className="cut-line cut-line-1" />
        <div className="cut-line cut-line-2" />
      </div>


    </section>
  );
}
