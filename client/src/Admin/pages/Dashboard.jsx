import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Package,
  Layers,
  ShoppingCart,
  Activity,
  Loader2,
  ChevronDown,
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

      setOrders(orderRes.data);
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

      await axios.put(
        `https://shopsphere-mern-stock-e-commerce.onrender.com/api/orders/${orderId}`,
        { orderStatus: status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, orderStatus: status } : o
        )
      );
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const stats = [
    { title: "Total Products", value: counts.products, icon: Package, color: "text-blue-600", bg: "bg-blue-50/80", border: "border-blue-100" },
    { title: "Categories", value: counts.categories, icon: Layers, color: "text-purple-600", bg: "bg-purple-50/80", border: "border-purple-100" },
    { title: "Total Orders", value: counts.orders, icon: ShoppingCart, color: "text-emerald-600", bg: "bg-emerald-50/80", border: "border-emerald-100" },
  ];

  if (loading) {
    return (
      <div className="w-full flex-1 min-w-0 min-h-[80vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    // ✅ Added flex-1 and min-w-0 to completely prevent overlap and flexbox blowout
    <div className="w-full flex-1 min-w-0 p-4 md:p-6 lg:p-8 space-y-6">
      
      {/* HEADER */}
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-blue-600" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600">
            Real-time Metrics
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
          Store Overview
        </h2>
      </header>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} delay={index * 0.1} />
        ))}
      </div>

      {/* ORDERS TABLE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg md:text-xl font-bold text-gray-900">Recent Orders</h3>
        </div>

        {/* ✅ Table wrapper specifically tuned to allow horizontal scrolling inside its bounds, not the window */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden w-full">
          <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-gray-200">
            <table className="w-full text-sm text-left whitespace-nowrap min-w-[750px]">
              <thead className="bg-gray-50/80 text-gray-500 text-[11px] uppercase font-bold tracking-wider border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3.5">Customer & Items</th>
                  <th className="px-5 py-3.5">Total Amount</th>
                  <th className="px-5 py-3.5">Payment</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/50 transition-colors align-top">
                    
                    {/* CUSTOMER + ITEMS */}
                    <td className="px-5 py-4 whitespace-normal min-w-[280px] max-w-[350px]">
                      <div className="mb-3">
                        <div className="font-semibold text-gray-900 text-sm">{order.userInfo?.name}</div>
                        <div className="text-[13px] text-gray-500">
                          {order.userInfo?.email}
                        </div>
                      </div>

                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item._id} className="flex gap-3 items-center bg-white border border-gray-100 p-1.5 pr-3 rounded-lg shadow-sm">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-8 h-8 object-cover rounded border border-gray-100"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-[12px] font-medium text-gray-800 truncate">{item.name}</p>
                              <p className="text-[11px] text-gray-500">
                                ₹{item.price} <span className="mx-0.5">×</span> {item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* TOTAL */}
                    <td className="px-5 py-4">
                      <div className="text-sm font-bold text-gray-900">₹{order.totalAmount}</div>
                      <div className="text-[12px] text-gray-500 mt-0.5">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </div>
                    </td>

                    {/* PAYMENT */}
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wide border ${
                        order.paymentStatus === 'paid' || order.paymentStatus === 'success' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : 'bg-gray-50 text-gray-600 border-gray-200'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-medium capitalize border ${
                          order.orderStatus === "processing"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : order.orderStatus === "shipped"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          order.orderStatus === "processing" ? "bg-amber-500" 
                          : order.orderStatus === "shipped" ? "bg-blue-500" 
                          : "bg-emerald-500"
                        }`}></span>
                        {order.orderStatus}
                      </span>
                    </td>

                    {/* UPDATE */}
                    <td className="px-5 py-4 text-right">
                      <div className="relative inline-block text-left w-32">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                          className="block w-full appearance-none bg-white border border-gray-200 text-gray-700 py-1.5 pl-3 pr-8 rounded-lg text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow cursor-pointer hover:bg-gray-50 shadow-sm"
                        >
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-400">
                          <ChevronDown size={14} />
                        </div>
                      </div>
                    </td>

                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-5 py-12 text-center text-gray-400 font-medium">
                      No orders found in the database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* PLACEHOLDER */}
      <div className="py-8 px-4 border-2 border-dashed border-gray-200 bg-gray-50/50 rounded-xl flex items-center justify-center text-gray-400 font-medium text-sm tracking-wide w-full">
        Sales Analytics Chart Area
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, bg, border, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3, ease: "easeOut" }}
      whileHover={{ y: -2 }}
      className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="flex justify-between items-start mb-3">
        <div className={`p-2.5 ${bg} ${color} ${border} border rounded-lg`}>
          <Icon size={20} strokeWidth={2.5} />
        </div>
      </div>
      <div>
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-0.5">{value}</h3>
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{title}</p>
      </div>
    </motion.div>
  );
}