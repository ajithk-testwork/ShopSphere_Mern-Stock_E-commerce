// components/AuthModal.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../utils/api";

const AuthModal = ({ isOpen, onClose, mode, setMode }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const payload =
        mode === "login"
          ? { email: formData.email, password: formData.password }
          : formData;

      const { data } = await api.post(endpoint, payload, {
        withCredentials: false,
      });

      if (mode === "login") {
        const token = data.accessToken;
        const user = data.user;
        if (!token || !user) {
          setError("Session could not be established.");
          return;
        }
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("user", JSON.stringify(data.user));

        setSuccess(true);
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 1200);
      }

      if (mode === "register") {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setMode("login");
          setFormData({ name: "", email: "", password: "" });
        }, 1200);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
      console.log("AXIOS ERROR 👉", error);
      console.log("MESSAGE 👉", error.message);
      console.log("RESPONSE 👉", error.response);
      console.log("REQUEST 👉", error.request);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-center p-4 bg-black/40 backdrop-blur-[8px] overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 cursor-pointer"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 450 }}
            /* MODIFIED: 
               1. Added 'my-auto' -> This is the secret to perfect centering that won't cut off content.
               2. Added 'h-fit' -> Ensures the card doesn't stretch unnecessarily.
            */
            className="relative w-full max-w-[420px] bg-white rounded-[32px] border border-gray-100 p-8 md:p-10 shadow-2xl my-auto h-fit z-10"
          >
            {!success && (
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-black transition-all cursor-pointer"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}

            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-black text-gray-900">Success!</h2>
                <p className="text-gray-500 mt-1">
                  {mode === "login"
                    ? "Welcome back to ShopSphere."
                    : "Account created. Please log in."}
                </p>
              </motion.div>
            ) : (
              <>
                <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-black/10">
                  <div className="w-4 h-4 bg-white rotate-45" />
                </div>

                <div className="mb-8">
                  <h2 className="text-3xl font-black tracking-tight text-gray-900 mb-2">
                    {mode === "login" ? "Welcome back." : "Create account."}
                  </h2>
                  <p className="text-gray-500 font-medium text-[14px]">
                    {mode === "login"
                      ? "Enter your details to sign in."
                      : "Join ShopSphere for a premium experience."}
                  </p>
                  {error && (
                    <p className="text-red-500 text-xs mt-3 font-bold bg-red-50 p-2 rounded-lg">
                      {error}
                    </p>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === "register" && (
                    <div className="group">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 ml-1">
                        Full Name
                      </label>
                      <input
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-5 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-black outline-none transition-all text-sm font-medium"
                      />
                    </div>
                  )}

                  <div className="group">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 ml-1">
                      Email Address
                    </label>
                    <input
                      name="email"
                      type="email"
                      placeholder="name@company.com"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-5 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-black outline-none transition-all text-sm font-medium"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 ml-1">
                      Password
                    </label>
                    <input
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-5 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-black outline-none transition-all text-sm font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group w-full bg-black text-white py-4 rounded-2xl font-bold text-[15px] mt-2 hover:bg-gray-800 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer shadow-xl shadow-black/10"
                  >
                    <span>
                      {loading
                        ? "Processing..."
                        : mode === "login"
                          ? "Sign In"
                          : "Register"}
                    </span>
                    {!loading && (
                      <svg
                        className="w-4 h-4 transition-transform group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    )}
                  </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                  <p className="text-gray-400 font-medium text-[13px]">
                    {mode === "login"
                      ? "New to ShopSphere? "
                      : "Already have an account? "}
                    <button
                      onClick={() =>
                        setMode(mode === "login" ? "register" : "login")
                      }
                      className="text-black font-bold hover:underline underline-offset-8 decoration-2 cursor-pointer transition-all"
                    >
                      {mode === "login" ? "Sign up" : "Log in"}
                    </button>
                  </p>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
