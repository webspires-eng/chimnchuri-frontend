'use client';

import React from 'react';
import { FaUtensils, FaHeart, FaAward, FaHistory, FaLeaf, FaUsers } from 'react-icons/fa';
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
                        Our <span className="text-brand">Flavors</span>, <br />
                        Your <span className="text-brand">Memories</span>
                    </h1>
                    <p className="max-w-xl mx-auto text-zinc-400 text-base md:text-lg leading-relaxed text-zinc-400/80">
                        At Chim &apos;N&apos; Churri, we don&apos;t just serve food; we craft experiences.
                        Every dish is a testament to our commitment to quality, authenticity, and the art of seasoning.
                    </p>
                </div>
            </section>

            {/* Our Story & Mission */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-brand text-[10px] font-bold tracking-wider uppercase">
                            <FaHistory size={12} /> Our Story
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                            Born from a <span className="text-brand">Passion</span> for Authentic Tastes
                        </h2>
                        <div className="space-y-4 text-zinc-400 text-sm leading-relaxed">
                            <p>
                                Chim &apos;N&apos; Churri began with a simple idea: that great food should be bold, fresh, and unforgettable.
                                Our journey started in a small family kitchen, where the secret recipes of our signature chimichurri
                                sauces were first perfected.
                            </p>
                            <p>
                                Today, we bring those same authentic flavors to your table, combining traditional methods
                                with modern culinary techniques to create something truly unique in the world of gastronomy.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <div className="bg-white/[0.03] border border-white/10 p-5 rounded-2xl backdrop-blur-sm">
                                <div className="text-brand text-2xl font-black mb-1">10+</div>
                                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Years of Flavor</div>
                            </div>
                            <div className="bg-white/[0.03] border border-white/10 p-5 rounded-2xl backdrop-blur-sm">
                                <div className="text-brand text-2xl font-black mb-1">50k+</div>
                                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Happy Guests</div>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="aspect-[1/1] rounded-[40px] overflow-hidden border border-white/10 bg-zinc-900 flex items-center justify-center p-8">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent opacity-60" />
                            <div className="text-center relative z-10">
                                <FaUtensils size={80} className="text-brand/20 mx-auto mb-6" />
                                <h3 className="text-2xl font-bold mb-4">Crafting the Perfect Bite</h3>
                                <p className="text-zinc-400 text-sm">
                                    Every ingredient we use is ethically sourced and hand-picked for peak freshness.
                                </p>
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute -top-6 -right-6 size-32 bg-brand/20 blur-3xl rounded-full" />
                            <div className="absolute -bottom-6 -left-6 size-32 bg-brand/20 blur-3xl rounded-full" />
                        </div>
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
                                title: "Fresh & Natural",
                                desc: "No artificial flavors or weird chemicals. Only the freshest herbs, spices, and premium meats."
                            },
                            {
                                icon: <FaHeart />,
                                title: "Made with Love",
                                desc: "Every order is prepared with the same care we give to our own family meals."
                            },
                            {
                                icon: <FaAward />,
                                title: "Quality First",
                                desc: "We никогда (never) compromise on quality. If it's not perfect, it doesn't leave our kitchen."
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
