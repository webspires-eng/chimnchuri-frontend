'use client';

import React, { useState } from 'react';
import {
    FaQuestionCircle,
    FaShoppingBag,
    FaCar,
    FaTruck,
    FaClock,
    FaDrumstickBite,
    FaMosque,
    FaLeaf,
    FaBreadSlice,
    FaCreditCard,
    FaCalendarAlt,
    FaUndoAlt,
    FaMapMarkerAlt,
    FaCalendarCheck,
    FaFire,
    FaEnvelope,
    FaInstagram,
    FaTiktok,
    FaChevronDown,
} from 'react-icons/fa';

const faqs = [
    {
        id: 1,
        icon: <FaShoppingBag />,
        question: 'How does ordering work?',
        answer: `We operate on a <strong>pre-order only basis</strong>.<br/><br/>
<strong>When to order:</strong> Order slots for the upcoming Friday, Saturday, or both are opened on our website each Sunday or Monday.<br/><br/>
<strong>Best time to order:</strong> To secure your preferred slot, it's best to place your order between Sunday and Thursday.<br/><br/>
<strong>Real-time availability:</strong> When you click to order, you can see live availability including:<br/>
&nbsp;&nbsp;• Which days we are open<br/>
&nbsp;&nbsp;• How many steaks are left<br/>
&nbsp;&nbsp;• Available time slots<br/><br/>
Please note that availability can change in real time if someone else is ordering at the same time.<br/><br/>
<strong>First come, first served:</strong> We usually sell out by Thursday or Friday morning, so ordering early helps ensure availability.<br/><br/>
<strong>How to order:</strong> Orders are placed through our website. For larger orders or special requests, contact us via Instagram, TikTok <a href="https://www.tiktok.com/@chimnchurri" target="_blank" class="text-brand hover:underline font-semibold">@chimnchurri</a>, or email <a href="mailto:info@chimnchurri.com" class="text-brand hover:underline font-semibold">info@chimnchurri.com</a>.<br/><br/>
<strong>Social updates:</strong> Check our Instagram or TikTok for the latest info on open days, times, and availability.`,
    },
    {
        id: 2,
        icon: <FaCar />,
        question: 'How do I receive my order?',
        answer: `We operate a <strong>kerbside drop-off service</strong>. When you arrive at our location in Chadderton, Oldham, Greater Manchester, OL9, a member of our team will bring your food directly to your car.<br/><br/>
• To ensure smooth service, we take all your details when you place your order, such as car registration, so we can identify your vehicle easily.<br/><br/>
<strong>Walk-up/local customers:</strong> If you don't have a car, leave a full stop in the car reg field and use the notes section to provide your name, contact details, and that you'll be walking.<br/><br/>
There's no need to leave your vehicle — just follow the instructions in your order confirmation email for the exact drop-off point.`,
    },
    {
        id: 3,
        icon: <FaTruck />,
        question: 'Do you offer delivery?',
        answer: `We do offer delivery <strong>but only in some cases</strong>, and it is not available through the website.<br/><br/>
If you'd like to enquire about delivery, please contact us via:<br/>
• Instagram or TikTok: <a href="https://www.instagram.com/chimnchurri" target="_blank" class="text-brand hover:underline font-semibold">@chimnchurri</a><br/>
• Email: <a href="mailto:info@chimnchurri.com" class="text-brand hover:underline font-semibold">info@chimnchurri.com</a><br/><br/>
<strong>Please note:</strong><br/>
• Delivery is not guaranteed<br/>
• It may not be available on certain days/times<br/>
• A delivery fee will apply`,
    },
    {
        id: 4,
        icon: <FaClock />,
        question: 'When are you open for orders and kerbside pickup?',
        answer: `We are usually open every Friday or every Saturday, and sometimes both days. Our operating hours are generally <strong>4:30 PM to 9:15 PM</strong>, but these can vary.<br/><br/>
The best way to check availability is:<br/>
• Instagram or TikTok <a href="https://www.instagram.com/chimnchurri" target="_blank" class="text-brand hover:underline font-semibold">@chimnchurri</a> for updates on opening days and times/slots<br/>
• Ordering through our website, which will show a live view of available dates, times, and slots on the 'Order' section.`,
    },
    {
        id: 5,
        icon: <FaDrumstickBite />,
        question: 'What steak cut do you use?',
        answer: `We mainly use <strong>striploin (also known as sirloin)</strong>, and only the highest quality. On rare occasions, we may offer rib-eye, but this is not common.`,
    },
    {
        id: 6,
        icon: <FaMosque />,
        question: 'Are your dishes halal?',
        answer: `<strong>Yes!</strong> All of our dishes are 100% halal, including every item on our menu. All meat is halal certified. 🥩✅`,
    },
    {
        id: 7,
        icon: <FaLeaf />,
        question: 'Do you cater for dietary requirements or allergies?',
        answer: `We operate from a <strong>shared home kitchen</strong>, so we cannot guarantee an allergen-free environment.<br/><br/>
• We cannot cater specifically for allergens, but we can advise on which dishes contain certain ingredients.<br/>
• If you have any allergies or dietary requirements, we <strong>strongly recommend contacting us before placing an order</strong> to discuss your needs.<br/><br/>
Contact via:<br/>
• Instagram or TikTok: <a href="https://www.instagram.com/chimnchurri" target="_blank" class="text-brand hover:underline font-semibold">@chimnchurri</a><br/>
• Email: <a href="mailto:info@chimnchurri.com" class="text-brand hover:underline font-semibold">info@chimnchurri.com</a><br/><br/>
<strong>⚠️ Important:</strong> Please do not place an order until you've confirmed it's safe for you.`,
    },
    {
        id: 8,
        icon: <FaBreadSlice />,
        question: 'Do your dishes contain gluten?',
        answer: `• Our <strong>fries are gluten-free</strong>, but our mushroom peppercorn sauce is <strong>not</strong>.<br/>
• All other items may contain gluten, and we cannot guarantee a gluten-free environment because we operate from a shared home kitchen.<br/><br/>
If you have gluten intolerance or celiac disease, we strongly recommend contacting us before placing an order via:<br/>
• Instagram or TikTok: <a href="https://www.instagram.com/chimnchurri" target="_blank" class="text-brand hover:underline font-semibold">@chimnchurri</a><br/>
• Email: <a href="mailto:info@chimnchurri.com" class="text-brand hover:underline font-semibold">info@chimnchurri.com</a>`,
    },
    {
        id: 9,
        icon: <FaCreditCard />,
        question: 'What payment methods do you accept?',
        answer: `• For <strong>website orders</strong>, we accept all card payments, including <strong>Apple Pay</strong> and <strong>Google Pay</strong>.<br/>
• For larger orders placed via Instagram, TikTok, or email (<a href="mailto:info@chimnchurri.com" class="text-brand hover:underline font-semibold">info@chimnchurri.com</a>), we can accept <strong>bank transfers</strong>.`,
    },
    {
        id: 10,
        icon: <FaCalendarAlt />,
        question: 'Do you cater for events or large orders?',
        answer: `We can accommodate events or larger orders, but availability is limited.<br/><br/>
• Please contact us at <a href="mailto:info@chimnchurri.com" class="text-brand hover:underline font-semibold">info@chimnchurri.com</a> for more details.<br/>
• We require at least <strong>2–3 weeks' notice</strong> to plan and prepare your order.`,
    },
    {
        id: 11,
        icon: <FaUndoAlt />,
        question: 'Can orders be changed or cancelled?',
        answer: `<strong>Late cancellations</strong> (less than 18 hours' notice) are normally non-refundable, as steaks are pre-prepared and short notice cancellations may result in the reserved cut being unsold. In certain circumstances, a partial or full refund may be provided at our discretion on a case-by-case basis.
        <br/>
        <br/>
        Cancellations made with less than 2 hours’ notice are fully non-refundable. Only in very serious and exceptional circumstances may this be reviewed at our discretion.<br/>
        <br/>
        
        No refunds will be issued for no-shows, and once preparation for an order has begun, refunds cannot be offered.
        <br/>
        <br/>
        
         You can make changes to your order if needed, but please provide at least 24 hours’ notice. Changes may not always be available, so we appreciate your understanding.<br/>
        <br/>
If you experience any issues with your order:

If you experience any issues with your order, please contact us as soon as possible via:<br/>
• Preferred contact: Send a direct message on Instagram or TikTok <a href="https://www.instagram.com/chimnchurri" target="_blank" class="text-brand hover:underline font-semibold">@chimnchurri</a> with your full name, the email used for the order, and details of your query.<br/>
• Alternative contact: If you cannot reach us on social media, send a text message to <a href="tel:07451221187" class="text-brand hover:underline font-semibold">07451 221187</a> with the same details.<br/><br/>
`,
    },
    {
        id: 12,
        icon: <FaMapMarkerAlt />,
        question: 'Where is ChimnChurri located?',
        answer: `We are based in <strong>Chadderton, Oldham, Greater Manchester, OL9</strong>.<br/><br/>
Kerbside drop-off details are provided in your <strong>order confirmation email</strong> once your order has been placed, so you'll know exactly where to meet us.`,
    },
    {
        id: 13,
        icon: <FaCalendarCheck />,
        question: 'Why are you only open 1 or 2 days a week?',
        answer: `Currently, we operate on one or two days per week because this allows us to <strong>grow slowly and consistently while maintaining the highest quality</strong>.<br/><br/>
We also have full-time jobs, so this schedule helps us manage both work and food preparation.<br/><br/>
We plan to expand in the future, but for now, this is the best way to ensure every order meets our standards.`,
    },
    {
        id: 14,
        icon: <FaShoppingBag />,
        question: 'Can I order more than 5 steak boxes in one time slot?',
        answer: `Our website allows orders of up to <strong>5 steak boxes per time slot</strong>.<br/><br/>
If you'd like to order more than 5 boxes, please contact us directly via:<br/>
• Instagram or TikTok: <a href="https://www.instagram.com/chimnchurri" target="_blank" class="text-brand hover:underline font-semibold">@chimnchurri</a><br/>
• Email: <a href="mailto:info@chimnchurri.com" class="text-brand hover:underline font-semibold">info@chimnchurri.com</a><br/><br/>
We can arrange your order manually and reserve your time slot that way. No guarantees.`,
    },
    {
        id: 15,
        icon: <FaFire />,
        question: 'What is chimichurri and what does it taste like?',
        answer: `Chimichurri is a sauce that originates from <strong>Argentina</strong>, but at Chim 'N' Churri, we mix it up and make it our own.<br/><br/>
<strong>Flavour profile:</strong> Our version is <em>acidic with a hint of kick/spice, garlicky, and savoury</em>, designed to complement the meat perfectly.<br/><br/>
<strong>Our twist:</strong> We use some of our in-house seasoning to give it a unique Chim 'N' Churri flavour that you won't find anywhere else. 🌿🔥`,
    },
    {
        id: 16,
        icon: <FaEnvelope />,
        question: 'How can I contact you if I have questions or need more information?',
        answer: `The best way to reach us is via <strong>Instagram</strong> <a href="https://www.instagram.com/chimnchurri" target="_blank" class="text-brand hover:underline font-semibold">@chimnchurri</a>.<br/><br/>
You can also contact us via:<br/>
• TikTok: <a href="https://www.tiktok.com/@chimnchurri" target="_blank" class="text-brand hover:underline font-semibold">@chimnchurri</a><br/>
• Email: <a href="mailto:info@chimnchurri.com" class="text-brand hover:underline font-semibold">info@chimnchurri.com</a><br/><br/>
We'll do our best to respond as quickly as possible!`,
    },
];

const FAQItem = ({ faq, isOpen, onToggle }) => {
    return (
        <div
            className={`border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen
                ? 'border-brand/40 bg-brand/5'
                : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.05] hover:border-white/20'
                }`}
        >
            <button
                onClick={() => onToggle(faq.id)}
                className="w-full flex items-center gap-4 p-5 md:p-6 text-left cursor-pointer group"
                aria-expanded={isOpen}
            >
                <div
                    className={`shrink-0 size-10 rounded-xl flex items-center justify-center transition-all duration-300 ${isOpen
                        ? 'bg-brand text-white scale-110'
                        : 'bg-brand/10 text-brand group-hover:scale-105'
                        }`}
                >
                    {React.cloneElement(faq.icon, { size: 16 })}
                </div>

                <span className="flex-1 font-semibold text-sm md:text-base text-white leading-snug">
                    {faq.question}
                </span>

                <div
                    className={`shrink-0 size-7 rounded-full flex items-center justify-center transition-all duration-300 text-zinc-400 ${isOpen ? 'rotate-180 text-brand' : ''
                        }`}
                >
                    <FaChevronDown size={12} />
                </div>
            </button>

            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="px-5 md:px-6 pb-5 md:pb-6 pt-0">
                    <div className="h-px w-full bg-white/10 mb-4" />
                    <p
                        className="text-zinc-400 text-sm leading-relaxed pl-14"
                        dangerouslySetInnerHTML={{ __html: faq.answer }}
                    />
                </div>
            </div>
        </div>
    );
};

const FAQContent = () => {
    const [openId, setOpenId] = useState(null);

    const handleToggle = (id) => {
        setOpenId(prev => (prev === id ? null : id));
    };

    return (
        <main className="min-h-screen bg-[#141414] text-white pt-32 pb-20 px-4 relative overflow-hidden">
            {/* Background glows */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-brand/5 blur-[120px] opacity-40" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-brand/5 blur-[100px] opacity-30" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-brand/3 blur-[150px] opacity-20" />
            </div>

            <div className="max-w-3xl mx-auto relative z-10 w-full">

                {/* Header */}
                <div className="text-center mb-14 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-brand text-[10px] font-bold tracking-wider uppercase mb-2">
                        <FaQuestionCircle size={12} /> Got Questions?
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                        Chim &apos;N&apos; Churri{' '}
                        <span className="text-brand">FAQ&apos;s</span>
                    </h1>
                    <p className="text-zinc-400 text-sm max-w-md mx-auto">
                        Everything you need to know about ordering, pickup, our food, and more. Can&apos;t find an answer? Reach out to us directly.
                    </p>
                </div>

                {/* FAQ accordion */}
                <div className="space-y-3">
                    {faqs.map(faq => (
                        <FAQItem
                            key={faq.id}
                            faq={faq}
                            isOpen={openId === faq.id}
                            onToggle={handleToggle}
                        />
                    ))}
                </div>

                {/* CTA card */}
                <div className="mt-12 p-8 rounded-3xl bg-brand/5 border border-brand/10 text-center space-y-3">
                    <div className="inline-flex items-center gap-2 text-brand text-sm font-bold">
                        <FaEnvelope size={14} />
                        Still have questions?
                    </div>
                    <p className="text-zinc-400 text-sm">
                        We&apos;re always happy to help. The quickest way to reach us is on social media.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                        <a
                            href="https://www.instagram.com/chimnchurri"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand/10 border border-brand/20 text-brand text-sm font-semibold hover:bg-brand hover:text-white transition-all duration-300"
                        >
                            <FaInstagram size={14} /> @chimnchurri
                        </a>
                        <a
                            href="https://www.tiktok.com/@chimnchurri"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand/10 border border-brand/20 text-brand text-sm font-semibold hover:bg-brand hover:text-white transition-all duration-300"
                        >
                            <FaTiktok size={14} /> @chimnchurri
                        </a>
                        <a
                            href="mailto:info@chimnchurri.com"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand/10 border border-brand/20 text-brand text-sm font-semibold hover:bg-brand hover:text-white transition-all duration-300"
                        >
                            <FaEnvelope size={14} /> info@chimnchurri.com
                        </a>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default FAQContent;
