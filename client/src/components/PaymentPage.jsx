import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { Loader2, ShieldCheck } from "lucide-react";

const PaymentPage = () => {
  const [error, setError] = useState(null);

  useEffect(() => {
    const order = JSON.parse(localStorage.getItem("lastOrder"));

    if (!order || !order._id) {
      window.location.href = "/cart";
      return;
    }

    const createSession = async () => {
      try {
        // Points to router.post("/payments/create", ...)
        const { data } = await api.post("/payments/create", {
          orderId: order._id,
        });

        if (data.url) {
          window.location.href = data.url; 
        } else {
          throw new Error("No redirection URL received");
        }
      } catch (err) {
        console.error("Payment Error:", err);
        setError(err.response?.data?.message || "Failed to initiate payment.");
      }
    };

    createSession();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-red-500 mb-4 font-bold">Error: {error}</div>
        <button 
          onClick={() => window.location.href = "/cart"}
          className="bg-black text-white px-6 py-2 rounded-lg"
        >
          Return to Cart
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-sm w-full">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900">Securing your session</h2>
        <p className="text-gray-500 mt-2">Redirecting you to Stripe to complete your purchase...</p>
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400 uppercase tracking-widest font-bold">
          <ShieldCheck size={14} /> 256-bit Encryption
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;