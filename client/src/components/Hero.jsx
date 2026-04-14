// components/Hero.jsx
import React from 'react';
import { motion } from 'framer-motion';
import HeroImage from "../assets/hero.png"; 

const Hero = () => {
  return (
    <section className="relative w-full min-h-[90vh] flex items-center justify-center  p-4 md:p-8  md:pt-5 overflow-hidden">
      
      {/* Main Immersive Container */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-[1400px] h-[75vh] md:h-[85vh] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl group"
      >
        
        {/* Immersive Background Image */}
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={HeroImage} 
          alt="Premium Collection" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />

        {/* Gradient Overlay - Smooth dark fade from left to right so white text stays readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Top Right: Modern Floating Trust Badge */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
          className="absolute top-6 right-6 md:top-10 md:right-10 z-20 backdrop-blur-md bg-white/10 border border-white/20 p-3 md:p-4 rounded-2xl shadow-2xl hidden md:flex items-center gap-3 md:gap-4"
        >
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] md:text-xs font-bold text-gray-600 uppercase tracking-wider">Secured Checkout</p>
            <p className="text-sm font-black text-white">Stripe Verified</p>
          </div>
        </motion.div>

        {/* Bottom Left: Content Container */}
        <div className="absolute bottom-0 left-0 w-full md:w-[85%] lg:w-[65%] p-4 md:p-10 lg:p-14 z-10">
          {/* UPDATED: Removed all background, border, blur, and shadow classes so it fully exposes the image */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="" 
          >
            <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-white/10 border border-white/20 text-white text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">
              Spring / Summer 2026
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.05] mb-6">
              ShopSphere. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-white">
                Redefining Retail.
              </span>
            </h1>

            <p className="text-sm md:text-lg text-gray-200 font-medium leading-relaxed max-w-xl mb-8">
              Discover a curated collection of premium goods. Powered by Stripe for seamless 
              security and the MERN stack for lightning-fast performance.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-gray-100 hover:scale-105 transition-all duration-300 active:scale-95 cursor-pointer">
                Shop Collection
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-transparent text-white border border-white/40 rounded-full font-bold hover:bg-white/10 hover:border-white transition-all duration-300 cursor-pointer backdrop-blur-sm">
                View Lookbook
              </button>
            </div>
          </motion.div>
        </div>

      </motion.div>
    </section>
  );
};

export default Hero;