"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { usePathname } from "next/navigation";
import { toggleCart } from "@/store/features/cartSlice";
import { FaShoppingBag, FaArrowRight } from "react-icons/fa";
import { useSettings, useCurrency } from "../providers/SettingsProvider";

const CartReminder = () => {
    const dispatch = useDispatch();
    const pathname = usePathname();
    const { totalItems, totalPrice, isCartOpen } = useSelector((state) => state.cartSlice);
    const { symbol } = useCurrency();
    const [show, setShow] = useState(false);
    const [prevItems, setPrevItems] = useState(0);
    const [pulse, setPulse] = useState(false);

    useEffect(() => {
        if (totalItems > 0 && !isCartOpen) {
            setShow(true);
        } else {
            setShow(false);
        }

        // Trigger pulse animation when items increase
        if (totalItems > prevItems && totalItems > 0) {
            setPulse(true);
            const timeout = setTimeout(() => setPulse(false), 600);
            return () => clearTimeout(timeout);
        }
        setPrevItems(totalItems);
    }, [totalItems, isCartOpen]);

    const isHiddenPage = pathname === '/checkout';

    if (!show || isHiddenPage) return null;

    return (
        <div
            className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-[999] w-[calc(100%-1.5rem)] sm:w-[calc(100%-2rem)] max-w-md"
            style={{
                animation: "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
        >
            <button
                onClick={() => dispatch(toggleCart(true))}
                className={`w-full flex items-center shadow shadow-zinc-800/30 justify-between gap-3 sm:gap-4 hover:bg-zinc-800 bg-black text-white px-3.5 sm:px-5 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl shadow-2xl shadow-black/40 transition-all duration-300 cursor-pointer group ${pulse ? "scale-[1.03]" : "scale-100"}`}
            >
                <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="relative">
                        <FaShoppingBag size={15} className="sm:w-[18px] sm:h-[18px]" />
                        <span className="absolute -top-2 -right-2 sm:-top-2.5 sm:-right-2.5 size-4 sm:size-5 text-[8px] sm:text-[10px] font-black rounded-full bg-white text-brand flex items-center justify-center shadow-md">
                            {totalItems}
                        </span>
                    </div>
                    <span className="font-bold text-xs sm:text-sm">View Your Basket</span>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="font-bold text-xs sm:text-sm">{symbol} {totalPrice.toFixed(2)}</span>
                    <FaArrowRight size={10} className="sm:w-3 sm:h-3 group-hover:translate-x-1 transition-transform" />
                </div>
            </button>

            <style jsx>{`
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translate(-50%, 100%);
                    }
                    to {
                        opacity: 1;
                        transform: translate(-50%, 0);
                    }
                }
            `}</style>
        </div>
    );
};

export default CartReminder;
