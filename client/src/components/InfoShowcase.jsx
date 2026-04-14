import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe2, ShieldCheck, BrainCircuit, Zap, ArrowRight } from "lucide-react";

// --- Informational Data ---
const capabilities = [
  {
    id: "01",
    title: "Global Logistics",
    subtitle: "Border-less Delivery",
    description: "Our decentralized fulfillment network spans 40+ countries. Using predictive routing, we ensure your tech arrives at hyper-speed, completely carbon-neutral.",
    icon: <Globe2 className="w-6 h-6" />,
    statValue: "24h",
    statLabel: "Average Delivery Time",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: "02",
    title: "Ironclad Security",
    subtitle: "Zero-Trust Architecture",
    description: "Your data is your property. ShopSphere utilizes military-grade 256-bit AES encryption and decentralized tokenization to keep your transactions completely impenetrable.",
    icon: <ShieldCheck className="w-6 h-6" />,
    statValue: "100%",
    statLabel: "Encrypted Transactions",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: "03",
    title: "Neural Curation",
    subtitle: "AI-Powered Shopping",
    description: "Stop searching. Our proprietary AI analyzes your workflow, aesthetic preferences, and tech stack to curate a personalized sphere of products tailored exactly to your needs.",
    icon: <BrainCircuit className="w-6 h-6" />,
    statValue: "94%",
    statLabel: "Recommendation Accuracy",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop"
  },
  {
    id: "04",
    title: "Hyper-Performance",
    subtitle: "Built on the MERN Stack",
    description: "Experience zero latency. Our platform is engineered from the ground up using React, Node.js, and MongoDB to handle millions of concurrent users without breaking a sweat.",
    icon: <Zap className="w-6 h-6" />,
    statValue: "<12ms",
    statLabel: "Server Response Time",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop"
  }
];

export default function InfoShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Optional: Auto-cycle through the information
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % capabilities.length);
    }, 6000); // Changes every 6 seconds
    return () => clearInterval(timer);
  }, []);

  const activeData = capabilities[activeIndex];

  return (
    <section className="bg-zinc-950 py-24 md:py-32 min-h-screen flex items-center selection:bg-blue-500 selection:text-white relative overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 w-full relative z-10">
        
        {/* Section Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-[2px] bg-blue-600" />
            <span className="text-zinc-500 font-black uppercase tracking-[0.3em] text-xs">
              System Architecture
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
            How the Sphere <span className="text-zinc-600">Operates.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* --- LEFT SIDE: Interactive Navigation List --- */}
          <div className="lg:col-span-5 flex flex-col gap-2">
            {capabilities.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveIndex(index)}
                  className={`group relative flex items-center gap-8 py-6 px-4 md:px-8 text-left transition-all duration-500 overflow-hidden ${
                    isActive ? "bg-zinc-900/80 rounded-2xl" : "hover:bg-zinc-900/40 rounded-2xl"
                  }`}
                >
                  {/* Active Indicator Line */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 bg-blue-600 transition-all duration-500 origin-top ${
                    isActive ? "scale-y-100" : "scale-y-0 group-hover:scale-y-50"
                  }`} />

                  {/* ID Number */}
                  <span className={`text-xl md:text-3xl font-black transition-colors duration-500 ${
                    isActive ? "text-blue-500" : "text-zinc-800 group-hover:text-zinc-600"
                  }`}>
                    {item.id}
                  </span>

                  {/* Title */}
                  <h3 className={`text-2xl md:text-4xl font-black tracking-tight transition-colors duration-500 ${
                    isActive ? "text-white" : "text-zinc-600 group-hover:text-zinc-400"
                  }`}>
                    {item.title}
                  </h3>
                </button>
              );
            })}
          </div>

          {/* --- RIGHT SIDE: Instant-Read Overlay Card --- */}
          {/* The fixed height (h-[500px] lg:h-[600px]) prevents layout shifting and scrolling */}
          <div className="lg:col-span-7 h-[500px] lg:h-[600px] w-full relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeData.id}
                initial={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 bg-zinc-900 rounded-[2.5rem] border border-zinc-800/50 shadow-2xl overflow-hidden flex flex-col justify-center"
              >
                
                {/* Full-bleed Background Image */}
                <img 
                  src={activeData.image} 
                  alt={activeData.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-luminosity scale-105"
                />
                
                {/* Heavy Dark Gradient: Ensures text is always 100% readable without scrolling */}
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-zinc-950 via-zinc-950/90 to-transparent" />

                {/* Information Content (Now overlaid directly in the center of the card) */}
                <div className="relative z-10 px-8 md:px-12 w-full lg:w-[85%] space-y-8">
                  
                  {/* Floating Icon */}
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl flex items-center justify-center text-white shadow-2xl">
                    {activeData.icon}
                  </div>

                  {/* Text Block */}
                  <div className="space-y-4">
                    <h4 className="text-blue-500 font-bold uppercase tracking-widest text-xs">
                      {activeData.subtitle}
                    </h4>
                    <p className="text-zinc-300 text-lg md:text-xl leading-relaxed font-medium">
                      {activeData.description}
                    </p>
                  </div>

                  {/* Highlight Statistic & Action */}
                  <div className="pt-8 border-t border-zinc-800/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <p className="text-5xl font-black text-white tracking-tighter mb-1">
                        {activeData.statValue}
                      </p>
                      <p className="text-zinc-500 text-xs font-black uppercase tracking-widest">
                        {activeData.statLabel}
                      </p>
                    </div>

                    <button className="flex items-center gap-2 text-white font-bold text-sm group hover:text-blue-400 transition-colors">
                      Learn more 
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}