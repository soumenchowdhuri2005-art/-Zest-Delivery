import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingBag, User, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchModal } from './SearchModal';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { cart, setIsSearchOpen } = useApp();
  const location = useLocation();
  const hideNav = ['/onboarding', '/auth'].includes(location.pathname);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen pb-24 md:pb-0 md:pt-0 max-w-md mx-auto bg-brand-cream relative overflow-x-hidden shadow-2xl">
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="w-full"
        >
          {children}
        </motion.main>
      </AnimatePresence>

      {!hideNav && (
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] bg-brand-dark/95 backdrop-blur-lg rounded-full px-8 py-4 flex items-center justify-between z-50 shadow-xl border border-white/10">
          <NavItem to="/" icon={<Home size={22} />} label="Home" />
          <NavItem 
            icon={<Search size={22} />} 
            label="Search" 
            onClick={() => setIsSearchOpen(true)}
          />
          <div className="relative">
            <NavItem to="/cart" icon={<ShoppingBag size={22} />} label="Cart" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-brand-dark">
                {cartCount}
              </span>
            )}
          </div>
          <NavItem to="/wishlist" icon={<Heart size={22} />} label="Saved" />
          <NavItem to="/profile" icon={<User size={22} />} label="Profile" />
        </nav>
      )}
      <SearchModal />
    </div>
  );
};

const NavItem: React.FC<{ to?: string; icon: React.ReactNode; label: string; onClick?: () => void }> = ({ to, icon, label, onClick }) => {
  const content = (
    <>
      {icon}
      <span className="text-[10px] font-medium uppercase tracking-widest">{label}</span>
    </>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="flex flex-col items-center gap-1 transition-all duration-300 text-white/60 hover:text-white"
      >
        {content}
      </button>
    );
  }

  return (
    <NavLink
      to={to || '/'}
      className={({ isActive }) =>
        cn(
          "flex flex-col items-center gap-1 transition-all duration-300",
          isActive ? "text-brand-primary scale-110" : "text-white/60 hover:text-white"
        )
      }
    >
      {content}
    </NavLink>
  );
};
