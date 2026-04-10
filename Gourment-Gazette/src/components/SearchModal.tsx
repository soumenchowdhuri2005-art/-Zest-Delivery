import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Star, Clock, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { RESTAURANTS, CATEGORIES, FEATURED_ITEMS } from '../data/mockData';
import { cn } from '../lib/utils';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen } = useApp();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setSearch('');
    }
  }, [isSearchOpen]);

  const results = useMemo(() => {
    if (search.length < 1 && activeCategory === 'all') return { restaurants: [], dishes: [] };

    const searchLower = search.toLowerCase();
    
    const restaurants = RESTAURANTS.filter(r => {
      const matchesSearch = r.name.toLowerCase().includes(searchLower) || 
                           r.category.toLowerCase().includes(searchLower) ||
                           r.description.toLowerCase().includes(searchLower);
      
      const matchesCategory = activeCategory === 'all' || 
                             r.category.toLowerCase() === activeCategory.toLowerCase() ||
                             r.menu.some(m => m.category.toLowerCase() === activeCategory.toLowerCase());
      
      return (search.length > 0 ? matchesSearch : true) && matchesCategory;
    });

    const allDishes = [...FEATURED_ITEMS];
    RESTAURANTS.forEach(r => allDishes.push(...r.menu));

    const dishes = allDishes.filter(d => {
      const matchesSearch = d.name.toLowerCase().includes(searchLower) || 
                           d.description.toLowerCase().includes(searchLower) ||
                           d.category.toLowerCase().includes(searchLower);
      
      const matchesCategory = activeCategory === 'all' || d.category.toLowerCase() === activeCategory.toLowerCase();
      
      return (search.length > 0 ? matchesSearch : true) && matchesCategory;
    });

    // Remove duplicates from dishes (since some featured items might be in restaurant menus)
    const uniqueDishes = Array.from(new Map(dishes.map(item => [item.id, item])).values());

    return { restaurants, dishes: uniqueDishes };
  }, [search, activeCategory]);

  const handleNavigate = (path: string) => {
    setIsSearchOpen(false);
    navigate(path);
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-brand-cream overflow-hidden">
          {/* Header */}
          <header className="p-6 pb-2 bg-brand-cream/80 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-4 mb-6">
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="w-10 h-10 rounded-full bg-brand-dark/5 flex items-center justify-center text-brand-dark"
              >
                <X size={20} />
              </button>
              <h2 className="text-xl font-bold text-brand-dark">Search <span className="text-brand-primary italic">Kitchens</span></h2>
            </div>

            <div className="relative group">
              <div className={cn(
                "absolute inset-0 bg-brand-primary/20 blur-xl opacity-0 transition-opacity duration-500 rounded-2xl",
                search.length > 0 && "opacity-100"
              )} />
              <div className="relative flex items-center gap-3 bg-white p-2 border border-brand-dark/5 rounded-[24px] shadow-sm group-focus-within:shadow-xl group-focus-within:border-brand-primary/20 transition-all duration-300">
                <div className="flex-1 relative flex items-center">
                  <Search className="absolute left-3 text-brand-dark/30 pointer-events-none" size={20} />
                  <input 
                    ref={inputRef}
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search for restaurants, dishes..."
                    className="w-full bg-transparent border-none py-3 pl-11 pr-4 text-brand-dark placeholder:text-brand-dark/30 focus:ring-0 outline-none text-base"
                  />
                  {search.length > 0 && (
                    <button 
                      onClick={() => setSearch('')}
                      className="absolute right-2 text-brand-dark/30 hover:text-brand-dark transition-colors"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {/* Categories */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-brand-dark/40">Categories</h3>
              </div>
              <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
                <button 
                  onClick={() => setActiveCategory('all')}
                  className={cn(
                    "px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all",
                    activeCategory === 'all' 
                      ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20" 
                      : "bg-white text-brand-dark/60 border border-brand-dark/5 hover:border-brand-primary/20"
                  )}
                >
                  All
                </button>
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={cn(
                      "px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                      activeCategory === cat.id 
                        ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20" 
                        : "bg-white text-brand-dark/60 border border-brand-dark/5 hover:border-brand-primary/20"
                    )}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Results */}
            <div className="space-y-8 pb-24">
              {(results.restaurants.length > 0 || results.dishes.length > 0) ? (
                <>
                  {/* Restaurants */}
                  {results.restaurants.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-brand-dark/40">
                        Kitchens ({results.restaurants.length})
                      </h3>
                      {results.restaurants.map((restaurant, idx) => (
                        <motion.div
                          key={restaurant.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          onClick={() => handleNavigate(`/restaurant/${restaurant.id}`)}
                          className="group bg-white rounded-[32px] p-4 flex gap-4 cursor-pointer hover:shadow-xl hover:shadow-brand-dark/5 transition-all duration-300 border border-brand-dark/5"
                        >
                          <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                            <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          </div>
                          <div className="flex-1 py-1">
                            <div className="flex justify-between items-start mb-1">
                              <h3 className="font-bold text-brand-dark transition-colors group-hover:text-brand-primary">{restaurant.name}</h3>
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
                              <div className="flex items-center gap-1 text-brand-primary">
                                <span>Visit Kitchen</span>
                                <ArrowRight size={10} />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Dishes */}
                  {results.dishes.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-brand-dark/40">
                        Dishes & Cravings ({results.dishes.length})
                      </h3>
                      <div className="grid grid-cols-1 gap-4">
                        {results.dishes.map((item, idx) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: (results.restaurants.length + idx) * 0.05 }}
                            className="bg-white rounded-3xl p-3 flex gap-4 border border-brand-dark/5 hover:border-brand-primary/20 transition-all group cursor-pointer"
                          >
                            <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            </div>
                            <div className="flex-1 flex flex-col justify-center">
                              <div className="flex justify-between items-start">
                                <h4 className="font-bold text-brand-dark group-hover:text-brand-primary transition-colors">{item.name}</h4>
                                <span className="text-brand-primary font-bold text-sm">${item.price.toFixed(2)}</span>
                              </div>
                              <p className="text-[10px] text-brand-dark/60 italic line-clamp-1">{item.description}</p>
                              <div className="mt-2 flex items-center justify-between">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-brand-dark/40 bg-brand-dark/5 px-2 py-0.5 rounded-full">{item.category}</span>
                                <button className="text-white bg-brand-primary w-6 h-6 rounded-full flex items-center justify-center shadow-lg shadow-brand-primary/20 active:scale-90 transition-transform">
                                  <ShoppingBag size={12} />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : search.length > 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-20 h-20 bg-brand-dark/5 rounded-full flex items-center justify-center text-brand-dark/20 mb-4">
                    <Search size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-brand-dark mb-2">No results for "{search}"</h3>
                  <p className="text-brand-dark/40 text-sm max-w-[200px]">Try searching with a different keyword or category.</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary mb-4">
                    <Search size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-brand-dark mb-2">Search Gourmet Gazette</h3>
                  <p className="text-brand-dark/40 text-sm max-w-[200px]">Find your favorite kitchens and cuisines nearby.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
