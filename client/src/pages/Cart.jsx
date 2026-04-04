import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
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
      <div className="max-w-7xl mx-auto px-6 py-20 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-6 bg-gray-50 rounded-full">
            <ShoppingBag className="w-12 h-12 text-gray-300" />
          </div>
        </div>
        <h2 className="text-3xl font-black tracking-tight text-gray-900">
          Your bag is empty
        </h2>
        <p className="text-gray-500 mt-2 mb-8">
          Items you add to your bag will show up here.
        </p>
        <button
          onClick={() => (window.location.href = "/products")}
          className="bg-black text-white px-8 py-3 rounded-2xl font-bold cursor-pointer hover:bg-gray-800 transition-all"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  const total = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
      <h1 className="text-4xl font-black tracking-tighter text-gray-900 mb-10">
        Shopping Bag
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="popLayout">
            {cart.items.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={item.product._id}
                className="flex flex-col sm:flex-row gap-6 p-6 rounded-[2rem] bg-gray-50 border border-gray-100 items-center"
              >
                {/* Product Image Container */}
                <div className="w-24 h-24 bg-white rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100 flex items-center justify-center p-2 group-hover:bg-gray-50 transition-colors">
                  <img
                    src={`https://shopsphere-mern-stock-e-commerce.onrender.com${item.product.image}`}
                    alt={item.product.name}
                    
    
                    className="max-w-full max-h-full object-contain mix-blend-multiply"
                    onError={(e) => {
                      e.target.src = "https://placehold.co/100x100?text=Item";
                    }}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-lg font-bold text-gray-900">
                    {item.product.name}
                  </h2>
                  <p className="text-gray-500 font-medium">
                    ₹{item.product.price.toLocaleString("en-IN")}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center bg-white rounded-xl border border-gray-200 p-1">
                  <button
                    onClick={() =>
                      updateQuantity(item.product._id, item.quantity - 1)
                    }
                    className="p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-bold">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item.product._id, item.quantity + 1)
                    }
                    className="p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Subtotal & Remove */}
                <div className="flex flex-col items-end gap-2 min-w-[100px]">
                  <p className="font-black text-gray-900 text-lg">
                    ₹
                    {(item.product.price * item.quantity).toLocaleString(
                      "en-IN",
                    )}
                  </p>
                  <button
                    onClick={() => removeItem(item.product._id)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Remove</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary Sidebar */}
        <div className="bg-gray-900 text-white rounded-[2.5rem] p-8 lg:sticky lg:top-32 shadow-2xl shadow-black/20">
          <h2 className="text-xl font-bold mb-6">Order Summary</h2>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-gray-400 font-medium">
              <span>Subtotal</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-gray-400 font-medium">
              <span>Shipping</span>
              <span className="text-green-400">Free</span>
            </div>
            <div className="border-t border-white/10 pt-4 flex justify-between items-end">
              <span className="text-lg font-bold">Total</span>
              <span className="text-3xl font-black">
                ₹{total.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <button
  onClick={() => navigate("/shipping")}
  className="bg-green-600 text-white px-6 py-3 rounded-lg"
>
  Checkout
</button>

          <p className="text-center text-[10px] text-gray-500 mt-6 uppercase tracking-widest font-bold">
            Secure Encryption • 256-bit SSL
          </p>
        </div>
      </div>
    </div>
  );
}
