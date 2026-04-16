import { LayoutDashboard, Plus, Package, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Add Product", path: "/admin/add-product", icon: Plus },
    { name: "Products", path: "/admin/admin-products", icon: Package },
  ];

  return (
    <aside className="w-60 h-screen bg-[#0a0a0b] text-white p-6 sticky top-0 flex flex-col">
      <div className="mb-12">
        <h1 className="text-xl font-black">ShopSphere</h1>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl ${
              location.pathname === item.path ? "bg-white/10 text-blue-500" : "text-gray-500"
            }`}
          >
            <item.icon size={20} />
            <span className="font-bold text-sm">{item.name}</span>
          </Link>
        ))}
      </nav>

      <button onClick={logout} className="flex items-center gap-3 p-4 text-gray-500 hover:text-red-500">
        <LogOut size={20} />
        <span className="font-bold">Logout</span>
      </button>
    </aside>
  );
}