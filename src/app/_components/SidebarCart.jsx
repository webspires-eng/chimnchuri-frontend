"use client"
import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaTimes, FaTrash, FaMinus, FaPlus, FaShoppingBag, FaArrowRight } from 'react-icons/fa'
import { toggleCart, removeFromCart, incrementQuantity, decrementQuantity } from '@/store/features/cartSlice'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Img from './Img'
import { useCurrency } from '../providers/SettingsProvider'
import { toast } from 'react-toastify'


const SidebarCart = () => {
    const dispatch = useDispatch()
    const router = useRouter()

    const { code, symbol, format } = useCurrency();

    const { items, totalItems, totalPrice, isCartOpen } = useSelector((state) => state.cartSlice)
    const sidebarRef = useRef(null)

    // Close sidebar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target) && isCartOpen) {
                dispatch(toggleCart(false))
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isCartOpen, dispatch])

    // Prevent body scroll when cart is open
    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isCartOpen])

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-400 ${isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                aria-hidden="true"
            />

            {/* Sidebar */}
            <div
                ref={sidebarRef}
                className={`fixed top-0 right-0 h-full w-full sm:w-[440px] bg-[#141414] border-l border-white/[0.06] z-50 shadow-2xl shadow-black/50 transform transition-transform duration-400 ease-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="flex flex-col h-full">

                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-brand/15 flex items-center justify-center">
                                <FaShoppingBag className="text-brand" size={15} />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-white">Your Order</h2>
                                <p className="text-[11px] text-zinc-400">{totalItems} {totalItems === 1 ? 'item' : 'items'}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => dispatch(toggleCart(false))}
                            className="size-9 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-zinc-400 hover:text-white flex items-center justify-center transition-all duration-300 cursor-pointer"
                        >
                            <FaTimes size={16} />
                        </button>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center space-y-5">
                                <div className="w-20 h-20 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                                    <FaShoppingBag size={32} className="text-zinc-500" />
                                </div>
                                <div>
                                    <p className="text-lg font-semibold text-white">Your cart is empty</p>
                                    <p className="text-sm text-zinc-400 mt-1">Looks like you haven&apos;t added anything yet.</p>
                                </div>
                                <button
                                    onClick={() => {
                                        dispatch(toggleCart(false))
                                        router.push('/categories/1')
                                    }}
                                    className="px-6 py-3 bg-brand hover:bg-green-700 text-white rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg shadow-brand/20 cursor-pointer"
                                >
                                    Start Ordering
                                </button>
                            </div>
                        ) : (
                            items.map((item) => (
                                <div key={item.id} className="rounded-2xl border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.05] transition-all duration-300 overflow-hidden">
                                    <div className="flex gap-3 p-3">
                                        {/* Item Image */}
                                        <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-zinc-800 relative">
                                            {item.image ? (
                                                <Img
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-zinc-500">
                                                    <FaShoppingBag size={20} />
                                                </div>
                                            )}
                                        </div>

                                        {/* Item Details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start gap-2">
                                                <h3 className="font-semibold text-sm text-white truncate">{item.name}</h3>
                                                <button
                                                    onClick={() => dispatch(removeFromCart(item.id))}
                                                    className="text-zinc-500 hover:text-red-400 transition-colors duration-300 p-1 shrink-0 cursor-pointer"
                                                >
                                                    <FaTrash size={12} />
                                                </button>
                                            </div>

                                            <p className="text-xs text-zinc-400 mt-0.5">
                                                <span className="text-zinc-400">Size:</span> {item.selectedSize.name}
                                            </p>

                                            {item.selectedAddons && item.selectedAddons.length > 0 && (
                                                <div className="mt-1.5 space-y-0.5">
                                                    {Object.entries(item.selectedAddons.reduce((acc, addon) => {
                                                        if (!acc[addon.category]) acc[addon.category] = [];
                                                        acc[addon.category].push(addon);
                                                        return acc;
                                                    }, {})).map(([category, addons]) => (
                                                        <div key={category} className="text-[11px]">
                                                            <span className="font-medium text-zinc-400">{category}:</span>
                                                            <div className="flex flex-col ml-2">
                                                                {addons.map((addon, idx) => {
                                                                    const addonPrice = parseFloat(addon.price) || parseFloat(addon.addon_item?.price) || 0;
                                                                    const addonQty = addon.qty || 1;
                                                                    return (
                                                                        <span key={`${addon.id}-${idx}`} className="text-zinc-400">
                                                                            + {addonQty > 1 ? `${addonQty}x ` : ''}{addon.name} <span className="text-zinc-500">({symbol} {(addonPrice * addonQty).toFixed(2)})</span>
                                                                        </span>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Bottom bar: quantity + price */}
                                    <div className="flex items-center justify-between px-3 py-2 bg-white/[0.02] border-t border-white/[0.04]">
                                        <div className="flex items-center bg-white/[0.05] border border-white/[0.08] rounded-lg">
                                            <button
                                                onClick={() => dispatch(decrementQuantity(item.id))}
                                                className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.06] rounded-l-lg transition-all duration-300 cursor-pointer"
                                            >
                                                <FaMinus size={9} />
                                            </button>
                                            <span className="w-8 text-center text-sm font-bold text-white select-none">{item.quantity}</span>
                                            <button
                                                onClick={() => {
                                                    const maxItems = process.env.NEXT_PUBLIC_MAX_CART_ITEMS ? parseInt(process.env.NEXT_PUBLIC_MAX_CART_ITEMS) : 5;
                                                    if (totalItems >= maxItems) {
                                                        toast.info(`Cart limit of ${maxItems} items reached. For larger orders, please contact our support.`, {
                                                            position: "top-center",
                                                            autoClose: 5000,
                                                            theme: "dark"
                                                        });
                                                        return;
                                                    }
                                                    dispatch(incrementQuantity(item.id))
                                                }}
                                                className={`w-8 h-8 flex items-center justify-center rounded-r-lg transition-all duration-300 cursor-pointer ${totalItems >= (process.env.NEXT_PUBLIC_MAX_CART_ITEMS ? parseInt(process.env.NEXT_PUBLIC_MAX_CART_ITEMS) : 5) ? 'text-zinc-600 bg-white/[0.02]' : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'}`}
                                            >
                                                <FaPlus size={9} />
                                            </button>


                                        </div>
                                        <span className="font-bold text-sm text-zinc-200">{symbol} {item.itemTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {items.length > 0 && (
                        <div className="border-t border-white/[0.06] p-5 space-y-4 bg-[#111] shrink-0">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm font-semibold text-zinc-300">
                                    <span>Subtotal</span>
                                    <span className='text-md'>{symbol} {totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-white text-lg">Total</span>
                                    <span className="font-bold text-zinc-100 text-lg">{symbol} {totalPrice.toFixed(2)}</span>
                                </div>
                            </div>

                            <Link
                                href="/checkout"
                                onClick={() => dispatch(toggleCart(false))}
                                className="group flex items-center justify-center gap-2 w-full py-3.5 bg-brand hover:bg-green-700 active:bg-green-800 text-white text-center font-bold text-sm rounded-xl transition-all duration-300 shadow-lg shadow-brand/20 hover:shadow-brand/30"
                            >
                                Proceed to Checkout
                                <FaArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default SidebarCart
