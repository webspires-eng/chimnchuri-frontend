"use client"

import React, { useEffect, useRef, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { useDispatch, useSelector } from "react-redux";
import Img from "@/app/_components/Img";
import { useForm } from "react-hook-form";
import { FaMapMarkerAlt, FaCreditCard, FaMoneyBillWave, FaShoppingBag, FaShieldAlt, FaArrowRight, FaPlus, FaMinus, FaTruck, FaStore, FaSearch, FaCheckCircle, FaTimesCircle, FaSpinner, FaCalendarAlt } from "react-icons/fa";
import { createOrder } from "@/lib/api";
import { clearCart } from "@/store/features/cartSlice";
import { useCurrency, useSettings } from "@/app/providers/SettingsProvider";
import { toast } from "react-toastify";
import useCartCalculation from "@/hooks/useCartCalculation";
import { useRouter } from "next/navigation";
import useTimeSlots from "@/hooks/useTimeSlots";
import useOrderDates from "@/hooks/useOrderDates";
import useDeliveryZone from "@/hooks/useDeliveryZone";


export default function CheckoutPage() {

    const [orderType, setOrderType] = useState("collection");
    const [selectedOrderDate, setSelectedOrderDate] = useState(null);
    const { data: orderDatesData, isLoading: orderDatesLoading } = useOrderDates();
    const { data: timeSlots, isLoading: timeSlotsLoading, error: timeSlotsError } = useTimeSlots(selectedOrderDate?.id);
    const auth = useSelector((state) => state.authSlice);

    // Delivery zone hook
    const {
        searchAddress,
        selectAddress,
        deliveryZone,
        distance: deliveryDistance,
        deliveryFee: zonalDeliveryFee,
        minOrderAmount: zonalMinOrder,
        isOutOfRange,
        isSearching: isSearchingPostcodes,
        isChecking: isCheckingDelivery,
        error: deliveryError,
        customerAddress,
        zones,
        searchResults,
        showDropdown,
        setShowDropdown,
        reset: resetDeliveryZone,
    } = useDeliveryZone();

    const {
        deliveryFee: settingsDeliveryFee,
        tax,
        taxAmount,
        minOrderAmount: settingsMinOrder,
        isCodEnabled,
        isOnlineEnabled,
        totalPrice,
        discountAmount: discount,
        grandTotal: baseGrandTotal } = useCartCalculation();

    // Use zone-based delivery fee when available, otherwise fallback to settings
    const deliveryFee = orderType === 'delivery' && deliveryZone ? zonalDeliveryFee : settingsDeliveryFee;
    const minOrderAmount = orderType === 'delivery' && deliveryZone ? zonalMinOrder : settingsMinOrder;
    // Recalculate grand total with zone-based delivery fee
    const grandTotal = totalPrice + (orderType === 'collection' ? 0 : deliveryFee) + taxAmount - discount;

    // Postcode lookup state
    const [postcodeInput, setPostcodeInput] = useState("");
    const [deliveryChecked, setDeliveryChecked] = useState(false);

    const settings = useSettings();


    const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
    const dispatch = useDispatch();

    const { code, symbol, format } = useCurrency();


    const { items } = useSelector((state) => state.cartSlice);
    const { register, handleSubmit, formState: { errors }, setValue, getValues, trigger } = useForm();
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const checkoutFormRef = useRef(null);
    const [isUsingCardPayment, setIsUsingCardPayment] = useState(false); // tracks if user toggled to card in CheckoutForm

    // Reset allocations and delivery zone when order type changes
    useEffect(() => {
        setAllocations({});
        setSelectedOrderDate(null);
        if (orderType === 'collection') {
            resetDeliveryZone();
            setDeliveryChecked(false);
            setPostcodeInput("");
        }
    }, [orderType]);
    useEffect(() => {
        if (settings) {
            let isCodEnabled = settings?.is_cod_enabled;
            let isOnlineEnabled = settings?.is_online_enabled;
            if (isCodEnabled && isOnlineEnabled) {
                setPaymentMethod("cod");
            } else if (isCodEnabled) {
                setPaymentMethod("cod");
            } else if (isOnlineEnabled) {
                setPaymentMethod("online");
            }
        }
    }, [settings])


    const [allocations, setAllocations] = useState({});
    const totalCartQty = items.reduce((sum, item) => sum + item.quantity, 0);
    const allocatedTotal = Object.values(allocations).reduce((sum, q) => sum + q, 0);

    const handleAllocationChange = (slotId, qty, max) => {
        const value = Math.min(Math.max(0, parseInt(qty) || 0), max);
        setAllocations(prev => ({
            ...prev,
            [slotId]: value
        }));
    };


    const router = useRouter()
    const [loading, setLoading] = useState(false);

    // Step 1: Search postcodes — shows dropdown
    const handlePostcodeLookup = async () => {
        if (!postcodeInput.trim()) {
            toast.error("Please enter a postcode");
            return;
        }
        setDeliveryChecked(false);
        await searchAddress(postcodeInput);
    };

    // Step 2: User selects a postcode from dropdown — check zone
    const handleSelectPostcode = async (postcodeObj) => {
        setPostcodeInput(postcodeObj.postcode);
        const result = await selectAddress(postcodeObj);
        if (result) {
            setDeliveryChecked(true);
            // Auto-fill city and postal code from geocoded data
            if (result.customerAddress) {
                setValue("postal_code", result.customerAddress.postcode || postcodeObj.postcode);
                setValue("city", result.customerAddress.district || result.customerAddress.ward || "");
            }
        }
    };

    // Handle react-hook-form validation errors
    const onFormError = (formErrors) => {
        const errorMessages = [];
        if (formErrors.full_name) errorMessages.push("Full name is required");
        if (formErrors.email) errorMessages.push("Email is required");
        if (formErrors.car_registration) errorMessages.push("Car registration number is required");
        if (formErrors.street_address) errorMessages.push("Street address is required");
        if (formErrors.city) errorMessages.push("City is required");

        if (errorMessages.length > 0) {
            toast.error(errorMessages[0]);
        } else {
            toast.error("Please fill in all required fields");
        }
    };

    // Build the form data object (shared between card, wallet, and COD)
    const buildFormData = (data) => {
        const user_id = auth?.user?.id || null;
        const effectiveDeliveryFee = orderType === "collection" ? 0 : (deliveryZone ? deliveryZone.delivery_fee : deliveryFee);
        const effectiveGrandTotal = totalPrice + effectiveDeliveryFee + taxAmount - discount;
        return {
            ...data,
            payment_method: paymentMethod,
            order_type: orderType,
            order_date: selectedOrderDate?.date || null,
            user_id,
            items: items,
            discount: discount,
            tax: taxAmount,
            delivery_fee: effectiveDeliveryFee,
            amount: effectiveGrandTotal,
            allocations: Object.entries(allocations)
                .filter(([_, qty]) => qty > 0)
                .map(([slotId, qty]) => ({ slot_id: slotId, quantity: qty }))
        };
    };

    // Validates and returns form data — used by GPay/Apple Pay button
    const getFormDataForWallet = () => {
        // Validate order date
        if (!selectedOrderDate) {
            toast.error("Please select an order date");
            return null;
        }
        // Validate delivery zone
        if (orderType === 'delivery' && !deliveryChecked) {
            toast.error("Please verify your delivery postcode first");
            return null;
        }
        if (orderType === 'delivery' && isOutOfRange) {
            toast.error("Sorry, we cannot deliver to your area");
            return null;
        }
        const effectiveMinOrder = orderType === 'delivery' && deliveryZone ? deliveryZone.minimum_order_amount : minOrderAmount;
        if (totalPrice < effectiveMinOrder) {
            toast.error(`Minimum order amount is ${symbol}${effectiveMinOrder.toFixed(2)}`);
            return null;
        }
        if (allocatedTotal !== totalCartQty) {
            toast.error(`Please allocate all ${totalCartQty} items to time slots. Currently allocated: ${allocatedTotal}`);
            return null;
        }
        if (timeSlots?.length === 0) {
            toast.error("No time slots available");
            return null;
        }

        // Get current form values without triggering HTML validation
        const data = getValues();
        if (!data.full_name || !data.email || !data.phone) {
            toast.error("Please fill in your name, email, and phone number");
            return null;
        }
        if (orderType === 'collection' && !data.car_registration) {
            toast.error("Car registration number is required for collection orders");
            return null;
        }
        if (orderType === 'delivery' && !data.street_address) {
            toast.error("Please fill in your street address");
            return null;
        }

        return buildFormData({ ...data, payment_method: "online" });
    };

    // Called when GPay/Apple Pay payment succeeds
    const onWalletPaymentSuccess = (response) => {
        if (response?.success) {
            dispatch(clearCart());
            toast.success("Order placed successfully");
            router.push(`/thank-you?id=${response.orderId}`);
        }
    };

    const handlePlaceOrder = async (data) => {

        // Check order date
        if (!selectedOrderDate) {
            toast.error("Please select an order date");
            return;
        }

        // Check delivery zone for delivery orders
        if (orderType === 'delivery' && !deliveryChecked) {
            toast.error("Please verify your delivery postcode first");
            return;
        }
        if (orderType === 'delivery' && isOutOfRange) {
            toast.error("Sorry, we cannot deliver to your area");
            return;
        }

        const effectiveMinOrder = orderType === 'delivery' && deliveryZone ? deliveryZone.minimum_order_amount : minOrderAmount;
        if (totalPrice < effectiveMinOrder) {
            toast.error(`Minimum order amount is ${symbol}${effectiveMinOrder.toFixed(2)}`);
            return;
        }
        if (allocatedTotal !== totalCartQty) {
            toast.error(`Please allocate all ${totalCartQty} items to time slots. Currently allocated: ${allocatedTotal}`);
            return;
        }
        if (timeSlots?.length === 0) {
            toast.error("No time slots available");
            return;
        }


        if (paymentMethod === "online" && !isOnlineEnabled) {
            toast.error("Online payment is not enabled");
            return;
        }
        if (paymentMethod === "cod" && !isCodEnabled) {
            toast.error("COD is not enabled");
            return;
        }

        const formData = buildFormData(data);

        setLoading(true);
        try {
            if (paymentMethod === "cod") {
                const response = await createOrder(formData);
                if (response?.success) {
                    dispatch(clearCart());
                    toast.success("Order placed successfully");
                    router.push(`/thank-you?id=${response.orderId}`);
                    return;
                }
            }

            if (paymentMethod === "online") {
                const response = await checkoutFormRef.current?.submitPayment(formData);
                if (response?.success) {
                    dispatch(clearCart());
                    toast.success("Order placed successfully");
                    router.push(`/thank-you?id=${response.orderId}`);
                    return;
                }
            }
            toast.error("Something went wrong");
        } catch (error) {
            toast.error(error?.message || "Something went wrong. Please try again.");
        }
        setLoading(false);
    };

    const InputField = ({ label, name, type = "text", placeholder, options = {} }) => (
        <div className="space-y-1">
            <label className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-400">{label}</label>
            <input
                type={type}
                {...register(name, options)}
                placeholder={placeholder}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 bg-white/[0.05] border border-white/10 rounded-lg sm:rounded-xl text-white placeholder-zinc-400 text-xs sm:text-sm
                    focus:outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20 focus:bg-white/[0.08]
                    transition-all duration-300 hover:border-white/20"
            />
            {errors[name] && <p className="text-[10px] sm:text-xs text-red-400 mt-1">{errors[name].message}</p>}
        </div>
    );






    return (
        <div className="min-h-screen bg-[#141414] py-6 sm:py-12 px-3 sm:px-6 lg:px-8 relative overflow-x-clip text-white">

            {loading && <Loader />}

            {/* Background elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-brand/10 blur-3xl opacity-50" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-brand/5 blur-3xl opacity-30" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <header className="mb-6 sm:mb-10">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-1 sm:mb-2">Checkout</h1>
                    <p className="text-zinc-300 text-xs sm:text-sm">Complete your order with secure {orderType} and payment</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-start relative">
                    {/* Left Column: Forms */}
                    <div className="lg:col-span-8 space-y-5 sm:space-y-8 order-2 lg:order-1">

                        {/* 0. Order Type: Delivery / Collection */}
                        <section className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-2xl">
                            <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white flex items-center justify-center">
                                    <FaShoppingBag className="text-brand" size={12} />
                                </div>
                                <h2 className="text-sm sm:text-base font-bold">Order Type</h2>
                            </div>

                            <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                <button
                                    onClick={() => setOrderType('delivery')}
                                    type="button"
                                    className={`relative group flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg sm:rounded-xl border-2 transition-all duration-300 cursor-pointer
                                        ${orderType === 'delivery'
                                            ? 'border-brand bg-brand/10'
                                            : 'border-white/10 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.04]'}`}
                                >
                                    <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-md sm:rounded-lg flex items-center justify-center shrink-0 transition-all ${orderType === 'delivery' ? 'bg-brand text-white shadow-md shadow-brand/30' : 'bg-white/10 text-zinc-400'}`}>
                                        <FaTruck size={12} />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-bold text-[10px] sm:text-xs">Delivery</div>
                                        <p className="text-[9px] sm:text-[10px] text-zinc-400">To your door</p>
                                    </div>
                                    {orderType === 'delivery' && (
                                        <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2">
                                            <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-brand flex items-center justify-center text-white">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                                            </div>
                                        </div>
                                    )}
                                </button>

                                <button
                                    onClick={() => setOrderType('collection')}
                                    type="button"
                                    className={`relative group flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg sm:rounded-xl border-2 transition-all duration-300 cursor-pointer
                                        ${orderType === 'collection'
                                            ? 'border-brand bg-brand/10'
                                            : 'border-white/10 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.04]'}`}
                                >
                                    <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-md sm:rounded-lg flex items-center justify-center shrink-0 transition-all ${orderType === 'collection' ? 'bg-brand text-white shadow-md shadow-brand/30' : 'bg-white/10 text-zinc-400'}`}>
                                        <FaStore size={12} />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-bold text-[10px] sm:text-xs">Collection - Kerbside Service</div>
                                        {/* <p className="text-[9px] sm:text-[10px] text-zinc-400">Pick up in store</p> */}
                                        <p className="text-[9px] sm:text-[10px] text-zinc-400">Drop off to your car</p>
                                    </div>
                                    {orderType === 'collection' && (
                                        <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2">
                                            <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-brand flex items-center justify-center text-white">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                                            </div>
                                        </div>
                                    )}
                                </button>
                            </div>
                            {
                                orderType === 'collection' && (
                                    // <p className="text-[10px] sm:text-xs text-zinc-400 mt-3 sm:mt-5">You can collect your order from our store at <span className="text-white">{settings?.address}, {settings?.city}</span> </p>
                                    <p className="text-[10px] sm:text-xs text-zinc-300 mt-3 sm:mt-5">
                                        Based in Chadderton, Oldham (OL9), your order will be ready at your scheduled collection time. It is your responsibility to arrive on time, as food is made fresh. Exact collection details will be provided in your order confirmation email.
                                        <br /><br />
                                        Please remain in your car when you arrive. We will bring your order directly to you.
                                        <br />
                                        <br />

                                        There may be slight delays on our side, so please be patient. You are responsible for letting us know by texting <a href="tel:+447451221187" className="text-blue-400 font-bold">07451221187</a> with the full name used on your order when you are 5 minutes away.
                                        <br />
                                        <br />

                                        If you cannot arrive at your scheduled time, you must text or call <a href="tel:+447451221187" className="text-blue-400 font-bold">07451221187</a> to let us know. Unless there are major delays, all updates will be communicated by us via text or call to <a href="tel:+447451221187" className="text-blue-400 font-bold">07451221187</a>.
                                    </p>

                                )
                            }
                        </section>

                        {/* 1a. Delivery Postcode Lookup (only for delivery) */}
                        {orderType === 'delivery' && (
                            <section className="bg-white/[0.04] relative z-10 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl">
                                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-brand to-green-600 flex items-center justify-center shadow-lg shadow-brand/20">
                                        <FaTruck className="text-white" size={14} />
                                    </div>
                                    <div>
                                        <h2 className="text-sm sm:text-lg font-bold">Delivery Area Check</h2>
                                        <p className="text-[10px] sm:text-xs text-zinc-400 mt-0.5">Enter your postcode to check if we deliver to your area</p>
                                    </div>
                                </div>

                                {/* Postcode Input */}
                                <div className="relative mb-3 sm:mb-4">
                                    <div className="flex gap-2 sm:gap-3">
                                        <div className="relative flex-1">
                                            <input
                                                type="text"
                                                value={postcodeInput}
                                                onChange={(e) => {
                                                    setPostcodeInput(e.target.value.toUpperCase());
                                                    if (deliveryChecked) {
                                                        setDeliveryChecked(false);
                                                        resetDeliveryZone();
                                                    }
                                                    if (showDropdown) {
                                                        setShowDropdown(false);
                                                    }
                                                }}
                                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handlePostcodeLookup())}
                                                placeholder="Enter postcode (e.g. M43 6JH)"
                                                className="w-full pl-3 sm:pl-4 pr-10 sm:pr-12 py-3 sm:py-3.5 bg-white/[0.05] border border-white/10 rounded-lg sm:rounded-xl text-white placeholder-zinc-500 text-xs sm:text-sm tracking-wider font-medium
                                                    focus:outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20 focus:bg-white/[0.08]
                                                    transition-all duration-300 hover:border-white/20 uppercase"
                                            />
                                            <FaMapMarkerAlt className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-zinc-500" size={12} />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handlePostcodeLookup}
                                            disabled={isSearchingPostcodes || isCheckingDelivery || !postcodeInput.trim()}
                                            className="px-4 sm:px-6 py-3 sm:py-3.5 bg-brand hover:bg-green-700 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-bold text-xs sm:text-sm rounded-lg sm:rounded-xl
                                                transition-all duration-300 flex items-center gap-1.5 sm:gap-2 shrink-0 cursor-pointer disabled:cursor-not-allowed
                                                shadow-lg"
                                        >
                                            {isSearchingPostcodes ? (
                                                <><FaSpinner className="animate-spin" size={12} /> Searching...</>
                                            ) : (
                                                <><FaSearch size={12} /> Search</>
                                            )}
                                        </button>
                                    </div>

                                    {/* Postcode Search Results Dropdown */}
                                    {showDropdown && searchResults.length > 0 && (
                                        <div className="absolute z-100 left-0 right-0 mt-1.5 bg-zinc-900 border border-white/10 rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[240px] sm:max-h-[280px] overflow-y-auto custom-scrollbar">
                                            <div className="p-1.5 sm:p-2">
                                                <p className="text-[9px] sm:text-[10px] text-zinc-500 uppercase tracking-widest font-bold px-2 sm:px-3 py-1.5 sm:py-2">Select your postcode</p>
                                                {searchResults.map((result, idx) => (
                                                    <button
                                                        key={idx}
                                                        type="button"
                                                        onClick={() => handleSelectPostcode(result)}
                                                        className="w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-left hover:bg-white/[0.06] transition-all duration-200 group cursor-pointer"
                                                    >
                                                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-brand/10 flex items-center justify-center shrink-0 group-hover:bg-brand/20 transition-colors">
                                                            <FaMapMarkerAlt className="text-brand" size={10} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs sm:text-sm font-bold text-white tracking-wide">{result.postcode}</p>
                                                            <p className="text-[10px] sm:text-[11px] text-zinc-400 truncate">{result.district}{result.ward ? `, ${result.ward}` : ''}</p>
                                                        </div>
                                                        <FaArrowRight className="text-zinc-600 group-hover:text-brand transition-colors shrink-0" size={8} />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Checking zone spinner */}
                                {isCheckingDelivery && (
                                    <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white/[0.03] border border-white/5">
                                        <FaSpinner className="animate-spin text-brand" size={14} />
                                        <span className="text-xs sm:text-sm text-zinc-400">Checking delivery availability...</span>
                                    </div>
                                )}

                                {/* Delivery Zone Result */}
                                {deliveryChecked && deliveryZone && !isOutOfRange && (
                                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                                        <div className="flex items-start gap-2.5 sm:gap-3">
                                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                                <FaCheckCircle className="text-green-400" size={14} />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-green-400 font-bold text-xs sm:text-sm mb-0.5 sm:mb-1">Great news! We deliver to your area</h3>
                                                <div className="space-y-0.5">
                                                    {customerAddress && (
                                                        <p className="text-[10px] sm:text-xs text-zinc-400">📍 {customerAddress.postcode}{customerAddress.district ? `, ${customerAddress.district}` : ''}</p>
                                                    )}
                                                    {/* <p className="text-[10px] sm:text-xs text-zinc-400">📏 Distance: <span className="text-white font-semibold">{deliveryDistance} miles</span> from our store</p> */}
                                                    <p className="text-[10px] sm:text-xs text-zinc-400">🚚 Delivery Fee: <span className="text-white font-semibold">{symbol}{deliveryZone.delivery_fee.toFixed(2)}</span></p>
                                                    <p className="text-[10px] sm:text-xs text-zinc-400">🛒 Min. Order: <span className="text-white font-semibold">{symbol}{deliveryZone.minimum_order_amount.toFixed(2)}</span></p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Out of Range */}
                                {deliveryChecked && isOutOfRange && (
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                                        <div className="flex items-start gap-2.5 sm:gap-3">
                                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                                <FaTimesCircle className="text-red-400" size={14} />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-red-400 font-bold text-xs sm:text-sm mb-0.5 sm:mb-1">Sorry, we can't deliver to this area</h3>
                                                <div className="space-y-0.5">
                                                    {customerAddress && (
                                                        <p className="text-[10px] sm:text-xs text-zinc-400">📍 {customerAddress.postcode}{customerAddress.district ? `, ${customerAddress.district}` : ''}</p>
                                                    )}
                                                    <p className="text-[10px] sm:text-xs text-zinc-400">📏 Distance: <span className="text-white font-semibold">{deliveryDistance} miles</span> — beyond our delivery range</p>
                                                    <p className="text-[10px] sm:text-xs text-zinc-300 mt-1.5">You can still place a <button type="button" onClick={() => setOrderType('collection')} className="text-brand font-bold underline underline-offset-2 hover:text-green-400 transition-colors cursor-pointer">Collection Order</button> and pick it up from our store.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Error */}
                                {deliveryError && (
                                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 sm:p-4">
                                        <p className="text-yellow-400 text-xs sm:text-sm font-medium">⚠️ {deliveryError}</p>
                                    </div>
                                )}

                                {/* Delivery zones info */}
                                {!deliveryChecked && !isCheckingDelivery && !showDropdown && zones.length > 0 && (
                                    <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-3 sm:mt-4">
                                        {zones.sort((a, b) => a.max_distance - b.max_distance).map((zone, idx) => {
                                            const colors = ['bg-green-400', 'bg-yellow-400', 'bg-orange-400', 'bg-red-400'];
                                            return (
                                                <div key={zone.id} className="bg-white/[0.03] border border-white/5 rounded-lg sm:rounded-xl p-2.5 sm:p-3">
                                                    <div className="flex items-center gap-1.5 mb-1 sm:mb-1.5">
                                                        <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${colors[idx] || colors[0]}`}></div>
                                                        <span className="text-[10px] sm:text-xs font-bold text-zinc-300">{zone.name}</span>
                                                    </div>
                                                    <p className="text-[9px] sm:text-[11px] text-zinc-400">
                                                        {zone.min_distance > 0 ? `${zone.min_distance} – ${zone.max_distance}` : `Within ${zone.max_distance}`} miles — {symbol}{zone.delivery_fee.toFixed(2)}
                                                    </p>
                                                    {/* <p className="text-[8px] sm:text-[10px] text-zinc-500 mt-0.5">Min. {symbol}{zone.minimum_order_amount.toFixed(2)}</p> */}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </section>
                        )}

                        {/* 1b. Customer Details & Address */}
                        <section className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl">
                            <div className="flex items-center gap-2.5 sm:gap-4 mb-5 sm:mb-8">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white flex items-center justify-center">
                                    <FaMapMarkerAlt className="text-brand" size={14} />
                                </div>
                                <h2 className="text-sm sm:text-xl font-bold">{orderType === 'delivery' ? 'Delivery Details' : 'Collection Details'}</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                <InputField label="Full name" name="full_name" placeholder="John Doe" options={{ required: "Name is required" }} />
                                <InputField label="Email" name="email" placeholder="Email Address" options={{ required: "Email is required" }} />
                                <InputField label="Phone Number" name="phone" placeholder="+44 7700 900000" options={{ required: "Phone number is required" }} />
                                {orderType === 'collection' && (
                                    <InputField label="Car Registration Number" name="car_registration" placeholder="e.g. AB12 CDE" options={{ required: orderType === 'collection' ? "Car registration number is required" : false }} />
                                )}
                                {orderType === 'delivery' && (
                                    <>
                                        <div className="md:col-span-2">
                                            <InputField label="Street Address" name="street_address" placeholder="123 Food Street, Block A" options={{ required: orderType === 'delivery' ? "Address is required" : false }} />
                                        </div>
                                        <InputField label="City" name="city" placeholder="London" options={{ required: orderType === 'delivery' ? "City is required" : false }} />
                                        <InputField label="Postal Code" name="postal_code" placeholder="SW1A 0AA" />
                                    </>
                                )}

                                <div className="md:col-span-2 space-y-3 sm:space-y-4">
                                    {/* Order Date Selection */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                                            <FaCalendarAlt size={10} className="text-brand" />
                                            Select Order Date
                                        </label>
                                        {orderDatesLoading ? (
                                            <div className="flex items-center gap-2 py-4">
                                                <div className="w-4 h-4 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                                                <span className="text-zinc-500 text-xs">Loading dates...</span>
                                            </div>
                                        ) : orderDatesData?.data?.length > 0 ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {orderDatesData.data.map((dateItem) => {
                                                    const isSelected = selectedOrderDate?.id === dateItem.id;
                                                    const isOpen = dateItem.status === 'open';
                                                    const isSoldOut = dateItem.status === 'sold_out';
                                                    const isClosed = dateItem.status === 'closed';

                                                    return (
                                                        <button
                                                            key={dateItem.id}
                                                            type="button"
                                                            onClick={() => {
                                                                if (isOpen) {
                                                                    setSelectedOrderDate(isSelected ? null : dateItem);
                                                                    setAllocations({});
                                                                }
                                                            }}
                                                            disabled={!isOpen}
                                                            className={`relative group flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-lg sm:rounded-xl border-2 transition-all duration-300 text-left
                                                                ${isSelected
                                                                    ? 'border-brand bg-brand/10'
                                                                    : isOpen
                                                                        ? 'border-white/10 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.04] cursor-pointer'
                                                                        : 'border-white/5 bg-white/[0.01] cursor-not-allowed opacity-60'
                                                                }`}
                                                        >
                                                            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0 transition-all
                                                                ${isSelected ? 'bg-brand text-white shadow-md shadow-brand/30'
                                                                    : isOpen ? 'bg-white/10 text-zinc-400'
                                                                        : 'bg-white/5 text-zinc-600'}`}>
                                                                <FaCalendarAlt size={14} />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="font-bold text-[11px] sm:text-xs truncate">
                                                                    {dateItem.day_name}
                                                                </div>
                                                                <p className="text-[9px] sm:text-[10px] text-zinc-400 truncate">
                                                                    {dateItem.short_date}
                                                                </p>
                                                            </div>
                                                            <div className="shrink-0">
                                                                {isOpen && (
                                                                    <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded-full">Open</span>
                                                                )}
                                                                {isSoldOut && (
                                                                    <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-full">Sold Out</span>
                                                                )}
                                                                {isClosed && (
                                                                    <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded-full">Closed</span>
                                                                )}
                                                            </div>
                                                            {isSelected && (
                                                                <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2">
                                                                    <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-brand flex items-center justify-center text-white">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="text-zinc-200 border border-zinc-500 bg-zinc-900 rounded-2xl px-2 py-4 text-center text-sm animate-pulse">
                                                No order dates available at the moment
                                            </div>
                                        )}
                                    </div>

                                    {/* Time Slot Allocation — only show when a date is selected */}
                                    {selectedOrderDate && (
                                        <>
                                            <div className="flex justify-between items-end mt-4">
                                                <label className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-400">Time Slot Allocation</label>
                                                <div className={`text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full ${allocatedTotal === totalCartQty ? 'bg-brand/20 text-white' : 'bg-red-500/10 text-red-400'}`}>
                                                    {allocatedTotal} / {totalCartQty} Allocated
                                                </div>
                                            </div>

                                            <div className="relative">
                                                <div className="max-h-[320px] overflow-y-auto rounded-xl border border-white/5 bg-white/[0.01] pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
                                                    <div className="grid grid-cols-1 gap-1 sm:gap-1.5 p-2">
                                                        {timeSlotsLoading ? (
                                                            <div className="flex flex-col items-center justify-center py-10 space-y-3">
                                                                <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                                                                <div className="text-zinc-500 text-xs sm:text-sm animate-pulse">Loading time slots...</div>
                                                            </div>
                                                        ) : timeSlots?.data?.length > 0 ? timeSlots.data.map((slot) => {
                                                            const allocated = allocations[slot.id] || 0;
                                                            const remaining = slot.max_capacity - allocated;
                                                            return (
                                                                <div key={slot.id} className={`flex items-center gap-3 sm:gap-4 ps-3 py-1.5 px-2 rounded-lg border transition-all ${slot.disabled ? 'opacity-40 grayscale border-white/5' : allocated > 0 ? 'bg-brand/5 border-brand/20' : 'bg-white/[0.02] border-white/5 hover:border-white/10'}`}>
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="text-xs sm:text-sm font-bold text-white">{slot.start_time}</div>
                                                                        <div className="text-[9px] sm:text-[10px] text-zinc-400 uppercase tracking-widest mt-0.5">
                                                                            {slot.disabled ? 'Full' : `${remaining} ${remaining === 1 ? 'steak' : 'steaks'} left`}
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center bg-white/[0.05] border border-white/10 rounded-lg overflow-hidden shadow-inner shrink-0">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleAllocationChange(slot.id, allocated - 1, slot.max_capacity)}
                                                                            disabled={slot.disabled || allocated <= 0}
                                                                            className="p-1.5 sm:p-2 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                                                                        >
                                                                            <FaMinus size={8} />
                                                                        </button>
                                                                        <div className="w-7 sm:w-8 text-center text-xs sm:text-sm font-bold text-white tabular-nums">
                                                                            {allocated}
                                                                        </div>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleAllocationChange(slot.id, allocated + 1, slot.max_capacity)}
                                                                            disabled={slot.disabled || allocated >= slot.max_capacity || allocatedTotal >= totalCartQty}
                                                                            className="p-1.5 sm:p-2 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                                                                        >
                                                                            <FaPlus size={8} />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )
                                                        }) : (
                                                            <div className="text-zinc-200 border border-zinc-500 bg-zinc-900 rounded-2xl px-2 py-4 text-center text-sm animate-pulse">No time slots available for this date</div>
                                                        )}
                                                    </div>
                                                </div>
                                                {/* Scroll fade hint */}
                                                {timeSlots?.data?.length > 6 && (
                                                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#141414] to-transparent pointer-events-none rounded-b-xl" />
                                                )}
                                            </div>
                                            {allocatedTotal !== totalCartQty && <p className="text-[12px] text-red-400 font-medium">* Total items ({totalCartQty}) must be fully allocated.</p>}
                                        </>
                                    )}

                                    <div className="bg-blue-400/5 border border-blue-500/10 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3">
                                        <p className="text-[9px] sm:text-[11px] text-white/80 leading-relaxed">
                                            <span className="">💬 Need more than 5 steaks in one slot?</span>{' '}
                                            DM us on{' '}
                                            <a href="https://www.instagram.com/chimnchurri" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 font-bold underline underline-offset-2">Instagram</a>{' '}or{' '}
                                            <a href="https://www.tiktok.com/@chimnchurri" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 font-bold underline underline-offset-2">TikTok</a>{' '}
                                            <span className="font-semibold">@chimnchurri</span> to arrange a larger order.
                                        </p>
                                    </div>
                                </div>

                                <div className="md:col-span-2 space-y-1">
                                    <label className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-400">Order Instructions (Optional)</label>
                                    <textarea
                                        {...register("order_instruction")}
                                        placeholder={orderType === 'collection' ? 'Any special requests for your order...' : 'Ring the doorbell, leave at gate, etc...'}
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 bg-white/[0.05] border border-white/10 rounded-lg sm:rounded-xl text-white placeholder-zinc-400 text-xs sm:text-sm
                                            focus:outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20 focus:bg-white/[0.08]
                                            transition-all duration-300 hover:border-white/20 min-h-[80px] sm:min-h-[100px] resize-none"
                                    />
                                    <div className="bg-yellow-50/10 border border-yellow-500/20 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
                                        <p className="text-[10px] sm:text-xs text-yellow-400 font-bold uppercase tracking-wider mb-0.5 sm:mb-1">⚠️ Allergens Notice</p>
                                        <p className="text-[9px] sm:text-[11px] text-yellow-300/80 leading-relaxed">Our food may contain or come into contact with common allergens such as nuts, gluten, dairy, eggs, soy, and shellfish. Please inform us of any allergies before placing your order.</p>
                                    </div>



                                </div>
                            </div>
                        </section>

                        <section className="lg:hidden">
                            <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-2 sm:p-3 shadow-2xl">
                                <h2 className="text-base sm:text-xl font-bold mb-5 sm:mb-8 flex items-center gap-2 sm:gap-3">
                                    <FaShoppingBag className="text-white" size={14} />
                                    Order Summary
                                </h2>

                                <div className="space-y-4 sm:space-y-6 mb-5 sm:mb-8 max-h-[350px] sm:max-h-[450px] overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
                                    {items.map((item, idx) => (
                                        <div key={idx} className="flex gap-3 sm:gap-4 group">
                                            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl bg-zinc-800 border border-white/5 overflow-hidden relative shrink-0">
                                                {item.image ? (
                                                    <Img src={item.image} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-zinc-500">
                                                        <FaShoppingBag size={18} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start gap-2">
                                                    <div>
                                                        <h3 className="font-bold text-white text-xs sm:text-sm line-clamp-1 mb-0.5">{item.name}</h3>
                                                        <p className="text-[10px] sm:text-[12px] text-zinc-200 font-medium">{item.selectedSize.name}</p>
                                                    </div>
                                                    <p className="text-xs sm:text-sm font-bold text-zinc-200">{symbol} {item.itemTotal.toFixed(2)}</p>
                                                </div>

                                                {item.selectedAddons && item.selectedAddons.length > 0 && (
                                                    <div className="mt-2 sm:mt-3 text-[9px] sm:text-[10px] space-y-0.5">
                                                        {item.selectedAddons.map((addon, aIdx) => (
                                                            <div key={aIdx} className="flex justify-between text-zinc-300">
                                                                <span>+ {addon.qty}x {addon.name}</span>
                                                                <span className="text-zinc-300 ml-2">{symbol} {(parseFloat(addon.price) * addon.qty).toFixed(2)}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                <div className="mt-1.5 sm:mt-2 text-[10px] sm:text-[11px] font-bold text-zinc-300">Qty: {item.quantity}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-white/5 pt-4 sm:pt-6 space-y-2.5 sm:space-y-4">
                                    <div className="flex justify-between text-xs sm:text-sm text-zinc-300">
                                        <span>Subtotal</span>
                                        <span className="text-zinc-200">{symbol} {totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs sm:text-sm text-zinc-300">
                                        <span>Delivery Fee</span>
                                        {orderType === 'collection' ? (
                                            <span className="text-green-400 line-through opacity-60">{symbol} {settingsDeliveryFee.toFixed(2)}</span>
                                        ) : deliveryChecked && deliveryZone ? (
                                            <span className="text-zinc-200">{symbol} {deliveryZone.delivery_fee.toFixed(2)}</span>
                                        ) : deliveryChecked && isOutOfRange ? (
                                            <span className="text-red-400 text-[10px] sm:text-xs">Out of range</span>
                                        ) : (
                                            <span className="text-zinc-500 text-[10px] sm:text-xs italic">Enter postcode to check</span>
                                        )}
                                    </div>

                                    <div className="flex justify-between text-xs sm:text-sm text-green-500">
                                        <span>Discount</span>
                                        <span className="text-green-500">{symbol} {discount.toFixed(2)}</span>
                                    </div>

                                    <div className="flex justify-between text-xs sm:text-sm text-zinc-300">
                                        <span>Tax ({tax}%)</span>
                                        <span className="text-zinc-200">{symbol} {taxAmount.toFixed(2)}</span>
                                    </div>

                                    <div className="flex justify-between items-center pt-3 sm:pt-4 border-t border-white/10">
                                        <span className="text-sm sm:text-base font-bold text-white">Total</span>
                                        <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
                                            {orderType === 'collection'
                                                ? `${symbol} ${(totalPrice + taxAmount - discount).toFixed(2)}`
                                                : deliveryChecked && deliveryZone
                                                    ? `${symbol} ${grandTotal.toFixed(2)}`
                                                    : `${symbol} ${(totalPrice + taxAmount - discount).toFixed(2)}` + (orderType === 'delivery' ? ' + delivery' : '')
                                            }
                                        </span>
                                    </div>
                                    {totalPrice < minOrderAmount && (
                                        <div className="mt-1.5 sm:mt-2 text-red-500 font-bold text-[10px] sm:text-[12px] text-center">
                                            Minimum order amount is {symbol} {minOrderAmount.toFixed(2)}
                                        </div>
                                    )}

                                </div>

                                <div className="mt-3 sm:mt-4 flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/5 text-[9px] sm:text-[10px] text-zinc-400 justify-center uppercase tracking-widest font-bold">
                                    <FaShieldAlt size={10} />
                                    <span>Encrypted & Secure</span>
                                </div>
                            </div>
                        </section>

                        {/* 2. Payment Method */}
                        <section className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl">
                            <div className="flex items-center gap-2.5 sm:gap-4 mb-5 sm:mb-8">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white flex items-center justify-center">
                                    <FaCreditCard className="text-brand" size={14} />
                                </div>
                                <h2 className="text-sm sm:text-xl font-bold">Payment Method</h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-8">
                                {
                                    !!isCodEnabled && (
                                        <button
                                            onClick={() => setPaymentMethod('cod')}
                                            type="button"
                                            className={`relative group flex flex-col items-start p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 cursor-pointer text-left
                                        ${paymentMethod === 'cod'
                                                    ? 'border-brand bg-brand/10'
                                                    : 'border-white/10 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.04]'}`}
                                        >
                                            <div className="flex items-center gap-2.5 sm:gap-3 mb-2 sm:mb-3">
                                                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center transition-all ${paymentMethod === 'cod' ? 'bg-brand text-white shadow-lg shadow-brand/30' : 'bg-white/10 text-zinc-400'}`}>
                                                    <FaMoneyBillWave size={14} />
                                                </div>
                                                <div className="font-bold text-xs sm:text-sm">{orderType === 'collection' ? 'Pay on Collection' : 'Cash on Delivery'}</div>
                                            </div>
                                            <p className="text-[10px] sm:text-xs text-zinc-400 leading-relaxed">{orderType === 'collection' ? 'Pay when you collect your order from our store.' : 'Pay with cash when your delicious food arrives at your doorstep.'}</p>
                                            {paymentMethod === 'cod' && (
                                                <div className="absolute top-4 right-4 text-brand">
                                                    <div className="w-5 h-5 rounded-full bg-brand flex items-center justify-center text-white">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                                                    </div>
                                                </div>
                                            )}
                                        </button>
                                    )
                                }

                                {
                                    !!isOnlineEnabled && (
                                        <button
                                            onClick={() => setPaymentMethod('online')}
                                            type="button"
                                            className={`relative group flex flex-col items-start p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 cursor-pointer text-left
                                        ${paymentMethod === 'online'
                                                    ? 'border-brand bg-brand/10'
                                                    : 'border-white/10 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.04]'}`}
                                        >
                                            <div className="flex items-center gap-2.5 sm:gap-3 mb-2 sm:mb-3">
                                                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center transition-all ${paymentMethod === 'online' ? 'bg-brand text-white shadow-lg shadow-brand/30' : 'bg-white/10 text-zinc-400'}`}>
                                                    <FaCreditCard size={14} />
                                                </div>
                                                <div className="font-bold text-xs sm:text-sm">Pay Online</div>
                                            </div>
                                            <p className="text-[10px] sm:text-xs text-zinc-400 leading-relaxed">Fast and secure payment using your credit or debit card.</p>
                                            {paymentMethod === 'online' && (
                                                <div className="absolute top-4 right-4 text-brand">
                                                    <div className="w-5 h-5 rounded-full bg-brand flex items-center justify-center text-white">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                                                    </div>
                                                </div>
                                            )}
                                        </button>
                                    )
                                }

                            </div>

                            {paymentMethod === "online" && (
                                <div className="mb-10 pt-4 border-t border-white/5">
                                    <Elements stripe={stripePromise}>
                                        <CheckoutForm
                                            ref={checkoutFormRef}
                                            amount={grandTotal}
                                            getFormData={getFormDataForWallet}
                                            onSuccess={onWalletPaymentSuccess}
                                            onCardToggle={setIsUsingCardPayment}
                                        />
                                    </Elements>
                                </div>
                            )}



                            {/* Show Place Order for COD or Card mode. Hide when GPay mode is active. */}
                            {paymentMethod === "online" && !isUsingCardPayment ? (
                                <p className="text-center text-[10px] sm:text-xs text-zinc-500 py-2">
                                    Tap the payment button above to complete your order, or switch to card
                                </p>
                            ) : isCodEnabled || !!isOnlineEnabled ? (
                                <button
                                    onClick={handleSubmit(handlePlaceOrder, onFormError)}
                                    disabled={loading}
                                    className={`group w-full flex items-center justify-center gap-3 py-4.5 font-bold rounded-xl sm:rounded-2xl text-sm sm:text-base transition-all duration-300 cursor-pointer
                                    ${!loading
                                            ? 'hover:bg-brand bg-green-700 text-white'
                                            : 'bg-white/5 text-zinc-500 cursor-not-allowed border border-white/5'}`}
                                >
                                    Place Order
                                    <FaArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            ) : (
                                <button
                                    onClick={() => toast.error("No Payment methods are available!")}
                                    disabled={allocatedTotal !== totalCartQty}
                                    className={`group w-full flex items-center justify-center gap-3 py-4.5 font-bold rounded-2xl transition-all duration-300 cursor-pointer
                                    ${allocatedTotal === totalCartQty
                                            ? 'bg-brand hover:bg-green-700 text-white shadow-lg shadow-brand/20'
                                            : 'bg-white/5 text-zinc-500 cursor-not-allowed border border-white/5'}`}
                                >
                                    No Payment methods are available!
                                </button>
                            )
                            }
                        </section>
                    </div>

                    {/* Right Column: Order Summary */}
                    <aside className="hidden lg:block lg:col-span-4 lg:sticky lg:top-8 lg:self-start order-1 lg:order-2 ">
                        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl  sm:rounded-3xl p-2 sm:p-3 shadow-2xl">
                            <h2 className="text-base sm:text-xl font-bold mb-5 sm:mb-8 flex items-center gap-2 sm:gap-3">
                                <FaShoppingBag className="text-white" size={14} />
                                Order Summary
                            </h2>

                            <div className="space-y-4 sm:space-y-6 mb-5 sm:mb-8 max-h-[350px] sm:max-h-[450px] overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
                                {items.map((item, idx) => (
                                    <div key={idx} className="flex gap-3 sm:gap-4 group">
                                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl bg-zinc-800 border border-white/5 overflow-hidden relative shrink-0">
                                            {item.image ? (
                                                <Img src={item.image} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-zinc-500">
                                                    <FaShoppingBag size={18} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start gap-2">
                                                <div>
                                                    <h3 className="font-bold text-white text-xs sm:text-sm line-clamp-1 mb-0.5">{item.name}</h3>
                                                    <p className="text-[10px] sm:text-[12px] text-zinc-200 font-medium">{item.selectedSize.name}</p>
                                                </div>
                                                <p className="text-xs sm:text-sm font-bold text-zinc-200">{symbol} {item.itemTotal.toFixed(2)}</p>
                                            </div>

                                            {item.selectedAddons && item.selectedAddons.length > 0 && (
                                                <div className="mt-2 sm:mt-3 text-[9px] sm:text-[10px] space-y-0.5">
                                                    {item.selectedAddons.map((addon, aIdx) => (
                                                        <div key={aIdx} className="flex justify-between text-zinc-300">
                                                            <span>+ {addon.qty}x {addon.name}</span>
                                                            <span className="text-zinc-300 ml-2">{symbol} {(parseFloat(addon.price) * addon.qty).toFixed(2)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="mt-1.5 sm:mt-2 text-[10px] sm:text-[11px] font-bold text-zinc-300">Qty: {item.quantity}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-white/5 pt-4 sm:pt-6 space-y-2.5 sm:space-y-4">
                                <div className="flex justify-between text-xs sm:text-sm text-zinc-300">
                                    <span>Subtotal</span>
                                    <span className="text-zinc-200">{symbol} {totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xs sm:text-sm text-zinc-300">
                                    <span>Delivery Fee</span>
                                    {orderType === 'collection' ? (
                                        <span className="text-green-400 line-through opacity-60">{symbol} {settingsDeliveryFee.toFixed(2)}</span>
                                    ) : deliveryChecked && deliveryZone ? (
                                        <span className="text-zinc-200">{symbol} {deliveryZone.delivery_fee.toFixed(2)}</span>
                                    ) : deliveryChecked && isOutOfRange ? (
                                        <span className="text-red-400 text-[10px] sm:text-xs">Out of range</span>
                                    ) : (
                                        <span className="text-zinc-500 text-[10px] sm:text-xs italic">Enter postcode to check</span>
                                    )}
                                </div>

                                <div className="flex justify-between text-xs sm:text-sm text-green-500">
                                    <span>Discount</span>
                                    <span className="text-green-500">{symbol} {discount.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between text-xs sm:text-sm text-zinc-300">
                                    <span>Tax ({tax}%)</span>
                                    <span className="text-zinc-200">{symbol} {taxAmount.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between items-center pt-3 sm:pt-4 border-t border-white/10">
                                    <span className="text-sm sm:text-base font-bold text-white">Total</span>
                                    <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
                                        {orderType === 'collection'
                                            ? `${symbol} ${(totalPrice + taxAmount - discount).toFixed(2)}`
                                            : deliveryChecked && deliveryZone
                                                ? `${symbol} ${grandTotal.toFixed(2)}`
                                                : `${symbol} ${(totalPrice + taxAmount - discount).toFixed(2)}` + (orderType === 'delivery' ? ' + delivery' : '')
                                        }
                                    </span>
                                </div>
                                {totalPrice < minOrderAmount && (
                                    <div className="mt-1.5 sm:mt-2 text-red-500 font-bold text-[10px] sm:text-[12px] text-center">
                                        Minimum order amount is {symbol} {minOrderAmount.toFixed(2)}
                                    </div>
                                )}

                            </div>

                            <div className="mt-3 sm:mt-4 flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/5 text-[9px] sm:text-[10px] text-zinc-400 justify-center uppercase tracking-widest font-bold">
                                <FaShieldAlt size={10} />
                                <span>Encrypted & Secure</span>
                            </div>
                        </div>
                    </aside>
                </div>
            </div >
        </div >
    );
}


const Loader = () => {
    return (
        <div className="fixed inset-0 bg-black /50 backdrop-blur-xs flex gap-2 items-center justify-center z-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-l-2 border-brand"></div>
        </div>
    );
}