import { LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AdminNavbar() {
  const { admin, logout } = useAuth();

  return (
    <header className="h-20 bg-white border-b px-10 flex items-center justify-between sticky top-0 z-10">
      <div className="font-black text-slate-800 tracking-tight">ADMIN PANEL</div>
      
      <div className="flex items-center gap-5">
        <div className="text-right">
          <p className="text-sm font-bold text-slate-900 leading-none">{admin?.name}</p>
          <p className="text-[10px] text-indigo-600 font-bold uppercase mt-1">Super Admin</p>
        </div>
        <button 
          onClick={logout} 
          title="Sign Out"
          className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer border border-transparent hover:border-red-100"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}