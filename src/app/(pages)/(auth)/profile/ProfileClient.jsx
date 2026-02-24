"use client"
import React from 'react'
import { fetchProfile } from '../../../../lib/api';
import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/features/authSlice';
import { logoutApi } from "@/lib/api";
import { useRouter } from 'next/navigation';
import { FaUser, FaEnvelope, FaSignOutAlt, FaShoppingBag, FaArrowLeft, FaShieldAlt } from 'react-icons/fa';
import Link from 'next/link';
import Img from '@/app/_components/Img';

const ProfileClient = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    const { data, isLoading, error } = useQuery({
        queryKey: ['profile'],
        queryFn: fetchProfile,
    });

    const handleLogout = async () => {
        const res = await logoutApi();
        if (res.success) {
            dispatch(logout());
            router.push('/login');
        }
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen bg-[#141414] items-center justify-center">
                <div className="relative">
                    <div className="h-16 w-16 animate-spin rounded-full border-4 border-brand/20 border-t-brand"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <FaUser className="text-brand/40 animate-pulse" size={20} />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <main className="flex min-h-screen bg-[#141414] flex-col items-center justify-center p-6 text-center text-white">
                <div className="max-w-md w-full bg-white/[0.04] backdrop-blur-xl border border-white/10 p-8 rounded-3xl">
                    <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <FaShieldAlt size={32} className="text-red-400" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight mb-4">Session Expired</h1>
                    <p className="text-zinc-400 mb-8 leading-relaxed">Please sign in again to view your profile details.</p>
                    <Link href="/login" className="inline-flex items-center gap-2 bg-brand hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all shadow-lg shadow-brand/20">
                        Sign In
                    </Link>
                </div>
            </main>
        );
    }

    const userData = data?.data || data;

    return (
        <main className="min-h-screen bg-[#141414] py-8 px-4 sm:px-6 relative overflow-hidden text-white font-sans">
            {/* Background elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-brand/10 blur-3xl opacity-50" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-brand/5 blur-3xl opacity-30" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group">
                        <FaArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium">Back to Home</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="inline-flex cursor-pointer items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm font-bold"
                    >
                        <FaSignOutAlt size={14} />
                        Logout
                    </button>
                </div>

                <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-black/40">
                    {/* Profile Header */}
                    <div className="relative h-40 bg-gradient-to-br from-brand/20 via-[#1a1a1a] to-[#141414] border-b border-white/5">
                        <div className="absolute -bottom-12 left-8 sm:left-12">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-2xl bg-[#141414] border-4 border-[#1c1c1c] shadow-2xl flex items-center justify-center p-1 overflow-hidden">
                                    {
                                        userData?.image ? (
                                            <Img src={`${process.env.NEXT_PUBLIC_BASE_URL}/storage/${userData?.image}`} onError={(e) => e.target.remove()} className="w-full h-full object-cover rounded-2xl" />
                                        ) : (
                                            <div className="w-full h-full rounded-2xl bg-brand/10 flex items-center justify-center">
                                                <span className="text-4xl font-black text-brand">{userData?.name?.charAt(0).toUpperCase()}</span>
                                            </div>
                                        )
                                    }
                                </div>
                                <div className="absolute bottom-2 right-2 w-6 h-6 bg-brand rounded-full border-4 border-[#141414]" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-16 pb-8 px-8 sm:px-12">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                            <div>
                                <h1 className="text-2xl font-black tracking-tight mb-1">{userData?.name}</h1>
                                <p className="text-brand font-bold text-sm tracking-widest uppercase">Premium Customer</p>
                            </div>
                            <Link
                                href="/profile/edit"
                                className="inline-flex items-center justify-center gap-2 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-brand/40 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all group"
                            >
                                <FaUser size={14} className="text-brand group-hover:scale-110 transition-transform" />
                                Edit Profile
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Personal Info */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 mb-2">Account Information</h3>

                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                    <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center text-brand shrink-0">
                                        <FaEnvelope size={16} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-0.5">Email Address</p>
                                        <p className="text-sm font-bold text-zinc-200 truncate">{userData?.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                    <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center text-brand shrink-0">
                                        <FaShieldAlt size={16} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-0.5">Account Status</p>
                                        <p className="text-sm font-bold text-zinc-200">Verified & Active</p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions & More */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 mb-2">Activities</h3>

                                <Link
                                    href="/orders"
                                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-brand/40 transition-all group"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white transition-all shrink-0">
                                        <FaShoppingBag size={16} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-zinc-200">Order History</p>
                                        <p className="text-[10px] text-zinc-500 font-medium">View your past delicious orders</p>
                                    </div>
                                </Link>

                                <div className="p-6 rounded-2xl bg-brand/5 border border-brand/10 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
                                        <FaShoppingBag size={64} />
                                    </div>
                                    <h4 className="font-bold text-brand text-sm mb-1">Satisfy your cravings?</h4>
                                    <p className="text-zinc-400 text-xs mb-4">Start another fresh order with Chimnchurri.</p>
                                    <Link href="/" className="inline-flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-green-700 transition-colors shadow-lg shadow-brand/20">
                                        Order Now
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </main>
    )
}

export default ProfileClient
