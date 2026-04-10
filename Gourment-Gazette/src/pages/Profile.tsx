import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, ShoppingBag, MapPin, CreditCard, ChevronRight, Settings, Bell, Star, Edit2, X, Check, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function Profile() {
  const { user, logout, orders, updateUser, addresses, removeAddress, addAddress, paymentMethods, removePaymentMethod, addPaymentMethod } = useApp();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const handleUpdateName = () => {
    updateUser({ name: newName });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-brand-cream pb-32">
      <header className="p-6 bg-brand-dark text-white rounded-b-[40px] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-brand-primary/20 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="relative z-10 flex flex-col items-center py-8">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full border-4 border-brand-primary p-1">
              <img 
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200" 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center text-white border-2 border-brand-dark">
              <Plus size={16} />
            </button>
          </div>
          
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input 
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-center font-bold text-xl outline-none focus:ring-2 focus:ring-brand-primary"
                autoFocus
              />
              <button onClick={handleUpdateName} className="p-2 bg-green-500 rounded-lg"><Check size={16} /></button>
              <button onClick={() => setIsEditing(false)} className="p-2 bg-red-500 rounded-lg"><X size={16} /></button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">{user?.name}</h2>
              <button onClick={() => setIsEditing(true)} className="text-white/40 hover:text-brand-primary transition-colors">
                <Edit2 size={16} />
              </button>
            </div>
          )}
          <p className="text-white/60 text-xs uppercase tracking-[0.2em] font-medium mt-1">{user?.email}</p>
        </div>
      </header>

      <div className="px-6 -mt-8 relative z-20 space-y-8">
        {/* Stats */}
        <div className="bg-white rounded-[32px] p-6 flex justify-around shadow-xl shadow-brand-dark/5 border border-brand-dark/5">
          <StatItem label="Orders" value={orders.length} />
          <div className="w-px h-10 bg-brand-dark/5 self-center"></div>
          <StatItem label="Points" value="1,240" />
          <div className="w-px h-10 bg-brand-dark/5 self-center"></div>
          <StatItem label="Reviews" value="12" />
        </div>

        {/* Recent Orders */}
        <section>
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40">Recent Orders</h2>
            <button className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">View All</button>
          </div>
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white rounded-[32px] p-8 text-center border border-brand-dark/5">
                <p className="text-sm text-brand-dark/40 italic">No orders yet. Start exploring!</p>
              </div>
            ) : (
              orders.slice(0, 3).map(order => (
                <div key={order.id} className="bg-white rounded-[32px] p-5 flex items-center justify-between shadow-lg shadow-brand-dark/5 border border-brand-dark/5 group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-accent/30 rounded-2xl flex items-center justify-center text-brand-primary">
                      <ShoppingBag size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-brand-dark text-sm">Order #{order.id}</h4>
                      <p className="text-[10px] text-brand-dark/40 font-medium uppercase tracking-widest">
                        {new Date(order.date).toLocaleDateString()} • ${order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase tracking-widest">
                      {order.status}
                    </span>
                    <ChevronRight size={16} className="text-brand-dark/20 group-hover:text-brand-primary transition-colors" />
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Addresses */}
        <section>
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40">Saved Addresses</h2>
            <button onClick={() => setShowAddressModal(true)} className="text-[10px] font-bold uppercase tracking-widest text-brand-primary flex items-center gap-1">
              <Plus size={12} /> Add New
            </button>
          </div>
          <div className="space-y-3">
            {addresses.map(addr => (
              <div key={addr.id} className="bg-white rounded-2xl p-4 flex items-center justify-between border border-brand-dark/5 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-brand-accent/20 rounded-xl flex items-center justify-center text-brand-primary">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-brand-dark">{addr.label}</h4>
                    <p className="text-[10px] text-brand-dark/40 font-medium truncate max-w-[180px]">{addr.address}</p>
                  </div>
                </div>
                <button onClick={() => removeAddress(addr.id)} className="text-red-500/40 hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Payments */}
        <section>
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40">Payment Methods</h2>
            <button onClick={() => setShowPaymentModal(true)} className="text-[10px] font-bold uppercase tracking-widest text-brand-primary flex items-center gap-1">
              <Plus size={12} /> Add New
            </button>
          </div>
          <div className="space-y-3">
            {paymentMethods.map(pm => (
              <div key={pm.id} className="bg-white rounded-2xl p-4 flex items-center justify-between border border-brand-dark/5 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-brand-dark/5 rounded-xl flex items-center justify-center text-brand-dark">
                    {pm.type === 'card' ? <CreditCard size={20} /> : <img src="https://www.apple.com/favicon.ico" className="w-5 h-5" alt="Apple" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-brand-dark">{pm.type === 'card' ? `•••• ${pm.last4}` : 'Apple Pay'}</h4>
                    <p className="text-[10px] text-brand-dark/40 font-medium uppercase tracking-widest">{pm.expiry || 'Connected'}</p>
                  </div>
                </div>
                <button onClick={() => removePaymentMethod(pm.id)} className="text-red-500/40 hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Menu Options */}
        <section className="space-y-3">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40 mb-4">Account Settings</h2>
          <MenuOption icon={<Bell size={20} />} label="Notifications" />
          <MenuOption icon={<Settings size={20} />} label="Preferences" />
          <button 
            onClick={handleLogout}
            className="w-full bg-red-50 text-red-600 rounded-2xl p-4 flex items-center gap-4 font-bold text-sm active:scale-95 transition-transform"
          >
            <LogOut size={20} />
            Logout
          </button>
        </section>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showAddressModal && (
          <SimpleModal title="Add Address" onClose={() => setShowAddressModal(false)}>
            <AddressForm onAdd={(data) => { addAddress(data); setShowAddressModal(false); }} />
          </SimpleModal>
        )}
        {showPaymentModal && (
          <SimpleModal title="Add Payment" onClose={() => setShowPaymentModal(false)}>
            <PaymentForm onAdd={(data) => { addPaymentMethod(data); setShowPaymentModal(false); }} />
          </SimpleModal>
        )}
      </AnimatePresence>
    </div>
  );
}

const StatItem = ({ label, value }: any) => (
  <div className="text-center">
    <p className="text-xl font-black text-brand-dark">{value}</p>
    <p className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40">{label}</p>
  </div>
);

const MenuOption = ({ icon, label }: any) => (
  <button className="w-full bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-brand-dark/5 active:scale-[0.98] transition-transform group">
    <div className="flex items-center gap-4">
      <div className="text-brand-primary">{icon}</div>
      <span className="text-sm font-bold text-brand-dark">{label}</span>
    </div>
    <ChevronRight size={18} className="text-brand-dark/20 group-hover:text-brand-primary transition-colors" />
  </button>
);

const SimpleModal = ({ title, children, onClose }: any) => (
  <div className="fixed inset-0 z-[100] flex items-end justify-center">
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
    <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="relative w-full max-w-md bg-brand-cream rounded-t-[40px] p-8 shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-brand-dark">{title}</h3>
        <button onClick={onClose} className="p-2 bg-brand-dark/5 rounded-full"><X size={20} /></button>
      </div>
      {children}
    </motion.div>
  </div>
);

const AddressForm = ({ onAdd }: any) => {
  const [label, setLabel] = useState('');
  const [address, setAddress] = useState('');
  return (
    <div className="space-y-4">
      <input value={label} onChange={e => setLabel(e.target.value)} placeholder="Label (e.g. Work)" className="w-full p-4 bg-white rounded-2xl border border-brand-dark/5 outline-none" />
      <textarea value={address} onChange={e => setAddress(e.target.value)} placeholder="Full Address" className="w-full p-4 bg-white rounded-2xl border border-brand-dark/5 outline-none h-32" />
      <button onClick={() => onAdd({ label, address, isDefault: false })} className="w-full py-4 bg-brand-primary text-white font-bold rounded-2xl">Save Address</button>
    </div>
  );
};

const PaymentForm = ({ onAdd }: any) => {
  const [last4, setLast4] = useState('');
  return (
    <div className="space-y-4">
      <input value={last4} onChange={e => setLast4(e.target.value)} placeholder="Last 4 Digits" maxLength={4} className="w-full p-4 bg-white rounded-2xl border border-brand-dark/5 outline-none" />
      <button onClick={() => onAdd({ type: 'card', last4, expiry: '12/28', isDefault: false })} className="w-full py-4 bg-brand-primary text-white font-bold rounded-2xl">Add Card</button>
    </div>
  );
};
