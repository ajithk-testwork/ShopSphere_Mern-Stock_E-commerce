import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, AlertCircle, PackageX, Search, ChevronDown } from "lucide-react";
import { api } from "../utils/api"; 
import ProductCard from "../components/ProductCard";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  
  const categories = ["All", "Laptops", "Audio", "Wearables", "Accessories"];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get("/products");
        setProducts(res.data.products || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching products", err);
        setError("Failed to load the collection. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

 
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

   
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter((p) => 
        p.name?.toLowerCase().includes(lowerQuery) || 
        p.description?.toLowerCase().includes(lowerQuery)
      );
    }

    
    if (activeCategory !== "All") {
      result = result.filter((p) => p.category?.toLowerCase() === activeCategory.toLowerCase());
    }

    
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-desc":
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "newest":
      default:
       
        result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
    }

    return result;
  }, [products, searchQuery, activeCategory, sortBy]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 15 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
  };

  return (
    <div className="bg-zinc-50 min-h-screen pb-24 selection:bg-blue-500 selection:text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8 pt-16">
        
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-4"
            >
              <div className="w-8 h-[2px] bg-blue-600" />
              <span className="text-blue-600 font-black uppercase tracking-[0.2em] text-xs">
                Curated Collection
              </span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-black text-zinc-900 tracking-tighter"
            >
              The Sphere.
            </motion.h1>
          </div>

         
          <motion.button 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 border px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-sm active:scale-95 ${
              showFilters ? "bg-zinc-900 text-white border-zinc-900" : "bg-white border-zinc-200 text-zinc-700 hover:border-blue-500 hover:text-blue-600"
            }`}
          >
            <SlidersHorizontal size={18} />
            Control Panel
          </motion.button>
        </div>

        
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0, marginBottom: 0 }}
              animate={{ height: "auto", opacity: 1, marginBottom: 48 }}
              exit={{ height: 0, opacity: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white border border-zinc-200 rounded-[2rem] p-6 shadow-xl shadow-zinc-200/20">
                <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                  
                 
                  <div className="relative w-full lg:w-1/3 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-600 transition-colors w-5 h-5" />
                    <input 
                      type="text" 
                      placeholder="Search the sphere..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-medium text-zinc-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-zinc-400"
                    />
                  </div>

                 

                 
                  <div className="relative w-full lg:w-auto min-w-[200px]">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-zinc-900 cursor-pointer focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    >
                      <option value="newest">Latest Arrivals</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none w-4 h-4" />
                  </div>

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        
        {loading ? (
         
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col gap-4">
                <div className="w-full aspect-[4/5] bg-zinc-200 animate-pulse rounded-[2rem]" />
                <div className="space-y-3 px-2">
                  <div className="w-2/3 h-5 bg-zinc-200 animate-pulse rounded-full" />
                  <div className="w-1/3 h-4 bg-zinc-200 animate-pulse rounded-full" />
                </div>
              </div>
            ))}
          </div>

        ) : error ? (
          
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
              <AlertCircle size={40} />
            </div>
            <h3 className="text-2xl font-black text-zinc-900 mb-2 tracking-tight">Transmission Failed</h3>
            <p className="text-zinc-500 font-medium max-w-md">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-8 bg-zinc-900 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>

        ) : filteredAndSortedProducts.length === 0 ? (
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="w-20 h-20 bg-zinc-100 text-zinc-400 rounded-full flex items-center justify-center mb-6">
              <PackageX size={40} />
            </div>
            <h3 className="text-2xl font-black text-zinc-900 mb-2 tracking-tight">No Matches Found</h3>
            <p className="text-zinc-500 font-medium max-w-md">
              We couldn't find any products matching your current filters. Try adjusting your search or categories.
            </p>
            <button 
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
                setSortBy("newest");
              }}
              className="mt-8 bg-zinc-100 text-zinc-900 px-8 py-3 rounded-full font-bold hover:bg-zinc-200 transition-colors"
            >
              Clear All Filters
            </button>
          </motion.div>

        ) : (
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredAndSortedProducts.map((product) => (
                <motion.div 
                  key={product._id} 
                  layout 
                  variants={itemVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

      </div>
      
     
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default Products;