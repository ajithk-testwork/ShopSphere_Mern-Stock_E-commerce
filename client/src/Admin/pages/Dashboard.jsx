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
  Calendar
} from "lucide-react";

export default function Dashboard() {
  const [counts, setCounts] = useState({
    products: 0,
    categories: 0,
    orders: 0,
  });

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH DATA
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("adminToken");

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

  // UPDATE STATUS
  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem("adminToken");

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
    { title: "Total Products", value: counts.products, icon: Package },
    { title: "Categories", value: counts.categories, icon: Layers },
    { title: "Total Orders", value: counts.orders, icon: ShoppingCart },
  ];

  if (loading) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-gray-900" size={32} />
      </div>
    );
  }

  return (
    <div className="w-full flex-1 min-w-0 space-y-6">
      
      {/* HEADER */}
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-gray-900" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-gray-900">
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

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden w-full">
          <div className="w-full overflow-x-auto">
            
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50/80 text-gray-500 text-[11px] uppercase font-bold tracking-wider border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3.5">Customer & Items</th>
                  <th className="px-5 py-3.5 whitespace-nowrap">Date & Time</th>
                  <th className="px-5 py-3.5 whitespace-nowrap">Total Amount</th>
                  <th className="px-5 py-3.5">Payment</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/50 transition-colors align-top">
                    
                    {/* CUSTOMER + ITEMS */}
                    {/* Added max-w-[280px] to strictly enforce wrapping and prevent table from expanding */}
                    <td className="px-5 py-4 w-full max-w-[280px] lg:max-w-[350px]">
                      <div className="mb-3">
                        <div className="font-semibold text-gray-900 text-sm">{order.userInfo?.name}</div>
                        <div className="text-[13px] text-gray-500 break-all">
                          {order.userInfo?.email}
                        </div>
                      </div>

                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item._id} className="flex gap-3 items-start bg-white border border-gray-100 p-2 pr-3 rounded-lg shadow-sm w-full">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-8 h-8 object-contain mix-blend-multiply rounded border border-gray-100 bg-gray-50 shrink-0 mt-0.5"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-[12px] font-medium text-gray-800 whitespace-normal break-words leading-snug">
                                {item.name}
                              </p>
                              <p className="text-[11px] font-bold text-gray-500 mt-1">
                                ₹{item.price} <span className="mx-0.5 font-normal">×</span> {item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* DATE & TIME */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-gray-900 font-semibold text-[13px]">
                        <Calendar size={14} className="text-gray-400" />
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </div>
                      <div className="text-[12px] text-gray-500 mt-1 font-medium pl-6">
                        {new Date(order.createdAt).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </div>
                    </td>

                    {/* TOTAL */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">₹{order.totalAmount}</div>
                      <div className="text-[12px] text-gray-500 mt-0.5 font-medium">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </div>
                    </td>

                    {/* PAYMENT */}
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide border ${
                        order.paymentStatus === 'paid' || order.paymentStatus === 'success' 
                        ? 'bg-gray-900 text-white border-gray-900' 
                        : 'bg-gray-100 text-gray-600 border-gray-200'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-semibold capitalize border ${
                          order.orderStatus === "processing"
                            ? "bg-gray-100 text-gray-700 border-gray-200"
                            : order.orderStatus === "shipped"
                            ? "bg-gray-200 text-gray-900 border-gray-300"
                            : "bg-gray-900 text-white border-gray-900"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          order.orderStatus === "processing" ? "bg-gray-400" 
                          : order.orderStatus === "shipped" ? "bg-gray-600" 
                          : "bg-white"
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
                          className="block w-full appearance-none bg-white border border-gray-200 text-gray-900 py-1.5 pl-3 pr-8 rounded-lg text-[13px] font-bold focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-shadow cursor-pointer hover:bg-gray-50 shadow-sm"
                        >
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-500">
                          <ChevronDown size={14} strokeWidth={2.5} />
                        </div>
                      </div>
                    </td>

                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-5 py-12 text-center text-gray-400 font-medium">
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

// Minimalist Monochrome StatCard
function StatCard({ title, value, icon: Icon, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3, ease: "easeOut" }}
      whileHover={{ y: -2 }}
      className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="p-2.5 bg-gray-100 text-gray-900 border border-gray-200 rounded-lg">
          <Icon size={20} strokeWidth={2.5} />
        </div>
      </div>
      <div>
        <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-0.5">{value}</h3>
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{title}</p>
      </div>
    </motion.div>
  );
}