"use client"

import React from 'react'
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchOrder } from '@/lib/api';
import { FaShoppingBag, FaArrowLeft, FaCalendarAlt, FaCreditCard, FaMapMarkerAlt, FaUser, FaEnvelope, FaPhoneAlt, FaCheckCircle, FaChevronLeft, FaStore, FaCar } from 'react-icons/fa';
import { MdOutlineDescription, MdOutlineAttachMoney } from 'react-icons/md';
import Img from '@/app/_components/Img';
import { useCurrency } from '@/app/providers/SettingsProvider';
import Link from 'next/link';

const OrderDetailClient = () => {
    const { id } = useParams();
    const router = useRouter();
    const { symbol } = useCurrency();

    const { data: orderResponse, isLoading, error } = useQuery({
        queryKey: ['order', id],
        queryFn: () => fetchOrder(id),
    });

    const order = orderResponse?.data;

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
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${colorClass}`}>
                    {status}
                </span>
            </>
        );
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen bg-[#141414] items-center justify-center">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-brand/20 border-t-brand"></div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <main className="flex min-h-screen bg-[#141414] flex-col items-center justify-center p-6 text-center text-white">
                <div className="max-w-md w-full bg-white/[0.04] backdrop-blur-xl border border-white/10 p-8 rounded-3xl">
                    <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-400">
                        <FaShoppingBag size={32} />
                    </div>
                    <h1 className="text-2xl font-black tracking-tight mb-4">Order Not Found</h1>
                    <p className="text-zinc-500 mb-8 text-sm">We couldn't retrieve the details for this order. It might not exist or you might not have access.</p>
                    <Link href="/orders" className="inline-flex items-center gap-2 bg-brand hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-black text-sm transition-all shadow-lg shadow-brand/20">
                        <FaArrowLeft />
                        Back to Orders
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#141414] py-6 sm:py-8 px-3 sm:px-6 relative overflow-hidden text-white font-sans">
            {/* Background elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-brand/10 blur-3xl opacity-50" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-brand/5 blur-3xl opacity-30" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <Link href="/orders" className="group inline-flex items-center gap-1.5 sm:gap-2 text-zinc-400 hover:text-white transition-colors">
                        <FaChevronLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs sm:text-sm font-medium">Back to Orders</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 sm:gap-8 items-start">
                    {/* Left Column: Order Header & Items */}
                    <div className="xl:col-span-8 space-y-4 sm:space-y-6">
                        {/* Summary Header */}
                        <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-2xl shadow-black/40">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="space-y-3 sm:space-y-4">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h1 className="text-base sm:text-xl font-black tracking-tight">Order #{order.order_number}</h1>
                                        <div className="flex gap-2">
                                            {getStatusBadge(order.order_status, 'Order')}
                                            {getStatusBadge(order.payment_status, 'Payment')}
                                        </div>
                                    </div>
                                    <p className="text-zinc-300 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                                        <FaCalendarAlt className="text-zinc-600" />
                                        Placed on {formatDate(order.created_at)}
                                    </p>
                                </div>
                                <div className="">
                                    <p className='text-[10px] sm:text-xs mb-1 sm:mb-2 text-zinc-400 capitalize'>Order Type: <span className='text-white'>{order?.order_type}</span></p>
                                    {order?.order_date && <p className='text-[10px] sm:text-xs mb-1 sm:mb-2 text-zinc-400'>Order Date: <span className='text-white font-semibold'>{new Date(order.order_date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}</span></p>}

                                    <div className="bg-brand/0 border border-brand/20 px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl text-center">
                                        <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-white/60 mb-0.5">Total Amount Paid</p>
                                        <p className="text-base sm:text-xl font-black text-white">{symbol} {order.grand_total}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
                            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-white/5 flex items-center justify-between">
                                <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 sm:gap-3">
                                    <FaShoppingBag className="text-brand" />
                                    Order Items
                                </h3>
                                <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-zinc-400">{order.items?.length || 0} Products</span>
                            </div>

                            <div className="divide-y divide-white/[0.05]">
                                {order.items?.map((item, idx) => (
                                    <div key={idx} className="p-3 sm:p-6 group hover:bg-white/[0.01] transition-all">
                                        <div className="flex gap-3 sm:gap-6">
                                            {/* Thumbnail */}
                                            <div className="h-14 w-14 sm:h-20 sm:w-20 shrink-0 bg-white/[0.03] border border-white/10 rounded-xl sm:rounded-2xl overflow-hidden relative shadow-inner">
                                                {item.item?.media?.[0]?.original_url ? (
                                                    <Img
                                                        src={item.item.media[0].original_url}
                                                        alt={item.item_name}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center text-zinc-700">
                                                        <FaShoppingBag size={32} />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                                    <div>
                                                        <h4 className="font-black text-white text-sm sm:text-lg mb-1 sm:mb-2 truncate capitalize group-hover:text-brand transition-colors">{item.item_name}</h4>
                                                        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                                                            <div className="bg-white/[0.05] px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-lg text-[9px] sm:text-[10px] font-bold capitalize tracking-widest text-zinc-400">
                                                                Size: <span className="text-zinc-200">{item.size_name}</span>
                                                            </div>
                                                            <div className="bg-white/[0.05] px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-lg text-[9px] sm:text-[10px] font-bold capitalize tracking-widest text-zinc-400">
                                                                Qty: <span className="text-zinc-200">{item.quantity}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm sm:text-lg font-black text-white">{symbol} {(item.quantity * item.price).toFixed(2)}</p>
                                                        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-400">{symbol} {item.price} each</p>
                                                    </div>
                                                </div>

                                                {/* Addons */}
                                                {item.addons && item.addons.length > 0 && (
                                                    <div className="mt-3 sm:mt-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-black/30 border border-white/5 space-y-2 sm:space-y-3">
                                                        {Object.entries(
                                                            item.addons.reduce((acc, addon) => {
                                                                (acc[addon.category_name] = acc[addon.category_name] || []).push(addon);
                                                                return acc;
                                                            }, {})
                                                        ).map(([categoryName, addons]) => (
                                                            <div key={categoryName}>
                                                                <p className="text-[9px] sm:text-[10px] font-black capitalize text-zinc-300 mb-1.5 sm:mb-2">{categoryName}</p>
                                                                <div className="space-y-1.5 sm:space-y-2 pl-3 sm:pl-4 border-l-2 border-brand/20">
                                                                    {addons.map((addon) => (
                                                                        <div key={addon.id} className="flex justify-between items-center text-[10px] sm:text-xs">
                                                                            <span className="text-zinc-300 font-bold flex items-center gap-2">
                                                                                <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                                                                                {addon.name}
                                                                            </span>
                                                                            <span className="text-zinc-300 font-black">
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
                                {order?.time_slots && order?.time_slots.length > 0 ? (
                                    order?.time_slots.map((slot) => (
                                        <div key={slot.id} className="flex justify-between items-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/5">
                                            <div className="space-y-0.5 sm:space-y-1">
                                                <p className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Time Window</p>
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

                        {order.order_instruction && (
                            <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-white/5">
                                <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-zinc-400 mb-1 sm:mb-2">Order Instructions</p>
                                <p className="text-xs sm:text-sm text-zinc-400 font-medium leading-relaxed bg-black/20 p-2.5 sm:p-3 rounded-lg sm:rounded-xl border border-white/5">
                                    "{order.order_instruction}"
                                </p>
                            </div>
                        )}

                    </div>

                    {/* Right Column: Totals & Delivery */}
                    <div className="xl:col-span-4 space-y-5 sm:space-y-8">
                        {/* Payment Breakdown */}
                        <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
                            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-white/5">
                                <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 sm:gap-3">
                                    <MdOutlineDescription className="text-brand" />
                                    Order Summary
                                </h3>
                            </div>
                            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                                <div className="flex justify-between items-center text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                                    <span className="text-zinc-500">Subtotal</span>
                                    <span className="text-zinc-200">{symbol} {order.sub_total}</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                                    <span className="text-zinc-500">Delivery Fee</span>
                                    <span className="text-zinc-200">{symbol} {order.delivery_charges || 0}</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] sm:text-xs font-bold uppercase tracking-widest text-green-500/80">
                                    <span>Discount</span>
                                    <span>- {symbol} {order.discount_total || 0}</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                                    <span className="text-zinc-500">Tax</span>
                                    <span className="text-zinc-200">{symbol} {order.tax_total || 0}</span>
                                </div>
                                <div className="pt-3 sm:pt-4 border-t border-white/10 flex justify-between items-center">
                                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-white">Grand Total</span>
                                    <span className="text-xl sm:text-2xl font-black text-white tracking-tight animate-pulse">{symbol} {order.grand_total}</span>
                                </div>
                            </div>

                            <div className="mx-4 sm:mx-6 mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-3 sm:gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-brand/10 flex items-center justify-center text-brand shrink-0">
                                    {order.payment_method === 'cod' ? <MdOutlineAttachMoney size={20} /> : <FaCreditCard size={16} />}
                                </div>
                                <div className="flex-1">
                                    <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-0.5">Paid Using</p>
                                    <div className="flex items-center justify-between">
                                        <p className="font-bold text-xs sm:text-sm text-zinc-300 capitalize">{order.payment_method === 'cod' ? (order.order_type === 'collection' ? 'Pay on Collection' : 'Cash On Delivery') : order.payment_method}</p>
                                        {order.payment_status === 'paid' && <FaCheckCircle className="text-green-500" size={12} />}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Delivery / Collection Info */}
                        <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl shadow-black/40">
                            <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 border-b border-white/5 pb-3 sm:pb-4">
                                {order.order_type === 'collection' ? <FaStore className="text-brand" /> : <FaMapMarkerAlt className="text-brand" />}
                                {order.order_type === 'collection' ? 'Collection Details' : 'Delivery Details'}
                            </h3>

                            <div className="space-y-4 sm:space-y-6">
                                <div className="flex gap-3 sm:gap-4">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand font-black text-sm sm:text-lg shrink-0">
                                        {order.customer_name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-black text-white text-sm sm:text-base mb-0.5 sm:mb-1 truncate">{order.customer_name}</p>
                                        <div className="space-y-0.5 sm:space-y-1">
                                            <p className="text-[10px] sm:text-xs font-bold text-zinc-300 flex items-center gap-1.5 sm:gap-2 truncate">
                                                <FaEnvelope className="text-brand" size={9} />
                                                {order.customer_email}
                                            </p>
                                            <p className="text-[10px] sm:text-xs font-bold text-zinc-300 flex items-center gap-1.5 sm:gap-2">
                                                <FaPhoneAlt className="text-brand" size={9} />
                                                {order.customer_phone}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {order.order_type === 'collection' ? (
                                    <>
                                        <div className="pt-6 border-t border-white/5">
                                            <div className="flex items-start gap-4">
                                                <div className="w-6 h-6 bg-brand/10 rounded-full flex items-center justify-center shrink-0 mt-0.5 border border-brand/20">
                                                    <FaStore className="text-brand" size={10} />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Pickup Address</p>
                                                    <p className="text-sm text-zinc-300 font-bold leading-relaxed">{order.pickup_address || 'Contact store for pickup details.'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {order.car_registration && (
                                            <div className="pt-4 border-t border-white/5">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-6 h-6 bg-brand/10 rounded-full flex items-center justify-center shrink-0 mt-0.5 border border-brand/20">
                                                        <FaCar className="text-brand" size={10} />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Car Registration</p>
                                                        <p className="text-sm text-zinc-300 font-bold leading-relaxed uppercase tracking-wider">{order.car_registration}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <div className="pt-6 border-t border-white/5">
                                            <div className="flex items-start gap-3 sm:gap-4">
                                                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-brand/10 rounded-full flex items-center justify-center shrink-0 mt-0.5 border border-brand/20">
                                                    <FaMapMarkerAlt className="text-brand" size={9} />
                                                </div>
                                                <div className="space-y-0.5 sm:space-y-1">
                                                    <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-zinc-400">Shipping Address</p>
                                                    <p className="text-xs sm:text-sm text-zinc-300 font-bold leading-relaxed">{order.delivery_address}, {order.city}, {order.postal_code} </p>
                                                </div>
                                            </div>
                                        </div>


                                    </>
                                )}
                            </div>
                        </div>

                        <Link
                            href="/"
                            className="w-full flex items-center justify-center gap-2 sm:gap-3 bg-brand hover:bg-green-700 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm transition-all shadow-xl shadow-brand/20 group"
                        >
                            Order More Deliciousness
                            <FaShoppingBag size={12} className="group-hover:rotate-12 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default OrderDetailClient
