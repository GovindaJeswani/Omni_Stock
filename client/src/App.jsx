/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import Storefront from './pages/Storefront';
import AdminDashboard from './pages/AdminDashboard';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, LayoutDashboard, Sparkles } from 'lucide-react';
import './index.css';

const Navbar = ({ currentView, setView }) => (
  <motion.nav 
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
  >
    <div className="max-w-7xl mx-auto glass-card rounded-2xl px-6 py-3 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-br from-indigo-500 to-sky-500 p-2 rounded-lg shadow-lg shadow-indigo-500/20">
           <ShoppingBag size={20} className="text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight">
          OmniStock <span className="text-sky-400 font-light">AI</span>
        </span>
      </div>
      
      <div className="flex bg-slate-800/50 p-1 rounded-xl border border-white/5">
        <NavButton 
          active={currentView === 'store'} 
          onClick={() => setView('store')} 
          icon={ShoppingBag} 
          label="Store" 
        />
        <NavButton 
          active={currentView === 'admin'} 
          onClick={() => setView('admin')} 
          icon={LayoutDashboard} 
          label="Admin" 
        />
      </div>
    </div>
  </motion.nav>
);

const NavButton = ({ active, onClick, icon: Icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex items-center px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative ${active ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}
  >
    {active && (
      <motion.div 
        layoutId="nav-pill"
        className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-sky-600 rounded-lg shadow-lg"
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    )}
    <span className="relative z-10 flex items-center gap-2">
      <Icon size={16} /> {label}
    </span>
  </button>
);

function App() {
  const [view, setView] = useState('admin'); 

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 pt-24 pb-10">
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none z-0"></div>
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <Navbar currentView={view} setView={setView} />
      
      <main className="relative z-10 container mx-auto px-4 max-w-7xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {view === 'store' ? <Storefront /> : <AdminDashboard />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;