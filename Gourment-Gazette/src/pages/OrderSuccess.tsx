import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OrderSuccess() {
  return (
    <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center p-6 text-center">
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 12, stiffness: 200 }}
        className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-8 shadow-xl shadow-green-500/10"
      >
        <CheckCircle2 size={64} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-4xl font-bold text-brand-dark mb-4">Order <span className="text-brand-primary italic">Placed!</span></h1>
        <p className="text-brand-dark/60 mb-12 max-w-xs mx-auto leading-relaxed">
          Your gourmet selection is being prepared with care. We'll notify you when it's on the way.
        </p>
      </motion.div>

      <div className="w-full space-y-4 max-w-xs">
        <Link 
          to="/profile"
          className="w-full py-5 editorial-gradient rounded-full text-white font-bold text-lg shadow-lg shadow-brand-primary/30 flex items-center justify-center gap-2 group active:scale-95 transition-transform"
        >
          Track Order
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link 
          to="/"
          className="w-full py-5 bg-white border border-brand-dark/10 rounded-full text-brand-dark font-bold text-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
