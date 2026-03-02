
import Link from "next/link";
import { FaEnvelope, FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";
import { FaUtensils, FaHeart, FaAward, FaLeaf, FaArrowRight } from "react-icons/fa";
import MenuSection from "./MenuSection";
import HeroSection from "./_components/HeroSection";
import HomeFooter from "./_components/HomeFooter";
import FoodGallery from "./_components/FoodGallery";
import BrandBanner from "./_components/BrandBanner";


export default function Home() {
  return (
    <>
      <div className="flex flex-col border-t border-brand/90 justify-between min-h-dvh">
        <HeroSection />

        {/* <BrandBanner /> */}
        <section>
          <MenuSection />
        </section>
        <FoodGallery />

        {/* About Us Section */}
        <section className="py-16 md:py-24 px-4 bg-[#141414] relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-brand/5 blur-[120px] opacity-40" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-brand/5 blur-[100px] opacity-30" />
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-brand text-[10px] font-bold tracking-wider uppercase mb-4">
                <FaUtensils size={12} /> About Us
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
                The <span className="text-brand">Chim &apos;N&apos; Churri</span> Story
              </h2>
              <p className="max-w-2xl mx-auto text-zinc-400 text-sm md:text-base leading-relaxed">
                Born from a passion for bold, authentic flavours — we bring the finest chimichurri-infused
                dishes straight to your table. Every bite is crafted with love and the freshest ingredients.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                {
                  icon: <FaLeaf />,
                  title: "Fresh & Natural",
                  desc: "Only the freshest herbs, spices, and premium meats — no shortcuts, no compromise."
                },
                {
                  icon: <FaHeart />,
                  title: "Made with Love",
                  desc: "Every order is prepared with the same care and passion we give to our own family meals."
                },
                {
                  icon: <FaAward />,
                  title: "Quality First",
                  desc: "If it&apos;s not perfect, it doesn&apos;t leave our kitchen. That&apos;s the Churrified standard."
                }
              ].map((value, idx) => (
                <div key={idx} className="bg-white/[0.03] border border-white/10 p-6 md:p-8 rounded-2xl hover:bg-white/[0.06] transition-all group text-center">
                  <div className="size-12 rounded-xl bg-brand/10 flex items-center justify-center text-brand mx-auto mb-5 group-hover:scale-110 transition-transform">
                    {value.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{value.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{value.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-8 py-4 bg-brand hover:bg-green-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-brand/20 text-sm uppercase tracking-wider group"
              >
                Learn More About Us
                <FaArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        <div className="">
          <HomeFooter />
        </div>
      </div>
    </>
  );
}
