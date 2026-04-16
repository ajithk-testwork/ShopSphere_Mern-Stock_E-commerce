import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  X,
  ChevronRight,
  ShoppingBag,
  Loader2,
  CreditCard,
  LogIn,
} from "lucide-react";

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem("accessToken");
    
    // ✅ Handle Authentication State
    if (!token) {
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        "http://shopsphere-mern-stock-e-commerce.onrender.com/api/orders/my-orders",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      // Sort orders by newest first
      const sortedOrders = res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(sortedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      // If unauthorized, trigger logged-out state
      if (error.response?.status === 401) {
        setIsLoggedIn(false);
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ 1. Not Logged In View
  if (!isLoggedIn) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-2 shadow-inner border border-blue-100">
          <LogIn size={40} />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900">Sign in to view orders</h2>
        <p className="text-gray-500 max-w-sm mt-1 mb-4">
          Please log in to your account to track your recent orders, manage returns, and view your purchase history.
        </p>
        <button 
          onClick={() => window.location.href = '/login'} 
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-colors"
        >
          Go to Login
        </button>
      </div>
    );
  }

  // ✅ 2. Loading View
  if (loading) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-gray-500 font-medium">Loading your order history...</p>
      </div>
    );
  }

  // ✅ 3. Main Orders View
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
      {/* Header section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Order History
          </h1>
          <p className="text-gray-500 mt-1">
            Track your shipments and review past purchases.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-gray-50 px-5 py-2.5 rounded-full border border-gray-200">
          <ShoppingBag size={18} className="text-gray-700" />
          <span className="text-sm font-bold text-gray-800">
            {orders.length} {orders.length === 1 ? "Order" : "Orders"} Found
          </span>
        </div>
      </header>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <Package className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-900">No orders yet</h3>
          <p className="text-gray-500 mt-1">Looks like you haven't made a purchase yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={order._id}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Card Header */}
              <div className="bg-gray-50/80 border-b border-gray-200 p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm w-full sm:w-auto">
                  <div>
                    <p className="font-semibold text-gray-500 uppercase text-[10px] tracking-wider mb-1">Order Placed</p>
                    <p className="font-medium text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-500 uppercase text-[10px] tracking-wider mb-1">Total</p>
                    <p className="font-bold text-gray-900">₹{order.totalAmount}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-500 uppercase text-[10px] tracking-wider mb-1">Order ID</p>
                    <p className="font-medium text-gray-900">#{order._id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-500 uppercase text-[10px] tracking-wider mb-1">Payment</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                      order.paymentStatus === 'success' || order.paymentStatus === 'paid' 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-amber-100 text-amber-700'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedOrder(order)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-xl transition-colors shrink-0 shadow-sm"
                >
                  Track Order
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Card Body (Items Preview) */}
              <div className="p-4 sm:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide max-w-full">
                  {order.items.map((item) => (
                    <div key={item._id} className="flex-shrink-0 relative group">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl border border-gray-100 overflow-hidden bg-gray-50">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white shadow-sm">
                        x{item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
                
                {/* Visual Status Indicator on main card */}
                <div className="flex flex-col items-end shrink-0 hidden md:flex">
                  <p className="text-sm font-bold text-gray-900 capitalize mb-2">{order.orderStatus}</p>
                  <div className="flex gap-1">
                    <div className={`h-1.5 w-8 rounded-full ${['processing', 'shipped', 'delivered'].includes(order.orderStatus) ? 'bg-blue-600' : 'bg-gray-200'}`} />
                    <div className={`h-1.5 w-8 rounded-full ${['shipped', 'delivered'].includes(order.orderStatus) ? 'bg-blue-600' : 'bg-gray-200'}`} />
                    <div className={`h-1.5 w-8 rounded-full ${order.orderStatus === 'delivered' ? 'bg-blue-600' : 'bg-gray-200'}`} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Tracking Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <TrackingModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ----------------------------------------------------------------------
// TRACKING MODAL COMPONENT
// ----------------------------------------------------------------------

function TrackingModal({ order, onClose }) {
  const flowSteps = ["processing", "shipped", "delivered"];
  const currentStepIndex = flowSteps.indexOf(order.orderStatus || "processing");

  const timelineConfig = [
    {
      id: "processing",
      title: "Order Processing",
      desc: "We are preparing your items for shipment.",
      icon: Clock,
    },
    {
      id: "shipped",
      title: "Order Shipped",
      desc: "Your order has been handed over to the courier.",
      icon: Truck,
    },
    {
      id: "delivered",
      title: "Delivered",
      desc: "Your order has been delivered successfully.",
      icon: CheckCircle,
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-2xl bg-white rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">Track Order</h2>
            <p className="text-sm text-gray-500 mt-1 font-medium">
              ID: #{order._id.toUpperCase()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white border border-gray-200 hover:bg-gray-100 rounded-full transition-colors text-gray-500 shadow-sm"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto">
          
          {/* Tracking Timeline Component */}
          <div className="mb-8 px-2 md:px-6">
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-[21px] top-4 bottom-4 w-0.5 bg-gray-100 rounded-full" />
              
              {/* Active Line Fill */}
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: `${(currentStepIndex / (flowSteps.length - 1)) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute left-[21px] top-4 w-0.5 bg-blue-600 rounded-full origin-top" 
              />

              <div className="space-y-8 relative">
                {timelineConfig.map((step, index) => {
                  const isActive = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  const StepIcon = step.icon;

                  return (
                    <div key={step.id} className="flex gap-5 relative z-10">
                      {/* Circle Indicator */}
                      <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center border-4 border-white shadow-sm flex-shrink-0 transition-colors duration-500 ${
                          isActive
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        <StepIcon size={18} strokeWidth={isActive ? 2.5 : 2} />
                      </div>

                      {/* Text */}
                      <div className="pt-2">
                        <h4
                          className={`text-base font-bold ${
                            isActive ? "text-gray-900" : "text-gray-400"
                          }`}
                        >
                          {step.title}
                        </h4>
                        <p
                          className={`text-sm mt-1 ${
                            isCurrent ? "text-blue-600 font-medium" : "text-gray-500"
                          }`}
                        >
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-gray-100 my-6" />

          {/* Order Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Shipping Address (Mapped from DB Object) */}
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={18} className="text-blue-600" />
                <h3 className="font-bold text-gray-900">Shipping Details</h3>
              </div>
              <p className="text-sm font-bold text-gray-900 mb-1">
                {order.shippingAddress?.fullName || order.userInfo?.name}
              </p>
              <p className="text-[13px] text-gray-600 leading-relaxed mb-3">
                {order.shippingAddress?.address}<br />
                {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}<br />
                {order.shippingAddress?.country}
              </p>
              <p className="text-[13px] font-medium text-gray-700 bg-white inline-block px-3 py-1 rounded-lg border border-gray-200">
                📞 {order.shippingAddress?.phone}
              </p>
            </div>

            {/* Payment Summary */}
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard size={18} className="text-blue-600" />
                <h3 className="font-bold text-gray-900">Payment Summary</h3>
              </div>
              
              <div className="space-y-3 flex-1">
                <div className="flex justify-between items-center text-[13px] text-gray-600">
                  <span>Items Total ({order.items.length})</span>
                  <span className="font-medium text-gray-900">₹{order.totalAmount}</span>
                </div>
                <div className="flex justify-between items-center text-[13px] text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-emerald-600">Free</span>
                </div>
                <div className="flex justify-between items-center text-[13px] text-gray-600 pb-3 border-b border-gray-200">
                  <span>Payment Status</span>
                  <span className={`font-bold uppercase text-[11px] px-2 py-0.5 rounded ${
                    order.paymentStatus === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
              
              <div className="mt-auto pt-3 flex justify-between items-end">
                <span className="font-bold text-gray-500 text-sm">Grand Total</span>
                <span className="font-black text-xl text-gray-900">₹{order.totalAmount}</span>
              </div>
            </div>

          </div>

          {/* Items List (Collapsible visually via scrolling) */}
          <div className="mt-6 border border-gray-200 rounded-2xl overflow-hidden">
             <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 flex items-center gap-2">
                <Package size={16} className="text-gray-500" />
                <span className="font-bold text-sm text-gray-700">Ordered Items</span>
             </div>
             <div className="divide-y divide-gray-100 max-h-[160px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
                {order.items.map((item) => (
                  <div key={item._id} className="p-4 flex gap-4 bg-white items-center">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg border border-gray-100 object-cover" />
                    <div className="flex-1 min-w-0">
                       <p className="text-[13px] font-bold text-gray-900 truncate">{item.name}</p>
                       <p className="text-[12px] text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-sm text-gray-900 shrink-0">₹{item.price}</p>
                  </div>
                ))}
             </div>
          </div>

        </div>
      </motion.div>
    </>
  );
}