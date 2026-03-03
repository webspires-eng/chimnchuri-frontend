'use client';

import { useSettings } from '@/app/providers/SettingsProvider';
import React from 'react';
import { FaUserShield, FaLock, FaEye, FaCookieBite, FaShieldAlt } from 'react-icons/fa';

const PrivacyContent = () => {

    const setting = useSettings();

    return (
        <main className="min-h-screen bg-[#141414] text-white pt-32 pb-20 px-4 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-brand/5 blur-[120px] opacity-40" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-brand/5 blur-[100px] opacity-30" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10 w-full">
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-brand text-[10px] font-bold tracking-wider uppercase mb-2">
                        <FaUserShield size={12} /> Privacy First
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                        Privacy <span className="text-brand">Policy</span>
                    </h1>
                    <p className="text-zinc-500 text-sm">Last updated: February 21, 2026</p>
                </div>

                <div className="space-y-12">
                    {[
                        {
                            icon: <FaEye />,
                            title: "Information We Collect",
                            content: "We collect information you provide directly to us (name, email, phone number, address) when you place an order or create an account. We also automatically collect certain technical information when you visit our site."
                        },
                        {
                            icon: <FaLock />,
                            title: "How We Use Data",
                            content: "Your data is used to process orders, provide customer support, improve our services, and send you promotional communications if you have opted in. We do not sell your personal information to third parties."
                        },
                        {
                            icon: <FaShieldAlt />,
                            title: "Data Security",
                            content: "We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, or destruction. However, no method of transmission over the internet is 100% secure."
                        },
                        {
                            icon: <FaCookieBite />,
                            title: "Cookies",
                            content: "We use cookies to enhance your browsing experience, remember your preferences, and analyze site traffic. You can manage cookie settings through your browser at any time."
                        }
                    ].map((section, idx) => (
                        <section key={idx} className="bg-white/[0.03] border border-white/10 p-8 rounded-3xl backdrop-blur-sm hover:bg-white/[0.05] transition-all group">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="size-10 rounded-xl bg-brand/10 flex items-center justify-center text-brand group-hover:scale-110 transition-transform">
                                    {(idx === 2) ? <FaUserShield size={18} /> : React.cloneElement(section.icon, { size: 18 })}
                                </div>
                                <h2 className="text-xl font-bold">{section.title}</h2>
                            </div>
                            <p className="text-zinc-400 text-sm leading-relaxed">
                                {section.content}
                            </p>
                        </section>
                    ))}

                    <div className="p-8 rounded-3xl bg-brand/5 border border-brand/10 text-center">
                        <p className="text-zinc-300 text-sm">
                            Need more details? Reach us at <a href={`mailto:${setting?.email}`} className="text-brand hover:underline font-bold">{setting?.email}</a>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default PrivacyContent;
