import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, Package, ArrowRight, MapPin, Receipt } from "lucide-react";
import { useCart } from "../context/CartContext";
import { api } from "../utils/api";

// ⚠️ Make sure to import or define your BASE_URL here if it's not in your api config
// const BASE_URL = "http://localhost:5000"; // Example

const PaymentSuccess = () => {
  const { fetchCartCount } = useCart();
  const [params] = useSearchParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fallback for BASE_URL if not defined globally
  const BASE_URL = api.defaults?.baseURL || "http://localhost:5000";

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const orderId = params.get("orderId");

        if (!orderId) return;

        const res = await api.post("/payments/verify", {
          orderId,
        });

        setOrder(res.data.order);

        // ✅ clear cart + temp data
        localStorage.removeItem("lastOrder");
        localStorage.removeItem("shippingAddress");

        fetchCartCount();
      } catch (err) {
        console.error("Payment verification failed:", err);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [params, fetchCartCount]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-medium">Verifying your secure payment...</p>
        </div>
      </div>
    );
  }

  return (
    // h-screen ensures the page itself never scrolls
    <div className="h-screen w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4 md:p-8 overflow-hidden">
      
      {/* Main Container: Split layout on Desktop, Stacked on Mobile */}
      <div className="max-w-5xl w-full max-h-full flex flex-col-reverse lg:flex-row bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100">
        
        {/* ========================================== */}
        {/* LEFT SIDE: Order Details (Scrollable) */}
        {/* ========================================== */}
        <div className="w-full lg:w-3/5 bg-gray-50/50 flex flex-col max-h-[50vh] lg:max-h-[85vh]">
          
          {/* Details Header */}
          <div className="p-6 md:p-8 pb-4 border-b border-gray-200 bg-white flex-shrink-0 flex justify-between items-end">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-gray-400" /> Order Summary
              </h2>
              <p className="text-sm text-gray-500 mt-1 font-mono">
                ID: {order?._id}
              </p>
            </div>
          </div>

          {/* Details Body (Scrollable Items List) */}
          <div className="p-6 md:p-8 flex-1 overflow-y-auto custom-scrollbar space-y-6">
            {order && (
              <>
                {/* Product List */}
                <div className="space-y-4">
                  {order.items.map((item) => {
                    const product = item.product;
                    
                    // ✅ Updated Image Logic
                    const imageUrl = product?.image
                      ? product.image.startsWith("http")
                        ? product.image 
                        : `${BASE_URL}${product.image}`
                      : "https://via.placeholder.com/600";

                    return (
                      <div
                        key={item._id}
                        className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm"
                      >
                        {/* Product Image */}
                        <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                          <img 
                            src={imageUrl} 
                            alt={product?.name || "Product"} 
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm md:text-base font-semibold text-gray-900 line-clamp-2 leading-snug">
                            {product?.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Shipping Address */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Shipping Destination
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {order.shippingAddress.fullName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress.city}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Details Footer (Total) */}
          <div className="p-6 md:p-8 border-t border-gray-200 bg-white flex-shrink-0">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Total Paid</span>
              <span className="text-2xl font-black text-gray-900">
                ₹{order?.totalAmount?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* RIGHT SIDE: Success Message (Static) */}
        {/* ========================================== */}
        <div className="w-full lg:w-2/5 bg-white p-8 md:p-12 flex flex-col justify-center items-center text-center relative overflow-hidden flex-shrink-0 border-b lg:border-b-0 lg:border-l border-gray-100">
          
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-400/10 blur-[80px] rounded-full pointer-events-none"></div>

          {/* Icon */}
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.15)] relative z-10">
            <CheckCircle className="text-green-500 w-12 h-12" strokeWidth={2.5} />
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-3 relative z-10">
            Payment<br />Successful! 🎉
          </h1>
          
          <p className="text-gray-500 mb-8 relative z-10 leading-relaxed max-w-xs">
            Thank you for your purchase. We are currently processing your order and will email you the updates.
          </p>

          {/* Action Buttons */}
          <div className="w-full space-y-3 relative z-10">
            <Link
              to="/orders/my-orders"
              className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-black hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-[0.98]"
            >
              <Package size={20} /> Track My Order
            </Link>

            <Link
              to="/products"
              className="w-full flex items-center justify-center gap-2 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all"
            >
              Continue Shopping <ArrowRight size={18} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PaymentSuccess;