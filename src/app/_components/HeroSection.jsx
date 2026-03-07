"use client"
import React, { useState, useEffect } from 'react'
import c from "@/assets/images/c.png"
import h from "@/assets/images/h.png"
import i from "@/assets/images/i.png"
import m from "@/assets/images/m.png"
import n from "@/assets/images/n.png"
import u from "@/assets/images/u.png"
import r from "@/assets/images/r.png"

const images = [
    { src: c, alt: "C" },
    { src: h, alt: "H" },
    { src: i, alt: "I" },
    { src: m, alt: "M" },
    { src: n, alt: "'N'" },
    { src: c, alt: "C" },
    { src: h, alt: "H" },
    { src: u, alt: "U" },
    { src: r, alt: "R" },
    { src: r, alt: "R" },
    { src: i, alt: "I" },
];

const LETTER_DURATION = 0.4; // seconds per letter bounce
const TOTAL_CYCLE = images.length * LETTER_DURATION; // 4.4s full cycle

// Bounce occupies (0.8s / 4.4s) ≈ 18.18% of the cycle
// Keyframe percentages: 0% → rest, ~9% → peak, ~18% → rest, 100% → rest (idle)
const BOUNCE_PERCENT = ((LETTER_DURATION * 2) / TOTAL_CYCLE) * 100;
const PEAK_PERCENT = BOUNCE_PERCENT / 2;

const HeroSection = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        let ticking = false;
        const checkMobile = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                setIsMobile(window.innerWidth <= 768);
                ticking = false;
            });
        };
        checkMobile();
        window.addEventListener("resize", checkMobile, { passive: true });
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const bounceHeight = isMobile ? 30 : 50;

    return (
        <section>
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes letterBounce {
                    0% {
                        transform: translate3d(0, 0, 0);
                    }
                    ${PEAK_PERCENT.toFixed(2)}% {
                        transform: translate3d(0, var(--bounce), 0);
                    }
                    ${BOUNCE_PERCENT.toFixed(2)}% {
                        transform: translate3d(0, 0, 0);
                    }
                    100% {
                        transform: translate3d(0, 0, 0);
                    }
                }
                .hero-letter {
                    will-change: transform;
                    backface-visibility: hidden;
                    -webkit-backface-visibility: hidden;
                    transform: translateZ(0);
                }
            `}} />
            <div className="bg-brand py-14 min-h-[20vh] lg:min-h-[50vh] flex items-center justify-center relative">
                {/* Halal badge */}
                <span className="absolute top-3 right-3 sm:top-4 sm:right-5 text-white/80 text-[10px] sm:text-xs font-black tracking-[0.2em] uppercase select-none">
                    HALAL
                </span>

                <div className="flex justify-center items-end">
                    {images.map((img, index) => {
                        const delay = index * LETTER_DURATION;
                        const isN = index === 4;
                        const spacingClass = isN ? "mx-[3vw] lg:mx-[3vw]" : "";

                        return (
                            <img
                                key={index}
                                src={img?.src?.src}
                                alt={img.alt}
                                height={100}
                                className={`h-[11vw] lg:h-[11vw] ${spacingClass} hero-letter`}
                                style={{
                                    "--bounce": `-${bounceHeight}px`,
                                    animation: `letterBounce ${TOTAL_CYCLE}s ease-in-out ${delay}s infinite`,
                                }}
                            />
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default HeroSection