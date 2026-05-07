import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import React from 'react'
import CategoryClient from './CategoryClient';
import { categryKeys } from '@/features/categories/keys';
import { prefetchCategory } from '@/features/categories/prefetch';
import { fetchCategory, fetchOrderDates } from '@/lib/api';


export async function generateMetadata({ params }) {
    const { slug } = await params;

    const { data } = await fetchCategory(slug);
    const url = `https://chimnchurri.com/category/${slug}`;
    const category = data;
    return {
        title: category?.name,
        description: category?.meta_description || `Browse products in ${category?.name}`,
        openGraph: {
            title: category?.meta_title || category?.name,
            description: category?.description,
            images: [category?.image_url],
        },
        alternates: {
            canonical: url,
        },
    };
}

const Category = async ({ params }) => {
    const queryClient = new QueryClient();

    const { slug } = await params;

    await prefetchCategory(queryClient, slug);
    await queryClient.prefetchQuery({ queryKey: ['orderDates'], queryFn: fetchOrderDates });

    return (
        <>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <CategoryClient />
            </HydrationBoundary>
        </>
    )
}

export default Category
