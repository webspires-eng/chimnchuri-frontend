'use client';

import React from 'react';
import Image from 'next/image';
import { FaInstagram, FaTiktok } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Maintenance = () => {
    const currentYear = new Date().getFullYear();

    return (
        <div className="min-h-screen bg-[#171717] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden selection:bg-[#396430] selection:text-white">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#396430] opacity-10 rounded-full blur-[150px]"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#396430] opacity-10 rounded-full blur-[150px]"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-3xl w-full z-10"
            >
                {/* Logo Section */}
                <div className="mb-10 flex justify-center">
                    <motion.div
                        animate={{
                            y: [0, -15, 0],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="relative"
                    >
                        <Image
                            src="/icon.png"
                            alt="Chimnchurri Logo"
                            width={140}
                            height={140}
                            className="drop-shadow-[0_0_25px_rgba(57,100,48,0.3)]"
                        />
                    </motion.div>
                </div>

                {/* Main Heading */}
                <h1 className="text-4xl md:text-7xl font-bold text-white mb-8 tracking-tighter uppercase leading-[0.9]" style={{ fontFamily: 'Gagalin, sans-serif' }}>
                    Website Under <br />
                    <span className="text-[#396430] relative inline-block">
                        Maintenance
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ delay: 1, duration: 1 }}
                            className="absolute bottom-1 left-0 h-1 md:h-2 bg-[#396430]/30 rounded-full"
                        />
                    </span>
                </h1>

                {/* Subtext */}
                <p className="text-xl md:text-2xl text-gray-400 mb-12 font-medium leading-relaxed max-w-2xl mx-auto">
                    Our website is currently down for maintenance. We will be back soon with a better experience.
                </p>

                {/* Social Card */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 mb-12 transition-colors hover:border-[#396430]/40 group"
                >
                    <p className="text-lg md:text-xl text-gray-400 mb-8 font-medium">
                        please order on instagram Or Tiktok:
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-10">
                        <a
                            href="https://instagram.com/chimnchurri"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 text-white hover:text-[#396430] transition-all text-xl md:text-2xl group/link"
                        >
                            <div className="p-3 rounded-full bg-white/5 group-hover/link:bg-[#396430]/20 transition-colors">
                                <FaInstagram />
                            </div>
                            <span className="font-semibold tracking-tight">@chimnchurri</span>
                        </a>
                        <div className="hidden sm:block w-px h-8 bg-white/10"></div>
                        <a
                            href="https://tiktok.com/@chimnchurri"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 text-white hover:text-[#396430] transition-all text-xl md:text-2xl group/link"
                        >
                            <div className="p-3 rounded-full bg-white/5 group-hover/link:bg-[#396430]/20 transition-colors">
                                <FaTiktok />
                            </div>
                            <span className="font-semibold tracking-tight">@chimnchurri</span>
                        </a>
                    </div>
                </motion.div>

                {/* Maintenance Status */}
                <div className="flex flex-col items-center gap-4">
                    <div className="flex gap-1.5">
                        <motion.div
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-2 h-2 rounded-full bg-[#396430]"
                        />
                        <motion.div
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                            className="w-2 h-2 rounded-full bg-[#396430]"
                        />
                        <motion.div
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                            className="w-2 h-2 rounded-full bg-[#396430]"
                        />
                    </div>
                    <p className="text-xs md:text-sm uppercase tracking-[0.4em] text-[#396430] font-black">
                        System Maintenance Mode
                    </p>
                </div>
            </motion.div>

            {/* Footer */}
            <footer className="absolute bottom-8 text-gray-600 text-[10px] md:text-xs tracking-[0.3em] uppercase font-bold">
                © {currentYear} Chimnchurri. Handcrafted Excellence.
            </footer>
        </div>
    );
};

export default Maintenance;
