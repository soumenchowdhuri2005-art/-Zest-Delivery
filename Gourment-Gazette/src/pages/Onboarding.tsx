import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, UtensilsCrossed } from 'lucide-react';
import { cn } from '../lib/utils';

const slides = [
  {
    title: "Gourmet Gazette",
    subtitle: "Your Cravings, Delivered.",
    description: "Discover the city's finest kitchens, curated like a premium food magazine.",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800",
    tags: ["Artisanal Pizza", "Gourmet Sushi", "Vegan Bowls"]
  },
  {
    title: "Handpicked Selection",
    subtitle: "Only the Best.",
    description: "We partner with top chefs and local gems to bring you a menu that's always exceptional.",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=800",
    tags: ["Chef's Choice", "Local Gems"]
  },
  {
    title: "Seamless Experience",
    subtitle: "Effortless Dining.",
    description: "From curation to your doorstep, every step is designed for your ultimate convenience.",
    image: "https://images.unsplash.com/photo-1526367790999-0150786486a9?auto=format&fit=crop&q=80&w=800",
    tags: ["Fast Delivery", "Live Tracking"]
  },
  {
    title: "Join the Table",
    subtitle: "Start Your Journey.",
    description: "Ready to explore the finest flavors in town? Let's get started.",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800",
    tags: ["Exclusive Offers", "Loyalty Rewards"]
  }
];

export default function Onboarding() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const next = () => {
    if (current === slides.length - 1) {
      localStorage.setItem('hasOnboarded', 'true');
      navigate('/auth');
    } else {
      setCurrent(prev => prev + 1);
    }
  };

  return (
    <div className="relative h-screen w-full bg-brand-primary overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <img 
            src={slides[current].image} 
            alt={slides[current].title}
            className="w-full h-[60%] object-cover brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-brand-primary/20" />
        </motion.div>
      </AnimatePresence>

      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute bottom-0 left-0 right-0 h-[55%] bg-brand-cream rounded-t-[40px] p-8 flex flex-col items-center text-center shadow-2xl"
      >
        <div className="mb-6 text-brand-primary">
          <UtensilsCrossed size={32} />
        </div>

        <motion.div
          key={current + 'text'}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-brand-primary font-bold tracking-widest uppercase text-sm mb-2">
            {slides[current].title}
          </h2>
          <h1 className="text-4xl font-black text-brand-dark leading-tight mb-4">
            {slides[current].subtitle.split(',').map((part, i) => (
              <span key={i} className={cn(i === 1 ? "text-brand-primary italic" : "")}>
                {part}{i === 0 && slides[current].subtitle.includes(',') ? ',' : ''}
                {i === 0 && <br />}
              </span>
            ))}
          </h1>
          <p className="text-brand-dark/70 text-lg leading-relaxed mb-8 max-w-xs mx-auto">
            {slides[current].description}
          </p>
        </motion.div>

        <div className="flex gap-2 mb-8">
          {slides.map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === current ? "w-8 bg-brand-primary" : "w-2 bg-brand-primary/20"
              )}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="w-full py-5 editorial-gradient rounded-full text-white font-bold text-lg shadow-lg shadow-brand-primary/30 flex items-center justify-center gap-2 group active:scale-95 transition-transform"
        >
          {current === slides.length - 1 ? 'Get Started' : 'Next'}
          <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {slides[current].tags.map(tag => (
            <span key={tag} className="px-4 py-1.5 bg-brand-accent/30 text-brand-dark text-xs font-semibold rounded-full uppercase tracking-wider">
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
