import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter, Youtube, ArrowUpRight } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Shop",
      links: [
        { name: "All Products", path: "/products" },
        { name: "Laptops", path: "/products?category=laptops" },
        { name: "Audio", path: "/products?category=audio" },
        { name: "Wearables", path: "/products?category=wearables" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", path: "/about" },
        { name: "Contact", path: "/contact" },
        { name: "Terms of Service", path: "/terms" },
        { name: "Privacy Policy", path: "/privacy" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Shipping Policy", path: "/shipping" },
        { name: "Returns & Exchanges", path: "/returns" },
        { name: "FAQs", path: "/faqs" },
        { name: "Secure Payment", path: "/payments" },
      ],
    },
  ];

  return (
    <footer className="bg-white border-t border-gray-100 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-20">
          
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-8">
            <Link to="/" className="text-2xl font-black tracking-tighter text-gray-900 flex items-center gap-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-white rotate-45" />
              </div>
              ShopSphere
            </Link>
            <p className="text-gray-500 font-medium leading-relaxed max-w-sm">
              Redefining the digital sphere through curated technology and human-centric design. Experience the future of retail.
            </p>
            <div className="flex items-center gap-4">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -3, color: "#000" }}
                  className="w-10 h-10 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-5 grid grid-cols-2 md:grid-cols-3 gap-8">
            {footerLinks.map((section) => (
              <div key={section.title} className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                  {section.title}
                </h4>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.path}
                        className="text-sm font-bold text-gray-600 hover:text-black transition-colors flex items-center group"
                      >
                        {link.name}
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-3 space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              Newsletter
            </h4>
            <p className="text-sm font-bold text-gray-900 leading-snug">
              Join the sphere. Get 10% off your first order.
            </p>
            <form className="relative group">
              <input
                type="email"
                placeholder="email@example.com"
                className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-black transition-all outline-none"
              />
              <button className="absolute right-2 top-2 bottom-2 bg-black text-white px-4 rounded-xl text-xs font-black hover:bg-gray-800 transition-all">
                JOIN
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs font-bold text-gray-400">
            © {currentYear} ShopSphere Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-8">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">
              Verified Secure Checkout
            </span>
            <div className="flex items-center gap-3 opacity-30 grayscale">
              {/* Payment Icons Placeholder */}
              <div className="w-8 h-5 bg-gray-400 rounded-sm" />
              <div className="w-8 h-5 bg-gray-400 rounded-sm" />
              <div className="w-8 h-5 bg-gray-400 rounded-sm" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;