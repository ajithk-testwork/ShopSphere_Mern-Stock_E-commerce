import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Globe, Instagram, Twitter, ArrowRight } from "lucide-react";

export default function Contact() {
  const [activeCategory, setActiveCategory] = useState("Inquiry");

  // Animation variants for staggered form loading
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="bg-zinc-50 min-h-screen flex items-center justify-center p-4 md:p-8 selection:bg-blue-500 selection:text-white">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-[2.5rem] md:rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden border border-zinc-100">
        
        {/* --- LEFT SIDE: BRAND & INFO (Dark Glass Vibe) --- */}
        <div className="lg:col-span-5 relative p-10 md:p-16 flex flex-col justify-between bg-zinc-950 text-white overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-[20%] -left-[20%] w-[70%] h-[70%] bg-blue-600/20 blur-[120px] rounded-full mix-blend-screen" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-400/10 blur-[100px] rounded-full mix-blend-screen" />
          </div>
          
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-[2px] bg-blue-500" />
                <span className="text-zinc-400 font-bold uppercase tracking-[0.2em] text-xs">
                  Connect
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-6">
                Let's shape the <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 italic pr-2">future.</span>
              </h1>
              <p className="text-zinc-400 text-lg max-w-sm font-medium leading-relaxed">
                Whether it's a partnership, support request, or you just want to talk tech. The sphere is open.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-20 space-y-10"
            >
              <ContactItem icon={<Mail strokeWidth={1.5} />} label="Email" value="hello@shopsphere.tech" />
              <ContactItem icon={<Phone strokeWidth={1.5} />} label="Phone" value="+91 123 456 7890" />
              <ContactItem icon={<MapPin strokeWidth={1.5} />} label="Studio" value="Cyber City, Phase II, Gurugram" />
            </motion.div>
          </div>

          {/* Social Links */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="relative z-10 pt-16 flex gap-4"
          >
            <SocialIcon icon={<Instagram size={20} />} />
            <SocialIcon icon={<Twitter size={20} />} />
            <SocialIcon icon={<Globe size={20} />} />
          </motion.div>
        </div>

        {/* --- RIGHT SIDE: THE INTERACTIVE FORM (Clean Minimalist) --- */}
        <div className="lg:col-span-7 p-10 md:p-16 lg:p-20 flex items-center justify-center bg-white relative">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-xl"
          >
            <motion.div variants={itemVariants} className="mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight mb-3">Send a Message</h2>
              <p className="text-zinc-500 font-medium">Expected response time: Under 2 hours.</p>
            </motion.div>

            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div variants={itemVariants}>
                  <MinimalInput label="Your Name" placeholder="John Doe" type="text" />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <MinimalInput label="Email Address" placeholder="john@example.com" type="email" />
                </motion.div>
              </div>
              
              <motion.div variants={itemVariants} className="pt-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4 block">How can we help?</label>
                <div className="flex flex-wrap gap-3">
                  {['Inquiry', 'Support', 'Feedback', 'Partnership'].map((tag) => (
                    <button 
                      key={tag} 
                      type="button"
                      onClick={() => setActiveCategory(tag)}
                      className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border ${
                        activeCategory === tag 
                          ? "bg-zinc-900 border-zinc-900 text-white shadow-lg shadow-zinc-900/20" 
                          : "bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:text-zinc-900"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="pt-2">
                <div className="relative group">
                  <textarea 
                    placeholder="Tell us about your project or issue..."
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-3xl p-6 text-zinc-900 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 min-h-[160px] outline-none transition-all duration-300 placeholder:text-zinc-400 resize-none font-medium peer relative z-10"
                  />
                  {/* Subtle focus glow behind the textarea */}
                  <div className="absolute inset-0 bg-blue-500/0 rounded-3xl blur-xl transition-colors duration-500 peer-focus:bg-blue-500/5 -z-10" />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="pt-4">
                <button 
                  type="submit"
                  className="group relative w-full overflow-hidden bg-zinc-900 text-white py-5 rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 active:scale-[0.98]"
                >
                  <span className="relative z-10">TRANSMIT MESSAGE</span>
                  <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out" />
                </button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function ContactItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-5 group cursor-pointer">
      <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 group-hover:shadow-[0_0_30px_rgba(37,99,235,0.3)] transition-all duration-500">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-1">{label}</p>
        <p className="text-lg font-bold text-zinc-100 tracking-tight group-hover:text-blue-400 transition-colors duration-300">{value}</p>
      </div>
    </div>
  );
}

function MinimalInput({ label, placeholder, type }) {
  return (
    <div className="relative group">
      <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2 block ml-1 transition-colors group-focus-within:text-blue-600">
        {label}
      </label>
      <input 
        type={type} 
        placeholder={placeholder}
        className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-5 py-4 text-zinc-900 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-300 placeholder:text-zinc-300 font-medium peer relative z-10" 
      />
      {/* Subtle focus glow */}
      <div className="absolute inset-y-0 inset-x-0 top-6 bg-blue-500/0 rounded-2xl blur-lg transition-colors duration-500 peer-focus:bg-blue-500/5 -z-10" />
    </div>
  );
}

function SocialIcon({ icon }) {
  return (
    <button className="w-12 h-12 rounded-full border border-zinc-800 bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-blue-600 hover:border-blue-500 hover:-translate-y-1 transition-all duration-300">
      {icon}
    </button>
  );
}