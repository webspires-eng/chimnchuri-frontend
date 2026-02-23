"use client"
import { useState } from "react";
import Link from "next/link";

export default function MenuSection() {
    const [open, setOpen] = useState(false);

    return (
        <div
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            className="text-center max-w-xl mx-auto text-white grid justify-center text-5xl md:text-9xl space-y-4 font-bold uppercase cursor-pointer"
        >
            <img src="https://framerusercontent.com/images/lqVLSf1L7iXRjlle5r0lSDziZJc.png?scale-down-to=512" alt="" />

            <div
                className={`grid items-center overflow-hidden transition-all duration-500 ${open ? "h-[200px] md:h-[500px]" : "h-0"
                    }`}
            >
                <Link href="/categories" className="hover:scale-125 hover:text-brand transition-all duration-500">
                    Menu
                </Link>
                <Link href="/categories" className="hover:scale-125 hover:text-brand transition-all duration-500">
                    Order
                </Link>
                <Link href="/team" className="hover:scale-125 hover:text-brand transition-all duration-500">
                    Team
                </Link>
            </div>

            <img src="https://framerusercontent.com/images/IBVmg3xN8SihQw2iTYArGQgLrU.png?scale-down-to=512" alt="" />
        </div>
    );
}
