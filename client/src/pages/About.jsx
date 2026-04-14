import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ShieldCheck, Zap, Globe, Award, ArrowRight } from "lucide-react";
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
  const yImage = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityText = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="bg-white min-h-screen selection:bg-blue-500 selection:text-white">
      
      {/* --- Section 1: Hero Header --- */}
      <section 
        ref={containerRef}
        className="relative pt-32 pb-24 md:py-48 bg-black overflow-hidden min-h-[90vh] flex items-center rounded-b-[3rem] md:rounded-b-[5rem] shadow-2xl"
      >
        {/* Background Image Layer */}
        <motion.div 
          style={{ y: yImage }}
          className="absolute inset-0 z-0 origin-top"
        >
          <img 
            src={image1} 
            alt="Future Technology"
            className="w-full h-[130%] object-cover opacity-50 grayscale scale-105"
          />
          {/* Refined Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent z-10" />
        </motion.div>

        {/* Large Background Text - SIZED DOWN to prevent ugly overlap */}
        <motion.div 
          style={{ y: yText, opacity: opacityText }}
          className="absolute inset-0 flex items-center justify-center opacity-[0.05] select-none pointer-events-none z-20 overflow-hidden"
        >
          <h2 className="text-[8rem] md:text-[18rem] lg:text-[24rem] font-black uppercase tracking-tighter text-white whitespace-nowrap">
            SPHERE
          </h2>
        </motion.div>

        {/* Main Hero Content */}
        <div className="max-w-7xl mx-auto px-8 relative z-30 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-5xl"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-[2px] bg-blue-500" />
              <span className="text-blue-400 font-black uppercase tracking-[0.3em] text-xs md:text-sm">
                Our DNA
              </span>
            </div>

            {/* Foreground Text - Sized down slightly and line-height adjusted */}
            <h1 className="text-5xl md:text-7xl lg:text-[8.5rem] font-black text-white tracking-tighter leading-[0.95] mb-10 drop-shadow-2xl">
              WE ARE THE <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 italic pr-4">FUTURE</span> <br /> 
              OF RETAIL.
            </h1>

            <div className="flex flex-col md:flex-row gap-12 items-start justify-between mt-8">
              <p className="text-gray-300 text-lg md:text-xl font-medium leading-relaxed max-w-xl">
                ShopSphere isn't just an e-commerce platform. It's a curated ecosystem where 
                bleeding-edge technology meets human-centric design.
              </p>
              
              {/* Animated Scroll Indicator */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="hidden md:flex flex-col items-center gap-4 pt-4"
              >
                <span className="text-[10px] text-gray-400 uppercase tracking-widest vertical-text rotate-180 mb-2">
                  Scroll
                </span>
                <div className="w-[2px] h-24 bg-gray-800 rounded-full overflow-hidden relative">
                  <motion.div 
                    animate={{ y: ["-100%", "200%"] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="absolute top-0 left-0 w-full h-1/2 bg-blue-500 rounded-full"
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- Section 2: Core Philosophy --- */}
      <section className="py-32 md:py-48 max-w-7xl mx-auto px-8 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          
          {/* Image Container with Floating Element */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative group w-full max-w-md mx-auto lg:max-w-full"
          >
            {/* Animated background shape */}
            <motion.div 
              animate={{ rotate: [0, 5, 0], y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute -top-8 -left-8 w-48 h-48 bg-blue-600 rounded-[3rem] z-0 hidden md:block opacity-90" 
            />
            
            <div className="relative z-10 aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] group-hover:shadow-[0_20px_50px_rgba(37,99,235,0.2)] transition-shadow duration-700">
              <img 
                src={image2}
                alt="Philosophy"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
              />
              <div className="absolute inset-0 border-[8px] border-white/20 rounded-[2.5rem] mix-blend-overlay pointer-events-none" />
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="space-y-10"
          >
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900 leading-[1.1]">
              Curating Excellence <br /> <span className="text-gray-400">Since 2026.</span>
            </h2>
            <p className="text-gray-500 text-lg md:text-xl leading-relaxed font-medium">
              We started with a simple problem: the digital world was moving too fast, and retail was falling behind. 
              ShopSphere was built to bridge that gap, providing a seamless, secure, and sophisticated 
              shopping experience for the modern innovator.
            </p>
            <div className="grid grid-cols-2 gap-12 pt-8 border-t border-gray-100">
              <Stat label="Global Users" value="2.5M+" />
              <Stat label="Products" value="15k+" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- Section 3: Why ShopSphere? (Bento Grid) --- */}
      <section className="bg-gray-50 py-32 md:py-40 rounded-[3rem] md:rounded-[5rem] my-12 mx-4 md:mx-8">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24 space-y-4"
          >
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-600">The Framework</h3>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900">Why we exist.</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AboutCard 
              icon={<Zap />} 
              title="Hyper-Speed" 
              desc="Optimized performance from search to checkout. We value your time as much as your tech."
              delay={0}
            />
            <AboutCard 
              icon={<ShieldCheck />} 
              title="Ironclad Security" 
              desc="Your data is your property. We use 256-bit encryption to keep the sphere impenetrable."
              delay={0.2}
            />
            <AboutCard 
              icon={<Award />} 
              title="Verified Quality" 
              desc="Every vendor is vetted. Every product is authenticated. No compromises, ever."
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* --- Section 4: Global Mission --- */}
      <section className="py-32 md:py-48 text-center max-w-4xl mx-auto px-8 relative">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
           className="relative z-10"
        >
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-12 shadow-inner">
            <Globe className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-gray-900 mb-10 leading-[0.9]">
            ONE SPHERE. <br /> ANYWHERE.
          </h2>
          <p className="text-xl md:text-2xl text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto">
            Headquartered in the heart of Cyber City, Gurugram, we operate a decentralized 
            logistics network that spans 40+ countries. We are building the infrastructure 
            for the next billion digital citizens.
          </p>
        </motion.div>
      </section>

      {/* --- CTA Footer --- */}
      <section className="p-4 md:p-8 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-black rounded-[3rem] md:rounded-[4rem] py-24 px-8 text-center relative overflow-hidden group"
        >
            {/* Dynamic background effect on hover */}
            <div className="absolute top-0 left-0 w-full h-full bg-blue-600/20 blur-[100px] opacity-50 group-hover:opacity-100 group-hover:bg-blue-500/30 transition-all duration-700" />
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-12">
                Ready to enter <br /> the sphere?
              </h2>
              <button 
                onClick={() => window.location.href = '/products'}
                className="group relative inline-flex items-center justify-center gap-3 bg-white text-black px-10 py-5 rounded-2xl font-black text-lg md:text-xl overflow-hidden transition-transform transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span className="relative z-10">START SHOPPING</span>
                <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-blue-50 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-out" />
              </button>
            </div>
        </motion.div>
      </section>
    </div>
  );
}

// --- Sub-Components ---

function Stat({ label, value }) {
  return (
    <div className="space-y-2">
      <p className="text-5xl font-black text-gray-900 tracking-tighter">{value}</p>
      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{label}</p>
    </div>
  );
}

function AboutCard({ icon, title, desc, delay }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: delay, duration: 0.6, ease: "easeOut" }}
      whileHover={{ y: -8 }}
      className="relative p-10 md:p-12 rounded-[2.5rem] bg-white border border-gray-100 shadow-xl shadow-black/[0.03] hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col items-center text-center transition-all duration-500 overflow-hidden group"
    >
      {/* Decorative Hover Gradient */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      
      <div className="w-20 h-20 rounded-[1.5rem] bg-gray-50 group-hover:bg-blue-50 text-gray-900 group-hover:text-blue-600 flex items-center justify-center mb-8 transition-colors duration-500 relative z-10">
        {React.cloneElement(icon, { size: 36, strokeWidth: 1.5 })}
      </div>
      
      <h4 className="text-2xl font-black text-gray-900 mb-4 tracking-tight relative z-10">
        {title}
      </h4>
      <p className="text-gray-500 font-medium leading-relaxed relative z-10">
        {desc}
      </p>
    </motion.div>
  );
}