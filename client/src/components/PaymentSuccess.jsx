import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { api } from "../utils/api";

const PaymentSuccess = () => {
  const { fetchCartCount } = useCart();
  const [params] = useSearchParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

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
          <p className="text-gray-500 font-medium">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    // h-screen and overflow-hidden prevent the entire page from scrolling
    <div className="h-screen w-full bg-gradient-to-br from-green-50 via-white to-gray-100 flex items-center justify-center p-4 overflow-hidden">
      
      {/* Max height constraints ensure the card never exceeds the screen */}
      <div className="max-w-md w-full max-h-full flex flex-col bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden">
        
        {/* HEADER: Static, non-scrolling */}
        <div className="p-6 pb-4 text-center flex-shrink-0 relative">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
            <CheckCircle className="text-green-500 w-10 h-10" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mb-1">
            Payment Successful 🎉
          </h1>
          <p className="text-sm text-gray-500">
            Your order is confirmed and being processed.
          </p>
        </div>

        {/* BODY: Scrollable internally ONLY if content is too long */}
        <div className="px-6 py-2 flex-1 overflow-y-auto custom-scrollbar">
          {order && (
            <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl space-y-4">
              
              {/* Top Row: Order ID & Total Side-by-Side to save vertical space */}
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <div className="min-w-0 pr-4">
                  <p className="text-xs text-gray-500 mb-1">Order ID</p>
                  <p className="text-sm font-mono text-gray-900 truncate">
                    {order._id}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-gray-500 mb-1">Total</p>
                  <p className="text-lg font-bold text-green-600">
                    ₹{order.totalAmount}
                  </p>
                </div>
              </div>

              {/* Items List */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Items Purchased
                </p>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item._id}
                      className="flex justify-between items-center text-sm gap-3"
                    >
                      {/* truncate forces long names onto a single line with ... */}
                      <span className="text-gray-700 font-medium truncate flex-1">
                        {item.product.name}
                      </span>
                      <span className="text-gray-500 font-semibold bg-white px-2 py-0.5 rounded-md border border-gray-200 shadow-sm flex-shrink-0">
                        x{item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Shipping To
                </p>
                <p className="text-sm text-gray-700 truncate">
                  <span className="font-medium text-gray-900">{order.shippingAddress.fullName}</span> • {order.shippingAddress.city}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER: Static, non-scrolling actions */}
        <div className="p-6 pt-4 space-y-3 flex-shrink-0 bg-white border-t border-gray-50">
          <Link
            to="/orders/my-orders"
            className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3.5 rounded-xl font-bold hover:bg-black hover:shadow-lg transition-all active:scale-[0.98]"
          >
            <Package size={18} /> View My Orders
          </Link>

          <Link
            to="/products"
            className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 font-semibold py-2 hover:text-gray-900 transition-colors"
          >
            Continue Shopping <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default PaymentSuccess;