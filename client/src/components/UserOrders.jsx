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
  ArrowLeft,
  Home
} from "lucide-react";

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders(false);

    const intervalId = setInterval(() => {
      fetchOrders(true);
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchOrders = async (isBackground = false) => {
    const token = localStorage.getItem("userToken");

    if (!token) {
      console.log("No user token found");
      setIsLoggedIn(false);
      if (!isBackground) setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        "https://shopsphere-mern-stock-e-commerce.onrender.com/api/orders/my-orders",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const ordersArray = Array.isArray(res.data)
        ? res.data
        : (res.data.orders || res.data.data || []);

      const sortedOrders = ordersArray.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setOrders(sortedOrders);

      setSelectedOrder((prevSelected) => {
        if (!prevSelected) return null;
        const updatedSelectedOrder = sortedOrders.find(o => o._id === prevSelected._id);
        return updatedSelectedOrder || prevSelected;
      });

    } catch (error) {
      console.error("Error fetching orders:", error);
      if (error.response?.status === 401) {
        setIsLoggedIn(false);
      }
    } finally {
      if (!isBackground) {
        setLoading(false);
      }
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="w-full min-h-[80vh] flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-gray-50 to-white">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col items-center"
        >
          {/* Removed Blue */}
          <div className="w-24 h-24 bg-gray-100 text-gray-900 rounded-full flex items-center justify-center mb-6 shadow-inner border border-gray-200">
            <LogIn size={40} strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-3">Sign in required</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Please log in to your account to track your recent orders, manage returns, and view your purchase history.
          </p>
          <div className="flex flex-col w-full gap-3">
            <button
              onClick={() => window.location.href = '/login'}
              className="w-full py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              Go to Login
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full py-4 bg-white text-gray-600 hover:text-gray-900 font-bold rounded-2xl transition-colors flex items-center justify-center gap-2"
            >
              <Home size={18} />
              Return to Store
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center gap-5">
        <div className="relative">
          {/* Removed Blue */}
          <div className="absolute inset-0 bg-gray-200 rounded-full blur-xl animate-pulse"></div>
          <Loader2 className="relative animate-spin text-gray-900" size={48} strokeWidth={1.5} />
        </div>
        <p className="text-gray-400 font-bold tracking-widest uppercase text-sm animate-pulse">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8 min-h-screen">

      <button
        onClick={() => window.location.href = '/'}
        className="group flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors w-fit"
      >
        <div className="p-2 bg-gray-100 group-hover:bg-gray-200 rounded-full transition-colors">
          <ArrowLeft size={16} />
        </div>
        Back to Home
      </button>

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-8">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            Order History
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            Track your shipments and review past purchases.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-gray-200 shadow-sm">
          {/* Removed Blue */}
          <div className="bg-gray-100 p-2 rounded-xl text-gray-900">
            <ShoppingBag size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total</span>
            <span className="text-sm font-black text-gray-900 leading-none">
              {orders.length} {orders.length === 1 ? "Order" : "Orders"}
            </span>
          </div>
        </div>
      </header>

      {orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center py-24 bg-white rounded-[3rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center"
        >
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
            <Package className="h-10 w-10 text-gray-300" strokeWidth={1.5} />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-500 mb-8 max-w-sm">Looks like you haven't made a purchase yet. Discover our latest products and start shopping!</p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-8 py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
          >
            Start Shopping
          </button>
        </motion.div>
      ) : (
        <div className="space-y-8">
          {orders.map((order, index) => (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
              key={order._id}
              className="bg-white border border-gray-200 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="bg-gray-50/50 border-b border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-sm w-full md:w-auto flex-1">
                  <div>
                    <p className="font-bold text-gray-400 uppercase text-[10px] tracking-widest mb-1.5">Order Placed</p>
                    <p className="font-bold text-gray-900 text-base">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-400 uppercase text-[10px] tracking-widest mb-1.5">Total</p>
                    <p className="font-black text-gray-900 text-base">₹{order.totalAmount}</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-400 uppercase text-[10px] tracking-widest mb-1.5">Order ID</p>
                    <p className="font-bold text-gray-900 text-base">#{order._id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-400 uppercase text-[10px] tracking-widest mb-1.5">Payment</p>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider ${order.paymentStatus === 'success' || order.paymentStatus === 'paid'
                        ? 'bg-gray-200 text-gray-900'
                        : 'bg-gray-100 text-gray-500'
                      }`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedOrder(order)}
                  className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-gray-900 hover:bg-black text-white text-sm font-bold rounded-2xl transition-colors shrink-0 shadow-md"
                >
                  Track Order
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* ✅ NEW: Card Body (Bento-Style Image Grid with Stacked Text) */}
              <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex gap-4 overflow-x-auto pb-4 md:pb-0 scrollbar-hide max-w-full snap-x">
                  {order.items.map((item) => (
                    <div key={item._id} className="flex-shrink-0 flex flex-col w-[110px] snap-start group/item cursor-default">
                      <div className="relative w-full aspect-square rounded-2xl border border-gray-100 overflow-hidden bg-[#EFEFEF] mb-3 group-hover/item:border-gray-300 transition-colors">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain p-2 mix-blend-multiply"
                        />
                        {/* Inner corner badge matching the image */}
                        <span className="absolute top-2 right-2 bg-gray-900 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-sm">
                          x{item.quantity}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-gray-900 truncate w-full">
                        {item.name}
                      </p>
                      <p className="text-xs font-black text-gray-500 mt-0.5">
                        ₹{item.price}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Status Indicator (Monochrome) */}
                <div className="flex flex-col items-end shrink-0 hidden md:flex">
                  <p className="text-sm font-black text-gray-900 uppercase tracking-widest mb-2.5">{order.orderStatus}</p>
                  <div className="flex gap-1.5">
                    <div className={`h-2 w-10 rounded-full transition-colors ${['processing', 'shipped', 'delivered'].includes(order.orderStatus) ? 'bg-gray-900' : 'bg-gray-200'}`} />
                    <div className={`h-2 w-10 rounded-full transition-colors ${['shipped', 'delivered'].includes(order.orderStatus) ? 'bg-gray-900' : 'bg-gray-200'}`} />
                    <div className={`h-2 w-10 rounded-full transition-colors ${order.orderStatus === 'delivered' ? 'bg-gray-900' : 'bg-gray-200'}`} />
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-gray-900/60 backdrop-blur-md z-40"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-2xl bg-white rounded-[2.5rem] shadow-2xl z-50 overflow-hidden flex flex-col max-h-[90vh] border border-gray-100"
      >
        <div className="flex items-center justify-between p-6 md:p-8 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Track Order</h2>
            <p className="text-sm text-gray-500 mt-1 font-bold tracking-widest uppercase">
              ID: #{order._id.toUpperCase()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-3 bg-gray-50 hover:bg-gray-200 rounded-full transition-colors text-gray-900"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto">

          <div className="mb-10 px-2 md:px-4">
            <div className="relative">
              <div className="absolute left-[23px] top-4 bottom-4 w-1 bg-gray-100 rounded-full" />

              {/* Removed Blue gradient */}
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(currentStepIndex / (flowSteps.length - 1)) * 100}%` }}
                transition={{ duration: 1, ease: "circOut" }}
                className="absolute left-[23px] top-4 w-1 bg-gray-900 rounded-full origin-top"
              />

              <div className="space-y-10 relative">
                {timelineConfig.map((step, index) => {
                  const isActive = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  const StepIcon = step.icon;

                  return (
                    <div key={step.id} className="flex gap-6 relative z-10">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.2 }}
                        className={`w-12 h-12 rounded-full flex items-center justify-center border-[4px] border-white flex-shrink-0 transition-all duration-500 ${isActive
                            ? "bg-gray-900 text-white shadow-lg scale-110"
                            : "bg-gray-100 text-gray-400 shadow-sm"
                          }`}
                      >
                        <StepIcon size={20} strokeWidth={isActive ? 2.5 : 2} />
                      </motion.div>

                      <div className="pt-2.5">
                        <h4
                          className={`text-lg font-black tracking-tight ${isActive ? "text-gray-900" : "text-gray-400"
                            }`}
                        >
                          {step.title}
                        </h4>
                        <p
                          className={`text-sm mt-1 font-medium ${isCurrent ? "text-gray-900 font-bold" : "text-gray-500"
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

          <div className="h-px w-full bg-gray-100 my-8" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-5">
                {/* Removed Blue */}
                <div className="p-2 bg-white rounded-xl shadow-sm text-gray-900">
                  <MapPin size={18} />
                </div>
                <h3 className="font-black text-gray-900 tracking-tight">Delivery Details</h3>
              </div>
              <p className="text-base font-bold text-gray-900 mb-1">
                {order.shippingAddress?.fullName || order.userInfo?.name}
              </p>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                {order.shippingAddress?.address}<br />
                {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}<br />
                {order.shippingAddress?.country}
              </p>
              <p className="text-sm font-bold text-gray-700 bg-white inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
                📞 {order.shippingAddress?.phone}
              </p>
            </div>

            <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 flex flex-col">
              <div className="flex items-center gap-3 mb-5">
                {/* Removed Blue */}
                <div className="p-2 bg-white rounded-xl shadow-sm text-gray-900">
                  <CreditCard size={18} />
                </div>
                <h3 className="font-black text-gray-900 tracking-tight">Payment Summary</h3>
              </div>

              <div className="space-y-4 flex-1">
                <div className="flex justify-between items-center text-sm font-medium text-gray-600">
                  <span>Items Total ({order.items.length})</span>
                  <span className="font-bold text-gray-900">₹{order.totalAmount}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium text-gray-600">
                  <span>Shipping</span>
                  <span className="font-bold text-gray-900">Free</span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium text-gray-600 pb-4 border-b border-gray-200">
                  <span>Status</span>
                  <span className={`font-black uppercase tracking-wider text-[11px] px-2.5 py-1 rounded-md ${order.paymentStatus === 'pending' ? 'bg-gray-200 text-gray-600' : 'bg-gray-900 text-white'
                    }`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex justify-between items-end">
                <span className="font-bold text-gray-500 uppercase tracking-widest text-xs mb-1">Grand Total</span>
                <span className="font-black text-2xl text-gray-900 tracking-tight">₹{order.totalAmount}</span>
              </div>
            </div>

          </div>

          <div className="mt-6 border border-gray-100 rounded-3xl overflow-hidden bg-white shadow-sm">
            <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <Package size={18} className="text-gray-900" />
              <span className="font-black text-gray-900 tracking-tight">Purchased Items</span>
            </div>
            <div className="divide-y divide-gray-50 max-h-[180px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
              {order.items.map((item) => (
                <div key={item._id} className="p-4 px-6 flex gap-4 items-center hover:bg-gray-50 transition-colors">
                  <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl border border-gray-200 object-contain bg-gray-50 shadow-sm mix-blend-multiply" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{item.name}</p>
                    <p className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-wider">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-black text-base text-gray-900 shrink-0">₹{item.price}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </motion.div>
    </>
  );
}