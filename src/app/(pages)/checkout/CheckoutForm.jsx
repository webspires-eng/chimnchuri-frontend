"use client";

import React, { forwardRef, useImperativeHandle, useState, useEffect, useRef } from "react";
import {
    useStripe,
    useElements,
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
    PaymentRequestButtonElement
} from "@stripe/react-stripe-js";
import { useSelector } from "react-redux";
import { createOrder } from "@/lib/api";
import { toast } from "react-toastify";
import { FaCreditCard } from "react-icons/fa";

const CheckoutForm = forwardRef(({ amount, getFormData, onSuccess, onCardToggle }, ref) => {
    const stripe = useStripe();
    const elements = useElements();
    const { items, totalPrice } = useSelector((state) => state.cartSlice);

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [paymentRequest, setPaymentRequest] = useState(null);
    const [prAvailable, setPrAvailable] = useState(false);
    const [showCardFields, setShowCardFields] = useState(false);

    // Use refs to always hold the latest props — prevents stale closure bug
    const getFormDataRef = useRef(getFormData);
    const onSuccessRef = useRef(onSuccess);

    useEffect(() => { getFormDataRef.current = getFormData; }, [getFormData]);
    useEffect(() => { onSuccessRef.current = onSuccess; }, [onSuccess]);

    // Initialize Payment Request (Google Pay / Apple Pay)
    useEffect(() => {
        if (!stripe || !amount) return;

        // ✅ FIX: Reset both states before creating a new PaymentRequest
        // This prevents rendering the button before canMakePayment() resolves
        setPrAvailable(false);
        setPaymentRequest(null);

        const pr = stripe.paymentRequest({
            country: "GB",
            currency: "gbp",
            total: {
                label: "Order Total",
                amount: Math.round(amount * 100),
            },
            requestPayerName: true,
            requestPayerEmail: true,
        });

        // Handle GPay / Apple Pay payment — register event BEFORE canMakePayment
        pr.on("paymentmethod", async (ev) => {
            try {
                const formData = getFormDataRef.current?.();
                if (!formData) {
                    ev.complete("fail");
                    return;
                }

                // 1. Create order + PaymentIntent on server
                let response;
                try {
                    response = await createOrder({
                        ...formData,
                        items: items,
                        amount: totalPrice,
                    });
                } catch (apiError) {
                    ev.complete("fail");
                    setMessage(apiError?.message || "Failed to create order. Please try again.");
                    toast.error(apiError?.message || "Failed to create order.");
                    return;
                }

                if (!response?.clientSecret) {
                    ev.complete("fail");
                    setMessage("Failed to create payment. Please try again.");
                    return;
                }

                // 2. Confirm the payment
                const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
                    response.clientSecret,
                    { payment_method: ev.paymentMethod.id },
                    { handleActions: false }
                );

                if (confirmError) {
                    ev.complete("fail");
                    setMessage(confirmError.message);
                    return;
                }

                // 3. Handle 3DS if needed
                if (paymentIntent.status === "requires_action") {
                    const { error: actionError } = await stripe.confirmCardPayment(response.clientSecret);
                    if (actionError) {
                        ev.complete("fail");
                        setMessage(actionError.message);
                        return;
                    }
                }

                ev.complete("success");
                onSuccessRef.current?.(response);
            } catch (err) {
                ev.complete("fail");
                setMessage("Payment failed. Please try again.");
            }
        });

        // ✅ FIX: Only set paymentRequest AFTER canMakePayment confirms availability
        // This ensures PaymentRequestButtonElement never mounts before canMakePayment resolves
        pr.canMakePayment().then((result) => {
            if (result) {
                setPaymentRequest(pr);
                setPrAvailable(true);
            }
        }).catch(() => {
            // Silently ignore — GPay just won't be available
        });

        // Cleanup: no need to set paymentRequest here
    }, [stripe, amount]);

    // Called for standard card payments
    const submitPayment = async (formData) => {
        if (!stripe || !elements) return false;

        setLoading(true);
        setMessage("");

        try {
            const response = await createOrder({
                ...formData,
                items: items,
                amount: totalPrice,
            });

            if (!response?.clientSecret) {
                setMessage("Failed to create payment.");
                setLoading(false);
                return false;
            }

            const result = await stripe.confirmCardPayment(response.clientSecret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                    billing_details: { name },
                },
            });

            if (result.error) {
                setMessage(result.error.message);
                setLoading(false);
                return false;
            }

            setLoading(false);
            return response;
        } catch (error) {
            setMessage(error?.message || "Payment failed. Please try again.");
            setLoading(false);
            return false;
        }
    };

    // Exposed to parent via ref
    useImperativeHandle(ref, () => ({
        submitPayment,
        prAvailable,
        showCardFields,
    }));

    const inputStyle = {
        style: {
            base: {
                fontSize: "16px",
                color: "#ffffff",
                "::placeholder": { color: "#71717a" },
            },
            invalid: { color: "#f87171" },
        },
    };

    const shouldShowCardFields = !prAvailable || showCardFields;

    return (
        <div className="space-y-4">

            {/* Payment method selector when GPay is available */}
            {prAvailable && paymentRequest && (
                <div className="space-y-3">

                    {/* GPay / Apple Pay button */}
                    <PaymentRequestButtonElement
                        options={{
                            paymentRequest,
                            style: {
                                paymentRequestButton: {
                                    type: "order",
                                    theme: "dark",
                                    height: "48px",
                                },
                            },
                        }}
                    />

                    {/* Card toggle button */}
                    <button
                        type="button"
                        onClick={() => {
                            const next = !showCardFields;
                            setShowCardFields(next);
                            onCardToggle?.(next);
                        }}
                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all duration-300 cursor-pointer text-sm font-semibold
                            ${showCardFields
                                ? 'border-brand bg-brand/10 text-white'
                                : 'border-white/10 bg-white/[0.02] text-zinc-400 hover:border-white/20 hover:bg-white/[0.04]'
                            }`}
                    >
                        <FaCreditCard size={14} />
                        {showCardFields ? "Paying by Card" : "Or Pay by Card"}
                    </button>
                </div>
            )}

            {/* Card input fields — hidden when GPay is available (unless toggled) */}
            {shouldShowCardFields && (
                <>
                    {/* Card Holder Name */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                            Card Holder Name
                        </label>
                        <input
                            type="text"
                            placeholder="Enter name on card"
                            className="w-full pl-4 pr-12 py-3.5 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-zinc-500 text-sm
                                focus:outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20 focus:bg-white/[0.08]
                                transition-all duration-300 hover:border-white/20"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    {/* Card Number */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Card Number</label>
                        <div className="w-full px-4 py-3.5 bg-white/[0.05] border border-white/10 rounded-xl text-white focus-within:border-brand/60 focus-within:ring-2 focus-within:ring-brand/20 transition-all duration-300">
                            <CardNumberElement options={inputStyle} />
                        </div>
                    </div>

                    {/* Expiry + CVC */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Expiry Date</label>
                            <div className="w-full px-4 py-3.5 bg-white/[0.05] border border-white/10 rounded-xl text-white focus-within:border-brand/60 focus-within:ring-2 focus-within:ring-brand/20 transition-all duration-300">
                                <CardExpiryElement options={inputStyle} />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">CVC</label>
                            <div className="w-full px-4 py-3.5 bg-white/[0.05] border border-white/10 rounded-xl text-white focus-within:border-brand/60 focus-within:ring-2 focus-within:ring-brand/20 transition-all duration-300">
                                <CardCvcElement options={inputStyle} />
                            </div>
                        </div>
                    </div>
                </>
            )}

            {loading && (
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <div className="w-4 h-4 border-2 border-brand/30 border-t-brand rounded-full animate-spin" />
                    Processing payment...
                </div>
            )}

            {message && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                    {message}
                </div>
            )}
        </div>
    );
});

CheckoutForm.displayName = "CheckoutForm";
export default CheckoutForm;