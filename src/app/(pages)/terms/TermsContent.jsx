'use client';

import React from 'react';
import { FaFileContract, FaShieldAlt, FaBalanceScale, FaInfoCircle, FaUndoAlt, FaClock, FaEdit, FaStore, FaExclamationTriangle } from 'react-icons/fa';

const TermsContent = () => {
    return (
        <main className="min-h-screen bg-[#141414] text-white pt-32 pb-20 px-4 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-brand/5 blur-[120px] opacity-40" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-brand/5 blur-[100px] opacity-30" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10 w-full">
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-brand text-[10px] font-bold tracking-wider uppercase mb-2">
                        <FaFileContract size={12} /> Legal Docs
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                        Terms & <span className="text-brand">Conditions</span>
                    </h1>
                    <p className="text-zinc-500 text-sm">Last updated: March 2, 2026</p>
                </div>

                <div className="space-y-12">
                    {[
                        {
                            icon: <FaInfoCircle />,
                            title: "1. Acceptance of Terms",
                            content: "By accessing and using Chim 'N' Churri's website and services, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services."
                        },
                        {
                            icon: <FaShieldAlt />,
                            title: "2. Use of Service",
                            content: "Our services are provided for personal, non-commercial use. You agree not to misuse the services or help anyone else do so. This includes not attempting to access the services using a method other than the interface and instructions we provide."
                        },
                        {
                            icon: <FaBalanceScale />,
                            title: "3. Ordering & Payment",
                            content: "All orders placed through our platform are subject to availability. We reserve the right to refuse or cancel any order for any reason. Prices are subject to change without notice. Payment must be made through our approved payment methods."
                        },
                        {
                            icon: <FaShieldAlt />,
                            title: "4. Intellectual Property",
                            content: "All content on this website, including text, graphics, logos, and images, is the property of Chim 'N' Churri and is protected by international copyright laws."
                        },
                        {
                            icon: <FaUndoAlt />,
                            title: "5. Cancellations & Refunds",
                            content: "Once an order has been confirmed and is being prepared, cancellations may not be possible. If you need to cancel, please contact us as soon as possible. Refunds are issued at our discretion and may depend on the stage of preparation. Any refund approved will be processed within 5–10 working days back to the original payment method."
                        },
                        {
                            icon: <FaClock />,
                            title: "6. Collection & Timing",
                            content: "Collection orders must be picked up within the time slot selected during checkout. We aim to have your order ready on time, but slight delays may occasionally occur during peak hours. Orders not collected within a reasonable timeframe may be disposed of at our discretion without a refund."
                        },
                        {
                            icon: <FaEdit />,
                            title: "7. Order Changes",
                            content: "Any modifications to your order must be requested before the order enters preparation. Once preparation has begun, we may not be able to accommodate changes. Please double-check your order before confirming at checkout."
                        },
                        {
                            icon: <FaStore />,
                            title: "8. Nature of the Business",
                            content: "Chim 'N' Churri is a food service business specialising in chimichurri-based dishes, steaks, and related food products. We operate via online ordering for delivery and collection. All food is freshly prepared and cooked on the day of your order."
                        },
                        {
                            icon: <FaExclamationTriangle />,
                            title: "9. Allergen & Dietary Notice",
                            content: "Our food may contain or come into contact with common allergens, including but not limited to: nuts, peanuts, gluten, dairy, eggs, soy, sesame, and shellfish. We prepare our food in a shared kitchen environment, so cross-contamination is possible. If you have any food allergies or dietary requirements, please inform us before placing your order. While we take all reasonable precautions, we cannot guarantee that any item is completely free from allergens."
                        }
                    ].map((section, idx) => (
                        <section key={idx} className="bg-white/[0.03] border border-white/10 p-8 rounded-3xl backdrop-blur-sm hover:bg-white/[0.05] transition-all group">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="size-10 rounded-xl bg-brand/10 flex items-center justify-center text-brand group-hover:scale-110 transition-transform">
                                    {React.cloneElement(section.icon, { size: 18 })}
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
                            Questions about our Terms? Contact us at <a href="mailto:legal@chimnchurri.com" className="text-brand hover:underline font-bold">legal@chimnchurri.com</a>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default TermsContent;
