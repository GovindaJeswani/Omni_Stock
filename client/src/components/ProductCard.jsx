/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { buyProduct, getRecommendations } from '../lib/api';
import { ShoppingBag, Check, X, Loader, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [recs, setRecs] = useState([]);

  // Fetch recommendations when the product loads
  useEffect(() => {
    getRecommendations(product.product_id)
      .then(setRecs)
      .catch(() => setRecs([]));
  }, [product.product_id]);

  // Handle the ACID Transaction "Buy" action
  const handleBuy = async () => {
    setLoading(true);
    try {
      // Hardcoded demo email for the simulation
      await buyProduct(product.product_id, 1, "demo@omnistock.com");
      setStatus('success');
    } catch (error) {
      console.error("Purchase failed:", error);
      setStatus('error');
    } finally {
      setLoading(false);
      // Reset status after 2 seconds so user can buy again
      setTimeout(() => setStatus(null), 2000);
    }
  };

  return (
    <motion.div 
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        whileHover={{ y: -5 }}
        className="glass-card rounded-2xl overflow-hidden group relative flex flex-col h-full"
    >
      {/* Glow Effect on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-sky-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-800">
          <img 
            src={product.image_url} 
            alt={product.name}
            onError={(e) => { e.target.src = "https://placehold.co/600x400/1e293b/334155?text=No+Image"; }}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Low Stock Badge */}
        {product.quantity < 5 && product.quantity > 0 && (
			<div className="absolute top-3 left-3 bg-rose-500/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg border border-rose-400/50">
				HURRY! ONLY {product.quantity} LEFT
			</div>
		)}
		{product.quantity === 0 && (
			<div className="absolute top-3 left-3 bg-slate-800/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full border border-white/20">
				SOLD OUT
			</div>
		)}
          
          {/* Price Badge */}
          <div className="absolute top-3 right-3 bg-slate-900/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/10">
            ${product.price}
          </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-1">
        {/* Category Pill */}
        <div className="mb-2">
            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider bg-sky-500/10 px-2 py-1 rounded-md border border-sky-500/20">
                {product.category}
            </span>
        </div>
        
        {/* Title */}
        <h3 className="font-semibold text-lg text-slate-100 leading-tight mb-2 line-clamp-1 group-hover:text-sky-300 transition-colors">
            {product.name}
        </h3>
        
        {/* Recommendations Section */}
        <div className="flex-1 min-h-[50px]">
             {recs.length > 0 && (
                <div className="mb-3">
                    <div className="flex items-center gap-1 mb-1.5 opacity-60">
                        <Sparkles size={10} className="text-purple-400" />
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Often bought with</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {recs.slice(0, 2).map((r, i) => (
                            <span key={i} className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-slate-300 truncate max-w-[120px]">
                                {r.name}
                            </span>
                        ))}
                    </div>
                </div>
             )}
        </div>
        
        {/* Footer Actions */}
        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between gap-3">
             <div className="text-xs font-medium text-slate-400">
                Stock: <span className={product.quantity < 20 ? "text-rose-400" : "text-emerald-400"}>{product.quantity}</span>
             </div>
             
             <button 
                onClick={handleBuy} 
                disabled={loading || product.quantity <= 0}
                className={`flex-1 h-9 rounded-lg text-xs font-bold uppercase tracking-wide flex items-center justify-center transition-all shadow-lg
                    ${status === 'success' ? 'bg-emerald-500 hover:bg-emerald-400 text-white' : 
                      status === 'error' ? 'bg-rose-500 hover:bg-rose-400 text-white' : 
                      'bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white'}`}
             >
                {loading ? <Loader size={14} className="animate-spin" /> : 
                 status === 'success' ? <><Check size={14} className="mr-1"/> DONE</> :
                 status === 'error' ? <><X size={14} className="mr-1"/> FAIL</> : 
                 <><ShoppingBag size={14} className="mr-1"/> BUY</>}
             </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;