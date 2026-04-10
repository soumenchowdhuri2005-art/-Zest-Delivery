import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, MapPin, UtensilsCrossed, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      login(email, isLogin ? undefined : name);
      navigate('/');
    }
  };

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    setTimeout(() => {
      login('google.user@gmail.com', 'Google User');
      setIsGoogleLoading(false);
      navigate('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-brand-cream p-6 flex flex-col">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-primary/20">
            <UtensilsCrossed size={24} />
          </div>
          <h1 className="text-2xl font-bold text-brand-primary leading-tight">
            Gourmet<br />Gazette
          </h1>
        </div>
        <div className="flex items-center gap-2 text-brand-dark/60 text-sm font-medium">
          <MapPin size={16} className="text-brand-primary" />
          <span>Global Kitchens</span>
        </div>
      </header>

      <div className="relative mb-12">
        <div className="w-full aspect-[4/3] rounded-[40px] overflow-hidden shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800" 
            alt="Welcome"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-8">
            <h2 className="text-white text-4xl font-bold mb-2">{isLogin ? "Welcome\nBack" : "Join the\nTable"}</h2>
            <p className="text-white/80 text-sm">The digital gastronome awaits your discovery.</p>
          </div>
        </div>
      </div>

      <div className="bg-brand-dark/5 rounded-full p-1 flex mb-8">
        <button 
          onClick={() => setIsLogin(true)}
          className={cn(
            "flex-1 py-3 rounded-full text-sm font-bold transition-all",
            isLogin ? "bg-white text-brand-primary shadow-md" : "text-brand-dark/60"
          )}
        >
          Login
        </button>
        <button 
          onClick={() => setIsLogin(false)}
          className={cn(
            "flex-1 py-3 rounded-full text-sm font-bold transition-all",
            !isLogin ? "bg-white text-brand-primary shadow-md" : "text-brand-dark/60"
          )}
        >
          Register
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {!isLogin && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-2"
          >
            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/60 ml-4">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/30" size={18} />
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jean-Luc Picard"
                className="w-full bg-brand-dark/5 border-none rounded-3xl py-4 pl-12 pr-4 text-brand-dark placeholder:text-brand-dark/20 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                required={!isLogin}
              />
            </div>
          </motion.div>
        )}

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/60 ml-4">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/30" size={18} />
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="gourmet@gazette.com"
              className="w-full bg-brand-dark/5 border-none rounded-3xl py-4 pl-12 pr-4 text-brand-dark placeholder:text-brand-dark/20 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center px-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/60">Password</label>
            {isLogin && <button type="button" className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">Forgot Password?</button>}
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/30" size={18} />
            <input 
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-brand-dark/5 border-none rounded-3xl py-4 pl-12 pr-12 text-brand-dark placeholder:text-brand-dark/20 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
              required
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-dark/30"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button 
          type="submit"
          className="w-full py-5 editorial-gradient rounded-full text-white font-bold text-lg shadow-lg shadow-brand-primary/30 flex items-center justify-center gap-2 group active:scale-95 transition-transform"
        >
          {isLogin ? "Enter the Kitchen" : "Create Account"}
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </form>

      <div className="mt-8 relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-brand-dark/10"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
          <span className="bg-brand-cream px-4 text-brand-dark/30">Or Continue With</span>
        </div>
      </div>

      <button 
        onClick={handleGoogleLogin}
        disabled={isGoogleLoading}
        className="mt-8 w-full py-4 bg-white border border-brand-dark/10 rounded-full flex items-center justify-center gap-3 font-bold text-brand-dark shadow-sm active:scale-95 transition-transform disabled:opacity-50"
      >
        {isGoogleLoading ? (
          <div className="w-5 h-5 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
        ) : (
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
        )}
        {isGoogleLoading ? "Connecting..." : "Continue with Google"}
      </button>

      <p className="mt-auto pt-8 text-center text-sm text-brand-dark/60">
        {isLogin ? "New to the table?" : "Already have a seat?"}
        <button 
          onClick={() => setIsLogin(!isLogin)}
          className="ml-2 text-brand-primary font-bold"
        >
          {isLogin ? "Create New Account" : "Login to Account"}
        </button>
      </p>
    </div>
  );
}
