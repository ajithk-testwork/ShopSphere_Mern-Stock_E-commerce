import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Cpu, Battery, Wifi } from "lucide-react";
import { Link } from "react-router-dom";

export default function FeaturedSpotlight() {
  return (
    <section className="relative bg-zinc-950 py-32 md:py-48 overflow-hidden selection:bg-blue-500 selection:text-white">
      {/* --- Ambient Background Glows --- */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          
          {/* --- Left Content: Typography & Specs --- */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-[2px] bg-blue-500" />
              <span className="text-blue-400 font-black uppercase tracking-[0.3em] text-xs">
                Flagship Spotlight
              </span>
            </div>

            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[0.9]">
              Power, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-500 to-zinc-300 italic pr-4">Redefined.</span>
            </h2>

            <p className="text-zinc-400 text-lg md:text-xl font-medium max-w-md leading-relaxed">
              Meet the Apex Pro. Engineered for those who demand uncompromising performance. Experience the absolute pinnacle of modern tech architecture.
            </p>

            {/* Spec Highlights */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-zinc-800 max-w-lg">
              <div className="space-y-2">
                <Cpu className="text-blue-500 w-6 h-6" />
                <p className="text-white font-black text-lg">M4 Max</p>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Processor</p>
              </div>
              <div className="space-y-2">
                <Battery className="text-blue-500 w-6 h-6" />
                <p className="text-white font-black text-lg">24 Hrs</p>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Battery</p>
              </div>
              <div className="space-y-2">
                <Wifi className="text-blue-500 w-6 h-6" />
                <p className="text-white font-black text-lg">Wi-Fi 7</p>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Connectivity</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link to="/products/apex-pro" className="group relative overflow-hidden bg-white text-black px-8 py-4 rounded-full font-black text-sm hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-300 active:scale-95 flex items-center gap-2">
                <span className="relative z-10">BUY NOW - $1,999</span>
                <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/products" className="px-8 py-4 rounded-full font-bold text-sm text-zinc-300 hover:text-white transition-colors">
                Compare Models
              </Link>
            </div>
          </motion.div>

          {/* --- Right Content: Floating Product Image --- */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative flex justify-center lg:justify-end"
          >
            {/* The Floating Animation */}
            <motion.div
              animate={{ y: [-15, 15, -15] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="relative z-10 w-full max-w-lg"
            >
              {/* Replace this with a transparent PNG of a premium laptop, headphone, or phone */}
              <img 
                src="https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3" 
                alt="Apex Pro Flagship" 
                className="w-full h-auto object-cover rounded-[2rem] shadow-2xl shadow-black/50"
              />
              
              {/* Floating detail tag */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute -right-4 md:-right-12 bottom-12 bg-zinc-900/80 backdrop-blur-md border border-zinc-700/50 p-4 rounded-2xl shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                  <div>
                    <p className="text-white font-bold text-sm">In Stock</p>
                    <p className="text-zinc-400 text-xs font-medium">Ready to ship</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}