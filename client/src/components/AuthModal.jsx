import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../utils/api";

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

        const { data } = await api.post(endpoint, payload);

        if (mode === "login") {
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken); // 🔥 ADD THIS
          localStorage.setItem("user", JSON.stringify(data.user));

          setSuccess(true);

          setTimeout(() => {
            onClose();
            window.dispatchEvent(new Event("storage")); // better than reload
          }, 1200);
        } else {
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
            handleModeChange("login");
          }, 1200);
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
      setError(err.response?.data?.message || "An error occurred");
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
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => handleModeChange("forgot")}
                  className="text-[11px] font-bold text-gray-400 hover:text-black hover:underline underline-offset-4 transition-all uppercase tracking-tight cursor-pointer"
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
            className="relative w-full max-w-[420px] bg-white rounded-[32px] p-8 md:p-10 shadow-2xl my-auto h-fit z-10"
          >
            {!success && (
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-black cursor-pointer transition-colors"
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
              <SuccessState mode={mode} />
            ) : (
              <>
                <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-black/20">
                  <div className="w-4 h-4 bg-white rotate-45" />
                </div>

                <div className="mb-8">
                  <h2 className="text-3xl font-black tracking-tight text-gray-900 mb-2">
                    {mode === "login" && "Welcome back."}
                    {mode === "register" && "Create account."}
                    {mode === "forgot" && "Reset access."}
                    {mode === "verify" && "Verify Email."}
                    {mode === "reset" && "New Password."}
                  </h2>
                  <p className="text-gray-500 font-medium text-[14px]">
                    {mode === "forgot"
                      ? "We'll send a code to your email."
                      : mode === "verify"
                        ? "Enter the code sent to your inbox."
                        : mode === "reset"
                          ? "Choose a strong new password."
                          : "Enter your details to continue."}
                  </p>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-red-500 text-xs mt-4 font-bold bg-red-50 p-3 rounded-xl border border-red-100"
                    >
                      {error}
                    </motion.p>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {renderFormFields()}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white py-4 rounded-2xl font-bold text-[15px] mt-2 hover:bg-gray-800 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-black/10 cursor-pointer"
                  >
                    <span>
                      {loading
                        ? "Processing..."
                        : mode === "login"
                          ? "Sign In"
                          : mode === "register"
                            ? "Register"
                            : mode === "forgot"
                              ? "Send Code"
                              : mode === "verify"
                                ? "Verify Code"
                                : "Update Password"}
                    </span>
                  </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                  <button
                    onClick={() =>
                      handleModeChange(mode === "login" ? "register" : "login")
                    }
                    className="text-gray-400 font-medium text-[13px] hover:text-black transition-colors cursor-pointer group"
                  >
                    {mode === "login"
                      ? "New to ShopSphere? "
                      : "Changed your mind? "}
                    <span className="text-black font-bold underline underline-offset-8 decoration-gray-200 group-hover:decoration-black transition-all">
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

const InputField = ({ label, ...props }) => (
  <div className="group">
    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 ml-1">
      {label}
    </label>
    <input
      {...props}
      required
      className="w-full px-5 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-black outline-none transition-all text-sm font-medium placeholder:text-gray-300"
    />
  </div>
);

const SuccessState = ({ mode }) => (
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
        : mode === "reset"
          ? "Password updated successfully."
          : "Account created successfully."}
    </p>
  </motion.div>
);

export default AuthModal;
