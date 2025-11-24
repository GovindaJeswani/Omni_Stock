/* eslint-disable no-unused-vars */
// D:\Adbms\omnistock\client\src\pages\Storefront.jsx
import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../lib/api';
import { Search, ChevronLeft, ChevronRight, Loader, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

const Storefront = () => {
    const [products, setProducts] = useState([]); 
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState(''); 
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const categories = ["All", "Electronics", "Fashion", "Home & Living", "Office Supplies"];
    
    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const data = await getProducts(1000, 0);
            setProducts(data);
            setLoading(false);
        };
        load();
    }, []);

    const filtered = products.filter(p => {
        const catMatch = !filterCategory || filterCategory === 'All' || p.category === filterCategory;
        const searchMatch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        return catMatch && searchMatch;
    });
    
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const currentItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* Modern Gradient Header */}
            <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-16 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <div className="container mx-auto relative z-10 text-center">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-extrabold tracking-tight mb-4"
                    >
                        Market<span className="text-blue-400">Place</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} delay={0.2}
                        className="text-gray-300 text-lg max-w-2xl mx-auto font-light"
                    >
                        AI-curated inventory. Real-time ACID transactions.
                    </motion.p>
                </div>
            </div>

            {/* Floating Filter Bar */}
            <div className="container mx-auto px-6 -mt-8 relative z-20">
                <motion.div 
                    initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                    className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 flex flex-col md:flex-row gap-4 items-center"
                >
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search for products..." 
                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm font-medium"
                            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
                        {categories.map(cat => (
                            <button 
                                key={cat}
                                onClick={() => { setFilterCategory(cat); setCurrentPage(1); }}
                                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap
                                    ${filterCategory === cat || (cat === 'All' && !filterCategory)
                                        ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20' 
                                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Product Grid */}
            <div className="container mx-auto px-6 mt-12">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <Loader className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                        <p className="text-gray-500 font-medium">Loading Inventory...</p>
                    </div>
                ) : (
                    <>
                        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {currentItems.map(p => <ProductCard key={p.product_id} product={p} />)}
                        </motion.div>
                        
                        {/* Pagination */}
                        {/* {totalPages > 1 && (
                            <div className="flex justify-center mt-16 gap-2">
                                <button disabled={currentPage===1} onClick={()=>setCurrentPage(c=>c-1)} className="p-3 rounded-xl border bg-white hover:bg-gray-50 disabled:opacity-50"><ChevronLeft size={20}/></button>
                                <div className="flex items-center px-6 font-medium text-gray-600 bg-white border rounded-xl">
                                    Page {currentPage} / {totalPages}
                                </div>
                                <button disabled={currentPage===totalPages} onClick={()=>setCurrentPage(c=>c+1)} className="p-3 rounded-xl border bg-white hover:bg-gray-50 disabled:opacity-50"><ChevronRight size={20}/></button>
                            </div>
                        )} */}
                    </>
                )}
            </div>
            {totalPages > 1 && (
                <div className="flex justify-center mt-16 gap-3">
                    <button disabled={currentPage===1} onClick={()=>setCurrentPage(c=>c-1)} className="p-3 rounded-xl border border-white/13 bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 transition-all">
                        <ChevronLeft size={20}/>
                    </button>
                    <span className="px-6 py-3 rounded-xl border border-white/13 bg-white/5 text-slate-300 font-mono text-sm flex items-center">
                        Page {currentPage} / {totalPages}
                    </span>
                    <button disabled={currentPage===totalPages} onClick={()=>setCurrentPage(c=>c+1)} className="p-3 rounded-xl border border-white/13 bg-white/5 hover:bg-white/12 text-white disabled:opacity-30 transition-all">
                        <ChevronRight size={20}/>
                    </button>
                </div>
            )}
        </div>
    );
};
export default Storefront;