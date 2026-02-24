"use client"
import React from 'react'
// import c from "@/assets/images/c.png"
// import h from "@/assets/images/h.png"
// import i from "@/assets/images/i.png"
// import m from "@/assets/images/m.png"
// import n from "@/assets/images/n.png"
// import u from "@/assets/images/u.png"
// import r from "@/assets/images/r.png"
import { useSettings } from '../providers/SettingsProvider'

const HeroSection = () => {
    const settings = useSettings();

    // let images = [{ src: c, alt: "C" }, { src: h, alt: "H" }, { src: i, alt: "I" }, { src: m, alt: "M" }, { src: n, alt: "N" }, { src: c, alt: "C" }, { src: h, alt: "H" }, { src: u, alt: "U" }, { src: r, alt: "R" }, { src: r, alt: "R" }, { src: i, alt: "I" }];
    return (
        <>
            <section>
                <div className="bg-brand py-0 min-h-[20vh] lg:min-h-[50vh] flex items-center justify-center">
                    <div className="flex justify-center">

                        <img src={settings?.restaurant_logo ? `${process.env.NEXT_PUBLIC_BASE_URL}/${settings?.restaurant_logo}` : "/logo-light.png"} className='max-w-[80vw]  sm:max-w-[50vw] md:max-w-[30vw] mx-auto' onError={(e) => e.target.src = "/logo-light.png"} alt="Chim 'N' Churri " />


                        {/* {
                            images?.map((img, index) => (
                                <img key={index} src={img?.src?.src} alt={img.alt} height={100} className="h-[12vw] animate-image-wave"
                                    style={{ animationDelay: `${index * 0.12}s` }} />
                            ))
                        } */}
                    </div>
                </div>
            </section>
        </>
    )
}

export default HeroSection