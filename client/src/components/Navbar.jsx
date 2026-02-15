// components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AuthModal from "./AuthModal.jsx";
import { api } from "../utils/api.js";
import { ShoppingCart, Menu, X, LogOut, User, ChevronRight } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";

const Navbar = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount, clearCart } = useCart();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Products", path: "/products" },
    { name: "Contact", path: "/contact" },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    loadUser();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("storage", loadUser); // Sync across tabs
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const openAuth = (mode) => {
    setAuthMode(mode);
    setIsAuthOpen(true);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      // 1. Call API to invalidate session
      await api.post("/auth/logout");
    } catch (error) {
      console.warn("Logout API failed, clearing local session anyway");
    } finally {
      // 2. Clear ALL local storage items found in your api.js
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      
      // 3. Reset local state
      setUser(null);
      clearCart();
      
      // 4. UI Fix: Close mobile menu immediately
      setIsMobileMenuOpen(false);
      
      // 5. Redirect
      navigate("/");
    }
  };

  return (
    <>
      <nav className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-white/90 backdrop-blur-md border-b border-gray-100 py-3" : "bg-white border-b border-transparent py-5"
      }`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-black tracking-tighter text-gray-900 flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-white rotate-45" />
            </div>
            <span className="hidden xs:block">ShopSphere</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} className={`text-sm font-semibold transition-colors ${
                location.pathname === link.path ? "text-black" : "text-gray-500 hover:text-black"
              }`}>
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3 sm:gap-6">
            <button onClick={() => navigate("/cart")} className="relative p-2 hover:bg-gray-100 rounded-full">
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-black text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Desktop Auth */}
            <div className="hidden md:block">
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="relative group">
                    <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold cursor-pointer">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 top-12 w-48 bg-white border border-gray-100 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all p-2 z-50">
                       <div className="px-4 py-2 border-b border-gray-50">
                          <p className="text-[10px] text-gray-400 font-bold uppercase">Account</p>
                          <p className="text-xs font-bold truncate">{user.email}</p>
                       </div>
                       <button onClick={handleLogout} className="w-full text-left text-sm text-red-500 font-bold p-3 hover:bg-red-50 rounded-xl mt-1 flex items-center gap-2">
                          <LogOut size={16} /> Logout
                       </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <button onClick={() => openAuth("login")} className="text-sm font-bold">Sign in</button>
                  <button onClick={() => openAuth("register")} className="px-6 py-2.5 bg-black text-white rounded-xl text-sm font-bold shadow-lg shadow-black/10">Get Started</button>
                </div>
              )}
            </div>

            {/* Mobile Toggle */}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 bg-gray-50 rounded-lg">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-2xl md:hidden z-50"
            >
              <div className="p-6 space-y-6">
                {/* Links */}
                <div className="space-y-4">
                  {navLinks.map((link) => (
                    <Link key={link.name} to={link.path} className="flex items-center justify-between text-lg font-bold text-gray-900 group">
                      {link.name}
                      <ChevronRight size={20} className="text-gray-300 group-hover:text-black transition-colors" />
                    </Link>
                  ))}
                </div>

                <div className="h-px bg-gray-100 w-full" />

                {/* Auth Area */}
                {user ? (
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-xl font-bold">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-bold text-gray-900 truncate">{user.name}</p>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                    <button onClick={handleLogout} className="w-full py-4 bg-red-50 text-red-600 rounded-xl font-bold flex items-center justify-center gap-2 border border-red-100">
                      <LogOut size={20} /> Logout
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => openAuth("login")} className="py-4 text-center font-bold border border-gray-200 rounded-xl">Sign In</button>
                    <button onClick={() => openAuth("register")} className="py-4 text-center font-bold bg-black text-white rounded-xl shadow-lg shadow-black/10">Get Started</button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} mode={authMode} setMode={setAuthMode} />
    </>
  );
};

export default Navbar;