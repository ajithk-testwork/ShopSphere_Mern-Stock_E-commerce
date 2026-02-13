import { useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";

const PaymentSuccess = () => {
  const { fetchCartCount } = useCart();

  useEffect(() => {
    // Clear local storage and refresh cart count on success
    localStorage.removeItem("lastOrder");
    localStorage.removeItem("shippingAddress");
    fetchCartCount(); 
  }, [fetchCartCount]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-[2rem] shadow-xl p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="text-green-600 w-12 h-12" />
        </div>
        
        <h1 className="text-3xl font-black text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your purchase. We've received your payment and are preparing your package.
        </p>

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