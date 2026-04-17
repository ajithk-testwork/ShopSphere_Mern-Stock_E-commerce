import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { api } from "../utils/api";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ChevronLeft, AlertCircle, CheckCircle } from "lucide-react";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchCartCount } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState(null); 

  const showMsg = (text, type = "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const imageUrl = product?.image
    ? product.image.startsWith("http")
      ? product.image
      : `https://shopsphere-mern-stock-e-commerce.onrender.com${product.image}`
    : "https://via.placeholder.com/600";

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
    const user = JSON.parse(localStorage.getItem("user")); 

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

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    // ✅ Main wrapper takes up minimum height and centers content vertically
    <div className="min-h-[85vh] flex flex-col justify-center max-w-7xl mx-auto px-6 py-10 relative">
      
      {/* --- Animated Notification --- */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 20, x: "-50%" }}
            exit={{ opacity: 0, y: -50, x: "-50%" }}
            className={`fixed top-10 left-1/2 z-50 px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-3 font-bold text-sm border ${
              message.type === "success" 
              ? "bg-white text-emerald-600 border-emerald-100" 
              : "bg-white text-gray-900 border-gray-200"
            }`}
          >
            {message.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back Button positioned cleanly at the top left of the container */}
      <div className="w-full mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center w-fit cursor-pointer gap-2 text-sm font-bold text-gray-400 hover:text-black transition-colors bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-full"
        >
          <ChevronLeft className="w-4 h-4" /> 
          Back to Collection
        </button>
      </div>

      {/* ✅ Grid updated to items-center to balance text and image perfectly */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
        
        {/* Left: Product Image */}
        <motion.div 
          initial={{ opacity: 0, x: -20, scale: 0.95 }} 
          animate={{ opacity: 1, x: 0, scale: 1 }} 
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square bg-gray-50/80 rounded-[2.5rem] overflow-hidden border border-gray-100 flex items-center justify-center p-8 lg:p-12 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)]"
        >
          <img 
            src={imageUrl} 
            alt={product.name} 
            className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 hover:scale-[1.03]" 
          />
        </motion.div>

        {/* Right: Product Details */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="flex flex-col justify-center h-full py-4 lg:py-8 lg:pr-8"
        >
          <div className="flex-1">
            <span className="inline-block px-3 py-1 bg-gray-100 text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 rounded-full mb-6">
              Premium Selection
            </span>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-gray-900 mb-6 leading-[1.1]">
              {product.name}
            </h1>
            <p className="text-[15px] text-gray-500 leading-relaxed font-medium mb-8 max-w-xl">
              {product.description}
            </p>
            <div className="flex items-end gap-3 mb-10">
              <span className="text-4xl font-black tracking-tight text-gray-900">
                ₹{product.price?.toLocaleString('en-IN')}
              </span>
              <span className="text-sm font-bold text-gray-400 mb-1.5 uppercase tracking-widest">
                Tax incl.
              </span>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-100">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={adding}
              className={`w-full sm:w-auto min-w-[280px] flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-base transition-all shadow-xl shadow-gray-900/10 cursor-pointer ${
                adding 
                ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none" 
                : "bg-gray-900 text-white hover:bg-black hover:shadow-gray-900/20"
              }`}
            >
              {adding ? (
                <>
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ShoppingBag size={18} strokeWidth={2.5} />
                  Add to Cart
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}