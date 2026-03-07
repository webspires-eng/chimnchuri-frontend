'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { FaLinkedin, FaTwitter, FaInstagram, FaEnvelope, FaUsers, FaArrowRight, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import { fetchTeamApi } from '@/lib/api';

// Helper to strip HTML tags for plain-text previews
const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
};

const TeamMemberCard = ({ member, onClick }) => (
    <div
        className="group relative bg-white/[0.03] border border-white/10 rounded-[2.5rem] overflow-hidden hover:bg-white/[0.06] transition-all duration-500 hover:-translate-y-2 cursor-pointer"
        onClick={() => onClick(member)}
    >
        {/* Profile Image Container */}
        <div className="aspect-[4/5] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent opacity-60 z-10" />
            <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
            />
            {/* Hover hint */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-white/10">
                    View Profile
                </span>
            </div>
        </div>

        {/* Info Area */}
        <div className="p-8 relative z-20">
            <div className="mb-4">
                <span className="text-white/50 text-[11px] font-semibold uppercase mb-2 block">
                    {member.role}
                </span>
                <h3 className="text-2xl font-bold text-white group-hover:text-brand transition-colors">
                    {member.name}
                </h3>
            </div>

            <p className="text-zinc-400 text-sm leading-relaxed mb-4 line-clamp-2">
                {stripHtml(member.bio)}
            </p>

            {member.email && (
                <Link href={`mailto:${member.email}`} onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-2 text-white/60 hover:text-brand text-xs font-bold transition-colors group/link">
                    <FaEnvelope className="group-hover/link:animate-bounce" /> {member.email}
                </Link>
            )}
        </div>

        {/* Decorative background blur */}
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-brand/10 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
    </div>
);

const TeamMemberModal = ({ member, onClose }) => {
    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    if (!member) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl animate-fadeIn" />

            {/* Modal */}
            <div
                className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-x-clip overflow-y-auto rounded-3xl sm:rounded-[2.5rem] bg-[#1a1a1a] border border-white/10 shadow-2xl shadow-black/60 animate-scaleIn"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-all duration-300 cursor-pointer"
                >
                    <FaTimes size={14} />
                </button>

                {/* Top Section: Image + Name */}
                <div className="relative">
                    {/* Large Image */}
                    <div className="h-64 sm:h-80 md:h-96 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/40 to-transparent z-10" />
                        <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full object-cover object-top"
                        />
                    </div>

                    {/* Name overlay at bottom of image */}
                    <div className="absolute bottom-0 left-0 right-0 z-20 px-6 sm:px-10 pb-6">
                        <span className="text-brand text-[11px] font-bold uppercase tracking-[0.2em] block mb-1">
                            {member.role}
                        </span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
                            {member.name}
                        </h2>
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 sm:px-10 py-6 sm:py-8 space-y-6">
                    {/* Bio */}
                    {member.bio && (
                        <div>
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-3">About</h4>
                            <div
                                className="text-zinc-300 text-xs leading-relaxed prose prose-invert prose-sm max-w-none"
                                dangerouslySetInnerHTML={{ __html: member.bio }}
                            />
                        </div>
                    )}


                    {/* Contact */}
                    {member.email && (
                        <div className="pt-4 border-t border-white/5">
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-3">Contact</h4>
                            <Link
                                href={`mailto:${member.email}`}
                                className="inline-flex items-center gap-3 bg-white/[0.03] hover:bg-brand/10 border border-white/10 hover:border-brand/30 px-5 py-3 rounded-xl transition-all duration-300 group/email"
                            >
                                <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center group-hover/email:bg-brand/20 transition-colors">
                                    <FaEnvelope className="text-brand" size={12} />
                                </div>
                                <span className="text-sm font-medium text-zinc-300 group-hover/email:text-white transition-colors">{member.email}</span>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Decorative blurs */}
                <div className="absolute top-20 -left-20 w-40 h-40 bg-brand/10 blur-[80px] rounded-full pointer-events-none" />
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-brand/5 blur-[60px] rounded-full pointer-events-none" />
            </div>
        </div>
    );
};

const TeamContent = () => {
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMember, setSelectedMember] = useState(null);

    useEffect(() => {
        const getTeamMembers = async () => {
            try {
                const response = await fetchTeamApi();
                if (response.success) {
                    setTeamMembers(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch team members:", error);
            } finally {
                setLoading(false);
            }
        };
        getTeamMembers();
    }, []);

    return (
        <main className="min-h-screen bg-[#141414] text-white">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-brand/10 blur-[130px] opacity-50" />
                    <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] rounded-full bg-brand/5 blur-[100px] opacity-30" />
                </div>

                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-brand text-[10px] font-black tracking-widest uppercase mb-6">
                        <FaUsers size={12} /> The People Behind the Flavor
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter">
                        Meet the <span className="text-brand">Churrified</span> <br />
                        Dream <span className="text-white/20">Team</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-zinc-400 text-base md:text-lg leading-relaxed">
                        A crew of flavor lovers, recipe experts, and service pros—dedicated to delivering the boldest, most unforgettable bites straight to your box.
                    </p>
                </div>
            </section>

            {/* Team Grid */}
            <section className="py-20 px-4 min-h-[400px]">
                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="aspect-[4/6] bg-white/5 rounded-[2.5rem] animate-pulse" />
                            ))}
                        </div>
                    ) : teamMembers.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {teamMembers.map((member, index) => (
                                <TeamMemberCard key={index} member={member} onClick={setSelectedMember} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-zinc-500">No team members found.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Joining Section */}
            <section className="py-32 px-4 relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-gradient-to-r from-zinc-900 to-black border border-white/5 rounded-[3rem] p-12 md:p-20 relative overflow-hidden group">
                        {/* Decorative background elements */}
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand/10 blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-brand/20 transition-colors duration-1000" />

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                            <div>
                                <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                                    Want to <span className="text-brand">Join</span> <br />
                                    the Family?
                                </h2>
                                <p className="text-zinc-400 text-lg mb-8 max-w-md">
                                    We're always looking for passionate individuals who love great food and exceptional service.
                                </p>
                                <Link href="/contact" className="inline-flex items-center gap-3 px-8 py-4 bg-brand hover:bg-green-700 text-white rounded-2xl font-bold transition-all shadow-2xl shadow-brand/20 group/btn">
                                    View Open Positions <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <div className="bg-white/[0.03] p-6 rounded-3xl border border-white/5">
                                        <h4 className="font-bold text-white mb-1">Growth</h4>
                                        <p className="text-xs text-zinc-500">Continuous learning & career paths.</p>
                                    </div>
                                    <div className="bg-white/[0.03] p-6 rounded-3xl border border-white/5">
                                        <h4 className="font-bold text-white mb-1">Culture</h4>
                                        <p className="text-xs text-zinc-500">Inclusive, vibrant, and fun.</p>
                                    </div>
                                </div>
                                <div className="space-y-4 pt-8">
                                    <div className="bg-white/[0.03] p-6 rounded-3xl border border-white/5">
                                        <h4 className="font-bold text-white mb-1">Benefits</h4>
                                        <p className="text-xs text-zinc-500">Competitive pay & perks.</p>
                                    </div>
                                    <div className="bg-white/[0.03] p-6 rounded-3xl border border-white/5">
                                        <h4 className="font-bold text-white mb-1">Impact</h4>
                                        <p className="text-xs text-zinc-500">Make people smile every day.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Member Modal */}
            {selectedMember && (
                <TeamMemberModal member={selectedMember} onClose={() => setSelectedMember(null)} />
            )}
        </main>
    );
};

export default TeamContent;
