"use client"
import React from 'react'
import { useSettings } from '../providers/SettingsProvider';
import Link from 'next/link';
import { FaFacebookF, FaInstagram, FaTiktok, FaEnvelope, FaWhatsapp, FaYoutube, FaLinkedin, FaTwitter } from 'react-icons/fa';

const HomeFooter = () => {
    const settings = useSettings();
    const socialLinks = settings?.social_links ? JSON.parse(settings?.social_links) : null;
    return (
        <>
            <section className="py-10 px-3 lg:py-20 bg-brand">
                <div className="max-w-auto mx-auto text-center  font-bold uppercase">
                    {/* <img src={settings?.restaurant_logo ? process.env.NEXT_PUBLIC_BASE_URL + "/" + settings?.restaurant_logo : "/logo.png"} className='h-[100px] mx-auto' alt="" /> */}
                    <img src={process.env.NEXT_PUBLIC_BASE_URL && settings?.restaurant_logo ? `${process.env.NEXT_PUBLIC_BASE_URL}/${settings.restaurant_logo}` : "/logo-light.png"} className='h-[140px] mx-auto' onError={(e) => e.target.src = "/logo-light.png"} alt="Chim 'N' Churri " />
                    {/* <h3 className="text-3xl md:text-5xl text-brand text-shadow-lg uppercase ">{settings?.restaurant_name}</h3> */}

                    <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5 font-bold text-md mt-8">
                        <Link href="/" className="text-white hover:text-black transition-all duration-500 text-sm md:text-lg">Home</Link>
                        <Link href="/categories" className="text-white hover:text-black transition-all duration-500 text-sm md:text-lg">Our Menu</Link>
                        <Link href="/contact" className="text-white hover:text-black transition-all duration-500 text-sm md:text-lg">Contact</Link>
                        <Link href="/team" className="text-white hover:text-black transition-all duration-500 text-sm md:text-lg">Team</Link>
                        <Link href="/privacy" className="text-white hover:text-black transition-all duration-500 text-sm md:text-lg">Privacy Policy</Link>
                        <Link href="/terms" className="text-white hover:text-black transition-all duration-500 text-sm md:text-lg">Terms & Conditions</Link>
                    </div>

                    <ul className="flex items-center justify-center flex-wrap gap-5 mt-5">
                        {
                            socialLinks?.fb_link && (
                                <li className=''>
                                    <Link target='_blank' className="text-white hover:text-black transition-all duration-500" href={socialLinks?.fb_link}>
                                        <FaFacebookF size={22} />
                                    </Link>
                                </li>
                            )
                        }

                        {
                            socialLinks?.insta_link && (
                                <li className=''>
                                    <Link target='_blank' className="text-white hover:text-black transition-all duration-500" href={socialLinks?.insta_link}>
                                        <FaInstagram size={22} />
                                    </Link>
                                </li>
                            )
                        }

                        {
                            socialLinks?.twitter_link && (
                                <li className=''>
                                    <Link target='_blank' className="text-white hover:text-black transition-all duration-500" href={socialLinks?.twitter_link}>
                                        <FaTwitter size={22} />
                                    </Link>
                                </li>
                            )
                        }

                        {
                            socialLinks?.youtube_link && (
                                <li className=''>
                                    <Link target='_blank' className="text-white hover:text-black transition-all duration-500" href={socialLinks?.youtube_link}>
                                        <FaYoutube size={22} />
                                    </Link>
                                </li>
                            )
                        }

                        {
                            socialLinks?.linkedin_link && (
                                <li className=''>
                                    <Link target='_blank' className="text-white hover:text-black transition-all duration-500" href={socialLinks?.linkedin_link}>
                                        <FaLinkedin size={22} />
                                    </Link>
                                </li>
                            )
                        }
                        {
                            socialLinks?.tiktok_link && (
                                <li className=''>
                                    <Link target='_blank' className="text-white hover:text-black transition-all duration-500" href={socialLinks?.tiktok_link}>
                                        <FaTiktok size={22} />
                                    </Link>
                                </li>
                            )
                        }

                        {
                            socialLinks?.whatsapp_link && (
                                <li className=''>
                                    <Link target='_blank' className="text-white hover:text-black transition-all duration-500" href={socialLinks?.whatsapp_link}>
                                        <FaWhatsapp size={22} />
                                    </Link>
                                </li>
                            )
                        }


                    </ul>

                </div>
            </section>
            <div className="text-center bg-brand pb-4 text-xs sm:text-sm md:text-lg">
                <p>{new Date().getFullYear()} © {settings?.restaurant_name}. Developed by <a target='_blank' href="https://webspires.co.uk/?utm_source=chimnchurri" className="text-white hover:text-black transition-all duration-500">Webspires</a></p>
            </div>
        </>
    )
}

export default HomeFooter