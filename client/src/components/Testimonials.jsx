import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Arjun Mehta",
    role: "Tech Reviewer",
    content: "The sound quality on the Boat Rockerz 650 Pro is unmatched at this price point. ShopSphere's delivery was fast.",
    rating: 5,
    image: "https://i.pravatar.cc/150?u=arjun"
  },
  {
    id: 2,
    name: "Sarah Jenkins",
    role: "Digital Artist",
    content: "Found my new MacBook here. The premium selection is truly curated for professionals. Exceptional service!",
    rating: 5,
    image: "https://i.pravatar.cc/150?u=sarah"
  },
  {
    id: 3,
    name: "Vikram Singh",
    role: "Software Engineer",
    content: "Secure checkout and authentic products. ShopSphere has become my go-to for all my wearable tech needs.",
    rating: 5,
    image: "https://i.pravatar.cc/150?u=vikram"
  },
  // Doubling the array to create a seamless infinite loop
  {
    id: 4,
    name: "Priya Das",
    role: "UX Designer",
    content: "Minimalist UI and great user experience. Buying tech has never been this satisfying.",
    rating: 5,
    image: "https://i.pravatar.cc/150?u=priya"
  }
];

export default function TestimonialSlider() {
  // We duplicate the items to make the loop infinite
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="py-24 bg-white overflow-hidden">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center md:text-left">
        <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
          <span className="w-8 h-[2px] bg-blue-600"></span>
          <span className="text-xs font-black uppercase tracking-[0.4em] text-blue-600">
            Digital Praise
          </span>
        </div>
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-gray-900 leading-tight">
          Voices of the <span className="text-blue-600">ShopSphere.</span>
        </h2>
      </div>

      {/* Infinite Moving Track */}
      <div className="flex relative">
        <motion.div 
          className="flex gap-8 px-4"
          animate={{ x: [0, -1920] }} // Adjust based on total width
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 40, // Increase for slower speed
              ease: "linear",
            },
          }}
          style={{ width: "fit-content" }}
        >
          {duplicatedTestimonials.map((item, index) => (
            <div
              key={index}
              className="w-[350px] md:w-[450px] flex-shrink-0 group relative p-8 md:p-10 rounded-[3rem] bg-[#F9FAFB] border border-gray-100 transition-all duration-500 hover:border-blue-100 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)]"
            >
              <div className="absolute top-8 right-10 text-gray-100 group-hover:text-blue-50/50 transition-colors">
                <Quote size={60} fill="currentColor" />
              </div>

              <div className="flex gap-1 mb-6 relative z-10">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} size={14} className="fill-blue-600 text-blue-600" />
                ))}
              </div>

              <p className="relative z-10 text-gray-600 text-lg leading-relaxed mb-8 font-medium">
                "{item.content}"
              </p>

              <div className="flex items-center gap-4 border-t border-gray-100 pt-8">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm grayscale group-hover:grayscale-0 transition-all duration-500">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-black text-gray-900 leading-none mb-1">{item.name}</h4>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Side Fades for that high-end look */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none" />
      </div>
    </section>
  );
}