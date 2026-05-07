'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchOrderDates, timeSlots } from '@/lib/api';
import {
    FaCalendarAlt,
    FaClock,
    FaChevronDown,
    FaChevronUp,
    FaCircle,
} from 'react-icons/fa';

// ── Slot row (loads its own time-slot data when the parent date is expanded) ──
const DateSlots = ({ dateId }) => {
    const { data, isLoading, isFetching } = useQuery({
        queryKey: ['timeSlots', dateId],
        queryFn: () => timeSlots(dateId),
        enabled: !!dateId,
        refetchInterval: 30_000, // real-time: refresh every 30 s
        staleTime: 0,
    });

    const slots = data?.data;

    if (isLoading || (isFetching && (!slots || slots.length === 0))) {
        return (
            <div className="flex items-center gap-2 py-3 px-1 text-zinc-500 text-xs animate-pulse">
                <div className="w-3 h-3 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                Loading slots...
            </div>
        );
    }

    if (!slots || slots.length === 0) {
        return <p className="text-xs text-zinc-500 py-2 px-1 italic">No time slots available.</p>;
    }

    return (
        <div className="mt-2 space-y-1.5">
            {slots.map((slot) => {
                const isFull = slot.disabled || slot.max_capacity <= 0;
                const remaining = Math.max(0, slot.max_capacity - (slot.booked_count ?? 0));
                return (
                    <div
                        key={slot.id}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs transition-all
                            ${isFull
                                ? 'bg-white/[0.01] border-white/5 opacity-50'
                                : 'bg-brand/5 border-brand/15'}`}
                    >
                        <div className="flex items-center gap-2 font-semibold text-white">
                            <FaClock size={10} className={isFull ? 'text-zinc-600' : 'text-brand'} />
                            {slot.start_time}
                        </div>
                        <div className="flex items-center gap-2">
                            {isFull ? (
                                <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                    Full
                                </span>
                            ) : (
                                <span className="text-[10px] font-bold text-brand bg-brand/10 px-2 py-0.5 rounded-full">
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

// ── Status badge config ──────────────────────────────────────────────────────
const STATUS = {
    open: {
        dot: 'bg-brand animate-pulse',
        badge: 'text-brand bg-brand/10 border-brand/20',
        label: 'Open',
    },
    sold_out: {
        dot: 'bg-amber-400',
        badge: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        label: 'Sold Out',
    },
    closed: {
        dot: 'bg-zinc-600',
        badge: 'text-zinc-500 bg-zinc-800 border-zinc-700',
        label: 'Closed',
    },
};

// ── Main panel ───────────────────────────────────────────────────────────────
const AvailabilityPanel = () => {
    const [expandedId, setExpandedId] = useState(null);

    const { data, isLoading } = useQuery({
        queryKey: ['orderDates'],
        queryFn: fetchOrderDates,
        refetchInterval: 30_000, // poll every 30 s for real-time updates
        staleTime: 30_000,
    });

    const dates = data?.data ?? [];

    return (
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-2.5 px-4 py-3 border-b border-white/[0.06]">
                <div className="size-7 rounded-lg bg-brand/15 flex items-center justify-center">
                    <FaCalendarAlt className="text-brand" size={12} />
                </div>
                <div className="flex-1">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Availability</h3>
                    <p className="text-[10px] text-zinc-500">Live · updates every 30s</p>
                </div>
                {/* Live dot */}
                <span className="flex items-center gap-1.5 text-[10px] text-brand font-semibold">
                    <span className="size-1.5 rounded-full bg-brand animate-pulse inline-block" />
                    LIVE
                </span>
            </div>

            {/* Content */}
            <div className="p-3 space-y-2">
                {isLoading ? (
                    <div className="flex items-center justify-center gap-2 py-6 text-zinc-500 text-xs animate-pulse">
                        <div className="w-4 h-4 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                        Loading availability…
                    </div>
                ) : dates.length === 0 ? (
                    <p className="text-center text-xs text-zinc-500 italic py-4">
                        No upcoming order dates available right now. Check back soon!
                    </p>
                ) : (
                    dates.map((dateItem) => {
                        const status = STATUS[dateItem.status] ?? STATUS.closed;
                        const isOpen = dateItem.status === 'open';
                        const isExpanded = expandedId === dateItem.id;

                        return (
                            <div key={dateItem.id} className={`rounded-xl border overflow-hidden transition-all duration-300
                                ${isOpen ? 'border-brand/20 bg-brand/[0.03]' : 'border-white/[0.06] bg-white/[0.02]'}`}
                            >
                                {/* Date row — clickable only when open */}
                                <button
                                    type="button"
                                    onClick={() => isOpen && setExpandedId(isExpanded ? null : dateItem.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all
                                        ${isOpen ? 'cursor-pointer hover:bg-brand/5' : 'cursor-default'}`}
                                >
                                    <FaCircle className={`${status.dot} size-2 shrink-0 rounded-full`} size={6} />

                                    <div className="flex-1 min-w-0">
                                        <p className={`text-xs font-bold truncate ${isOpen ? 'text-white' : 'text-zinc-500'}`}>
                                            {dateItem.day_name}
                                        </p>
                                        <p className="text-[10px] text-zinc-500">{dateItem.short_date}</p>
                                    </div>

                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 ${status.badge}`}>
                                        {status.label}
                                    </span>

                                    {isOpen && (
                                        <div className="text-zinc-500 shrink-0">
                                            {isExpanded ? <FaChevronUp size={9} /> : <FaChevronDown size={9} />}
                                        </div>
                                    )}
                                </button>

                                {/* Expanded slots */}
                                {isOpen && isExpanded && (
                                    <div className="px-3 pb-3 border-t border-brand/10">
                                        <DateSlots dateId={dateItem.id} />
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default AvailabilityPanel;
