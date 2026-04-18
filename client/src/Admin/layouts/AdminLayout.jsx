import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar"; 
import AdminNavbar from "../components/AdminNavbar";

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-slate-50/50 overflow-hidden">
      <Sidebar />
      {/* ✅ FIX: Added min-w-0 to prevent flexbox blowout from wide tables */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminNavbar /> 
        <main className="flex-1 p-6 md:p-8 lg:p-10">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
}