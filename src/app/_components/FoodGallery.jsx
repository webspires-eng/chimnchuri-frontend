"use client";
import React, { useState, useEffect, useCallback } from "react";

const images = [
    "/gallery/1.jpg",
    "/gallery/2.jpg",
    "/gallery/3.jpg",
    "/gallery/4.jpg",
];

const FoodGallery = () => {
    const [current, setCurrent] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const next = useCallback(() => {
        setCurrent((prev) => (prev + 1) % images.length);
    }, []);

    const prev = useCallback(() => {
        setCurrent((prev) => (prev - 1 + images.length) % images.length);
    }, []);

    useEffect(() => {
        if (!isAutoPlaying) return;
        const timer = setInterval(next, 3500);
        return () => clearInterval(timer);
    }, [isAutoPlaying, next]);

    return (
        <section className="w-full py-12 lg:py-20 bg-[#0a0a0a]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Section Header */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight mb-3">
                        Our Dishes
                    </h2>
                    <p className="text-zinc-500 text-sm max-w-md mx-auto">
                        Fresh steaks, chimichurri sauces, and loaded fries — made with love.
                    </p>
                </div>

                {/* Desktop: 4 columns grid */}
                <div className="hidden md:grid grid-cols-4 gap-4">
                    {images.map((src, i) => (
                        <div
                            key={i}
                            className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer"
                        >
                            <img
                                src={src}
                                alt={`Dish ${i + 1}`}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                    ))}
                </div>

                {/* Mobile: Slider */}
                <div
                    className="md:hidden relative"
                    onTouchStart={() => setIsAutoPlaying(false)}
                    onTouchEnd={() => setIsAutoPlaying(true)}
                >
                    <div className="overflow-hidden rounded-2xl">
                        <div
                            className="flex transition-transform duration-500 ease-out"
                            style={{ transform: `translateX(-${current * 100}%)` }}
                        >
                            {images.map((src, i) => (
                                <div
                                    key={i}
                                    className="w-full flex-shrink-0 aspect-[3/4]"
                                >
                                    <img
                                        src={src}
                                        alt={`Dish ${i + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Nav arrows */}
                    <button
                        onClick={prev}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                    >
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={next}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                    >
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Dots */}
                    <div className="flex justify-center gap-2 mt-4">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === current
                                        ? "bg-green-500 w-6"
                                        : "bg-white/20 hover:bg-white/40"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FoodGallery;
