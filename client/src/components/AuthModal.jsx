import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../utils/api";
import { Eye, EyeOff, Loader2, CheckCircle, X } from "lucide-react";

const AuthModal = ({ isOpen, onClose, mode, setMode }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    otp: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleModeChange = (newMode) => {
    setError("");
    setFormData({
      name: "",
      email: formData.email,
      password: "",
      otp: "",
      newPassword: "",
    });
    setMode(newMode);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (mode === "login" || mode === "register") {
        const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
        const payload =
          mode === "login"
            ? { email: formData.email, password: formData.password }
            : formData;

        const res = await api.post(endpoint, payload);

        if (mode === "login") {
          localStorage.clear();
          localStorage.setItem("accessToken", res.data.accessToken);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          window.location.reload();
        } else {
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
            handleModeChange("login");
          }, 1500);
        }
      } else if (mode === "forgot") {
        await api.post("/auth/forgot-password", { email: formData.email });
        handleModeChange("verify");
      } else if (mode === "verify") {
        await api.post("/auth/verify-otp", {
          email: formData.email,
          otp: formData.otp,
        });
        handleModeChange("reset");
      } else if (mode === "reset") {
        await api.post("/auth/reset-password", {
          email: formData.email,
          newPassword: formData.newPassword,
        });
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          handleModeChange("login");
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderFormFields = () => {
    switch (mode) {
      case "forgot":
        return (
          <InputField
            label="Email Address"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />
        );
      case "verify":
        return (
          <InputField
            label="Enter 6-Digit OTP"
            name="otp"
            type="text"
            maxLength="6"
            placeholder="123456"
            value={formData.otp}
            onChange={handleChange}
          />
        );
      case "reset":
        return (
          <InputField
            label="New Password"
            name="newPassword"
            type="password"
            placeholder="••••••••"
            value={formData.newPassword}
            onChange={handleChange}
          />
        );
      default:
        return (
          <>
            {mode === "register" && (
              <InputField
                label="Full Name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
              />
            )}
            <InputField
              label="Email Address"
              name="email"
              type="email"
              placeholder="name@company.com"
              value={formData.email}
              onChange={handleChange}
            />
            <InputField
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
            {mode === "login" && (
              <div className="flex justify-end pt-0.5">
                <button
                  type="button"
                  onClick={() => handleModeChange("forgot")}
                  className="text-[10px] font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
            )}
          </>
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        // Removed overflow-y-auto to enforce strict centering
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 cursor-pointer"
          />

          {/* Modal Content - Reduced max-width and paddings */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
            className="relative w-full max-w-[380px] bg-white rounded-[2rem] p-6 sm:p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] z-10 border border-gray-100"
          >
            {!success && (
              <button
                onClick={onClose}
                className="absolute top-5 right-5 p-2 bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-900 rounded-full cursor-pointer transition-colors"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            )}

            {success ? (
              <SuccessState mode={mode} />
            ) : (
              <>
                {/* Reduced Logo Size and Margins */}
                <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center mb-5 shadow-md shadow-gray-900/20">
                  <div className="w-3.5 h-3.5 bg-white rotate-45 rounded-sm" />
                </div>

                <div className="mb-5">
                  <h2 className="text-2xl font-black tracking-tight text-gray-900 mb-1.5">
                    {mode === "login" && "Welcome back."}
                    {mode === "register" && "Create account."}
                    {mode === "forgot" && "Reset access."}
                    {mode === "verify" && "Verify Email."}
                    {mode === "reset" && "New Password."}
                  </h2>
                  <p className="text-gray-500 font-medium text-[13px] leading-relaxed">
                    {mode === "forgot"
                      ? "Enter your email for a recovery code."
                      : mode === "verify"
                        ? "Enter the 6-digit code sent to your inbox."
                        : mode === "reset"
                          ? "Choose a strong new password."
                          : "Enter your details below to continue."}
                  </p>
                  
                  {/* Error State */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="text-red-600 text-[11px] font-bold bg-red-50 p-2.5 rounded-lg border border-red-100 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                          {error}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Reduced vertical space between inputs */}
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  {renderFormFields()}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold text-sm mt-2 hover:bg-black transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-gray-900/10 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <span>
                        {mode === "login" && "Sign In"}
                        {mode === "register" && "Create Account"}
                        {mode === "forgot" && "Send Code"}
                        {mode === "verify" && "Verify"}
                        {mode === "reset" && "Update Password"}
                      </span>
                    )}
                  </button>
                </form>

                <div className="mt-5 pt-4 border-t border-gray-100 text-center">
                  <button
                    onClick={() =>
                      handleModeChange(mode === "login" ? "register" : "login")
                    }
                    className="text-gray-500 font-medium text-[13px] hover:text-gray-900 transition-colors cursor-pointer group"
                  >
                    {mode === "login"
                      ? "New to ShopSphere? "
                      : "Changed your mind? "}
                    <span className="text-gray-900 font-bold underline underline-offset-4 decoration-gray-300 group-hover:decoration-gray-900 transition-all">
                      {mode === "login" ? "Sign up" : "Back to Log in"}
                    </span>
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// ----------------------------------------------------------------------
// UPGRADED INPUT FIELD (COMPACT)
// ----------------------------------------------------------------------

const InputField = ({ label, type, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="group relative">
      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5 ml-1">
        {label}
      </label>
      <div className="relative">
        {/* Reduced input padding from py-3.5 to py-2.5 */}
        <input
          {...props}
          type={inputType}
          required
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-gray-900 focus:ring-2 focus:ring-gray-900/5 outline-none transition-all text-sm font-medium placeholder:text-gray-400"
        />
        
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors focus:outline-none p-1"
          >
            {showPassword ? (
              <EyeOff size={16} strokeWidth={2} />
            ) : (
              <Eye size={16} strokeWidth={2} />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// UPGRADED SUCCESS STATE (COMPACT)
// ----------------------------------------------------------------------

const SuccessState = ({ mode }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="text-center py-8 flex flex-col items-center"
  >
    <motion.div 
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", bounce: 0.5, delay: 0.1 }}
      className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4 shadow-inner border border-emerald-100"
    >
      <CheckCircle size={32} strokeWidth={2} />
    </motion.div>
    <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Success!</h2>
    <p className="text-gray-500 font-medium text-sm">
      {mode === "login"
        ? "Welcome back to ShopSphere."
        : mode === "reset"
          ? "Password updated successfully."
          : "Account created successfully."}
    </p>
  </motion.div>
);

export default AuthModal;