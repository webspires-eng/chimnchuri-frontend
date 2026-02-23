'use client';

import { useSettings } from '@/app/providers/SettingsProvider';
import React from 'react';
import { useForm } from 'react-hook-form';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaFacebookF, FaInstagram, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { sendContactEmailApi } from '@/lib/api';

const ContactContent = () => {

    const setting = useSettings();
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

    const onSubmit = async (data) => {
        try {
            await sendContactEmailApi(data);
            toast.success("Your message has been sent successfully!");
            reset();
        } catch (error) {
            toast.error(error.message || "Failed to send message. Please try again later.");
        }
    };

    const contactInfo = [
        {
            icon: <FaPhoneAlt />,
            label: "Phone",
            value: setting?.phone,
            subValue: "",
            link: `tel:${setting?.phone}`
        },
        {
            icon: <FaEnvelope />,
            label: "Email",
            value: setting?.email,
            subValue: "",
            link: `mailto:${setting?.email}`
        },
        {
            icon: <FaMapMarkerAlt />,
            label: "Location",
            value: `${setting?.address}, ${setting?.city}, ${setting?.state} ${setting?.postcode}`,
            subValue: "",
            link: `https://maps.google.com/?q=${setting?.address}`
        }
    ];

    return (
        <main className="min-h-screen bg-[#141414] text-white pt-32 pb-20 px-4 w-full relative overflow-x-hidden">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-brand/10 blur-[120px] opacity-40 -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-brand/5 blur-[100px] opacity-30 translate-x-1/3 translate-y-1/3" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10 w-full">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">

                    {/* Left Column: Info */}
                    <div className="w-full lg:w-[40%] space-y-10">
                        <div className="space-y-6">
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.1]">
                                Let&apos;s <span className="text-brand">Talk</span> <br /> Sauce.
                            </h1>
                            <p className="text-zinc-400 text-base md:text-lg leading-relaxed max-w-lg">
                                Have a question about our menu, a booking inquiry, or just want to say hi?
                                We&apos;re all ears. Drop us a message or find us at the details below.
                            </p>
                        </div>

                        <div className="space-y-5">
                            {contactInfo.map((info, idx) => (
                                <a
                                    href={info.link}
                                    key={idx}
                                    className="flex items-center gap-6 p-5 rounded-3xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] transition-all group w-full"
                                    target={info.label === "Location" ? "_blank" : undefined}
                                    rel={info.label === "Location" ? "noopener noreferrer" : undefined}
                                >
                                    <div className="size-12 rounded-xl bg-brand/10 flex items-center justify-center text-brand group-hover:scale-110 transition-transform shrink-0">
                                        {React.cloneElement(info.icon, { size: 20 })}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-0.5">{info.label}</p>
                                        <p className="font-bold text-base text-white truncate">{info.value}</p>
                                        <p className="text-xs text-zinc-400 opacity-80">{info.subValue}</p>
                                    </div>
                                </a>
                            ))}
                        </div>

                        {/* <div className="space-y-6 pt-4">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Follow Our Journey</p>
                            <div className="flex gap-4">
                                {[
                                    { icon: <FaFacebookF />, link: "#" },
                                    { icon: <FaInstagram />, link: "#" },
                                    { icon: <FaTwitter />, link: "#" },
                                    { icon: <FaWhatsapp />, link: "#" }
                                ].map((social, idx) => (
                                    <a key={idx} href={social.link} className="size-12 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-zinc-400 hover:bg-brand hover:text-white hover:border-brand transition-all">
                                        {social.icon}
                                    </a>
                                ))}
                            </div>
                        </div> */}
                    </div>

                    {/* Right Column: Form */}
                    <div className="w-full lg:w-[60%]">
                        <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 p-6 md:p-10 rounded-[32px] shadow-2xl relative overflow-hidden">
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand/20 blur-3xl rounded-full" />

                            <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Full Name</label>
                                        <input
                                            {...register("full_name", { required: "Name is required" })}
                                            type="text"
                                            placeholder="John Doe"
                                            className={`w-full bg-white/[0.05] border ${errors.full_name ? 'border-red-500/50' : 'border-white/10'} focus:border-brand rounded-xl p-4 outline-none text-white text-sm transition-all backdrop-blur-sm`}
                                        />
                                        {errors.full_name && <p className="text-red-400 text-[9px] font-bold mt-1 ml-1 uppercase">{errors.full_name.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Email Address</label>
                                        <input
                                            {...register("email", {
                                                required: "Email is required",
                                                pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                                            })}
                                            type="email"
                                            placeholder="john@example.com"
                                            className={`w-full bg-white/[0.05] border ${errors.email ? 'border-red-500/50' : 'border-white/10'} focus:border-brand rounded-xl p-4 outline-none text-white text-sm transition-all backdrop-blur-sm`}
                                        />
                                        {errors.email && <p className="text-red-400 text-[9px] font-bold mt-1 ml-1 uppercase">{errors.email.message}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Subject</label>
                                    <div className="relative">
                                        <select
                                            {...register("subject")}
                                            className="w-full bg-white/[0.05] border border-white/10 focus:border-brand rounded-xl p-4 outline-none text-white text-sm transition-all appearance-none cursor-pointer backdrop-blur-sm"
                                        >
                                            <option value="General Inquiry" className="bg-[#1a1a1a]">General Inquiry</option>
                                            <option value="Reservation" className="bg-[#1a1a1a]">Table Reservation</option>
                                            <option value="Feedback" className="bg-[#1a1a1a]">Feedback</option>
                                            <option value="Partnership" className="bg-[#1a1a1a]">Partnership</option>
                                        </select>
                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Message</label>
                                    <textarea
                                        {...register("message", { required: "Message is required" })}
                                        rows={4}
                                        placeholder="Tell us what's on your mind..."
                                        className={`w-full bg-white/[0.05] border ${errors.message ? 'border-red-500/50' : 'border-white/10'} focus:border-brand rounded-xl p-4 outline-none text-white text-sm transition-all resize-none backdrop-blur-sm`}
                                    ></textarea>
                                    {errors.message && <p className="text-red-400 text-[9px] font-bold mt-1 ml-1 uppercase">{errors.message.message}</p>}
                                </div>

                                <button
                                    disabled={isSubmitting}
                                    type="submit"
                                    className="w-full bg-brand hover:bg-green-700 disabled:bg-brand/50 text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-brand/20 flex items-center justify-center gap-2 text-md mt-2 group uppercase tracking-widest"
                                >
                                    {isSubmitting ? (
                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    ) : (
                                        <>
                                            Send Message
                                            <FaPaperPlane size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ContactContent;
