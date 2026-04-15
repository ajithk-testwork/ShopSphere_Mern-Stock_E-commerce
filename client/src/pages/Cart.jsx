import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const { fetchCartCount } = useCart();
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await api.get("/carts");
      setCart(res.data);
    } catch (error) {
      console.error("Failed to load cart", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productId, quantity) => {
    try {
      if (quantity < 1) {
        await removeItem(productId);
        return;
      }
      await api.put("/carts/update", {
        productId: productId.toString(),
        quantity,
      });
      fetchCart();
    } catch (err) {
      console.error("Quantity update failed", err);
    }
  };

  const removeItem = async (productId) => {
    try {
      await api.delete("/carts/delete", {
        data: { productId: productId.toString() },
      });
      fetchCart();
      fetchCartCount();
    } catch (err) {
      console.error("Remove failed", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center min-h-[70vh] flex flex-col items-center justify-center">
        <div className="flex justify-center mb-8">
          <div className="p-8 bg-gray-50 rounded-full shadow-sm border border-gray-100">
            <ShoppingBag className="w-16 h-16 text-gray-300" />
          </div>
        </div>
        <h2 className="text-4xl font-black tracking-tight text-gray-900 mb-4">
          Your bag is empty
        </h2>
        <p className="text-gray-500 text-lg mb-10 max-w-md mx-auto">
          Looks like you haven't added anything to your cart yet. Discover our latest products and find something you love.
        </p>
        <button
          onClick={() => navigate("/products")}
          className="group flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-full font-bold cursor-pointer hover:bg-gray-800 transition-all hover:shadow-xl hover:-translate-y-1"
        >
          Continue Shopping <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    );
  }

  const total = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
      {/* Back to Home Button */}
      <button
        onClick={() => navigate("/")}
        className="group flex items-center text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors mb-8 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </button>

      <div className="flex items-end justify-between mb-10">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900">
          Shopping Bag
        </h1>
        <span className="text-gray-500 font-medium pb-2 hidden sm:block">
          {cart.items.length} {cart.items.length === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 items-start">
        {/* Items List */}
        <div className="xl:col-span-2 space-y-5">
          <AnimatePresence mode="popLayout">
            {cart.items.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                key={item.product._id}
                className="flex flex-col sm:flex-row gap-6 p-5 sm:p-6 rounded-[2rem] bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow items-center relative group"
              >
                {/* Product Image Container */}
                <div className="w-28 h-28 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100 flex items-center justify-center p-3 transition-colors">
                  <img
                    src={
                      item.product.image?.startsWith("http")
                        ? item.product.image
                        : `https://shopsphere-mern-stock-e-commerce.onrender.com${item.product.image}`
                    }
                    alt={item.product.name}
                    className="max-w-full max-h-full object-contain mix-blend-multiply drop-shadow-sm"
                    onError={(e) => {
                      e.target.src = "https://placehold.co/100x100?text=Item";
                    }}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 text-center sm:text-left w-full">
                  <h2 className="text-xl font-bold text-gray-900 line-clamp-2 leading-tight mb-2">
                    {item.product.name}
                  </h2>
                  <p className="text-gray-500 font-semibold text-lg">
                    ₹{item.product.price.toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 w-full sm:w-auto justify-between sm:justify-end">
                  {/* Quantity Controls */}
                  <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200 p-1">
                    <button
                      onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                      className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all cursor-pointer text-gray-600 hover:text-gray-900"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-bold text-gray-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                      className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all cursor-pointer text-gray-600 hover:text-gray-900"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Subtotal & Remove */}
                  <div className="flex flex-col items-end gap-2 min-w-[120px]">
                    <p className="font-black text-gray-900 text-xl tracking-tight">
                      ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                    <button
                      onClick={() => removeItem(item.product._id)}
                      className="text-red-400 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-sm font-bold"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary Sidebar */}
        <div className="bg-gray-900 text-white rounded-[2.5rem] p-8 lg:sticky lg:top-32 shadow-2xl shadow-gray-900/20">
          <h2 className="text-2xl font-black mb-8 tracking-tight">Order Summary</h2>

          <div className="space-y-5 mb-8">
            <div className="flex justify-between text-gray-400 font-medium text-lg">
              <span>Subtotal</span>
              <span className="text-white">₹{total.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-gray-400 font-medium text-lg">
              <span>Shipping Estimate</span>
              <span className="text-emerald-400 font-bold">Free</span>
            </div>
            <div className="flex justify-between text-gray-400 font-medium text-lg">
              <span>Tax</span>
              <span className="text-white">Calculated at checkout</span>
            </div>
            
            <div className="border-t border-white/10 pt-6 mt-6 flex justify-between items-end">
              <span className="text-xl font-medium text-gray-300">Total</span>
              <span className="text-4xl font-black tracking-tighter">
                ₹{total.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate("/shipping")}
            className="w-full group flex items-center justify-center gap-3 bg-white text-gray-900 px-6 py-4 rounded-2xl font-black text-lg hover:bg-gray-100 transition-all cursor-pointer hover:shadow-lg hover:shadow-white/10 active:scale-[0.98]"
          >
            Proceed to Checkout
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="text-center text-xs text-gray-500 mt-8 uppercase tracking-[0.2em] font-bold flex flex-col items-center gap-2">
            <span>Secure Checkout</span>
            <span className="flex gap-2 opacity-50">
               {/* Optional: Add payment icons here if you have them */}
               256-bit SSL Encryption
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}