"use client"
import Link from 'next/link'
import React from 'react'
import { useSettings } from '../providers/SettingsProvider'
import { FaFacebookF, FaInstagram, FaLinkedin, FaTiktok, FaTwitter, FaWhatsapp, FaYoutube } from 'react-icons/fa'

const Footer = () => {
    const settings = useSettings();
    const socialLinks = settings?.social_links ? JSON.parse(settings?.social_links) : null;
    return (
        <footer className='mt-auto'>
            <div className="container mx-auto px-3 pt-10">
                <div className='grid grid-cols-2 lg:grid-cols-3 gap-3'>
                    <div className="mb-2">
                        <h3 className='text-xl lg:text-2xl font-bold mb-2 md:mb-4'>Help</h3>
                        <ul>
                            <li className=''>
                                <Link className='text-sm md:text-md mb-1 md:mb-2 text-white/80 hover:text-brand transition ease duration-200 inline-block' href={"/categories"}>Menu</Link>
                            </li>
                            <li className=''>
                                <Link className='text-sm md:text-md mb-1 md:mb-2 text-white/80 hover:text-brand transition ease duration-200 inline-block' href={"/categories"}>Order online</Link>
                            </li>
                            <li className=''>
                                <Link className='text-sm md:text-md mb-1 md:mb-2 text-white/80 hover:text-brand transition ease duration-200 inline-block' href={"/contact"}>Contact Us</Link>
                            </li>
                            <li className=''>
                                <Link className='text-sm md:text-md mb-1 md:mb-2 text-white/80 hover:text-brand transition ease duration-200 inline-block' href={"/about"}>About Us</Link>
                            </li>
                            <li className=''>
                                <Link className='text-sm md:text-md mb-1 md:mb-2 text-white/80 hover:text-brand transition ease duration-200 inline-block' href={"/team"}>Our Team</Link>
                            </li>
                        </ul>
                    </div>



                    <div className="mb-2">
                        <h3 className='text-xl lg:text-2xl font-bold mb-2 md:mb-4'>Address</h3>
                        <ul>
                            <li className=''>
                                <p className='text-sm md:text-md mb-1 md:mb-2 text-white/80 hover:text-brand transition ease duration-200 inline-block'>{settings?.address}, {settings?.city}, {settings?.state}, {settings?.postcode}</p>
                            </li>
                            <li className=''>
                                <Link className='text-sm md:text-md mb-1 md:mb-2 text-white/80 hover:text-brand transition ease duration-200 inline-block' href={`tel:${settings?.phone}`}>{settings?.phone}</Link>
                            </li>
                            <li className=''>
                                <Link className='text-sm md:text-md mb-1 md:mb-2 text-white/80 hover:text-brand transition ease duration-200 inline-block' href={`mailto:${settings?.email}`}>{settings?.email}</Link>
                            </li>

                        </ul>
                    </div>

                    <div className="mb-2">
                        <h3 className='text-xl lg:text-2xl font-bold mb-2 md:mb-4'>Follow Us</h3>
                        <ul className="flex item-center gap-2 flex-wrap">
                            {
                                socialLinks?.fb_link && (
                                    <li className=''>
                                        <Link className='text-white border border-white/10 bg-brand/20 hover:bg-brand hover:border-brand transition ease duration-200 size-10 rounded-full bg-brand flex items-center justify-center' href={socialLinks?.fb_link}>
                                            <FaFacebookF />
                                        </Link>
                                    </li>
                                )
                            }

                            {
                                socialLinks?.insta_link && (
                                    <li className=''>
                                        <Link className='text-white border border-white/10 bg-brand/20 hover:bg-brand hover:border-brand transition ease duration-200 size-10 rounded-full bg-brand flex items-center justify-center' href={socialLinks?.insta_link}>
                                            <FaInstagram />
                                        </Link>
                                    </li>
                                )
                            }

                            {
                                socialLinks?.twitter_link && (
                                    <li className=''>
                                        <Link className='text-white border border-white/10 bg-brand/20 hover:bg-brand hover:border-brand transition ease duration-200 size-10 rounded-full bg-brand flex items-center justify-center' href={socialLinks?.twitter_link}>
                                            <FaTwitter />
                                        </Link>
                                    </li>
                                )
                            }

                            {
                                socialLinks?.youtube_link && (
                                    <li className=''>
                                        <Link className='text-white border border-white/10 bg-brand/20 hover:bg-brand hover:border-brand transition ease duration-200 size-10 rounded-full bg-brand flex items-center justify-center' href={socialLinks?.youtube_link}>
                                            <FaYoutube />
                                        </Link>
                                    </li>
                                )
                            }

                            {
                                socialLinks?.linkedin_link && (
                                    <li className=''>
                                        <Link className='text-white border border-white/10 bg-brand/20 hover:bg-brand hover:border-brand transition ease duration-200 size-10 rounded-full bg-brand flex items-center justify-center' href={socialLinks?.linkedin_link}>
                                            <FaLinkedin />
                                        </Link>
                                    </li>
                                )
                            }
                            {
                                socialLinks?.tiktok_link && (
                                    <li className=''>
                                        <Link className='text-white border border-white/10 bg-brand/20 hover:bg-brand hover:border-brand transition ease duration-200 size-10 rounded-full bg-brand flex items-center justify-center' href={socialLinks?.tiktok_link}>
                                            <FaTiktok />
                                        </Link>
                                    </li>
                                )
                            }

                            {
                                socialLinks?.whatsapp_link && (
                                    <li className=''>
                                        <Link className='text-white border border-white/10 bg-brand/20 hover:bg-brand hover:border-brand transition ease duration-200 size-10 rounded-full bg-brand flex items-center justify-center' href={socialLinks?.whatsapp_link}>
                                            <FaWhatsapp />
                                        </Link>
                                    </li>
                                )
                            }


                        </ul>
                    </div>

                </div>
            </div>
            <div className="border-b border-gray-600/40 my-4"></div>
            <div className="container mx-auto pb-4 px-2 md:px-4">
                <div className="flex gap-3 text-center md:text-left flex-col md:flex-row items-center justify-center md:justify-between">
                    <p>Copyright © {new Date().getFullYear()} {settings?.restaurant_name} all Right Reserved</p>

                    <div className="flex items-center gap-4 text-xs font-semibold">
                        <Link href="/privacy" className="hover:text-brand transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-brand transition-colors">Terms & Conditions</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
