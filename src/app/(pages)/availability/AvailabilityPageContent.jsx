'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchOrderDates, timeSlots } from '@/lib/api';
import Link from 'next/link';
import {
    FaCalendarAlt,
    FaClock,
    FaChevronDown,
    FaChevronUp,
    FaArrowRight,
    FaCheckCircle,
    FaTimesCircle,
    FaExclamationTriangle,
} from 'react-icons/fa';
import { MdRestaurant } from 'react-icons/md';

// ── Individual date's time slots ─────────────────────────────────────────────
const DateSlots = ({ dateId }) => {
    const { data, isLoading } = useQuery({
        queryKey: ['timeSlots', dateId],
        queryFn: () => timeSlots(dateId),
        enabled: !!dateId,
        refetchInterval: 30_000,
        staleTime: 25_000,
    });

    if (isLoading) {
        return (
            <div className="flex items-center gap-2.5 py-4 px-2 text-zinc-500 text-xs animate-pulse">
                <div className="w-4 h-4 border-2 border-brand border-t-transparent rounded-full animate-spin shrink-0" />
                Loading time slots…
            </div>
        );
    }

    const slots = data?.data;
    if (!slots || slots.length === 0) {
        return <p className="text-xs text-zinc-500 italic py-3">No time slots available for this date.</p>;
    }

    const totalCapacity = slots.reduce((sum, s) => sum + (s.max_capacity ?? 0), 0);
    const totalRemaining = slots.reduce((sum, s) => {
        const remaining = Math.max(0, (s.max_capacity ?? 0) - (s.booked_count ?? 0));
        return sum + (s.disabled ? 0 : remaining);
    }, 0);

    return (
        <div className="space-y-2 mt-1">
            {/* Summary bar */}
            <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-3">
                <span>{slots.length} time slot{slots.length !== 1 ? 's' : ''}</span>
                <span className={`font-bold ${totalRemaining === 0 ? 'text-red-400' : 'text-brand'}`}>
                    {totalRemaining} steak{totalRemaining !== 1 ? 's' : ''} remaining
                </span>
            </div>

            {slots.map((slot) => {
                const isFull = slot.disabled || slot.max_capacity <= 0;
                const remaining = Math.max(0, (slot.max_capacity ?? 0) - (slot.booked_count ?? 0));
                const pct = slot.max_capacity > 0 ? Math.round(((slot.max_capacity - remaining) / slot.max_capacity) * 100) : 100;

                return (
                    <div
                        key={slot.id}
                        className={`rounded-xl border p-3 transition-all
                            ${isFull
                                ? 'bg-white/[0.02] border-white/5 opacity-60'
                                : 'bg-brand/[0.04] border-brand/15'}`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <FaClock size={11} className={isFull ? 'text-zinc-600' : 'text-brand'} />
                                <span className="text-sm font-bold text-white">{slot.start_time}</span>
                            </div>
                            {isFull ? (
                                <span className="text-[11px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                    Full
                                </span>
                            ) : (
                                <span className="text-[11px] font-bold text-brand bg-brand/10 border border-brand/20 px-2.5 py-0.5 rounded-full">
                                    {remaining} {remaining === 1 ? 'steak' : 'steaks'} left
                                </span>
                            )}
                        </div>


                    </div>
                );
            })}
        </div>
    );
};

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
    open: {
        icon: FaCheckCircle,
        iconColor: 'text-brand',
        badge: 'text-brand bg-brand/10 border-brand/30',
        cardBorder: 'border-brand/25',
        cardBg: 'bg-brand/[0.04]',
        label: 'Open',
        dot: 'bg-brand',
        pulse: true,
    },
    sold_out: {
        icon: FaExclamationTriangle,
        iconColor: 'text-amber-400',
        badge: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        cardBorder: 'border-amber-500/20',
        cardBg: 'bg-amber-500/[0.03]',
        label: 'Sold Out',
        dot: 'bg-amber-400',
        pulse: false,
    },
    closed: {
        icon: FaTimesCircle,
        iconColor: 'text-zinc-600',
        badge: 'text-zinc-500 bg-zinc-800 border-zinc-700',
        cardBorder: 'border-white/[0.06]',
        cardBg: 'bg-white/[0.02]',
        label: 'Closed',
        dot: 'bg-zinc-600',
        pulse: false,
    },
};

// ── Main page content ─────────────────────────────────────────────────────────
const AvailabilityPageContent = () => {
    const [expandedId, setExpandedId] = useState(null);

    const { data, isLoading } = useQuery({
        queryKey: ['orderDates'],
        queryFn: fetchOrderDates,
        refetchInterval: 30_000,
        staleTime: 25_000,
    });

    const dates = data?.data ?? [];
    const openCount = dates.filter((d) => d.status === 'open').length;

    return (
        <div className="min-h-screen bg-[#141414] text-white relative overflow-x-clip">

            {/* Background blobs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-brand/10 blur-3xl opacity-40" />
                <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full bg-brand/5 blur-3xl opacity-25" />
            </div>

            <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20">

                {/* ── Page header ── */}
                <div className="text-center mb-10 sm:mb-14">
                    <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-brand bg-brand/10 border border-brand/20 px-3 py-1.5 rounded-full mb-5">
                        <span className="size-1.5 rounded-full bg-brand animate-pulse inline-block" />
                        Live Availability
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4">
                        Availability <span className="text-brand">Times</span>
                    </h1>
                    <p className="text-zinc-400 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
                        See exactly when we&apos;re open, how many slots are left, and how many steaks remain —
                        updated in real time every 30 seconds.
                    </p>
                </div>

                {/* ── Status summary strip ── */}
                {!isLoading && dates.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 mb-8">
                        {[
                            { label: 'Open Days', value: openCount, color: 'text-brand' },
                            { label: 'Closed Days', value: dates.filter((d) => d.status === 'closed').length, color: 'text-zinc-500' },
                        ].map((stat) => (
                            <div key={stat.label} className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4 text-center">
                                <p className={`text-2xl sm:text-3xl font-black ${stat.color}`}>{stat.value}</p>
                                <p className="text-[11px] text-zinc-500 mt-0.5 uppercase tracking-wider font-semibold">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Date cards ── */}
                <div className="space-y-3">
                    {isLoading ? (
                        // Skeleton
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 animate-pulse">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-xl bg-white/[0.05]" />
                                    <div className="space-y-2 flex-1">
                                        <div className="h-3 bg-white/[0.06] rounded-full w-32" />
                                        <div className="h-2 bg-white/[0.04] rounded-full w-20" />
                                    </div>
                                    <div className="h-6 w-16 bg-white/[0.05] rounded-full" />
                                </div>
                            </div>
                        ))
                    ) : dates.length === 0 ? (
                        <div className="text-center py-16 space-y-4">
                            <div className="size-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto">
                                <FaCalendarAlt className="text-zinc-600" size={24} />
                            </div>
                            <p className="text-zinc-400 text-sm">No upcoming order dates right now.</p>
                            <p className="text-zinc-600 text-xs">New slots typically open every Sunday or Monday — check back soon!</p>
                        </div>
                    ) : (
                        dates.map((dateItem) => {
                            const cfg = STATUS_CONFIG[dateItem.status] ?? STATUS_CONFIG.closed;
                            const Icon = cfg.icon;
                            const isOpen = dateItem.status === 'open';
                            const isExpanded = expandedId === dateItem.id;

                            return (
                                <div
                                    key={dateItem.id}
                                    className={`rounded-2xl border overflow-hidden transition-all duration-300 ${cfg.cardBorder} ${cfg.cardBg}`}
                                >
                                    {/* Header row */}
                                    <button
                                        type="button"
                                        onClick={() => isOpen && setExpandedId(isExpanded ? null : dateItem.id)}
                                        className={`w-full flex items-center gap-4 p-4 sm:p-5 text-left transition-all
                                            ${isOpen ? 'cursor-pointer hover:bg-brand/[0.04]' : 'cursor-default'}`}
                                    >
                                        {/* Icon */}
                                        <div className={`size-10 sm:size-12 rounded-xl flex items-center justify-center shrink-0
                                            ${isOpen ? 'bg-brand/15' : 'bg-white/[0.04]'}`}>
                                            <Icon className={cfg.iconColor} size={18} />
                                        </div>

                                        {/* Date info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <p className={`text-sm sm:text-base font-bold truncate ${isOpen ? 'text-white' : 'text-zinc-500'}`}>
                                                    {dateItem.day_name}
                                                </p>
                                                {cfg.pulse && (
                                                    <span className="size-1.5 rounded-full bg-brand animate-pulse shrink-0" />
                                                )}
                                            </div>
                                            <p className="text-xs text-zinc-500">{dateItem.short_date}</p>
                                        </div>

                                        {/* Badge */}
                                        <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border shrink-0 ${cfg.badge}`}>
                                            {cfg.label}
                                        </span>

                                        {/* Expand chevron (open only) */}
                                        {isOpen && (
                                            <div className="text-zinc-500 shrink-0 ml-1">
                                                {isExpanded ? <FaChevronUp size={11} /> : <FaChevronDown size={11} />}
                                            </div>
                                        )}
                                    </button>

                                    {/* Expanded slot list */}
                                    {isOpen && isExpanded && (
                                        <div className="px-4 sm:px-5 pb-5 border-t border-brand/10">
                                            <DateSlots dateId={dateItem.id} />
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

                {/* ── Order CTA ── */}
                {openCount > 0 && (
                    <div className="mt-10 bg-brand/[0.06] border border-brand/20 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                        <div className="size-12 rounded-xl bg-brand/15 flex items-center justify-center shrink-0">
                            <MdRestaurant className="text-brand" size={22} />
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-white text-sm sm:text-base">Ready to order?</p>
                            <p className="text-zinc-400 text-xs sm:text-sm mt-0.5">
                                Slots are filling fast — secure yours before it&apos;s too late.
                            </p>
                        </div>
                        <Link
                            href="/categories/1"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand hover:bg-green-700 text-white text-sm font-bold transition-all duration-300 shadow-lg shadow-brand/20 shrink-0"
                        >
                            Order Now <FaArrowRight size={12} />
                        </Link>
                    </div>
                )}

                {/* ── How ordering works blurb ── */}
                <div className="mt-6 text-center">
                    <p className="text-zinc-600 text-xs leading-relaxed">
                        Order slots open every <span className="text-zinc-400 font-semibold">Sunday or Monday</span> for the upcoming Friday &amp; Saturday.
                        We usually sell out by Thursday — order early to secure your slot.
                    </p>
                    <Link href="/faq" className="inline-block mt-2 text-brand text-xs font-semibold hover:underline">
                        Read our FAQ →
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default AvailabilityPageContent;
