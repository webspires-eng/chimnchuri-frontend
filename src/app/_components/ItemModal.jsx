"use client"
import { closeItemModal } from '@/store/features/itemModalSlice'
import React, { useEffect, useState } from 'react'
import { FaTimes, FaPlus, FaMinus, FaCheck, FaShoppingBag } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import Img from './Img'
import { addToCart } from '@/store/features/cartSlice'
import { useCurrency } from '../providers/SettingsProvider'
import Price from './Price'

const ItemModal = () => {
    const dispatch = useDispatch();

    const { code, symbol, format } = useCurrency();


    const { isModalOpen, itemData, isInCart } = useSelector((state) => state.itemModalSlice);
    const { items } = useSelector((state) => state.cartSlice);
    const { offer } = useSelector((state) => state.offerSlice);

    const data = itemData;

    let addon_groups = data?.addon_groups;

    const [selectedSize, setSelectedSize] = useState(data?.sizes[0] ?? {});
    const [selectedAddons, setSelectedAddons] = useState({})
    const [quantity, setQuantity] = useState(1)
    const [validationError, setValidationError] = useState("")
    const [errorGroupId, setErrorGroupId] = useState(null)

    useEffect(() => {
        if (data?.sizes && data.sizes.length > 0) {
            setSelectedSize(data.sizes[0]);
        }
    }, [data]);

    useEffect(() => {
        if (data?.sizes && data.sizes.length > 0) {
            setSelectedSize(data.sizes[0]);
        }
        setSelectedAddons({});
        setQuantity(1);
        setValidationError("");
        setErrorGroupId(null);
    }, [data, isModalOpen]);

    const handleAddonChange = (group, addonId, delta) => {
        setValidationError("");
        setErrorGroupId(null);
        setSelectedAddons(prev => {
            const currentGroupQtys = prev[group.id] || {};
            const currentQty = currentGroupQtys[addonId] || 0;
            const newQty = Math.max(0, currentQty + delta);

            if (group.selection_type === 'single') {
                // For single selection: if adding, set this addon to 1 and clear others
                if (delta > 0) {
                    return { ...prev, [group.id]: { [addonId]: 1 } };
                } else {
                    const minQty = group.min_qty ? parseInt(group.min_qty) : 0;
                    if (minQty === 0) {
                        const updated = { ...currentGroupQtys };
                        delete updated[addonId];
                        return { ...prev, [group.id]: updated };
                    }
                    return prev;
                }
            } else {
                // For multiple selection: allow quantity per addon
                const totalGroupQty = Object.entries(currentGroupQtys)
                    .filter(([id]) => id !== String(addonId))
                    .reduce((sum, [, q]) => sum + q, 0) + newQty;

                if (group.max_qty && totalGroupQty > group.max_qty) {
                    return prev;
                }

                const updated = { ...currentGroupQtys };
                if (newQty === 0) {
                    delete updated[addonId];
                } else {
                    updated[addonId] = newQty;
                }
                return { ...prev, [group.id]: updated };
            }
        });
    }

    const calculateTotalPrice = () => {
        let basePrice = parseFloat(selectedSize.price) || 0;
        let discountedBasePrice = basePrice;

        if (offer && offer.type === "percentage") {
            discountedBasePrice = basePrice - (basePrice * parseFloat(offer.value)) / 100;
        }

        let total = discountedBasePrice;

        Object.entries(selectedAddons).forEach(([groupId, addonQtys]) => {
            const group = addon_groups?.find(g => g.id === parseInt(groupId));
            if (group) {
                Object.entries(addonQtys).forEach(([addonId, qty]) => {
                    const addon = group.items.find(a => a.id === parseInt(addonId));
                    if (addon) {
                        let price = parseFloat(addon.price);
                        if (!price || price === 0) price = parseFloat(addon.addon_item?.price) || 0;
                        total += price * qty;
                    }
                });
            }
        });

        return (total * quantity).toFixed(2);
    }

    const validateAddons = () => {
        for (let group of addon_groups) {
            const groupQtys = selectedAddons[group.id] || {};
            const selectedCount = Object.values(groupQtys).reduce((sum, q) => sum + q, 0);
            const minQty = group.min_qty ? parseInt(group.min_qty) : 0;
            const isRequired = group.is_required;

            if (isRequired && selectedCount < Math.max(minQty, 1)) {
                const name = group.addon_category?.name || 'option';
                if (group.selection_type === 'single') {
                    setValidationError(`Please select a ${name}`);
                } else {
                    setValidationError(`Please select at least ${Math.max(minQty, 1)} item(s) from ${name}`);
                }
                setErrorGroupId(group.id);
                return false;
            }

            if (!isRequired && minQty > 0 && selectedCount > 0 && selectedCount < minQty) {
                setValidationError(`Please select at least ${minQty} item(s) from ${group.addon_category?.name || 'options'}`);
                setErrorGroupId(group.id);
                return false;
            }
        }
        return true;
    }

    const handleAddToCart = () => {
        setValidationError("");
        setErrorGroupId(null);
        if (!validateAddons()) {
            return;
        }

        const maxItems = process.env.NEXT_PUBLIC_MAX_CART_ITEMS ? parseInt(process.env.NEXT_PUBLIC_MAX_CART_ITEMS) : 5;
        const currentTotalItems = items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

        if (currentTotalItems + quantity > maxItems) {
            setValidationError(`You can only add up to ${maxItems} items in total. For larger orders, please contact our support.`);
            return;
        }


        dispatch(addToCart({
            item: data,
            selectedSize,
            selectedAddons,
            quantity,
            addonGroups: addon_groups
        }));

        setQuantity(1);
        setSelectedAddons({});
        setValidationError("");
        dispatch(closeItemModal());
    }




    return (
        <div
            className={`fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center transition-all duration-400 ${isModalOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
            onClick={(e) => e.target === e.currentTarget && dispatch(closeItemModal())}
        >
            <div className={`w-4xl max-w-[95vw] rounded-3xl bg-[#1a1a1a] text-white transition-all duration-400 flex flex-col max-h-[90vh] shadow-2xl shadow-black/50 border border-white/[0.06] ${isModalOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"}`}>

                {/* HEADER */}
                <div className="px-6 py-4 flex items-center justify-between shrink-0 border-b border-white/[0.06]">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-brand/15 flex items-center justify-center shrink-0">
                            <FaShoppingBag className="text-brand" size={14} />
                        </div>
                        <h2 className='text-lg font-bold truncate'>{data?.name}</h2>
                    </div>
                    <button
                        onClick={() => dispatch(closeItemModal())}
                        className='size-9 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer transition-all duration-300'>
                        <FaTimes size={16} />
                    </button>
                </div>

                {/* BODY */}
                <div className="overflow-y-auto flex-1 custom-scrollbar">
                    <div className="sm:flex items-start gap-0">

                        {/* IMAGE */}
                        <div className="sm:w-2/5 shrink-0 relative">
                            <div className="aspect-video sm:aspect-[4/5] relative overflow-hidden bg-zinc-800">
                                {data?.media?.[0]?.original_url ? (
                                    <Img
                                        src={data.media[0].original_url}
                                        className='w-full h-full object-cover'
                                        alt={data.name}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-500">
                                        <FaShoppingBag size={48} />
                                    </div>
                                )}
                                {/* Gradient overlay on bottom for mobile */}
                                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#1a1a1a] to-transparent sm:hidden" />
                            </div>
                        </div>

                        {/* DETAILS */}
                        <div className="flex-1 space-y-5 p-5 sm:p-6 pb-24 sm:pb-6">
                            {/* Description */}
                            {data?.description && (
                                <p className='text-sm text-zinc-300 leading-relaxed'>{data.description}</p>
                            )}

                            {/* SIZES */}
                            {data?.sizes?.length > 0 && (
                                <div>
                                    <h3 className='text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3'>Select Size</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {data.sizes.map((size) => {
                                            const isActive = selectedSize.id === size.id;
                                            return (
                                                <label
                                                    key={size.id}
                                                    className={`
                                                        relative flex items-center justify-between px-2 py-3 capitalize rounded-xl cursor-pointer
                                                        transition-all duration-300 border
                                                        ${isActive
                                                            ? 'border-brand bg-brand/10 shadow-sm shadow-brand/10'
                                                            : 'border-white/[0.06] bg-white/[0.03] hover:border-white/[0.12] hover:bg-white/[0.05]'
                                                        }
                                                    `}
                                                >
                                                    <div className="flex items-center gap-1">
                                                        <div className={`
                                                            w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center transition-all duration-300
                                                            ${isActive ? 'border-brand bg-brand' : 'border-zinc-600'}
                                                        `}>
                                                            {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                        </div>
                                                        <span className={`font-medium text-sm ${isActive ? 'text-white' : 'text-zinc-300'}`}>{size.name}</span>
                                                    </div>
                                                    <Price amount={size.price} className={`text-xs ${isActive ? 'text-white' : ''}`} />
                                                    <input
                                                        type="radio"
                                                        name="size"
                                                        value={size.id}
                                                        hidden
                                                        checked={isActive}
                                                        onChange={() => setSelectedSize(size)}
                                                    />
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* ADD-ONS */}
                            {addon_groups?.length > 0 && (
                                <div className="space-y-5">
                                    {addon_groups.map((group) => {
                                        const groupQtys = selectedAddons[group.id] || {};
                                        const groupCount = Object.values(groupQtys).reduce((sum, q) => sum + q, 0);
                                        const minQty = group.min_qty ? parseInt(group.min_qty) : 0;
                                        const maxQty = group.max_qty;
                                        const isRequired = group.is_required;
                                        const hasError = errorGroupId === group.id;

                                        const isUnderMin = isRequired
                                            ? groupCount < Math.max(minQty, 1)
                                            : (groupCount > 0 && groupCount < minQty);

                                        return (
                                            <div key={group.id} className={`rounded-2xl p-4 transition-all duration-300 ${hasError ? 'bg-red-500/5 ring-1 ring-red-500/20' : 'bg-white/[0.02]'}`}>
                                                <div className="flex items-center justify-between mb-3">
                                                    <div>
                                                        <h4 className='text-xs font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-2'>
                                                            {group.addon_category?.name}
                                                            {isRequired ? (
                                                                <span className='text-[10px] font-bold text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded-md uppercase'>Required</span>
                                                            ) : (
                                                                <span className="text-[10px] text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded-md">Optional</span>
                                                            )}
                                                        </h4>
                                                        <p className='text-[11px] text-zinc-500 mt-0.5'>
                                                            {group.selection_type === 'single'
                                                                ? (isRequired ? 'Choose one' : 'Optional (Choose one)')
                                                                : (minQty > 0
                                                                    ? `Choose ${minQty}${maxQty ? ` to ${maxQty}` : ' or more'}`
                                                                    : (maxQty ? `Choose up to ${maxQty}` : 'Choose any number'))
                                                            }
                                                        </p>
                                                    </div>
                                                    {group.selection_type === 'multiple' && (
                                                        <span className={`text-xs font-mono px-2.5 py-1 rounded-lg border transition-colors duration-300 ${hasError || isUnderMin
                                                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                                            : groupCount >= minQty && groupCount > 0
                                                                ? 'bg-brand/10 text-brand border-brand/20'
                                                                : 'bg-white/[0.05] text-zinc-400 border-white/[0.06]'
                                                            }`}>
                                                            {groupCount}{maxQty ? `/${maxQty}` : ''}
                                                        </span>
                                                    )}
                                                </div>
                                                {hasError && (
                                                    <p className="text-xs text-red-400 mb-2">⚠ {group.selection_type === 'single' ? `Please select a ${group.addon_category?.name || 'option'}` : `Select 0 or at least ${minQty} item(s)`}</p>
                                                )}

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    {group.items?.map((addon) => {
                                                        const addonQty = (groupQtys[addon.id] || 0);
                                                        const isSelected = addonQty > 0;
                                                        const totalGroupQty = groupCount;
                                                        const isMaxReached = group.max_qty && totalGroupQty >= group.max_qty;

                                                        let addonPrice = parseFloat(addon.price);
                                                        if (!addonPrice || addonPrice === 0) addonPrice = parseFloat(addon.addon_item?.price) || 0;

                                                        if (group.selection_type === 'single') {
                                                            return (
                                                                <label
                                                                    key={addon.id}
                                                                    onClick={() => isSelected ? handleAddonChange(group, addon.id, -1) : handleAddonChange(group, addon.id, 1)}
                                                                    className={`
                                                                    flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer
                                                                    transition-all duration-300
                                                                    ${isSelected
                                                                            ? 'border-brand bg-brand/10 shadow-sm shadow-brand/5'
                                                                            : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]'
                                                                        }
                                                                `}
                                                                >
                                                                    <div className={`
                                                                    w-[18px] h-[18px] shrink-0 flex items-center justify-center
                                                                    transition-all duration-300 border-2 rounded-full
                                                                    ${isSelected ? 'bg-brand border-brand' : 'border-zinc-500 bg-transparent'}
                                                                `}>
                                                                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                                    </div>

                                                                    {addon.addon_item?.image && (
                                                                        <Img src={addon.addon_item.image} alt="" className="w-8 h-8 rounded-lg object-cover bg-zinc-700 shrink-0" />
                                                                    )}

                                                                    <div className="flex-1 min-w-0">
                                                                        <p className={`text-sm font-medium truncate ${isSelected ? 'text-white' : 'text-zinc-300'}`}>{addon.addon_item?.name}</p>
                                                                    </div>

                                                                    <span className={`text-xs whitespace-nowrap font-medium ${isSelected ? 'text-brand' : 'text-zinc-400'}`}>
                                                                        + {symbol} {addonPrice}
                                                                    </span>
                                                                </label>
                                                            );
                                                        }

                                                        // Multiple selection with quantity controls
                                                        return (
                                                            <div
                                                                key={addon.id}
                                                                className={`
                                                                flex items-center gap-3 px-3 py-2.5 rounded-xl border
                                                                transition-all duration-300
                                                                ${isSelected
                                                                        ? 'border-brand bg-brand/10 shadow-sm shadow-brand/5'
                                                                        : 'border-white/[0.06] bg-white/[0.02]'
                                                                    }
                                                            `}
                                                            >
                                                                {addon.addon_item?.image && (
                                                                    <Img src={addon.addon_item.image} alt="" className="w-8 h-8 rounded-lg object-cover bg-zinc-700 shrink-0" />
                                                                )}

                                                                <div className="flex-1 min-w-0">
                                                                    <p className={`text-sm font-medium truncate ${isSelected ? 'text-white' : 'text-zinc-300'}`}>{addon.addon_item?.name}</p>
                                                                    <span className={`text-[11px] whitespace-nowrap font-medium ${isSelected ? 'text-brand' : 'text-zinc-500'}`}>
                                                                        {symbol} {addonPrice} each
                                                                    </span>
                                                                </div>

                                                                <div className="flex items-center bg-white/[0.05] border border-white/[0.08] rounded-lg shrink-0">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleAddonChange(group, addon.id, -1)}
                                                                        disabled={addonQty <= 0}
                                                                        className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.06] rounded-l-lg transition-all duration-300 cursor-pointer disabled:opacity-30"
                                                                    >
                                                                        <FaMinus size={8} />
                                                                    </button>
                                                                    <span className="w-6 text-center text-xs font-bold text-white select-none">{addonQty}</span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleAddonChange(group, addon.id, 1)}
                                                                        disabled={isMaxReached && !isSelected}
                                                                        className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.06] rounded-r-lg transition-all duration-300 cursor-pointer disabled:opacity-30"
                                                                    >
                                                                        <FaPlus size={8} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="border-t border-white/[0.06] p-4 sm:p-5 shrink-0 bg-[#141414]  rounded-b-3xl">
                    {validationError && (
                        <div className="mb-3 text-sm font-medium text-center py-2.5 px-4 rounded-xl bg-red-500/10 border border-red-500/15 text-red-400">
                            {validationError}
                        </div>
                    )}

                    <div className="flex gap-3 items-center max-w-lg mx-auto">
                        {/* Quantity Stepper */}
                        <div className="flex items-center bg-white/[0.05] border border-white/[0.08] rounded-xl h-12 shrink-0">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-11 h-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.06] rounded-l-xl transition-all duration-300 cursor-pointer"
                            >
                                <FaMinus size={11} />
                            </button>
                            <span className="w-10 text-center font-bold text-base text-white select-none">{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="w-11 h-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.06] rounded-r-xl transition-all duration-300 cursor-pointer"
                            >
                                <FaPlus size={11} />
                            </button>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                            onClick={handleAddToCart}
                            className="flex-1 h-12 rounded-xl bg-brand hover:bg-green-700 active:bg-green-800 text-white font-bold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-brand/20 hover:shadow-brand/30 cursor-pointer"
                        >
                            <span>Add to Order</span>
                            <span className=" px-3 py-1 rounded-lg text-sm font-semibold">{symbol} {calculateTotalPrice()}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ItemModal
