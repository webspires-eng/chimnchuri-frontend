

import React from 'react'
import Header from '../_components/Header'
import Footer from '../_components/Footer'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { fetchOrderDates } from '@/lib/api'

const MainLayout = async ({ children }) => {
    const queryClient = new QueryClient()
    await queryClient.prefetchQuery({ queryKey: ['orderDates'], queryFn: fetchOrderDates })

    return (
        <div className='flex flex-col  min-h-screen'>
            <div className="">
                <HydrationBoundary state={dehydrate(queryClient)}>
                    {children}
                </HydrationBoundary>
            </div>
            <Footer />
        </div>
    )
}

export default MainLayout
