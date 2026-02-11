import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageCircle, Globe, Instagram, Twitter } from "lucide-react";

export default function Contact() {
  return (
    <div className="bg-[#0A0A0A] min-h-screen text-white selection:bg-blue-500">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        
        {/* --- LEFT SIDE: THE VIBE & INFO (Dark) --- */}
        <div className="lg:col-span-5 relative p-8 md:p-16 flex flex-col justify-between overflow-hidden bg-[#0F0F0F]">
          {/* Animated Background Glow */}
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full" />
          
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-6">
                TALK TO <br /> <span className="text-blue-600">US.</span>
              </h1>
              <p className="text-gray-400 text-lg max-w-sm font-medium leading-relaxed">
                Have a vision? A question? Or just want to say hi? Our sphere is always open for innovators.
              </p>
            </motion.div>

            <div className="mt-20 space-y-12">
              <ContactItem icon={<Mail />} label="Email" value="hello@shopsphere.tech" />
              <ContactItem icon={<Phone />} label="Phone" value="+91 123 456 7890" />
              <ContactItem icon={<MapPin />} label="Studio" value="Cyber City, Phase II, Gurugram" />
            </div>
          </div>

          {/* Social Links */}
          <div className="relative z-10 pt-12 flex gap-6">
            <SocialIcon icon={<Instagram />} />
            <SocialIcon icon={<Twitter />} />
            <SocialIcon icon={<Globe />} />
          </div>
        </div>

        {/* --- RIGHT SIDE: THE INTERACTIVE FORM (Light/Glass) --- */}
        <div className="lg:col-span-7 bg-white p-8 md:p-20 flex items-center justify-center relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl"
          >
            <div className="mb-12">
              <h2 className="text-4xl font-black text-black tracking-tight mb-2">Send a Message</h2>
              <p className="text-gray-500 font-medium">Expected response time: Under 2 hours</p>
            </div>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FloatingInput label="Your Name" placeholder="Elon Musk" />
              <FloatingInput label="Email Address" placeholder="elon@x.com" />
              
              <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-4 block">Message Category</label>
                <div className="flex flex-wrap gap-3">
                  {['Inquiry', 'Support', 'Feedback', 'Partnership'].map((tag) => (
                    <button key={tag} type="button" className="px-6 py-2 cursor-pointer rounded-full border border-gray-200 text-black text-xs font-bold hover:bg-black hover:text-white transition-all">
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <textarea 
                  placeholder="Tell us about your project or issue..."
                  className="w-full bg-gray-50 border-none rounded-3xl p-6 text-black focus:ring-2 focus:ring-blue-600 min-h-[180px] outline-none transition-all placeholder:text-gray-300"
                />
              </div>

              <div className="md:col-span-2">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group w-full bg-black cursor-pointer text-white py-6 rounded-[2rem] font-black text-xl flex items-center justify-center gap-4 hover:shadow-2xl hover:shadow-blue-500/20 transition-all"
                >
                  TRANSMIT MESSAGE
                  <Send className="w-5 h-5 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS FOR CLEANER CODE ---

function ContactItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-6 group">
      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{label}</p>
        <p className="text-lg font-bold text-white tracking-tight">{value}</p>
      </div>
    </div>
  );
}

function FloatingInput({ label, placeholder }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-blue-600 ml-1">{label}</label>
      <input 
        type="text" 
        placeholder={placeholder}
        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-5 text-black focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-gray-300 font-medium" 
      />
    </div>
  );
}

function SocialIcon({ icon }) {
  return (
    <button className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:border-white transition-all">
      {icon}
    </button>
  );
}