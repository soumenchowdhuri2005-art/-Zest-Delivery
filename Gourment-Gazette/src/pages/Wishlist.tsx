import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight, Star, Clock, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RESTAURANTS } from '../data/mockData';

export default function Wishlist() {
  const { wishlist, toggleWishlist } = useApp();
  
  const savedRestaurants = RESTAURANTS.filter(r => wishlist.includes(r.id));

  if (savedRestaurants.length === 0) {
    return (
      <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center p-6 text-center">
        <div className="w-32 h-32 bg-brand-dark/5 rounded-full flex items-center justify-center text-brand-primary mb-6">
          <Heart size={48} />
        </div>
        <h2 className="text-2xl font-bold text-brand-dark mb-2">No favorites yet</h2>
        <p className="text-brand-dark/60 mb-8 max-w-xs">Start hearting the kitchens you love to see them here.</p>
        <Link 
          to="/"
          className="px-8 py-4 editorial-gradient rounded-full text-white font-bold uppercase tracking-widest shadow-lg active:scale-95 transition-transform"
        >
          Discover Kitchens
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream pb-32">
      <header className="p-6 flex items-center gap-4 sticky top-0 bg-brand-cream/80 backdrop-blur-md z-40">
        <h1 className="text-2xl font-bold text-brand-dark">Saved <span className="text-brand-primary italic">Kitchens</span></h1>
      </header>

      <div className="px-6 space-y-6">
        {savedRestaurants.map(restaurant => (
          <Link 
            key={restaurant.id} 
            to={`/restaurant/${restaurant.id}`} 
            className="block bg-white rounded-[32px] p-4 flex gap-4 shadow-lg shadow-brand-dark/5 border border-brand-dark/5 active:scale-[0.98] transition-transform group"
          >
            <div className="relative w-28 h-28 rounded-2xl overflow-hidden shrink-0">
              <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  toggleWishlist(restaurant.id);
                }}
                className="absolute top-2 right-2 w-8 h-8 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-brand-primary shadow-sm"
              >
                <Heart size={14} fill="currentColor" />
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
                  <span>Free Delivery</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
