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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">Verifying payment...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white rounded-[2rem] shadow-xl p-8 text-center">

        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="text-green-600 w-12 h-12" />
        </div>

        <h1 className="text-3xl font-black text-gray-900 mb-2">
          Payment Successful 🎉
        </h1>

        <p className="text-gray-600 mb-6">
          Your order has been confirmed and is being processed.
        </p>

        {/* 🧾 ORDER DETAILS */}
        {order && (
          <div className="text-left bg-gray-50 p-4 rounded-xl mb-6 space-y-3">

            <p className="font-semibold">
              Order ID: <span className="text-gray-600">{order._id}</span>
            </p>

            <p className="font-semibold">
              Total: ₹{order.totalAmount}
            </p>

            {/* Products */}
            <div>
              <p className="font-semibold mb-2">Items:</p>

              {order.items.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between text-sm text-gray-700"
                >
                  <span>{item.product.name}</span>
                  <span>x{item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Address */}
            <div>
              <p className="font-semibold mt-3">Shipping:</p>
              <p className="text-sm text-gray-600">
                {order.shippingAddress.fullName},{" "}
                {order.shippingAddress.city}
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-4">
          <Link
            to="/orders/my-orders"
            className="w-full flex items-center justify-center gap-2 bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all"
          >
            <Package size={20} /> View My Orders
          </Link>

          <Link
            to="/products"
            className="w-full flex items-center justify-center gap-2 text-gray-600 font-semibold py-2 hover:text-black transition-all"
          >
            Continue Shopping <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;