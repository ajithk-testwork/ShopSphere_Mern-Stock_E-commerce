import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../Admin/context/AuthContext"; // Added Auth context
import { api } from "../utils/api";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ChevronLeft, AlertCircle, CheckCircle } from "lucide-react";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchCartCount } = useCart();
  const { user } = useAuth(); // Get user state

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState(null); // Animated message state

  const showMsg = (text, type = "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data.product);
      } catch (e) {
        console.error("Failed to load product", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    // 1. Check if user is logged in
    if (!user) {
      showMsg("Please login to add items to cart", "error");
      return;
    }

    try {
      setAdding(true);
      await api.post("/carts/add", {
        productId: id,
        quantity: 1,
      });
      fetchCartCount();
      showMsg("Added to Bag!", "success");
    } catch (e) {
      showMsg("Failed to add item", "error");
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20 relative">
      {/* --- Animated Notification --- */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 20, x: "-50%" }}
            exit={{ opacity: 0, y: -50, x: "-50%" }}
            className={`fixed top-10 left-1/2 z-50 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold border ${
              message.type === "success" 
              ? "bg-white text-green-600 border-green-100" 
              : "bg-white text-blue-600 border-blue-100"
            }`}
          >
            {message.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      <button onClick={() => navigate(-1)} className="mb-8 flex items-center cursor-pointer gap-2 text-sm font-bold text-gray-400 hover:text-black transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back to Collection
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="relative aspect-square bg-[#F9FAFB] rounded-[2.5rem] overflow-hidden border border-gray-100 flex items-center justify-center p-8 lg:p-12">
          <img src={`https://shopsphere-mern-stock-e-commerce.onrender.com${product.image}`} alt={product.name} className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 hover:scale-105" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col h-full py-2">
          <div className="flex-1">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 mb-4 block">Premium Selection</span>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-gray-900 mb-6">{product.name}</h1>
            <p className="text-lg text-gray-500 leading-relaxed font-medium mb-8">{product.description}</p>
            <p className="text-4xl font-black text-gray-900 mb-10">₹{product.price?.toLocaleString('en-IN')}</p>
          </div>

          <div className="pt-8 border-t border-gray-100">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={adding}
              className={`w-full cursor-pointer md:w-auto min-w-[240px] flex items-center justify-center gap-3 px-8 py-5 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-black/5 ${
                adding ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              {adding ? "Processing..." : "Add to Cart"}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}