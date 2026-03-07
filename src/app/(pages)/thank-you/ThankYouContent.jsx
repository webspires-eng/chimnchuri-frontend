'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FaCheckCircle, FaCreditCard, FaMapMarkerAlt, FaPhoneAlt, FaUser, FaShoppingBag, FaArrowLeft, FaEnvelope, FaStore, FaCar } from 'react-icons/fa';
import { MdOutlineLocalShipping, MdOutlineDescription, MdOutlineAttachMoney, MdOutlineDiscount } from 'react-icons/md';
import Img from '@/app/_components/Img';
import { useQuery } from '@tanstack/react-query';
import { fetchOrder } from '@/lib/api';
import { useCurrency } from '@/app/providers/SettingsProvider';

const ThankYouContent = () => {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('id');

    const { code, symbol, format } = useCurrency();

    const { data, isLoading, error } = useQuery({
        queryKey: ["order", orderId],
        queryFn: () => fetchOrder(orderId),
    })
    let loading = isLoading;

    const order = data?.data;


    if (loading) {
        return (
            <div className="flex min-h-screen bg-[#141414] items-center justify-center">
                <div className="relative">
                    <div className="h-16 w-16 animate-spin rounded-full border-4 border-brand/20 border-t-brand"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <FaShoppingBag className="text-brand/40 animate-pulse" size={20} />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <main className="flex min-h-screen bg-[#141414] flex-col items-center justify-center p-6 text-center text-white">
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-red-500/10 blur-3xl opacity-50" />
                </div>
                <div className="max-w-md w-full relative z-10 bg-white/[0.04] backdrop-blur-xl border border-white/10 p-8 rounded-3xl">
                    <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <FaShoppingBag size={32} className="text-red-400" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight mb-4">
                        Order Not Found
                    </h1>
                    <p className="text-zinc-400 mb-8 leading-relaxed">
                        Wait... we couldn&apos;t find your order details. Please check the URL or contact our support team.
                    </p>
                    <Link href="/" className="inline-flex items-center gap-2 bg-white/[0.05] hover:bg-white/[0.1] text-white px-6 py-3 rounded-2xl font-semibold transition-all border border-white/10 group">
                        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        Go Back Home
                    </Link>
                </div>
            </main>
        );
    }

    const {
        order_number,
        payment_status,
        order_status,
        created_at,
        items,
        sub_total,
        discount_total,
        delivery_charges,
        tax_total,
        grand_total,
        customer_name,
        customer_email,
        customer_phone,
        delivery_address,
        city,
        postal_code,
        payment_method,
        time_slots,
        order_type,
        car_registration,
        order_date
    } = order;

    const isDelivery = order_type !== 'collection';

    const getStatusBadge = (status, label) => {
        const statusColors = {
            paid: 'bg-green-500/10 text-green-400 border-green-500/20',
            unpaid: 'bg-red-500/10 text-red-400 border-red-500/20',
            pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
            confirmed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
            processing: 'bg-brand/10 text-brand border-brand/20',
            shipped: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
            completed: 'bg-green-500/10 text-green-400 border-green-500/20',
            cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
        };
        const colorClass = statusColors[status] || 'bg-white/10 text-zinc-400 border-white/10';
        return (
            <>
                <span className='text-sm text-zinc-400'>{label}: </span>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${colorClass}`}>
                    {status}
                </span>
            </>
        );
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <main className="min-h-screen bg-[#141414] py-8 sm:py-12 px-4 sm:px-6 relative overflow-hidden text-white font-sans">
            {/* Background elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-brand/10 blur-3xl opacity-50" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-brand/5 blur-3xl opacity-30" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-6 sm:mb-10">
                    <div className="space-y-1.5 sm:space-y-2">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-brand/20 flex items-center justify-center">
                                <FaCheckCircle className="text-brand" size={16} />
                            </div>
                            <h1 className="text-lg sm:text-2xl md:text-3xl font-bold tracking-tight">Thank You for Your Order!</h1>
                        </div>
                        <p className="text-zinc-300 text-xs sm:text-sm pl-10 sm:pl-[52px]">Your order has been received and is being processed.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 sm:gap-8 items-start">
                    {/* Left Column (Order Details) */}
                    <div className="xl:col-span-8 space-y-4 sm:space-y-6">
                        {/* Order Header Card */}
                        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                                <div className="space-y-0.5 sm:space-y-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h2 className="text-sm sm:text-lg font-bold text-white tracking-tight">Order #{order_number}</h2>
                                        <div className="flex gap-2">
                                            {getStatusBadge(payment_status, 'Payment')}
                                            {getStatusBadge(order_status, 'Order')}
                                        </div>
                                    </div>
                                    <p className="text-zinc-400 text-[10px] sm:text-xs">
                                        Placed on {formatDate(created_at)}
                                    </p>
                                </div>
                                <div className="">
                                    <p className='text-[10px] sm:text-xs mb-1 sm:mb-2 text-zinc-400 capitalize'>Order Type: <span className='text-white'>{order_type}</span></p>
                                    {order_date && <p className='text-[10px] sm:text-xs mb-1 sm:mb-2 text-zinc-400'>Order Date: <span className='text-white font-semibold'>{new Date(order_date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}</span></p>}
                                    <div className="text-xs sm:text-sm font-bold w-fit text-white/90 bg-brand/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-brand/20">
                                        Total: {symbol} {grand_total}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Product List */}
                        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-3xl overflow-hidden shadow-2xl">
                            <div className="px-4 sm:px-6 py-3 sm:py-5 border-b border-white/5 flex items-center justify-between">
                                <h3 className="font-bold text-xs sm:text-base flex items-center gap-2">
                                    <FaShoppingBag className="text-brand" size={14} />
                                    Order Items
                                </h3>
                                <span className="text-[10px] sm:text-xs text-zinc-400 font-medium">{items.length} Items</span>
                            </div>

                            <div className="divide-y divide-white/[0.05]">
                                {items.map((item, idx) => (
                                    <div key={item.id} className="p-3 sm:p-6 transition-all group">
                                        <div className="flex gap-3 sm:gap-6">
                                            {/* Thumbnail */}
                                            <div className="h-12 w-12 sm:h-20 sm:w-20 shrink-0 bg-white/[0.03] border border-white/10 rounded-xl sm:rounded-2xl overflow-hidden relative">
                                                {item.item?.media?.[0]?.original_url ? (
                                                    <Img
                                                        src={item.item.media[0].original_url}
                                                        alt={item.item_name}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center text-zinc-600">
                                                        <FaShoppingBag size={24} />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                                                    <div>
                                                        <h4 className="font-bold text-white text-xs sm:text-base mb-0.5 sm:mb-1 truncate capitalize">{item.item_name}</h4>
                                                        <div className="flex items-center gap-2 sm:gap-3">
                                                            <span className="text-[10px] sm:text-xs text-zinc-400">Size: <span className="text-zinc-300 capitalize">{item.size_name}</span></span>
                                                            <span className="text-[10px] sm:text-xs text-zinc-400">Qty: <span className="text-zinc-300">{item.quantity}</span></span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs sm:text-sm font-bold text-white">{symbol} {(item.quantity * item.price).toFixed(2)}</p>
                                                        <p className="text-[9px] sm:text-[11px] text-zinc-400">{symbol} {item.price} each</p>
                                                    </div>
                                                </div>

                                                {/* Addons */}
                                                {item.addons && item.addons.length > 0 && (
                                                    <div className="mt-2.5 sm:mt-4 p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-black/20 border border-white/5 space-y-2 sm:space-y-3">
                                                        {Object.entries(
                                                            item.addons.reduce((acc, addon) => {
                                                                (acc[addon.category_name] = acc[addon.category_name] || []).push(addon);
                                                                return acc;
                                                            }, {})
                                                        ).map(([categoryName, addons]) => (
                                                            <div key={categoryName}>
                                                                <p className="font-semibold capitalize text-xs sm:text-md text-zinc-200 mb-1 sm:mb-1.5">{categoryName}</p>
                                                                <div className="space-y-1 sm:space-y-1.5 pl-2 border-l border-white/5">
                                                                    {addons.map((addon) => (
                                                                        <div key={addon.id} className="flex justify-between items-center text-[10px] sm:text-xs">
                                                                            <span className="text-zinc-200 text-[10px] sm:text-[12px] flex items-center gap-1.5 sm:gap-2">
                                                                                <span className="w-1 h-1 rounded-full bg-brand/40" />
                                                                                {addon.name}
                                                                            </span>
                                                                            <span className="text-zinc-400 font-medium">
                                                                                {addon.quantity} × {symbol} {addon.price}
                                                                            </span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {items.length === 0 && (
                                    <div className="p-12 text-center text-zinc-400 italic text-sm">
                                        No items recorded for this order.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* time slots */}
                        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-3xl overflow-hidden shadow-2xl">
                            <div className="px-4 sm:px-6 py-3 sm:py-5 border-b border-white/5">
                                <h3 className="font-bold text-xs sm:text-base flex items-center gap-2">
                                    <MdOutlineDescription className="text-brand" size={16} />
                                    Time Slots
                                </h3>
                            </div>
                            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                                {time_slots && time_slots.length > 0 ? (
                                    time_slots.map((slot) => (
                                        <div key={slot.id} className="flex justify-between items-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/5">
                                            <div className="space-y-0.5 sm:space-y-1">
                                                <p className="text-[9px] sm:text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Time Window</p>
                                                <p className="text-xs sm:text-sm font-medium text-zinc-200">
                                                    {slot.start_time}
                                                </p>
                                            </div>
                                            <div className="text-right space-y-0.5 sm:space-y-1">
                                                <p className="text-[9px] sm:text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Capacity</p>
                                                <span className="inline-flex items-center text-xs sm:text-[14px] font-bold text-white">
                                                    {slot.capacity}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-4 text-zinc-500 text-sm italic">
                                        No time slots assigned.
                                    </div>
                                )}
                            </div>
                        </div>

                        {order?.order_instruction && (
                            <div className="pt-3 sm:pt-4 mt-1.5 sm:mt-2 border-t border-white/5">
                                <p className="text-xs sm:text-sm font-bold uppercase tracking-widest mb-0.5 sm:mb-1">Order Instructions</p>
                                <p className="text-xs sm:text-sm text-zinc-400 font-medium leading-relaxed bg-black/20 p-2.5 sm:p-3 rounded-lg sm:rounded-xl border border-white/5">
                                    "{order.order_instruction}"
                                </p>
                            </div>
                        )}

                    </div>

                    {/* Right Column (Sidebar) */}
                    <div className="xl:col-span-4 space-y-4 sm:space-y-6">
                        {/* Summary Card */}
                        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-3xl overflow-hidden shadow-2xl">
                            <div className="px-4 sm:px-6 py-3 sm:py-5 border-b border-white/5">
                                <h3 className="font-bold text-xs sm:text-base flex items-center gap-2">
                                    <MdOutlineDescription className="text-brand" />
                                    Payment Summary
                                </h3>
                            </div>
                            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                                <div className="flex justify-between items-center text-xs sm:text-sm">
                                    <span className="text-zinc-400">Subtotal</span>
                                    <span className="font-medium text-zinc-200">{symbol} {sub_total}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs sm:text-sm">
                                    <span className="text-zinc-400">Discount</span>
                                    <span className="font-medium text-green-500">- {symbol} {discount_total || 0}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs sm:text-sm">
                                    <span className="text-zinc-400">Delivery Charge</span>
                                    <span className="font-medium text-zinc-200">{symbol} {delivery_charges || 0}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs sm:text-sm pb-1 sm:pb-2">
                                    <span className="text-zinc-400">Service Tax</span>
                                    <span className="font-medium text-zinc-200">{symbol} {tax_total || 0}</span>
                                </div>
                                <div className="pt-3 sm:pt-4 border-t border-white/10 flex justify-between items-center">
                                    <span className="font-bold text-sm sm:text-base text-white">Grand Total</span>
                                    <span className="text-xl sm:text-2xl font-black text-white/90 tracking-tight">{symbol} {grand_total}</span>
                                </div>
                            </div>

                            {/* Payment Method Block */}
                            <div className="mx-4 sm:mx-6 mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/5">
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="size-8 sm:size-10 rounded-lg sm:rounded-xl bg-white/[0.05] flex items-center justify-center text-brand">
                                        {payment_method === 'cod' ? <MdOutlineAttachMoney size={18} /> : <FaCreditCard size={14} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-0.5">Payment via</p>
                                        <div className="flex items-center justify-between">
                                            <p className="font-bold text-xs sm:text-sm text-zinc-200 capitalize">
                                                {payment_method === 'cod' ? (order_type === 'collection' ? 'Pay on Collection' : 'Cash On Delivery') : payment_method}
                                            </p>
                                            {payment_status === 'paid' && <FaCheckCircle className="text-green-500" size={12} />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Customer Info */}
                        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl">
                            <h3 className="font-bold text-xs sm:text-base mb-4 sm:mb-6 flex items-center gap-2 border-b border-white/5 pb-3 sm:pb-4">
                                {isDelivery ? <FaUser className="text-brand" size={13} /> : <FaStore className="text-brand" size={13} />}
                                {isDelivery ? 'Delivery Details' : 'Collection Details'}
                            </h3>

                            <div className="space-y-4 sm:space-y-6">
                                <div className="flex gap-3 sm:gap-4">
                                    <div className="size-8 sm:size-10 rounded-full bg-white/[0.05] flex items-center justify-center shrink-0 border border-white/5">
                                        <span className="text-brand text-xs sm:text-md font-black">{customer_name?.charAt(0)}</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-zinc-200 text-xs sm:text-sm">{customer_name}</p>
                                        <p className="text-[10px] sm:text-xs text-zinc-100 mt-0.5 sm:mt-1 flex items-center gap-1 sm:gap-1.5 opacity-80">
                                            <FaEnvelope size={9} className="text-brand" />
                                            {customer_email}
                                        </p>
                                        <p className="text-[10px] sm:text-xs text-zinc-100 mt-0.5 sm:mt-1 flex items-center gap-1 sm:gap-1.5 opacity-80">
                                            <FaPhoneAlt size={9} className="text-brand" />
                                            {customer_phone}
                                        </p>
                                    </div>
                                </div>

                                {isDelivery ? (
                                    <>
                                        <div className="pt-6 border-t border-white/5 relative">
                                            <div className="flex items-start gap-3">
                                                <div className="w-5 h-5 bg-brand/10 rounded-full flex items-center justify-center shrink-0 mt-0.5 border border-brand/20">
                                                    <FaMapMarkerAlt className="text-brand" size={10} />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-brand">Shipping Address</p>
                                                    <p className="text-sm text-zinc-300 leading-relaxed font-medium">{delivery_address}, {city}, {postal_code}</p>
                                                </div>
                                            </div>
                                        </div>


                                    </>
                                ) : (
                                    <>
                                        <div className="pt-6 border-t border-white/5 relative">
                                            <div className="flex items-start gap-3">
                                                <div className="w-5 h-5 bg-brand/10 rounded-full flex items-center justify-center shrink-0 mt-0.5 border border-brand/20">
                                                    <FaStore className="text-brand" size={10} />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[12px] font-bold uppercase tracking-widest text-zinc-400">Pickup Address</p>
                                                    <p className="text-sm text-zinc-300 leading-relaxed font-medium">{order?.pickup_address || 'Contact store for pickup details.'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {car_registration && (
                                            <div className="pt-4 border-t border-white/5 relative">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-5 h-5 bg-brand/10 rounded-full flex items-center justify-center shrink-0 mt-0.5 border border-brand/20">
                                                        <FaCar className="text-brand" size={10} />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[12px] font-bold uppercase tracking-widest text-zinc-400">Car Registration</p>
                                                        <p className="text-sm text-zinc-300 leading-relaxed font-bold uppercase tracking-wider">{car_registration}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-1 gap-3 pt-1 sm:pt-2">
                            <Link href="/" className="group flex items-center justify-center gap-2 bg-brand hover:bg-green-700 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-base transition-all shadow-xl">
                                Continue Shopping
                                <FaShoppingBag className="group-hover:translate-x-1 transition-transform" size={12} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

// export default ThankYouContent;

export default function ThankYouPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ThankYouContent />
        </Suspense>
    )
}