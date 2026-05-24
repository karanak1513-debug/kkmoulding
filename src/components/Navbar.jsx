import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Phone, MessageCircle, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BUSINESS_DETAILS } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { currentUser, isAdmin, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Products', path: '/products' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const activeStyle = ({ isActive }) =>
    `relative py-2 text-sm font-medium transition-colors duration-300 ${
      isActive ? 'text-brand-wood font-semibold' : 'text-brand-dark/80 hover:text-brand-wood'
    }`;

  return (
    <nav className="glass-nav sticky top-0 z-50 w-full transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo Section */}
          <Link to="/" className="flex items-center">
            <img src="/logo-white.png" alt="K K Moulding Logo" className="h-14 sm:h-16 w-auto object-contain" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink key={link.name} to={link.path} className={activeStyle}>
                {({ isActive }) => (
                  <>
                    {link.name}
                    {isActive && (
                      <motion.span
                        layoutId="activeNavLine"
                        className="absolute bottom-0 left-0 h-[2px] w-full bg-brand-gold"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}

            {isAdmin && (
              <NavLink to="/admin" className={activeStyle}>
                <span className="flex items-center gap-1.5 text-brand-gold">
                  <LayoutDashboard size={16} /> Admin Panel
                </span>
              </NavLink>
            )}
          </div>

          {/* Desktop CTA / Auth buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-full border border-brand-wood/30 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-brand-wood transition-all duration-300 hover:bg-brand-wood hover:text-white"
              >
                <LogOut size={14} /> Log Out
              </button>
            ) : null}

            <a
              href={`tel:${BUSINESS_DETAILS.phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-2 rounded-full bg-brand-wood px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-brand-dark hover:shadow-lg hover:-translate-y-0.5"
            >
              <Phone size={16} /> Call Now
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            {isAdmin && (
              <Link to="/admin" className="p-2 text-brand-gold hover:text-brand-wood">
                <LayoutDashboard size={20} />
              </Link>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-lg p-2 text-brand-dark hover:bg-brand-beige/50 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Slide-out */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-brand-wood/10 bg-white/95 backdrop-blur-md"
          >
            <div className="space-y-1 px-4 pb-6 pt-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-brand-beige/50 text-brand-wood font-semibold'
                        : 'text-brand-dark/80 hover:bg-brand-beige/30 hover:text-brand-wood'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}

              {isAdmin && (
                <NavLink
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-brand-beige/50 text-brand-wood font-semibold'
                        : 'text-brand-wood hover:bg-brand-beige/30'
                    }`
                  }
                >
                  <LayoutDashboard size={18} /> Admin Panel
                </NavLink>
              )}

              <div className="border-t border-brand-wood/10 pt-4 mt-4 flex flex-col space-y-3">
                {currentUser ? (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-brand-wood/30 py-3 text-sm font-semibold uppercase tracking-wider text-brand-wood"
                  >
                    <LogOut size={16} /> Log Out
                  </button>
                ) : null}

                <a
                  href={`tel:${BUSINESS_DETAILS.phone.replace(/\s+/g, '')}`}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-wood py-3 text-sm font-semibold text-white shadow-sm"
                >
                  <Phone size={16} /> Call Now
                </a>
                
                <a
                  href={`https://wa.me/${BUSINESS_DETAILS.whatsapp}?text=Hello%20K%20K%20Moulding%2C%20I%20have%20an%20inquiry.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] py-3 text-sm font-semibold text-white shadow-sm"
                >
                  <MessageCircle size={16} /> WhatsApp Us
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
