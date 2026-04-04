import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import ProductCard from "./ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ShoppingBag } from "lucide-react";

export default function SubCategoryProducts() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoryName = searchParams.get("category"); 
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndFilterProducts = async () => {
      setLoading(true);
      try {
        
        const res = await api.get("/products");
        
        
        const filtered = res.data.products.filter((product) => 
          product.category?.name?.toLowerCase() === categoryName?.toLowerCase()
        );
        
        setProducts(filtered);
      } catch (error) {
        console.error("Error fetching filtered products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryName) {
      fetchAndFilterProducts();
    }
  }, [categoryName]);

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
     
      <button 
        onClick={() => navigate("/")} 
        className="mb-8 cursor-pointer flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
      >
        <ChevronLeft size={16} /> Back to Home
      </button>

      <header className="mb-12 space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-8 h-[2px] bg-blue-600"></span>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">
            Category Spotlight
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black capitalize tracking-tighter text-gray-900">
          {categoryName} <span className="text-blue-600">Collection</span>
        </h1>
        <p className="text-gray-500 font-medium">
          Showing {products.length} premium items found.
        </p>
      </header>

      {/* Product Grid */}
      <AnimatePresence mode="wait">
        {products.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10"
          >
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-32 text-center border-2 border-dashed border-gray-100 rounded-[3rem] bg-gray-50/50"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="p-5 bg-white rounded-full shadow-sm">
                <ShoppingBag className="text-gray-300 w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">No Products Found</h3>
              <p className="text-gray-500 max-w-xs mx-auto">
                We couldn't find any items in the <span className="font-bold text-black">"{categoryName}"</span> category right now.
              </p>
              <button 
                onClick={() => navigate("/products")}
                className="mt-4 px-8 py-3 bg-black text-white rounded-2xl font-bold text-sm hover:bg-gray-800 transition-all"
              >
                Browse All Products
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}