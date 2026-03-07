'use client';

import React from 'react';
import { FaUtensils, FaHeart, FaAward, FaLeaf, FaSeedling, FaFire } from 'react-icons/fa';
import Link from 'next/link';

const AboutContent = () => {
    return (
        <main className="min-h-screen bg-[#141414] text-white overflow-hidden">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-brand/10 blur-[120px] opacity-60" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-brand/5 blur-[100px] opacity-40" />
                </div>

                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
                        About <span className="text-brand">Us</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-zinc-400 text-base md:text-lg leading-relaxed text-zinc-400/80">
                        At Chim ‘N’ Churri, we don’t just cook — we perfect. Every steak, side, and sauce is carefully crafted with quality ingredients, bold seasoning, and an uncompromising standard.
                    </p>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto space-y-16">
                    {/* Origin */}
                    <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-sm relative overflow-hidden">
                        <div className="absolute -top-6 -right-6 size-32 bg-brand/20 blur-3xl rounded-full" />
                        <div className="relative z-10 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-brand text-[10px] font-bold tracking-wider uppercase">
                                <FaHeart size={12} /> Our Beginning
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                                From a <span className="text-brand">Family Kitchen</span> to Your Table
                            </h2>
                            <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
                                Launched in September 2025 from a home family kitchen, Chim &apos;N&apos; Churri began with a simple
                                vision: to offer something different to the local community, with the long-term goal of opening
                                a physical store in the near future.
                            </p>
                        </div>
                    </div>

                    {/* The Food */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden">
                            <div className="absolute -bottom-6 -left-6 size-32 bg-brand/20 blur-3xl rounded-full" />
                            <div className="relative z-10 space-y-4">
                                <div className="size-12 rounded-xl bg-brand/10 flex items-center justify-center text-brand">
                                    <FaUtensils size={20} />
                                </div>
                                <h3 className="text-xl font-bold">Carefully Crafted <span className="text-brand">Menu</span></h3>
                                <p className="text-zinc-400 text-sm leading-relaxed">
                                    Our steaks are the star of the menu. We use premium quality cuts that are tender, juicy, and full of flavour — no shortcuts and no low-grade meat. Taste it yourself and you’ll know the difference.
                                    <br /><br />
                                    Every other item on the menu has been just as carefully developed. The creamy mash delivers the perfect buttery texture, while the seasoned fries are bold, flavourful, and seriously addictive. Just consistently great food made with proper ingredients.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden">
                            <div className="absolute -top-6 -right-6 size-32 bg-brand/20 blur-3xl rounded-full" />
                            <div className="relative z-10 space-y-4">
                                <div className="size-12 rounded-xl bg-brand/10 flex items-center justify-center text-brand">
                                    <FaSeedling size={20} />
                                </div>
                                <h3 className="text-xl font-bold">Signature <span className="text-brand">Sauces</span></h3>
                                <p className="text-zinc-400 text-sm leading-relaxed">
                                    The signature mushroom peppercorn sauce is rich, creamy, and full of flavour, crafted to stand
                                    apart from ordinary sauces. Chimichurri is equally distinctive, using a unique blend of herbs
                                    and seasonings to create a smoother, premium finish.
                                </p>
                            </div>
                        </div>
                    </div>




                    {/* Commitment */}
                    <div className="text-center space-y-6 max-w-2xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-brand text-[10px] font-bold tracking-wider uppercase">
                            <FaFire size={12} /> Our Promise
                        </div>
                        <p className="text-zinc-400 text-base md:text-lg leading-relaxed">
                            From steaks to sides and sauces, every plate reflects the same commitment: tender, flavourful,
                            high-quality food served fresh, every time.
                        </p>
                        <p className="text-xl md:text-2xl font-bold">
                            Chim &apos;N&apos; Churri stands for <span className="text-brand">passion</span>,{' '}
                            <span className="text-brand">care</span>, and <span className="text-brand">flavour</span> —
                            delivered with every bite.
                        </p>
                    </div>
                </div>
            </section>

            {/* Our Values */}
            <section className="py-20 px-4 bg-white/[0.02]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-2xl md:text-4xl font-bold tracking-tight">The <span className="text-brand">Churrified</span> Standard</h2>
                        <p className="text-zinc-500 text-sm max-w-lg mx-auto">Our values are the secret ingredients that make everything we do special.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: <FaLeaf />,
                                title: "No Shortcuts",
                                desc: "No low-quality ingredients, no cutting corners. Every dish is made with premium, carefully sourced produce."
                            },
                            {
                                icon: <FaHeart />,
                                title: "Made with Care",
                                desc: "Born from a family kitchen, every order is prepared with the same love and attention we give to our own meals."
                            },
                            {
                                icon: <FaAward />,
                                title: "Premium Quality",
                                desc: "From tender steaks to our signature sauces, we deliver consistently great food — fresh, every single time."
                            }
                        ].map((value, idx) => (
                            <div key={idx} className="bg-white/[0.04] backdrop-blur-xl border border-white/10 p-6 rounded-2xl hover:bg-white/[0.06] transition-all group">
                                <div className="size-12 rounded-xl bg-brand/10 flex items-center justify-center text-brand mb-5 group-hover:scale-110 transition-transform">
                                    {React.cloneElement(value.icon, { size: 20 })}
                                </div>
                                <h3 className="text-lg font-bold mb-2">{value.title}</h3>
                                <p className="text-zinc-500 leading-relaxed text-[13px]">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-20 px-4 text-center">
                <div className="max-w-3xl mx-auto bg-brand/10 border border-brand/20 rounded-[32px] p-8 md:p-14 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-brand/20 blur-[80px] -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand/20 blur-[80px] translate-y-1/2 -translate-x-1/2" />

                    <div className="relative z-10">
                        <h2 className="text-2xl md:text-4xl font-black mb-8 leading-tight">Ready to taste <br /> the <span className="text-brand underline decoration-brand/30 underline-offset-8">Difference</span>?</h2>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a href="/categories/1" className="px-8 py-4 bg-brand hover:bg-green-700 text-white rounded-xl font-bold transition-all shadow-xl shadow-brand/20 text-md w-full sm:w-auto uppercase tracking-wide">
                                Explore Menu
                            </a>
                            <Link href="/contact" className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold transition-all text-md w-full sm:w-auto uppercase tracking-wide">
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default AboutContent;

