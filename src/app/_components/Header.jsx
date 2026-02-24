"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { FaBars, FaCarAlt, FaCartPlus, FaTimes, FaUser } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import SidebarCart from './SidebarCart'
import { toggleCart } from '@/store/features/cartSlice'
import { useSettings } from '../providers/SettingsProvider'
import { useOffer } from '@/hooks/useOffer'

import { useQueryClient } from '@tanstack/react-query'



const Header = () => {

    const queryClient = useQueryClient();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('cache') === 'clear') {
            queryClient.clear();
        }
    }, [queryClient]);




    const { data: offerData, isLoading: offerLoading, error: offerError } = useOffer();

    const [mounted, setMounted] = useState(false)
    const auth = useSelector((state) => state.authSlice);

    const settings = useSettings();

    const [isOpenMobileNav, setIsOpenMobileNav] = useState(false);
    const dispatch = useDispatch();

    const { items, totalItems, totalPrice } = useSelector((state) => state.cartSlice);

    const toggleMobileNav = () => {
        setIsOpenMobileNav(!isOpenMobileNav);
    }
    useEffect(() => {
        setMounted(true)
    }, [])
    return (
        <>
            <SidebarCart />
            <header className='px-2 py-4 xl:px-28 bg-brand text-white'>
                <div className="container mx-auto flex items-center justify-between">

                    <a href="/">
                        {/* <Image src={settings?.restaurant_logo ? `${process.env.NEXT_PUBLIC_BASE_URL}/${settings?.restaurant_logo}` : "/logo-light.png"} alt="Chim 'N' Churri " width={100} height={60} /> */}
                        <img src={`${process.env.NEXT_PUBLIC_BASE_URL}/${settings?.restaurant_logo}`} onError={(e) => e.target.src = "/logo-light.png"} alt="Chim 'N' Churri " className='size-[100px]' />
                    </a>

                    <ul className='hidden lg:flex lg:relative items-center gap-8 font-medium text-xl'>
                        <li><Link href={"/categories"}>Our Menu</Link></li>
                        <li><Link href={"/about"}>About</Link></li>
                        <li><Link href={"/contact"}>Contact</Link></li>
                        <li><Link href={"/categories"}
                            className='px-5 py-3 bg-black rounded-xl text-lg border-2 border-black  hover:bg-brand focus:bg-brand transition-all duration-500'
                        >Order Online</Link></li>
                    </ul>

                    <div className="flex items-center text-xs md:text-[14px] gap-3 md:gap-6">
                        {auth?.isAuthenticated && mounted ? (
                            <Link href={"/profile"} className='flex items-center gap-2'>
                                <FaUser size={20} /> {auth?.user?.name}
                            </Link>
                        ) : (
                            <Link href={"/login"} className='flex items-center gap-2'>
                                <FaUser size={20} /> Sign in
                            </Link>
                        )}

                        <button
                            onClick={() => dispatch(toggleCart(true))}
                            className='flex items-center gap-2 relative cursor-pointer'
                        >
                            <span
                                className='absolute left-2 -top-4 size-5 text-xs rounded-full flex items-center justify-center bg-white text-brand font-bold '
                            >{totalItems}</span>
                            <FaCartPlus size={20} />
                            {/* <span>Rs {totalPrice.toFixed(2)}</span> */}
                        </button>

                        <button onClick={toggleMobileNav} className='block lg:hidden cursor-pointer text-xl'>
                            <FaBars />
                        </button>

                    </div>


                </div>



            </header>
            {/* MOBILE MENU */}
            <div className={`block transition duration-500  fixed z-50 top-0 left-0 w-3xs backdrop-blur-xs bg-white/80 h-screen p-2 ${isOpenMobileNav ? "translate-x-0" : "-translate-x-full"}`}>
                <button onClick={toggleMobileNav} className='size-9 ms-auto text-md flex items-center justify-center rounded-full bg-black cursor-pointer'>
                    <FaTimes />
                </button>

                <ul className='grid text-black gap-2 pt-10 '>
                    <li className='border-b transition duration-300 rounded-sm hover:bg-brand text-brand hover:text-white border-zinc-400/30'><Link onClick={toggleMobileNav} className='block px-2 py-2 ' href={"/categories"}>Our Menu</Link></li>
                    <li className='border-b transition duration-300 rounded-sm hover:bg-brand text-brand hover:text-white border-zinc-400/30'><Link onClick={toggleMobileNav} className='block px-2 py-2 ' href={"/about"}>About</Link></li>
                    <li className='border-b transition duration-300 rounded-sm hover:bg-brand text-brand hover:text-white border-zinc-400/30'><Link onClick={toggleMobileNav} className='block px-2 py-2 ' href={"/contact"}>Contact</Link></li>
                    <li className='mt-4'><Link href={"/categories"}
                        className=' py-2 w-full flex justify-center items-center text-white text-center bg-brand rounded-xl text-lg hover:bg-black hover:text-white transition-all duration-500'
                    >Order Online</Link></li>
                </ul>
            </div>
        </>
    )
}

export default Header
