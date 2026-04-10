import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, Clock, Heart, Filter, ArrowRight, ShoppingBag, UtensilsCrossed, X, Plus, Minus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, RESTAURANTS, FEATURED_ITEMS, MenuItem } from '../data/mockData';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const { wishlist, toggleWishlist, addToCart, cart, updateQuantity, setIsSearchOpen } = useApp();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedFood, setSelectedFood] = useState<MenuItem | null>(null);

  const filteredRestaurants = RESTAURANTS.filter(r => 
    (activeCategory === 'all' || r.category.toLowerCase() === activeCategory.toLowerCase())
  );

  const searchSuggestions: string[] = [];

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-brand-cream pb-24">
      {/* Header */}
      <header className="p-6 flex justify-between items-center sticky top-0 bg-brand-cream/80 backdrop-blur-md z-40">
        <div className="flex items-center gap-3">
          <Link to="/profile" className="w-10 h-10 rounded-full overflow-hidden border-2 border-brand-primary active:scale-90 transition-transform">
            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" alt="Profile" />
          </Link>
          <div>
            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-brand-dark/40">
              <MapPin size={10} className="text-brand-primary" />
              <span>Deliver To</span>
            </div>
            <h3 className="text-sm font-bold text-brand-dark">Home, 124 Gourmet Way</h3>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <h1 className="text-xl font-bold text-brand-primary leading-tight">
              Gourmet<br />Gazette
            </h1>
          </div>
          <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-primary/20">
            <UtensilsCrossed size={20} />
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="px-6 mb-8 relative">
        <div 
          onClick={() => setIsSearchOpen(true)}
          className="relative flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/30 group-hover:text-brand-primary transition-colors" size={20} />
            <div className="w-full bg-brand-dark/5 border border-brand-dark/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-brand-dark/30 group-hover:bg-brand-dark/10 transition-all">
              Search for recipes, chefs or cravings...
            </div>
          </div>
          <button className="w-12 h-12 bg-brand-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-primary/20 active:scale-90 transition-transform">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <div className="px-6 flex justify-between items-end mb-4">
          <h2 className="text-2xl font-bold text-brand-dark">Today's <span className="text-brand-primary italic">Cravings</span></h2>
          <button className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">View Editorial</button>
        </div>
        <div className="flex gap-4 overflow-x-auto px-6 hide-scrollbar pb-2">
          <CategoryItem 
            active={activeCategory === 'all'} 
            onClick={() => setActiveCategory('all')}
            icon="✨"
            name="All"
          />
          {CATEGORIES.map(cat => (
            <CategoryItem 
              key={cat.id}
              active={activeCategory === cat.id}
              onClick={() => setActiveCategory(cat.id)}
              icon={cat.icon}
              name={cat.name}
            />
          ))}
        </div>
      </div>

      {/* Featured Items */}
      <div className="mb-8">
        <div className="px-6 flex justify-between items-end mb-4">
          <h2 className="text-2xl font-bold text-brand-dark">Suggested for <span className="text-brand-primary italic">You</span></h2>
        </div>
        <div className="flex gap-6 overflow-x-auto px-6 hide-scrollbar">
          {FEATURED_ITEMS.map(item => (
            <FeaturedCard key={item.id} item={item} onSelect={() => setSelectedFood(item)} />
          ))}
        </div>
      </div>

      {/* Restaurants List */}
      <div className="px-6">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold text-brand-dark">Kitchens <span className="text-brand-primary italic">Nearby</span></h2>
          <button className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-brand-primary">
            See All <ArrowRight size={12} />
          </button>
        </div>
        <div className="space-y-6">
          {filteredRestaurants.map(restaurant => (
            <RestaurantCard 
              key={restaurant.id} 
              restaurant={restaurant} 
              isWishlisted={wishlist.includes(restaurant.id)}
              onWishlistToggle={() => toggleWishlist(restaurant.id)}
            />
          ))}
        </div>
      </div>

      {/* Food Detail Modal */}
      <AnimatePresence>
        {selectedFood && (
          <FoodDetailModal 
            item={selectedFood} 
            onClose={() => setSelectedFood(null)} 
            onAdd={() => {
              addToCart(selectedFood, RESTAURANTS[0]);
              setSelectedFood(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Floating Cart Button */}
      {cartCount > 0 && (
        <Link 
          to="/cart"
          className="fixed bottom-28 right-6 w-16 h-16 editorial-gradient rounded-full flex items-center justify-center text-white shadow-2xl z-50 group active:scale-90 transition-transform"
        >
          <ShoppingBag size={24} />
          <span className="absolute -top-1 -right-1 bg-brand-dark text-white text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-brand-cream">
            {cartCount}
          </span>
        </Link>
      )}
    </div>
  );
}

const CategoryItem = ({ active, onClick, icon, name }: any) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex flex-col items-center gap-2 min-w-[70px] transition-all duration-300",
      active ? "scale-110" : "opacity-60 grayscale"
    )}
  >
    <div className={cn(
      "w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-inner transition-all",
      active ? "bg-brand-accent/40 border-2 border-brand-primary" : "bg-brand-dark/5"
    )}>
      {icon}
    </div>
    <span className={cn(
      "text-[10px] font-bold uppercase tracking-widest",
      active ? "text-brand-primary" : "text-brand-dark"
    )}>{name}</span>
  </button>
);

interface FeaturedCardProps {
  item: any;
  onSelect: () => void;
  key?: string | number;
}

const FeaturedCard = ({ item, onSelect }: FeaturedCardProps) => {
  const { addToCart, cart, updateQuantity } = useApp();
  const restaurant = RESTAURANTS[0]; 
  const cartItem = cart.find(i => i.id === item.id);

  return (
    <div className="min-w-[280px] bg-white rounded-[32px] overflow-hidden shadow-xl shadow-brand-dark/5 border border-brand-dark/5 group">
      <div className="relative h-48 overflow-hidden cursor-pointer" onClick={onSelect}>
        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        {item.isSeasonal && (
          <span className="absolute top-4 left-4 bg-brand-primary/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
            Seasonal
          </span>
        )}
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-1 cursor-pointer" onClick={onSelect}>
          <h3 className="text-lg font-bold text-brand-dark">{item.name}</h3>
          <span className="text-brand-primary font-bold">${item.price.toFixed(2)}</span>
        </div>
        <p className="text-xs text-brand-dark/60 line-clamp-2 mb-4 italic">{item.description}</p>
        
        {cartItem ? (
          <div className="flex items-center justify-between bg-brand-dark/5 rounded-2xl p-1">
            <button 
              onClick={() => updateQuantity(item.id, -1)}
              className="w-10 h-10 flex items-center justify-center text-brand-primary hover:bg-brand-accent/20 rounded-xl transition-colors"
            >
              <Minus size={16} />
            </button>
            <span className="text-sm font-bold text-brand-dark">{cartItem.quantity}</span>
            <button 
              onClick={() => updateQuantity(item.id, 1)}
              className="w-10 h-10 flex items-center justify-center text-brand-primary hover:bg-brand-accent/20 rounded-xl transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => addToCart(item, restaurant)}
            className="w-full py-3 bg-brand-primary text-white text-xs font-bold rounded-2xl uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <ShoppingBag size={14} /> Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

interface RestaurantCardProps {
  restaurant: any;
  isWishlisted: boolean;
  onWishlistToggle: () => void;
  key?: string | number;
}

const RestaurantCard = ({ restaurant, isWishlisted, onWishlistToggle }: RestaurantCardProps) => (
  <Link to={`/restaurant/${restaurant.id}`} className="block bg-white rounded-[32px] p-4 flex gap-4 shadow-lg shadow-brand-dark/5 border border-brand-dark/5 active:scale-[0.98] transition-transform group">
    <div className="relative w-28 h-28 rounded-2xl overflow-hidden shrink-0">
      <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
      <button 
        onClick={(e) => {
          e.preventDefault();
          onWishlistToggle();
        }}
        className="absolute top-2 right-2 w-8 h-8 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-brand-primary shadow-sm active:scale-90 transition-transform"
      >
        <Heart size={14} fill={isWishlisted ? "currentColor" : "none"} />
      </button>
    </div>
    <div className="flex-1 py-1">
      <div className="flex justify-between items-start mb-1">
        <h3 className="font-bold text-brand-dark">{restaurant.name}</h3>
        <div className="flex items-center gap-1 bg-brand-accent/30 px-2 py-0.5 rounded-full">
          <Star size={10} className="text-brand-primary fill-brand-primary" />
          <span className="text-[10px] font-bold text-brand-primary">{restaurant.rating}</span>
        </div>
      </div>
      <p className="text-[10px] text-brand-dark/40 font-medium uppercase tracking-widest mb-3">
        {restaurant.category} • {restaurant.priceRange}
      </p>
      <div className="flex items-center gap-4 text-[10px] font-bold text-brand-dark/60">
        <div className="flex items-center gap-1">
          <Clock size={12} className="text-brand-primary" />
          <span>{restaurant.deliveryTime}</span>
        </div>
        <div className="flex items-center gap-1">
          <ShoppingBag size={12} className="text-brand-primary" />
          <span>{restaurant.deliveryFee === 0 ? 'Free Delivery' : `$${restaurant.deliveryFee.toFixed(2)} Fee`}</span>
        </div>
      </div>
    </div>
  </Link>
);

const FoodDetailModal = ({ item, onClose, onAdd }: { item: MenuItem; onClose: () => void; onAdd: () => void }) => (
  <div className="fixed inset-0 z-[100] flex items-end justify-center">
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="absolute inset-0 bg-black/60 backdrop-blur-sm"
    />
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="relative w-full max-w-md bg-brand-cream rounded-t-[40px] overflow-hidden shadow-2xl"
    >
      <div className="relative h-72">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-brand-dark shadow-lg"
        >
          <X size={20} />
        </button>
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
        <button 
          onClick={onAdd}
          className="w-full py-5 editorial-gradient rounded-full text-white font-bold text-lg shadow-lg shadow-brand-primary/30 flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <ShoppingBag size={20} /> Add to Order
        </button>
      </div>
    </motion.div>
  </div>
);
