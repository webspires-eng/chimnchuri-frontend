"use client"

import { login } from "../../../../lib/api";
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import Image from 'next/image';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/store/features/authSlice';
import { useRouter } from "next/navigation";

const LoginPage = () => {

    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const mutation = useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            dispatch(setCredentials(data.data));
            router.push("/categories/1");
        },
        onError: (error) => {
            console.log(error);
        },
    });

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        mutation.mutate(data);
    }

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand/10 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-brand/5 blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand/[0.03] blur-3xl" />
            </div>

            <div className="max-w-md w-full relative z-10">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <Link href="/">
                        <Image src="/logo-light.png" alt="Chim 'N' Churri" width={120} height={72} className="drop-shadow-lg" />
                    </Link>
                </div>

                {/* Card */}
                <div className="bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/20">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                            Welcome Back
                        </h1>
                        <p className="text-zinc-400 text-sm">
                            Sign in to continue ordering delicious food
                        </p>
                    </div>

                    {/* Error message */}
                    {mutation.isError && (
                        <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                            Invalid email or password. Please try again.
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FaEnvelope className="text-zinc-500 group-focus-within:text-brand transition-colors duration-300" size={14} />
                                </div>
                                <input
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: { value: /^\S+@\S+$/, message: "Invalid email address" }
                                    })}
                                    type="email"
                                    placeholder="you@example.com"
                                    className={`w-full pl-11 pr-4 py-3.5 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-zinc-500 text-sm
                                        focus:outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20 focus:bg-white/[0.08]
                                        transition-all duration-300 hover:border-white/20 ${errors.email ? "border-red-500" : ""}`}
                                />
                            </div>
                            {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>}
                        </div>

                        {/* Password Field */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-zinc-300">Password</label>
                                <Link href="/forgot-password" size={14} className="text-xs text-brand hover:text-green-400 transition-colors duration-300">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FaLock className="text-zinc-500 group-focus-within:text-brand transition-colors duration-300" size={14} />
                                </div>
                                <input
                                    {...register("password", {
                                        required: "Password is required"
                                    })}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className={`w-full pl-11 pr-12 py-3.5 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-zinc-500 text-sm
                                        focus:outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20 focus:bg-white/[0.08]
                                        transition-all duration-300 hover:border-white/20 ${errors.password ? "border-red-500" : ""}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors duration-300 cursor-pointer"
                                >
                                    {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                </button>
                            </div>
                            {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="group w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-brand hover:bg-green-700 active:bg-green-800 text-white font-semibold text-sm rounded-xl shadow-lg shadow-brand/20 hover:shadow-brand/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"

                        >
                            {mutation.isPending ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Sign In
                                    <FaArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="mt-8 flex items-center gap-4">
                        <div className="flex-1 h-px bg-white/10" />
                        <span className="text-xs text-zinc-500 uppercase tracking-wider">New here?</span>
                        <div className="flex-1 h-px bg-white/10" />
                    </div>

                    {/* Register Link */}
                    <div className="mt-6 text-center">
                        <Link
                            href="/register"
                            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-sm text-zinc-300
                                hover:border-brand/40 hover:text-white hover:bg-white/[0.03]
                                transition-all duration-300`}
                        >
                            Create an account
                            <FaArrowRight size={11} />
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <p className="mt-6 text-center text-xs text-zinc-600">
                    By signing in, you agree to our Terms of Service & Privacy Policy
                </p>
            </div>
        </div>
    )
}

export default LoginPage