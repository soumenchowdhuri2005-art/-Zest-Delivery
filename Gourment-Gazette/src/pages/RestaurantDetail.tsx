import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Clock, ShoppingBag, Heart, Share2, Info, Plus, Minus, X, UtensilsCrossed } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RESTAURANTS, MenuItem } from '../data/mockData';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart, updateQuantity, wishlist, toggleWishlist } = useApp();
  const [activeCategory, setActiveCategory] = useState('All Menu');
  const [selectedFood, setSelectedFood] = useState<MenuItem | null>(null);

  const restaurant = RESTAURANTS.find(r => r.id === id);

  if (!restaurant) return <div className="p-10 text-center">Restaurant not found</div>;

  const categories = ['All Menu', ...new Set(restaurant.menu.map(m => m.category))];
  const filteredMenu = activeCategory === 'All Menu' 
    ? restaurant.menu 
    : restaurant.menu.filter(m => m.category === activeCategory);

  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-brand-cream pb-32">
      {/* Hero Section */}
      <div className="relative h-80">
        <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-brand-cream" />
        
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-brand-dark shadow-lg active:scale-90 transition-transform"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex gap-3">
            <button 
              onClick={() => toggleWishlist(restaurant.id)}
              className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-brand-primary shadow-lg active:scale-90 transition-transform"
            >
              <Heart size={20} fill={wishlist.includes(restaurant.id) ? "currentColor" : "none"} />
            </button>
            <button className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-brand-dark shadow-lg active:scale-90 transition-transform">
              <Share2 size={20} />
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="bg-brand-primary/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest inline-block mb-3">
            Gourmet Gazette Choice
          </div>
          <h1 className="text-4xl font-bold text-brand-dark mb-2">{restaurant.name}</h1>
          <p className="text-brand-dark/70 text-sm leading-relaxed max-w-xs italic">
            {restaurant.description}
          </p>
        </div>
      </div>

      {/* Info Bar */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-brand-dark/5">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-brand-accent/30 px-3 py-1 rounded-full">
            <Star size={14} className="text-brand-primary fill-brand-primary" />
            <span className="text-xs font-bold text-brand-primary">{restaurant.rating}</span>
          </div>
          <span className="text-[10px] text-brand-dark/40 font-bold uppercase tracking-widest">200+ Reviews</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-bold text-brand-dark/60">
          <div className="flex items-center gap-1">
            <Clock size={14} className="text-brand-primary" />
            <span>{restaurant.deliveryTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Info size={14} className="text-brand-primary" />
            <span>Info</span>
          </div>
        </div>
      </div>

      {/* Menu Categories */}
      <div className="sticky top-0 bg-brand-cream/80 backdrop-blur-md z-30 py-4 border-b border-brand-dark/5">
        <div className="flex gap-3 overflow-x-auto px-6 hide-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all",
                activeCategory === cat 
                  ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20" 
                  : "bg-brand-dark/5 text-brand-dark/60"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-6 space-y-12">
        {categories.filter(c => c !== 'All Menu').map(cat => {
          const items = restaurant.menu.filter(m => m.category === cat);
          if (activeCategory !== 'All Menu' && activeCategory !== cat) return null;
          
          return (
            <div key={cat}>
              <h2 className="text-2xl font-bold text-brand-dark mb-6 flex items-center gap-3">
                <span className="w-1 h-6 bg-brand-primary rounded-full"></span>
                {cat}
              </h2>
              <div className="space-y-8">
                {items.map(item => (
                  <MenuItemCard 
                    key={item.id} 
                    item={item} 
                    onAdd={() => addToCart(item, restaurant)}
                    onSelect={() => setSelectedFood(item)}
                    cartItem={cart.find(i => i.id === item.id)}
                    onUpdate={(delta) => updateQuantity(item.id, delta)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Food Detail Modal */}
      <AnimatePresence>
        {selectedFood && (
          <FoodDetailModal 
            item={selectedFood} 
            onClose={() => setSelectedFood(null)} 
            onAdd={() => {
              addToCart(selectedFood, restaurant);
              setSelectedFood(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Bottom Cart Bar */}
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] z-50"
          >
            <button 
              onClick={() => navigate('/cart')}
              className="w-full bg-brand-dark text-white rounded-full p-2 flex items-center justify-between shadow-2xl border border-white/10 group active:scale-95 transition-transform"
            >
              <div className="flex items-center gap-3 ml-4">
                <div className="relative">
                  <ShoppingBag size={20} />
                  <span className="absolute -top-2 -right-2 bg-brand-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-brand-dark">
                    {cartCount}
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">View Cart</p>
                  <p className="text-sm font-bold">${cartTotal.toFixed(2)}</p>
                </div>
              </div>
              <div className="bg-brand-primary px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                Checkout <ArrowLeft className="rotate-180" size={14} />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const MenuItemCard = ({ item, onAdd, onSelect, cartItem, onUpdate }: any) => (
  <div className="group">
    <div className="flex gap-6 mb-4">
      <div className="flex-1 cursor-pointer" onClick={onSelect}>
        <h3 className="text-lg font-bold text-brand-dark mb-1 group-hover:text-brand-primary transition-colors">{item.name}</h3>
        <p className="text-xs text-brand-dark/60 leading-relaxed mb-3 line-clamp-2 italic">{item.description}</p>
        <div className="flex items-center gap-4">
          <span className="text-lg font-bold text-brand-primary">${item.price.toFixed(2)}</span>
          {item.isVegan && (
            <span className="bg-green-100 text-green-700 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">Vegan Option</span>
          )}
        </div>
      </div>
      <div className="relative w-32 h-32 rounded-3xl overflow-hidden shrink-0 shadow-lg shadow-brand-dark/5">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 cursor-pointer" onClick={onSelect} />
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[80%]">
          {cartItem ? (
            <div className="bg-white rounded-xl flex items-center justify-between p-1 shadow-lg border border-brand-dark/5">
              <button onClick={() => onUpdate(-1)} className="w-8 h-8 flex items-center justify-center text-brand-primary hover:bg-brand-accent/20 rounded-lg transition-colors">
                <Minus size={14} />
              </button>
              <span className="text-xs font-bold text-brand-dark">{cartItem.quantity}</span>
              <button onClick={() => onUpdate(1)} className="w-8 h-8 flex items-center justify-center text-brand-primary hover:bg-brand-accent/20 rounded-lg transition-colors">
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button 
              onClick={onAdd}
              className="w-full py-2 bg-white text-brand-primary text-[10px] font-bold rounded-xl uppercase tracking-widest shadow-lg border border-brand-dark/5 hover:bg-brand-primary hover:text-white transition-all active:scale-90"
            >
              Add to Order
            </button>
          )}
        </div>
      </div>
    </div>
    <div className="h-px bg-brand-dark/5 w-full"></div>
  </div>
);

const FoodDetailModal = ({ item, onClose, onAdd }: { item: MenuItem; onClose: () => void; onAdd: () => void }) => (
  <div className="fixed inset-0 z-[100] flex items-end justify-center">
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
    <motion.div 
      initial={{ y: '100%' }} 
      animate={{ y: 0 }} 
      exit={{ y: '100%' }} 
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="relative w-full max-w-md bg-brand-cream rounded-t-[40px] overflow-hidden shadow-2xl"
    >
      <div className="relative h-72">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        <button onClick={onClose} className="absolute top-6 right-6 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-brand-dark shadow-lg"><X size={20} /></button>
      </div>
      <div className="p-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest mb-1 block">{item.category}</span>
            <h2 className="text-3xl font-bold text-brand-dark">{item.name}</h2>
          </div>
          <span className="text-2xl font-black text-brand-primary">${item.price.toFixed(2)}</span>
        </div>
        <p className="text-brand-dark/60 text-sm leading-relaxed mb-8 italic">
          {item.description}
          <br /><br />
          Ingredients: Freshly sourced seasonal produce, artisanal spices, and the chef's secret touch.
        </p>
        <button onClick={onAdd} className="w-full py-5 editorial-gradient rounded-full text-white font-bold text-lg shadow-lg shadow-brand-primary/30 flex items-center justify-center gap-2 active:scale-95 transition-transform">
          <ShoppingBag size={20} /> Add to Order
        </button>
      </div>
    </motion.div>
  </div>
);
