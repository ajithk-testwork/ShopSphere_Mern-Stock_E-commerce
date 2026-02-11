import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Mail,
  Lock,
  Loader2,
  CheckCircle2,
  ArrowRight,
  Eye,
  EyeOff
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      await login(email, password);
      setStatus("success");
      setTimeout(() => {
        navigate("/admin/dashboard", { replace: true });
      }, 2000);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || "Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="h-screen w-full bg-[#f8fafc] flex items-center justify-center overflow-y-auto py-12 px-2 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md my-auto"
      >
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 p-8 md:p-10 relative overflow-hidden">
          
          <AnimatePresence>
            {status === "success" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 bg-white flex flex-col items-center justify-center text-center p-10"
              >
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", damping: 12, stiffness: 200 }}
                  className="relative"
                >
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-200 mb-6">
                    <CheckCircle2 size={40} strokeWidth={2.5} />
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-2 border-2 border-dashed border-green-200 rounded-full"
                  />
                </motion.div>

                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Welcome back!</h2>
                <p className="text-slate-500 mt-2 font-medium text-sm">Authorization successful.</p>

                <div className="w-40 h-1.5 bg-slate-100 rounded-full mt-8 overflow-hidden">
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "0%" }}
                    transition={{ duration: 1.8, ease: "easeInOut" }}
                    className="w-full h-full bg-green-500"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-2xl text-white mb-4 shadow-lg shadow-indigo-100">
              <ShieldCheck size={28} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Admin Engine</h1>
            <p className="text-slate-400 mt-1 font-medium text-sm">Enterprise Secure Portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="group">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input
                  type="email"
                  required
                  placeholder="admin@shopstack.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white outline-none transition-all font-semibold text-slate-700 text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="group">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Security Key</label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-14 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white outline-none transition-all font-semibold text-slate-700 text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 cursor-pointer -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {status === "error" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 border border-red-100 p-3 rounded-xl flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <p className="text-red-600 text-[10px] font-bold uppercase tracking-tight">{errorMsg}</p>
              </motion.div>
            )}

            <button
              disabled={status === "loading"}
              className="w-full bg-slate-900 cursor-pointer hover:bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-slate-200 active:scale-[0.98] transition-all disabled:opacity-70 mt-2"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span className="uppercase tracking-widest text-[10px]">Verifying...</span>
                </>
              ) : (
                <>
                  <span className="uppercase  tracking-widest text-[10px]">Authorize Access</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-50 text-center">
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">Powered by ShopSphere Auth v2.0</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}