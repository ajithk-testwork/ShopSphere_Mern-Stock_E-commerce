import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Package, Layers, ShoppingCart, ArrowUpRight, Activity, Loader2 } from "lucide-react";

export default function Dashboard() {
  const [counts, setCounts] = useState({ products: 0, categories: 0, orders: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchStats = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        axios.get("https://shopsphere-mern-stock-e-commerce.onrender.com/api/products"),
        axios.get("https://shopsphere-mern-stock-e-commerce.onrender.com/api/categories")
      ]);

      setCounts({
        products: prodRes.data.products.length || 0,
        categories: catRes.data.length || 0,
        orders: 0
      });
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchStats(); // first load

  const interval = setInterval(fetchStats, 3000); // 🔁 every 3 sec

  return () => clearInterval(interval); // cleanup
}, []);

  const stats = [
    { title: "Total Products", value: counts.products, icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Categories", value: counts.categories, icon: Layers, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Pending Orders", value: counts.orders, icon: ShoppingCart, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-12 max-w-7xl">
      <header className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <Activity size={18} className="text-blue-600" />
          <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Real-time Metrics</span>
        </div>
        <h2 className="text-4xl font-black tracking-tighter text-gray-900">Store Overview</h2>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
      
      
      <div className="mt-12 p-12 border-2 border-dashed border-gray-100 rounded-[3rem] flex items-center justify-center text-gray-300 font-bold">
        Sales Analytics Chart Area
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
      className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 relative overflow-hidden group transition-all hover:shadow-2xl hover:shadow-black/5 cursor-default"
    >
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 ${bg} ${color} rounded-2xl`}>
          <Icon size={24} />
        </div>
        <div className="flex items-center gap-1 text-green-500 font-bold text-xs bg-green-50 px-2 py-1 rounded-lg">
          <ArrowUpRight size={14} />
          Live
        </div>
      </div>
      
      <div>
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-5xl font-black text-gray-900 tracking-tighter">
          {value}
        </h3>
      </div>

      <div className={`absolute -right-4 -bottom-4 opacity-5 transition-transform group-hover:scale-110 duration-500 ${color}`}>
        <Icon size={120} />
      </div>
    </motion.div>
  );
}