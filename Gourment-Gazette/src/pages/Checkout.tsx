import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, ChevronRight, Ticket, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

export default function Checkout() {
  const { cart, placeOrder, addresses, paymentMethods } = useApp();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState('');
  const [isApplied, setIsApplied] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(addresses[0]?.id || '');
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0]?.id || '');

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = 2.99;
  const discount = isApplied ? subtotal * 0.5 : 0;
  const total = subtotal + deliveryFee - discount;

  const handleApplyCoupon = () => {
    if (coupon.toUpperCase() === 'FLAT50') {
      setIsApplied(true);
    } else {
      alert('Invalid coupon. Try FLAT50');
    }
  };

  const handlePlaceOrder = () => {
    if (!selectedAddress || !selectedPayment) {
      alert('Please select address and payment method');
      return;
    }
    placeOrder();
    navigate('/order-success');
  };

  return (
    <div className="min-h-screen bg-brand-cream pb-40">
      <header className="p-6 flex items-center gap-4 sticky top-0 bg-brand-cream/80 backdrop-blur-md z-40">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-brand-dark shadow-sm border border-brand-dark/5"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-brand-dark">Check<span className="text-brand-primary italic">out</span></h1>
      </header>

      <div className="px-6 space-y-8">
        {/* Delivery Address */}
        <section>
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40">Delivery Address</h2>
            <button onClick={() => navigate('/profile')} className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">Manage</button>
          </div>
          <div className="space-y-3">
            {addresses.map(addr => (
              <button 
                key={addr.id}
                onClick={() => setSelectedAddress(addr.id)}
                className={cn(
                  "w-full bg-white rounded-[32px] p-5 flex gap-4 border transition-all text-left",
                  selectedAddress === addr.id ? "border-brand-primary shadow-md" : "border-brand-dark/5 shadow-sm"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                  selectedAddress === addr.id ? "bg-brand-primary text-white" : "bg-brand-accent/30 text-brand-primary"
                )}>
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-brand-dark text-sm mb-1">{addr.label}</h3>
                  <p className="text-xs text-brand-dark/60 leading-relaxed line-clamp-2">{addr.address}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Payment Method */}
        <section>
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40">Payment Method</h2>
            <button onClick={() => navigate('/profile')} className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">Manage</button>
          </div>
          <div className="space-y-3">
            {paymentMethods.map(pm => (
              <PaymentOption 
                key={pm.id}
                active={selectedPayment === pm.id} 
                onClick={() => setSelectedPayment(pm.id)}
                icon={pm.type === 'card' ? <CreditCard size={20} /> : <img src="https://www.apple.com/favicon.ico" className="w-5 h-5" alt="Apple" />}
                title={pm.type === 'card' ? `•••• ${pm.last4}` : 'Apple Pay'}
                subtitle={pm.expiry || 'Connected'}
              />
            ))}
          </div>
        </section>

        {/* Coupon */}
        <section>
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40 mb-4">Apply Coupon</h2>
          <div className="relative">
            <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/30" size={20} />
            <input 
              type="text"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="Enter code (FLAT50)"
              className="w-full bg-white border border-brand-dark/10 rounded-2xl py-4 pl-12 pr-24 text-sm text-brand-dark placeholder:text-brand-dark/30 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all shadow-sm"
            />
            <button 
              onClick={handleApplyCoupon}
              disabled={isApplied}
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                isApplied ? "bg-green-500 text-white" : "bg-brand-dark text-white active:scale-95"
              )}
            >
              {isApplied ? 'Applied' : 'Apply'}
            </button>
          </div>
        </section>

        {/* Order Summary */}
        <section className="bg-white rounded-[32px] p-6 space-y-4 shadow-xl shadow-brand-dark/5 border border-brand-dark/5">
          <div className="flex justify-between text-sm">
            <span className="text-brand-dark/60 font-medium">Subtotal</span>
            <span className="text-brand-dark font-bold">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-brand-dark/60 font-medium">Delivery Fee</span>
            <span className="text-brand-dark font-bold">${deliveryFee.toFixed(2)}</span>
          </div>
          {isApplied && (
            <div className="flex justify-between text-sm text-green-600">
              <span className="font-medium">Discount (FLAT50)</span>
              <span className="font-bold">-${discount.toFixed(2)}</span>
            </div>
          )}
          <div className="h-px bg-brand-dark/5"></div>
          <div className="flex justify-between text-lg">
            <span className="text-brand-dark font-bold">Total Amount</span>
            <span className="text-brand-primary font-black">${total.toFixed(2)}</span>
          </div>
        </section>
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] z-50">
        <button 
          onClick={handlePlaceOrder}
          className="w-full py-5 editorial-gradient rounded-full text-white font-bold text-lg shadow-2xl shadow-brand-primary/30 flex items-center justify-center gap-2 group active:scale-95 transition-transform"
        >
          Place Order
          <CheckCircle2 size={20} className="group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
}

const PaymentOption = ({ active, onClick, icon, title, subtitle }: any) => (
  <button 
    onClick={onClick}
    className={cn(
      "w-full bg-white rounded-2xl p-4 flex items-center justify-between border transition-all",
      active ? "border-brand-primary shadow-md" : "border-brand-dark/5 shadow-sm"
    )}
  >
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-brand-dark/5 rounded-xl flex items-center justify-center text-brand-dark">
        {icon}
      </div>
      <div className="text-left">
        <h4 className="text-sm font-bold text-brand-dark">{title}</h4>
        <p className="text-[10px] text-brand-dark/40 font-medium uppercase tracking-widest">{subtitle}</p>
      </div>
    </div>
    <div className={cn(
      "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
      active ? "border-brand-primary bg-brand-primary" : "border-brand-dark/10"
    )}>
      {active && <div className="w-2 h-2 bg-white rounded-full" />}
    </div>
  </button>
);
