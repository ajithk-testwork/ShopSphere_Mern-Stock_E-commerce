import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar"; 
import AdminNavbar from "../components/AdminNavbar";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50/50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <AdminNavbar /> 
        <main className="flex-1 p-10">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
}