import { Link } from "react-router-dom";
import { XCircle, AlertCircle, RefreshCw } from "lucide-react";

const PaymentCancel = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-[2rem] shadow-xl p-8 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="text-red-600 w-12 h-12" />
        </div>
        
        <h1 className="text-3xl font-black text-gray-900 mb-2">Payment Cancelled</h1>
        <p className="text-gray-600 mb-8">
          The transaction was not completed. No funds were debited from your account.
        </p>

        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-8 flex gap-3 text-left">
          <AlertCircle className="text-amber-600 shrink-0" size={20} />
          <p className="text-amber-800 text-sm">
            If this was a mistake, your items are still safe in your cart. You can try checking out again.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/cart"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all"
          >
            <RefreshCw size={20} /> Return to Cart
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;