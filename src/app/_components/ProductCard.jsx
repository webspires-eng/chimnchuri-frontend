"use client";
import React from 'react'
import Img from './Img'
import { FaPlus, FaShoppingBag } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { openItemModal } from '@/store/features/itemModalSlice';
import { useCurrency } from '../providers/SettingsProvider';
import Price from './Price';

const ProductCard = ({ item }) => {

    const { offer } = useSelector((state) => state.offerSlice);
    const dispatch = useDispatch();
    const { format } = useCurrency();


    const img = item?.media[0]?.original_url ?? null;
    const price = item?.sizes[0]?.price;

    return (
        <div
            className='group relative rounded-2xl overflow-hidden h-full bg-[#1e1e1e] border border-white/[0.06] hover:border-brand/30 transition-all duration-400 cursor-pointer shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-brand/5'
            onClick={() => dispatch(openItemModal(item))}
        >
            {/* Image */}
            <div className="aspect-square overflow-hidden relative bg-zinc-800">
                {img ? (
                    <Img
                        src={img}
                        className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out'
                        alt={item?.name}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-500">
                        <FaShoppingBag size={36} />
                    </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#1e1e1e] to-transparent" />


                {/* Discount badge */}
                {offer?.type == "percentage" && (
                    <div className="absolute top-2.5 left-2.5 bg-green-500/60 backdrop-blur-md rounded-full  flex items-center justify-center border border-white/10">
                        <p className="text-[10px] px-3 pt-1.5 pb-1 leading-none  text-white">{`${Number(offer?.value).toFixed(0)}% OFF`}</p>
                    </div>
                )}



            </div>

            {/* Content */}
            <div className="px-3 pb-3 pt-1 flex flex-col gap-1.5">
                <h3 className='text-sm sm:text-[15px] font-bold capitalize text-white line-clamp-1 group-hover:text-brand transition-colors duration-300'>
                    {item?.name?.toLowerCase()}
                </h3>

                <p className='line-clamp-2 text-[12px] leading-relaxed text-zinc-300 min-h-[2lh]'>
                    {item?.description}
                </p>

                {/* Bottom row */}
                <div className="flex items-center justify-between mt-1">
                    {price && (
                        <Price amount={price} className="text-xl font-bold" />
                    )}

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            dispatch(openItemModal(item));
                        }}
                        className='ml-auto size-8 rounded-xl bg-brand/15 hover:bg-brand text-white hover:text-white flex items-center justify-center cursor-pointer transition-all duration-300 group-hover:bg-brand group-hover:text-white'
                    >
                        <FaPlus size={12} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProductCard
