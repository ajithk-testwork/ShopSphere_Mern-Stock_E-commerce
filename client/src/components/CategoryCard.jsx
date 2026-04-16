import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../utils/api";
import { ArrowUpRight } from "lucide-react";

export default function CategoryCard() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");

      setCategories((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(res.data)) {
          return res.data;
        }
        return prev;
      });
    } catch (error) {
      console.error("Failed to load categories", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();

    const interval = setInterval(() => {
      fetchCategories();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (loading && categories.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="aspect-[10/14] bg-gray-100 animate-pulse rounded-[2.5rem]"
          />
        ))}
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-8 h-[2px] bg-blue-600 rounded-full"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">
              Live Catalog
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-gray-900 leading-none">
            Curated Collection
          </h2>
        </div>

        <Link
          to="/products"
          className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-all"
        >
          View All Products
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {categories.map((category) => (
          <motion.div
            layout
            key={category._id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              to={`/sub-category?category=${category.name.toLowerCase()}`}
              className="group relative aspect-[10/14] block overflow-hidden rounded-[2.5rem] bg-gray-900 shadow-2xl shadow-black/20"
            >
              <img
                src={
                  category.image.startsWith("http")
                    ? category.image
                    : `https://shopsphere-mern-stock-e-commerce.onrender.com${category.image}`
                }
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-3 block">
                  Premium Quality
                </span>
                <h3 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight tracking-tighter capitalize">
                  {category.name}
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-white uppercase tracking-widest opacity-80 group-hover:opacity-100 transition-all">
                    Explore Now
                  </span>
                  <div className="h-[2px] bg-blue-600 rounded-full w-8 group-hover:w-16 transition-all duration-500 shadow-[0_0_15px_rgba(37,99,235,0.6)]" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
