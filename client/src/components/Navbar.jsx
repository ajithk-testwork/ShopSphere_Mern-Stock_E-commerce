// components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AuthModal from './AuthModal.jsx';

const Navbar = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  
  const location = useLocation();

  // Check for logged in user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
      }
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openAuth = (mode) => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.reload(); // Force reload to clear all states
  };

  return (
    <>
      <nav 
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/80 backdrop-blur-md border-b border-gray-100 py-3' 
            : 'bg-white border-b border-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
          
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link 
              to="/" 
              className="text-2xl font-black tracking-tighter text-gray-900 flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-white rotate-45" />
              </div>
              ShopSphere
            </Link>
          </motion.div>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-10">
            {[
              { name: 'Home', path: '/' },
              { name: 'Products', path: '/products' },
              { name: 'Checkout', path: '/checkout' },
            ].map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative text-[14px] font-semibold transition-colors duration-200 ${
                  location.pathname === link.path ? 'text-black' : 'text-gray-500 hover:text-black'
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div 
                    layoutId="nav-underline"
                    className="absolute -bottom-[22px] left-0 right-0 h-[2px] bg-black"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Action Buttons / User Profile */}
          <div className="flex items-center space-x-6">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-gray-700 hidden sm:block">
                  Hi, {user.name?.split(' ')[0]}
                </span>
                
                {/* Profile Circle with Hover Dropdown */}
                <div className="relative group cursor-pointer">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-black shadow-lg shadow-black/10"
                  >
                    {user.name?.charAt(0).toUpperCase()}
                  </motion.div>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-12 w-44 bg-white border border-gray-100 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2 origin-top-right">
                    <div className="px-4 py-2 border-b border-gray-50 mb-1">
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Logged in as</p>
                       <p className="text-xs font-bold text-gray-900 truncate">{user.email}</p>
                    </div>
                    <button 
                      onClick={handleLogout} 
                      className="w-full text-left text-sm text-red-500 font-bold p-3 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-6">
                <button 
                  onClick={() => openAuth('login')}
                  className="text-[14px] font-bold cursor-pointer text-gray-900 hover:opacity-70 transition-opacity"
                >
                  Sign in
                </button>
                
                <button 
                  onClick={() => openAuth('register')}
                  className="group relative inline-flex cursor-pointer items-center justify-center px-6 py-2.5 font-bold text-white transition-all duration-200 bg-black rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 shadow-lg shadow-black/10"
                >
                  Get Started
                  <svg 
                    className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Auth Modal Component */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        mode={authMode} 
        setMode={setAuthMode} 
      />
    </>
  );
};

export default Navbar;