import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart } = useApp();
  const navigate = useNavigate();

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = 2.99;
  const total = subtotal + deliveryFee;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center p-6 text-center">
        <div className="w-32 h-32 bg-brand-dark/5 rounded-full flex items-center justify-center text-brand-primary mb-6">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-2xl font-bold text-brand-dark mb-2">Your table is empty</h2>
        <p className="text-brand-dark/60 mb-8 max-w-xs">Looks like you haven't added any delicacies to your order yet.</p>
        <Link 
          to="/"
          className="px-8 py-4 editorial-gradient rounded-full text-white font-bold uppercase tracking-widest shadow-lg active:scale-95 transition-transform"
        >
          Explore Kitchens
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream pb-40">
      <header className="p-6 flex items-center gap-4 sticky top-0 bg-brand-cream/80 backdrop-blur-md z-40">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-brand-dark shadow-sm border border-brand-dark/5"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-brand-dark">Your <span className="text-brand-primary italic">Order</span></h1>
      </header>

      <div className="px-6 space-y-6">
        <div className="bg-brand-accent/20 p-4 rounded-2xl flex items-center gap-3">
          <ShoppingBag size={18} className="text-brand-primary" />
          <p className="text-xs font-bold text-brand-dark uppercase tracking-widest">
            Ordering from <span className="text-brand-primary">{cart[0].restaurantName}</span>
          </p>
        </div>

        <div className="space-y-6">
          <AnimatePresence>
            {cart.map(item => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex gap-4 group"
              >
                <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 shadow-md">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-brand-dark text-sm">{item.name}</h3>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-brand-dark/20 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p className="text-[10px] text-brand-dark/40 font-medium uppercase tracking-widest mb-3 italic">
                    {item.category}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-brand-primary">${(item.price * item.quantity).toFixed(2)}</span>
                    <div className="bg-white rounded-lg flex items-center gap-3 p-1 shadow-sm border border-brand-dark/5">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 flex items-center justify-center text-brand-primary hover:bg-brand-accent/20 rounded-md transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-xs font-bold text-brand-dark min-w-[12px] text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-6 h-6 flex items-center justify-center text-brand-primary hover:bg-brand-accent/20 rounded-md transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-[32px] p-6 space-y-4 shadow-xl shadow-brand-dark/5 border border-brand-dark/5">
          <div className="flex justify-between text-sm">
            <span className="text-brand-dark/60 font-medium">Subtotal</span>
            <span className="text-brand-dark font-bold">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-brand-dark/60 font-medium">Delivery Fee</span>
            <span className="text-brand-dark font-bold">${deliveryFee.toFixed(2)}</span>
          </div>
          <div className="h-px bg-brand-dark/5"></div>
          <div className="flex justify-between text-lg">
            <span className="text-brand-dark font-bold">Total</span>
            <span className="text-brand-primary font-black">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] z-50">
        <button 
          onClick={() => navigate('/checkout')}
          className="w-full py-5 editorial-gradient rounded-full text-white font-bold text-lg shadow-2xl shadow-brand-primary/30 flex items-center justify-center gap-2 group active:scale-95 transition-transform"
        >
          Proceed to Checkout
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
