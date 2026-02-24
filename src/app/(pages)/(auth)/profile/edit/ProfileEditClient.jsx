"use client"

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchProfile, updateProfile } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCity, FaPostbox, FaCamera, FaArrowLeft, FaSave, FaSpinner } from 'react-icons/fa';
import Link from 'next/link';
import { toast } from 'react-toastify';

const ProfileEditClient = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [previewImage, setPreviewImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const { data: profileData, isLoading: profileLoading } = useQuery({
        queryKey: ['profile'],
        queryFn: fetchProfile,
    });

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        const user = profileData?.data || profileData;
        if (user && user.email) {
            reset({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                street_address: user.street_address || '',
                city: user.city || '',
                postal_code: user.postal_code || '',
            });
            if (user.image) {
                setPreviewImage(`${process.env.NEXT_PUBLIC_BASE_URL}/storage/${user.image}`);
            }
        }
    }, [profileData, reset]);

    const mutation = useMutation({
        mutationFn: updateProfile,
        onSuccess: () => {
            toast.success("Profile updated successfully");
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            router.push('/profile');
        },
        onError: (error) => {
            toast.error(error.message || "Failed to update profile");
        }
    });

    const onImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = (data) => {
        const submissionData = { ...data };
        if (selectedFile) {
            submissionData.image = selectedFile;
        }
        mutation.mutate(submissionData);
    };

    const InputField = ({ icon: Icon, label, name, type = "text", placeholder, validation = {} }) => (
        <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">{label}</label>
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Icon className="text-zinc-500 group-focus-within:text-brand transition-colors duration-300" size={14} />
                </div>
                <input
                    {...register(name, validation)}
                    type={type}
                    placeholder={placeholder}
                    className={`w-full pl-11 pr-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder-zinc-600 text-sm
                        focus:outline-none focus:border-brand/60 focus:ring-4 focus:ring-brand/10 focus:bg-white/[0.08]
                        transition-all duration-300 hover:border-white/20 ${errors[name] ? "border-red-500/50 ring-4 ring-red-500/10" : ""}`}
                />
            </div>
            {errors[name] && <p className="mt-1.5 text-[10px] font-bold text-red-400 uppercase tracking-wider">{errors[name].message}</p>}
        </div>
    );

    if (profileLoading) {
        return (
            <div className="flex min-h-screen bg-[#141414] items-center justify-center">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-brand/20 border-t-brand"></div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#141414] py-8 px-4 sm:px-6 relative overflow-hidden text-white font-sans">
            {/* Background elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-brand/10 blur-3xl opacity-50" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-brand/5 blur-3xl opacity-30" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <Link href="/profile" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group">
                        <FaArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium">Back to Profile</span>
                    </Link>
                </div>

                <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-black/40">
                    <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8" encType='multipart/formData'>
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Left Side: Avatar Upload */}
                            <div className="flex flex-col items-center space-y-4">
                                <div className="relative group">
                                    <div className="w-32 h-32 rounded-3xl bg-[#1c1c1c] border-4 border-white/5 overflow-hidden shadow-2xl flex items-center justify-center">
                                        {previewImage ? (
                                            <img src={previewImage} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <FaUser className="text-zinc-700" size={64} />
                                        )}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                            <FaCamera className="text-white" size={32} />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                onChange={onImageChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-brand rounded-xl flex items-center justify-center shadow-lg border-4 border-[#141414]">
                                        <FaCamera className="text-white" size={16} />
                                    </div>
                                </div>
                                <div className="text-center">
                                    <h4 className="text-sm font-black uppercase tracking-widest text-zinc-500 mb-1">Profile Photo</h4>
                                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-tighter">JPG, PNG or GIF • Max 2MB</p>
                                </div>
                            </div>

                            {/* Right Side: Form Fields */}
                            <div className="flex-1 space-y-6">
                                <div>
                                    <h2 className="text-2xl font-black tracking-tight mb-1">Edit Profile</h2>
                                    <p className="text-zinc-500 text-sm">Update your personal information and delivery details.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField
                                        icon={FaUser}
                                        label="Full Name"
                                        name="name"
                                        placeholder="John Doe"
                                        validation={{ required: "Name is required" }}
                                    />
                                    <InputField
                                        icon={FaEnvelope}
                                        label="Email Address"
                                        name="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        validation={{
                                            required: "Email is required",
                                            pattern: { value: /^\S+@\S+$/, message: "Invalid email" }
                                        }}
                                    />
                                    <InputField
                                        icon={FaPhone}
                                        label="Phone Number"
                                        name="phone"
                                        type="tel"
                                        placeholder="+92 300 1234567"
                                        validation={{ required: "Phone is required" }}
                                    />
                                    <InputField
                                        icon={FaCity}
                                        label="City"
                                        name="city"
                                        placeholder="Lahore"
                                        validation={{ required: "City is required" }}
                                    />
                                    <div className="md:col-span-2">
                                        <InputField
                                            icon={FaMapMarkerAlt}
                                            label="Street Address"
                                            name="street_address"
                                            placeholder="123 Food Street, Block A"
                                            validation={{ required: "Address is required" }}
                                        />
                                    </div>
                                    <InputField
                                        icon={FaMapMarkerAlt} // Changed from FaPostbox as it might not exist in fa-icons
                                        label="Postal Code"
                                        name="postal_code"
                                        placeholder="54000"
                                    />
                                </div>

                                <div className="pt-4 border-t border-white/5 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={mutation.isPending}
                                        className="group flex items-center gap-3 bg-brand hover:bg-green-700 text-white px-8 py-4 rounded-2xl font-black text-sm transition-all shadow-xl shadow-brand/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        {mutation.isPending ? (
                                            <FaSpinner className="animate-spin" />
                                        ) : (
                                            <FaSave />
                                        )}
                                        {mutation.isPending ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    )
}

export default ProfileEditClient
