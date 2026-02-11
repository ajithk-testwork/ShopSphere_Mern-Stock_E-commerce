import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ShieldCheck, Zap, Globe, Award, MapPin } from "lucide-react";
import image1 from "../assets/about_banner.jpg";
import image2 from "../assets/about_img.jpg";


export default function About() {
  const containerRef = useRef(null);
  
  // Scroll logic for the Hero Parallax
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax transformations
  const yImage = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div className="bg-white min-h-screen selection:bg-blue-500">
      
      {/* --- Section 1: Hero Header (Merged AboutHero) --- */}
      
<section 
  ref={containerRef}
  className="relative py-24 md:py-48 bg-black overflow-hidden h-[80vh] md:h-screen flex items-center"
>
  {/* 1. Background Image Layer (Lowest Layer) */}
  <motion.div 
    style={{ y: yImage }}
    className="absolute inset-0 z-0"
  >
    <img 
      src={image1} 
      alt="Future Technology"
      className="w-full h-[120%] object-cover opacity-60 grayscale scale-110"
    />
    {/* Refined Overlays: Stronger gradient to ensure text is never covered */}
    <div className="absolute inset-0 bg-gradient-to-b from-black via-black/20 to-black z-10" />
    <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent z-10" />
  </motion.div>

  {/* 2. Large Background Text (Middle Layer) */}
  <motion.div 
    style={{ y: yText }}
    className="absolute inset-0 flex items-center justify-center opacity-[0.07] select-none pointer-events-none z-20"
  >
    <h2 className="text-[20rem] md:text-[35rem] font-black uppercase tracking-tighter text-white">
      Sphere
    </h2>
  </motion.div>

  {/* 3. Main Hero Content (Top Layer - z-30) */}
  <div className="max-w-7xl mx-auto px-6 relative z-30 w-full">
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="max-w-5xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-[2px] bg-blue-600" />
        <span className="text-blue-500 font-black uppercase tracking-[0.4em] text-xs">
          Our DNA
        </span>
      </div>

      {/* leading-tight and responsive text sizes to prevent overlap issues */}
      <h1 className="text-6xl md:text-[8rem] lg:text-[10rem] font-black text-white tracking-tighter leading-[0.85] mb-12 drop-shadow-2xl">
        WE ARE THE <br /> 
        <span className="text-blue-600 italic">FUTURE</span> <br /> 
        OF RETAIL.
      </h1>

      <div className="flex flex-col md:flex-row gap-12 items-start">
         <p className="text-gray-300 text-lg md:text-2xl font-medium leading-relaxed max-w-xl">
          ShopSphere isn't just an e-commerce platform. It's a curated ecosystem where 
          bleeding-edge technology meets human-centric design.
        </p>
        
        {/* Scroll Indicator */}
        <div className="hidden md:flex flex-col items-center gap-4 pt-4 ml-auto">
           <span className="text-[10px] text-gray-500 uppercase tracking-widest vertical-text rotate-180 mb-4">Scroll</span>
           <div className="w-[1px] h-24 bg-gradient-to-b from-blue-600 via-blue-600/50 to-transparent" />
        </div>
      </div>
    </motion.div>
  </div>
</section>

      {/* --- Section 2: Core Philosophy --- */}
      <section className="py-24 md:py-32 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative group">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-600 rounded-[3rem] z-0 hidden md:block group-hover:rotate-12 transition-transform duration-500" />
            <div className="relative z-10 aspect-square rounded-[4rem] overflow-hidden border-[12px] border-white shadow-2xl">
              <img 
                src={image2}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-gray-900 leading-tight">
              Curating Excellence <br /> Since 2026.
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed font-medium">
              We started with a simple problem: the digital world was moving too fast, and retail was falling behind. 
              ShopSphere was built to bridge that gap, providing a seamless, secure, and sophisticated 
              shopping experience for the modern innovator.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-6">
              <Stat label="Global Users" value="2.5M+" />
              <Stat label="Products" value="15k+" />
            </div>
          </div>
        </div>
      </section>

      {/* --- Section 3: Why ShopSphere? (Bento Grid) --- */}
      <section className="bg-gray-50 py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-600">The Framework</h3>
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-gray-900">Why we exist.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AboutCard 
              icon={<Zap />} 
              title="Hyper-Speed" 
              desc="Optimized performance from search to checkout. We value your time as much as your tech."
            />
            <AboutCard 
              icon={<ShieldCheck />} 
              title="Ironclad Security" 
              desc="Your data is your property. We use 256-bit encryption to keep the sphere impenetrable."
            />
            <AboutCard 
              icon={<Award />} 
              title="Verified Quality" 
              desc="Every vendor is vetted. Every product is authenticated. No compromises, ever."
            />
          </div>
        </div>
      </section>

      {/* --- Section 4: Global Mission --- */}
      <section className="py-24 md:py-40 text-center max-w-5xl mx-auto px-6">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
        >
          <Globe className="w-20 h-20 text-blue-600 mx-auto mb-10 animate-pulse" />
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-gray-900 mb-8 leading-none">
            ONE SPHERE. <br /> ANYWHERE.
          </h2>
          <p className="text-xl text-gray-500 font-medium leading-relaxed">
            Headquartered in the heart of Cyber City, Gurugram, we operate a decentralized 
            logistics network that spans 40+ countries. We are building the infrastructure 
            for the next billion digital citizens.
          </p>
        </motion.div>
      </section>

      {/* --- CTA Footer --- */}
      <section className="p-6 md:p-12">
        <div className="bg-black rounded-[4rem] py-20 px-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-blue-600/10 blur-[100px]" />
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter relative z-10 mb-10">
              Ready to enter the sphere?
            </h2>
            <button 
              onClick={() => window.location.href = '/products'}
              className="relative z-10 bg-white text-black px-12 py-5 rounded-2xl font-black text-xl hover:bg-blue-600 hover:text-white transition-all transform active:scale-95 cursor-pointer"
            >
              START SHOPPING
            </button>
        </div>
      </section>
    </div>
  );
}

// --- Sub-Components ---

function Stat({ label, value }) {
  return (
    <div className="space-y-1">
      <p className="text-4xl font-black text-gray-900 tracking-tighter">{value}</p>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</p>
    </div>
  );
}

function AboutCard({ icon, title, desc }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="p-10 rounded-[3rem] bg-white border border-gray-100 shadow-xl shadow-black/5 flex flex-col items-center text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-8">
        {React.cloneElement(icon, { size: 32 })}
      </div>
      <h4 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">{title}</h4>
      <p className="text-gray-500 font-medium leading-relaxed">{desc}</p>
    </motion.div>
  );
}