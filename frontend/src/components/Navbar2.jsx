// Navbar Component
// Responsive navigation bar with cart count and user menu

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-white text-2xl font-bold hover:opacity-90 transition">
            🛍️ AI E-Shop
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-white hover:text-purple-200 transition">
              Home
            </Link>
            
            {user ? (
              <>
                <Link to="/cart" className="text-white hover:text-purple-200 transition relative">
                  Cart
                  {getCartCount() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {getCartCount()}
                    </span>
                  )}
                </Link>
                <Link to="/profile" className="text-white hover:text-purple-200 transition">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-100 transition font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-purple-200 transition">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-100 transition font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <Link to="/" className="block text-white py-2 hover:text-purple-200 transition">
              Home
            </Link>
            {user ? (
              <>
                <Link to="/cart" className="block text-white py-2 hover:text-purple-200 transition">
                  Cart {getCartCount() > 0 && `(${getCartCount()})`}
                </Link>
                <Link to="/profile" className="block text-white py-2 hover:text-purple-200 transition">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-white py-2 hover:text-purple-200 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-white py-2 hover:text-purple-200 transition">
                  Login
                </Link>
                <Link to="/signup" className="block text-white py-2 hover:text-purple-200 transition">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
