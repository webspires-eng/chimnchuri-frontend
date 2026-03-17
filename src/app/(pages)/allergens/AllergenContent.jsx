'use client';

import React from 'react';
import {
    FaExclamationTriangle,
    FaInstagram,
    FaTiktok,
    FaEnvelope,
    FaHome,
    FaSeedling,
    FaMortarPestle,
    FaEgg,
    FaFish,
    FaBreadSlice,
    FaLeaf,
    FaCheckCircle,
    FaTimesCircle,
    FaPhoneAlt,
    FaPencilAlt,
} from 'react-icons/fa';
import { GiMilkCarton, GiPeanut, GiShrimp } from 'react-icons/gi';

const allergens = [
    { icon: <GiPeanut />, label: 'Peanuts', note: 'May be present' },
    { icon: <FaSeedling />, label: 'Tree Nuts', note: 'May be present' },
    { icon: <FaBreadSlice />, label: 'Gluten / Wheat', note: 'Present in some dishes' },
    { icon: <GiMilkCarton />, label: 'Dairy', note: 'May be present' },
    { icon: <FaEgg />, label: 'Eggs', note: 'May be present' },
    { icon: <FaLeaf />, label: 'Soy', note: 'May be present' },
    { icon: <FaMortarPestle />, label: 'Mustard', note: 'May be present' },
    { icon: <GiShrimp />, label: 'Shellfish', note: 'May be present' },
];

const AllergenContent = () => {
    return (
        <main className="min-h-screen bg-[#141414] text-white pt-32 pb-20 px-4 relative overflow-hidden">

            {/* Background glows */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-brand/5 blur-[130px] opacity-50" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-brand/5 blur-[100px] opacity-30" />
            </div>

            <div className="max-w-3xl mx-auto relative z-10 w-full">

                {/* ── Header ── */}
                <div className="text-center mb-14 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 border border-brand/25 text-brand text-[10px] font-bold tracking-wider uppercase mb-2">
                        <FaExclamationTriangle size={11} /> Allergy &amp; Dietary Info
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                        Chim &apos;N&apos; Churri{' '}
                        <span className="text-brand">Allergen Info</span>
                    </h1>
                    <p className="text-zinc-400 text-sm max-w-md mx-auto">
                        Your safety matters. Please read the information below carefully before placing an order.
                    </p>
                </div>

                {/* ── Shared-kitchen warning banner ── */}
                <div className="flex gap-4 items-start p-5 sm:p-6 rounded-2xl bg-brand/5 border border-brand/25 mb-8">
                    <div className="shrink-0 size-10 rounded-xl bg-brand/15 flex items-center justify-center text-brand">
                        <FaHome size={18} />
                    </div>
                    <div>
                        <h2 className="font-bold text-brand text-base mb-1">Shared Home Kitchen</h2>
                        <p className="text-zinc-300 text-sm leading-relaxed">
                            We operate from a <strong>shared home kitchen</strong> and cannot guarantee a completely allergen-free
                            environment. <strong>Cross-contamination may occur.</strong> We cannot cater specifically to allergens,
                            so if you have a severe allergy, please contact us before placing an order.
                        </p>
                    </div>
                </div>

                {/* ── Common allergens grid ── */}
                <div className="mb-8">
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">
                        Common allergens that may be present
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {allergens.map((a, i) => (
                            <div
                                key={i}
                                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300 text-center"
                            >
                                <div className="size-10 rounded-xl bg-brand/10 flex items-center justify-center text-brand text-lg">
                                    {a.icon}
                                </div>
                                <span className="text-sm font-semibold text-white">{a.label}</span>
                                <span className="text-[11px] text-zinc-500">{a.note}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Gluten specifics ── */}
                <div className="mb-8">
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">
                        Gluten information
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-3">
                        <div className="flex items-start gap-3 p-4 rounded-2xl bg-brand/5 border border-brand/20">
                            <div className="shrink-0 size-9 rounded-xl bg-brand/15 flex items-center justify-center text-brand mt-0.5">
                                <FaCheckCircle size={16} />
                            </div>
                            <div>
                                <p className="font-semibold text-white text-sm mb-0.5">Fries</p>
                                <p className="text-zinc-400 text-xs leading-relaxed">
                                    Our fries are <strong className="text-brand">gluten-free</strong>. However, as we operate from a shared
                                    kitchen, cross-contamination cannot be fully ruled out.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-500/5 border border-red-500/20">
                            <div className="shrink-0 size-9 rounded-xl bg-red-500/15 flex items-center justify-center text-red-400 mt-0.5">
                                <FaTimesCircle size={16} />
                            </div>
                            <div>
                                <p className="font-semibold text-white text-sm mb-0.5">Mushroom Peppercorn Sauce</p>
                                <p className="text-zinc-400 text-xs leading-relaxed">
                                    Our mushroom peppercorn sauce <strong className="text-red-400">contains gluten</strong> and is
                                    not suitable for those with gluten intolerance or coeliac disease.
                                </p>
                            </div>
                        </div>
                    </div>
                    <p className="text-zinc-500 text-xs mt-3 leading-relaxed px-1">
                        All other items may contain gluten. We cannot guarantee any dish is free from gluten, nuts, dairy, soy,
                        eggs, mustard, or shellfish due to our shared kitchen environment.
                    </p>
                </div>

                {/* ── Order notes tip ── */}
                <div className="flex gap-4 items-start p-5 sm:p-6 rounded-2xl bg-brand/5 border border-brand/15 mb-8">
                    <div className="shrink-0 size-10 rounded-xl bg-brand/15 flex items-center justify-center text-brand">
                        <FaPencilAlt size={16} />
                    </div>
                    <div>
                        <h2 className="font-bold text-white text-base mb-1">Include a note with your order</h2>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            When ordering through the website, you can include <strong className="text-white">allergy or dietary notes</strong> in
                            the order notes field. This helps us be aware of your requirements. However, please still contact us
                            in advance — notes alone cannot guarantee a safe preparation.
                        </p>
                    </div>
                </div>

                {/* ── Main disclaimer ── */}
                <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 mb-8 space-y-3">
                    <h2 className="font-bold text-white text-base flex items-center gap-2">
                        <FaExclamationTriangle className="text-brand" size={15} />
                        Important Disclaimer
                    </h2>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                        Orders placed without confirming allergy safety are done at the customer’s own risk. Chim ‘N’ Churri cannot cater to certain allergies and accepts no legal responsibility for allergic reactions resulting from orders placed without prior allergy consultation. We strongly urge you not to place an order until you have spoken with us directly about your allergy.
                    </p>
                </div>

                {/* ── Contact CTA ── */}
                <div className="p-7 rounded-3xl bg-brand/5 border border-brand/15 text-center space-y-4">
                    <div className="inline-flex items-center gap-2 text-brand text-sm font-bold">
                        <FaPhoneAlt size={13} />
                        Contact us before placing an order
                    </div>
                    <p className="text-zinc-400 text-sm max-w-sm mx-auto">
                        If you have <strong className="text-white">any allergy or dietary concern</strong>, please reach out to us first.
                        We&apos;ll do everything we can to help you order safely.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                        <a
                            href="https://www.instagram.com/chimnchurri"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand/10 border border-brand/20 text-brand text-sm font-semibold hover:bg-brand hover:text-white transition-all duration-300"
                        >
                            <FaInstagram size={14} /> @chimnchurri
                        </a>
                        <a
                            href="https://www.tiktok.com/@chimnchurri"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand/10 border border-brand/20 text-brand text-sm font-semibold hover:bg-brand hover:text-white transition-all duration-300"
                        >
                            <FaTiktok size={14} /> @chimnchurri
                        </a>
                        <a
                            href="mailto:info@chimnchurri.com"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand/10 border border-brand/20 text-brand text-sm font-semibold hover:bg-brand hover:text-white transition-all duration-300"
                        >
                            <FaEnvelope size={14} /> info@chimnchurri.com
                        </a>
                    </div>
                </div>

            </div>
        </main>
    );
};

export default AllergenContent;
