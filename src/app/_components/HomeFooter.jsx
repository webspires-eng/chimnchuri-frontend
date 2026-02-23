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
            <section className="py-10 lg:py-20">
                <div className="max-w-xl mx-auto text-center  font-bold uppercase">
                    <h3 className="text-3xl md:text-5xl text-brand text-shadow-lg uppercase ">{settings?.restaurant_name}</h3>

                    <div className="flex flex-wrap items-center justify-center gap-5 font-bold text-md mt-5">
                        <Link href="/" className="text-white hover:text-brand transition-all duration-500">Home</Link>
                        <Link href="/categories" className="text-white hover:text-brand transition-all duration-500">Menu</Link>
                        <Link href="/categories" className="text-white hover:text-brand transition-all duration-500">Our Food</Link>
                        <Link href="/contact" className="text-white hover:text-brand transition-all duration-500">Contact</Link>
                        <Link href="/team" className="text-white hover:text-brand transition-all duration-500">Team</Link>
                    </div>

                    <ul className="flex items-center justify-center flex-wrap gap-5 mt-5">
                        {
                            socialLinks?.fb_link && (
                                <li className=''>
                                    <Link target='_blank' className="text-white hover:text-brand transition-all duration-500" href={socialLinks?.fb_link}>
                                        <FaFacebookF size={22} />
                                    </Link>
                                </li>
                            )
                        }

                        {
                            socialLinks?.insta_link && (
                                <li className=''>
                                    <Link target='_blank' className="text-white hover:text-brand transition-all duration-500" href={socialLinks?.insta_link}>
                                        <FaInstagram size={22} />
                                    </Link>
                                </li>
                            )
                        }

                        {
                            socialLinks?.twitter_link && (
                                <li className=''>
                                    <Link target='_blank' className="text-white hover:text-brand transition-all duration-500" href={socialLinks?.twitter_link}>
                                        <FaTwitter size={22} />
                                    </Link>
                                </li>
                            )
                        }

                        {
                            socialLinks?.youtube_link && (
                                <li className=''>
                                    <Link target='_blank' className="text-white hover:text-brand transition-all duration-500" href={socialLinks?.youtube_link}>
                                        <FaYoutube size={22} />
                                    </Link>
                                </li>
                            )
                        }

                        {
                            socialLinks?.linkedin_link && (
                                <li className=''>
                                    <Link target='_blank' className="text-white hover:text-brand transition-all duration-500" href={socialLinks?.linkedin_link}>
                                        <FaLinkedin size={22} />
                                    </Link>
                                </li>
                            )
                        }
                        {
                            socialLinks?.tiktok_link && (
                                <li className=''>
                                    <Link target='_blank' className="text-white hover:text-brand transition-all duration-500" href={socialLinks?.tiktok_link}>
                                        <FaTiktok size={22} />
                                    </Link>
                                </li>
                            )
                        }

                        {
                            socialLinks?.whatsapp_link && (
                                <li className=''>
                                    <Link target='_blank' className="text-white hover:text-brand transition-all duration-500" href={socialLinks?.whatsapp_link}>
                                        <FaWhatsapp size={22} />
                                    </Link>
                                </li>
                            )
                        }


                    </ul>

                </div>
            </section>
            <div className="text-center">
                <p>{new Date().getFullYear()} © {settings?.restaurant_name}. Developed by <a target='_blank' href="https://webspires.com.pk/?utm_source=chimnchurri" className="text-white hover:text-brand transition-all duration-500">Webspires</a></p>
            </div>
        </>
    )
}

export default HomeFooter