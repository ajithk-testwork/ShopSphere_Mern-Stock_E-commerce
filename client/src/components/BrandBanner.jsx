import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function BrandBanner() {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Background text moves left
  const xMove = useTransform(scrollYProgress, [0, 1], [0, -300]);
  // Background image moves slightly slower for a deep parallax feel
  const yImageMove = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section 
      ref={containerRef}
      className="relative w-full py-24 md:py-48 bg-black overflow-hidden"
    >
      {/* 1. Background Image Layer */}
      <motion.div 
        style={{ y: yImageMove }}
        className="absolute inset-0 z-0 opacity-40" // Adjust opacity based on your image brightness
      >
        <img 
          src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop" // Replace with your website image URL
          alt="Tech Background"
          className="w-full h-[120%] object-cover grayscale" // Grayscale keeps it premium and non-distracting
        />
        {/* Gradient Overlay to blend image into the black background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
      </motion.div>

      {/* 2. Parallax Background Text (Now layered over the image) */}
      <div className="absolute inset-0 flex items-center whitespace-nowrap pointer-events-none select-none z-10">
        <motion.h2 
          style={{ x: xMove }}
          className="text-[15rem] md:text-[25rem] font-black text-white/[0.05] uppercase tracking-tighter"
        >
          ShopSphere Tech Gear ShopSphere
        </motion.h2>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* 3. Brand Identity Text */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-1 rounded-full border border-blue-500/30 text-blue-400 text-xs font-black uppercase tracking-widest mb-6 backdrop-blur-sm">
                Est. 2026
              </span>
              <h2 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tighter">
                Redefining the <br />
                <span className="text-blue-600">Digital Sphere.</span>
              </h2>
            </motion.div>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-lg font-medium drop-shadow-md"
            >
              At **ShopSphere**, we don't just sell gadgets. We curate the tools 
              that power your ambition, your music, and your daily life. 
              Engineering meets elegance.
            </motion.p>
          </div>

          {/* 4. Bento Stats with Glassmorphism */}
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-8 rounded-[2.5rem] bg-black/40 border border-white/10 backdrop-blur-xl group hover:bg-blue-600 transition-colors duration-500"
            >
              <h4 className="text-3xl font-black text-white mb-2">99%</h4>
              <p className="text-gray-400 group-hover:text-white/80 text-xs font-bold uppercase tracking-widest">
                Customer <br />Satisfaction
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-8 rounded-[2.5rem] bg-black/40 border border-white/10 backdrop-blur-xl mt-8 group hover:bg-white transition-colors duration-500"
            >
              <h4 className="text-3xl font-black text-white group-hover:text-black mb-2">24/7</h4>
              <p className="text-gray-400 group-hover:text-black/60 text-xs font-bold uppercase tracking-widest">
                Premium <br />Tech Support
              </p>
            </motion.div>
          </div>

        </div>
      </div>

      {/* 5. Animated Bottom Accent */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-600/50 to-transparent" />
    </section>
  );
}