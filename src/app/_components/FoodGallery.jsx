"use client";
import React from "react";

const images = [
    "/gallery/1.jpeg",
    "/gallery/2.jpeg",
    "/gallery/3.jpeg",
    "/gallery/4.jpeg",
];

// Duplicate images twice for a seamless infinite loop
const marqueeImages = [...images, ...images, ...images];

const FoodGallery = () => {
    return (
        <section className="w-full overflow-hidden">
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes marqueeScroll {
                    0% {
                        transform: translateX(0) translateZ(0);
                    }
                    100% {
                        transform: translateX(-50%) translateZ(0);
                    }
                }
                .marquee-track {
                    display: flex;
                    width: max-content;
                    animation: marqueeScroll 50s linear infinite;
                    will-change: transform;
                    backface-visibility: hidden;
                    -webkit-backface-visibility: hidden;
                }
            `}} />
            <div className="w-full">
                <div className="marquee-track">
                    {marqueeImages.map((src, i) => (
                        <div
                            key={i}
                            className="group relative flex-shrink-0 w-[150px] sm:w-[150px] md:w-[200px] lg:w-[250px] aspect-[3/4] overflow-hidden cursor-pointer"
                        >
                            <img
                                src={src}
                                alt={`Dish ${(i % images.length) + 1}`}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FoodGallery;
