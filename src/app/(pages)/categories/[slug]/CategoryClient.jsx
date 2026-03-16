"use client";
import React from 'react'
import { useParams } from 'next/navigation';
import { useCategory } from '@/features/categories/hooks';
import ProductCard from '@/app/_components/ProductCard';
import ItemModal from '@/app/_components/ItemModal';
import AvailabilityPanel from '@/app/_components/AvailabilityPanel';

const CategoryClient = () => {
    const { slug } = useParams();

    const { data, isLoading, error } = useCategory(slug);

    if (isLoading) return <div>Loading...</div>;

    if (error) return <div>Error loading category</div>;
    const items = data?.data?.items || [];
    const childern = data?.data?.children || [];

    return (
        <div>
            <ItemModal />
            <div className="container mx-auto px-2 md:px-4 my-6 sm:my-10 mb-14 sm:mb-20">

                <div className="my-3 sm:my-4">
                    <h3 className='text-lg sm:text-2xl md:text-3xl font-bold'>{data?.data?.name}</h3>
                </div>

                {/* Two-column layout: product grid left, availability panel right */}
                <div className="flex flex-col lg:flex-row gap-5 lg:gap-8 items-start">

                    {/* Product grid */}
                    <div className="flex-1 min-w-0">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-1.5 sm:gap-2 md:gap-4">
                            {items?.map((item, idx) => (
                                <div className="" key={idx}>
                                    <ProductCard item={item} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Availability panel — sticky on desktop, stacked below on mobile */}
                    <div className="w-full lg:w-72 xl:w-80 shrink-0 lg:sticky lg:top-24">
                        <AvailabilityPanel />
                    </div>

                </div>
            </div>
        </div>
    )
}

export default CategoryClient
