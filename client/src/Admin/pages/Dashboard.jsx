import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  Package, 
  Layers, 
  ShoppingCart, 
  ArrowUpRight, 
  Activity, 
  Loader2,
  ChevronDown
} from "lucide-react";

// API Base URL - update this if needed
const API_BASE = "https://shopsphere-mern-stock-e-commerce.onrender.com/api";

export default function Dashboard() {
  const [counts, setCounts] = useState({ products: 0, categories: 0, pendingOrders: 0 });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null); // Track which order is updating

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // We fetch products, categories, and orders simultaneously
        const [prodRes, catRes, ordersRes] = await Promise.all([
          axios.get(`${API_BASE}/products`),
          axios.get(`${API_BASE}/categories`),
          axios.get(`${API_BASE}/orders/my-orders`) // Using your provided endpoint
        ]);

        const fetchedOrders = ordersRes.data || [];
        
        // Calculate pending orders (Assuming 'processing' means pending)
        const pendingCount = fetchedOrders.filter(
          (order) => order.orderStatus === "processing"
        ).length;

        setOrders(fetchedOrders);
        setCounts({
          products: prodRes.data.products?.length || 0,
          categories: catRes.data?.length || 0,
          pendingOrders: pendingCount
        });
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Auto-refresh every 10 seconds (increased from 3s to reduce heavy API load)
    const interval = setInterval(fetchStats, 10000); 

    return () => clearInterval(interval); 
  }, []);

  // Function to handle status updates
  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      // Optimistically update the UI first
      setOrders(currentOrders => 
        currentOrders.map(order => 
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );

      // Re-calculate pending count
      setCounts(prev => ({
        ...prev,
        pendingOrders: orders.filter(o => 
          (o._id === orderId ? newStatus : o.orderStatus) === "processing"
        ).length
      }));

      // Make API Call (Replace this endpoint with your actual admin update endpoint)
      // Example: PUT /api/orders/:id/status
      await axios.put(`${API_BASE}/orders/${orderId}/status`, { 
        orderStatus: newStatus 
      });

    } catch (error) {
      console.error("Failed to update status", error);
      // Revert if failed (optional, depends on your preference)
    } finally {
      setUpdating(null);
    }
  };

  const stats = [
    { title: "Total Products", value: counts.products, icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Categories", value: counts.categories, icon: Layers, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Pending Orders", value: counts.pendingOrders, icon: ShoppingCart, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-blue-600" size={40} />
          <p className="text-gray-500 font-medium tracking-wide">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto bg-gray-50/50 min-h-screen">
      
      {/* HEADER */}
      <header className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <Activity size={18} className="text-blue-600" />
          <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Real-time Metrics</span>
        </div>
        <h2 className="text-4xl font-black tracking-tighter text-gray-900">Store Overview</h2>
      </header>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {stats.map((stat, index) => (
          <StatCard 
            key={index} 
            title={stat.title} 
            value={stat.value} 
            Icon={stat.icon} 
            color={stat.color}
            bg={stat.bg}
            delay={index * 0.1}
          />
        ))}
      </div>
      
      {/* ORDERS TABLE SECTION */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Recent Orders</h3>
            <p className="text-sm text-gray-500 mt-1">Manage and track customer deliveries</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/30">
                <th className="py-5 px-8 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Order ID</th>
                <th className="py-5 px-8 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Customer</th>
                <th className="py-5 px-8 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Products</th>
                <th className="py-5 px-8 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Total</th>
                <th className="py-5 px-8 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-400 font-medium">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/50 transition-colors group">
                    
                    {/* Order ID */}
                    <td className="py-6 px-8 align-top">
                      <span className="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                        {order._id.slice(-6).toUpperCase()}
                      </span>
                    </td>

                    {/* Customer Info */}
                    <td className="py-6 px-8 align-top">
                      <p className="text-sm font-bold text-gray-900">{order.shippingAddress?.fullName || order.user?.name || "Unknown User"}</p>
                      <p className="text-xs text-gray-500 mt-1">{order.user?.email || "No email"}</p>
                    </td>

                    {/* Product Details */}
                    <td className="py-6 px-8 align-top">
                      <div className="space-y-2 max-w-[250px]">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex gap-2 items-start text-sm">
                            <span className="font-bold text-gray-400">x{item.quantity}</span>
                            <span className="text-gray-700 line-clamp-1" title={item.product?.name}>
                              {item.product?.name || "Deleted Product"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Total Amount */}
                    <td className="py-6 px-8 align-top">
                      <span className="text-sm font-black text-gray-900">
                        ₹{order.totalAmount?.toLocaleString()}
                      </span>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-6 px-8 align-top">
                      <div className="relative">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                          disabled={updating === order._id}
                          className={`
                            appearance-none w-full pl-4 pr-10 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border-2 outline-none cursor-pointer transition-all
                            ${order.orderStatus === 'processing' ? 'bg-orange-50 border-orange-100 text-orange-700 focus:border-orange-300' : ''}
                            ${order.orderStatus === 'shipped' ? 'bg-blue-50 border-blue-100 text-blue-700 focus:border-blue-300' : ''}
                            ${order.orderStatus === 'delivered' ? 'bg-green-50 border-green-100 text-green-700 focus:border-green-300' : ''}
                            ${updating === order._id ? 'opacity-50 cursor-not-allowed' : ''}
                          `}
                        >
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>
                        <ChevronDown 
                          size={16} 
                          className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none
                            ${order.orderStatus === 'processing' ? 'text-orange-500' : ''}
                            ${order.orderStatus === 'shipped' ? 'text-blue-500' : ''}
                            ${order.orderStatus === 'delivered' ? 'text-green-500' : ''}
                          `} 
                        />
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
  );
}

function StatCard({ title, value, Icon, color, bg, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -5 }}
      className="bg-white p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative overflow-hidden group transition-all duration-300 cursor-default"
    >
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className={`p-4 ${bg} ${color} rounded-2xl`}>
          <Icon size={24} />
        </div>
        <div className="flex items-center gap-1 text-green-600 font-bold text-xs bg-green-50 px-2.5 py-1.5 rounded-lg">
          <ArrowUpRight size={14} />
          Live
        </div>
      </div>
      
      <div className="relative z-10">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{title}</p>
        <h3 className="text-5xl font-black text-gray-900 tracking-tighter">
          {value}
        </h3>
      </div>

      <div className={`absolute -right-4 -bottom-4 opacity-[0.03] transition-transform group-hover:scale-110 duration-500 ${color} z-0`}>
        <Icon size={140} />
      </div>
    </motion.div>
  );
}