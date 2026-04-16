import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Package,
  Layers,
  ShoppingCart,
  Activity,
  Loader2,
  CalendarDays,
  TrendingUp,
  MoreHorizontal,
  ChevronDown
} from "lucide-react";

export default function Dashboard() {
  const [counts, setCounts] = useState({
    products: 0,
    categories: 0,
    orders: 0,
  });

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ FETCH DATA
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const [prodRes, catRes, orderRes] = await Promise.all([
        axios.get("https://shopsphere-mern-stock-e-commerce.onrender.com/api/products"),
        axios.get("https://shopsphere-mern-stock-e-commerce.onrender.com/api/categories"),
        axios.get("https://shopsphere-mern-stock-e-commerce.onrender.com/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setCounts({
        products: prodRes.data.products?.length || 0,
        categories: catRes.data?.length || 0,
        orders: orderRes.data?.length || 0,
      });

      setOrders(orderRes.data || []);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // ✅ UPDATE STATUS
  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem("accessToken");

      // Optimistic UI update for immediate feedback
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, orderStatus: status } : o
        )
      );

      await axios.put(
        `https://shopsphere-mern-stock-e-commerce.onrender.com/api/orders/${orderId}`,
        { orderStatus: status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Update error:", err);
      // Revert on failure by refetching
      fetchData();
    }
  };

  const stats = [
    { title: "Total Products", value: counts.products, icon: Package, color: "text-indigo-600", bg: "bg-indigo-50", ring: "ring-indigo-100" },
    { title: "Categories", value: counts.categories, icon: Layers, color: "text-fuchsia-600", bg: "bg-fuchsia-50", ring: "ring-fuchsia-100" },
    { title: "Total Orders", value: counts.orders, icon: ShoppingCart, color: "text-emerald-600", bg: "bg-emerald-50", ring: "ring-emerald-100" },
  ];

  // Helper for status styling
  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "processing": return "bg-amber-50 text-amber-700 ring-amber-600/20";
      case "shipped": return "bg-blue-50 text-blue-700 ring-blue-600/20";
      case "delivered": return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
      default: return "bg-slate-50 text-slate-700 ring-slate-600/20";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-indigo-600" size={48} />
          <p className="text-slate-500 font-medium animate-pulse">Syncing store data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 font-sans">
      <div className="max-w-[90rem] mx-auto">
        
        {/* HEADER */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Activity size={16} className="text-indigo-600" />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Live Overview
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Dashboard Metrics
            </h2>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
            <CalendarDays size={16} className="text-slate-400" />
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </div>
        </header>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} delay={index * 0.1} />
          ))}
        </div>

        {/* ORDERS TABLE SECTION */}
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Recent Orders</h3>
              <p className="text-sm text-slate-500 mt-1">Manage and track your latest customer purchases.</p>
            </div>
            <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-slate-600">
              <MoreHorizontal size={20} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="p-6 font-medium">Customer</th>
                  <th className="p-6 font-medium">Products</th>
                  <th className="p-6 font-medium">Amount</th>
                  <th className="p-6 font-medium">Payment</th>
                  <th className="p-6 font-medium text-right">Status Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-12 text-center text-slate-400 font-medium">
                      No recent orders found.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order._id} className="group hover:bg-slate-50/30 transition-colors">
                      
                      {/* CUSTOMER INFO */}
                      <td className="p-6 align-top">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-100 to-indigo-50 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200/50 shadow-sm">
                            {order.userInfo?.name?.charAt(0).toUpperCase() || "?"}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">{order.userInfo?.name}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{order.userInfo?.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* PRODUCTS LIST (Compact) */}
                      <td className="p-6 align-top">
                        <div className="flex flex-col gap-3 max-w-[280px]">
                          {order.items.slice(0, 2).map((item) => (
                            <div key={item._id} className="flex gap-3 items-center group/item">
                              <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover transition-transform group-hover/item:scale-110"
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-slate-900 truncate">{item.name}</p>
                                <p className="text-xs text-slate-500 font-medium">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <div className="text-xs font-semibold text-indigo-600 bg-indigo-50 inline-flex px-2 py-1 rounded-md w-fit">
                              +{order.items.length - 2} more items
                            </div>
                          )}
                        </div>
                      </td>

                      {/* TOTAL */}
                      <td className="p-6 align-top">
                        <div className="font-bold text-slate-900 tabular-nums">
                          ₹{order.totalAmount?.toLocaleString('en-IN')}
                        </div>
                        <div className="text-xs font-medium text-slate-500 mt-0.5">
                          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                        </div>
                      </td>

                      {/* PAYMENT STATUS */}
                      <td className="p-6 align-top">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20`}>
                          {order.paymentStatus}
                        </span>
                      </td>

                      {/* ORDER STATUS DROPDOWN */}
                      <td className="p-6 align-top text-right">
                        <div className="relative inline-block text-left">
                          <select
                            value={order.orderStatus}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                            className={`appearance-none cursor-pointer pl-4 pr-10 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all outline-none ring-1 ring-inset focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 shadow-sm ${getStatusStyles(order.orderStatus)}`}
                          >
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-current opacity-70">
                            <ChevronDown size={14} strokeWidth={3} />
                          </div>
                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

// ✅ SEPARATED STAT CARD COMPONENT
function StatCard({ title, value, icon: Icon, color, bg, ring, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200/60 shadow-sm hover:shadow-lg transition-all relative overflow-hidden group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3.5 ${bg} ${color} rounded-2xl ring-1 ring-inset ${ring}`}>
          <Icon size={24} strokeWidth={2.5} />
        </div>
        <div className="flex items-center gap-1 text-emerald-600 font-semibold text-xs bg-emerald-50 px-2.5 py-1 rounded-full ring-1 ring-inset ring-emerald-600/20">
          <TrendingUp size={14} />
          Live
        </div>
      </div>

      <div className="relative z-10">
        <p className="text-sm font-semibold text-slate-500 mb-1">{title}</p>
        <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight tabular-nums">
          {value.toLocaleString()}
        </h3>
      </div>

      {/* Decorative background icon */}
      <div className={`absolute -right-6 -bottom-6 opacity-[0.03] transition-transform group-hover:scale-110 group-hover:-rotate-12 duration-500 ${color}`}>
        <Icon size={140} />
      </div>
    </motion.div>
  );
}