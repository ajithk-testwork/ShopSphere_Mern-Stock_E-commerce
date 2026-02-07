// components/Hero.jsx
import React from 'react';
import { motion } from 'framer-motion';
import HeroImage from "../assets/hero.png"; 

const Hero = () => {
  return (
    /* pt-0 removes the gap between Navbar and Hero content */
    <section className="relative w-full bg-white overflow-hidden pt-0 pb-20 md:pb-32">
      
      {/* Background Decorative Element - Adjusted to start at the top */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50/50 skew-x-[-12deg] translate-x-20 z-0 hidden lg:block" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left Side: Content */}
          <div className="z-10 order-2 lg:order-1 pt-4">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-1.5 mb-6 rounded-full bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em]"
            >
              Spring / Summer 2026
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-7xl font-black tracking-tight text-gray-900 leading-[1.05] mb-6"
            >
              ShopSphere. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-400 to-gray-900">
                Redefining Retail.
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-500 font-medium leading-relaxed max-w-lg mb-10"
            >
              Discover a curated collection of premium goods. Powered by Stripe for seamless 
              security and the MERN stack for lightning-fast performance.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-4"
            >
              <button className="px-8 py-4 bg-black text-white rounded-2xl font-bold hover:shadow-2xl hover:shadow-black/20 transition-all active:scale-95 cursor-pointer">
                Shop Now
              </button>
              <button className="px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-2xl font-bold hover:border-black transition-all cursor-pointer">
                View Gallery
              </button>
            </motion.div>
          </div>

          {/* Right Side: Professional Image Display */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative order-1 lg:order-2"
          >
            {/* Image Wrapper */}
            <div className="relative z-10 rounded-[40px] overflow-hidden border-[12px] border-white shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)]">
              <img 
                src={HeroImage} 
                alt="Ecommerce Showcase" 
                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
              />
            </div>
            
            {/* Floating Trust Card */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 z-20 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 hidden md:flex items-center gap-4"
            >
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Verified Security</p>
                <p className="text-sm font-black text-gray-900 italic">Stripe Certified</p>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;