/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
"use client";
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Zap, TrendingDown, Clock, Package, Search, ArrowUpRight, Database, User, Lock, Play, Users } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { triggerDemandForecast, getForecastAnalytics, getProducts, getAdminStats, buyProduct } from '../lib/api'; 
import { motion, AnimatePresence } from 'framer-motion';

// --- Components ---
const GlassCard = ({ title, icon: Icon, children, className }) => (
    <div className={`glass-card rounded-2xl p-6 ${className}`}>
        {title && (
            <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400"><Icon size={20} /></div>
                <h3 className="font-semibold text-lg text-slate-200">{title}</h3>
            </div>
        )}
        {children}
    </div>
);

const StatCard = ({ label, value, subtext, gradient }) => (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:bg-white/5 transition-colors">
        <div className={`absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br ${gradient} opacity-20 blur-2xl rounded-full group-hover:scale-125 transition-transform duration-500`}></div>
        <p className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-4xl font-bold text-white mb-2">{value}</p>
        <p className="text-xs font-medium text-emerald-400 flex items-center gap-1"><ArrowUpRight size={12}/> {subtext}</p>
    </div>
);

// --- 1. OVERVIEW TAB ---
const AnalyticsOverview = () => {
    const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, lowStockCount: 0, activeSkus: 0 });
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        getAdminStats().then(setStats);
        // Generate pseudo-realistic trend data based on total revenue
        const data = Array.from({ length: 12 }, (_, i) => ({
            name: `Month ${i + 1}`,
            revenue: Math.floor(Math.random() * 5000) + 2000
        }));
        setChartData(data);
    }, []);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard label="Total Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} subtext="Real-time DB Sum" gradient="from-indigo-500 to-purple-500" />
                <StatCard label="Orders" value={stats.totalOrders} subtext="Partitioned Table" gradient="from-sky-500 to-cyan-500" />
                <StatCard label="Active Alerts" value={stats.lowStockCount} subtext="Low Stock (<20)" gradient="from-rose-500 to-orange-500" />
                <StatCard label="Active SKUs" value={stats.activeSkus} subtext="Products Listed" gradient="from-emerald-500 to-teal-500" />
            </div>
            
            <GlassCard title="Revenue Trends" icon={TrendingDown}>
                {/* FIX: Explicit height container for Recharts */}
                <div style={{ width: '100%', height: 400 }}>
                    <ResponsiveContainer>
                        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8" }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8" }} />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                            <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px" }} />
                            <Area type="monotone" dataKey="revenue" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </GlassCard>
        </div>
    );
};

// --- 2. CONCURRENCY VISUALIZER (Multi-User) ---
const ConcurrencyVisualizer = () => {
    const [products, setProducts] = useState([]);
    const [selected, setSelected] = useState(null);
    const [userCount, setUserCount] = useState(3);
    const [simulations, setSimulations] = useState([]); // Array of user states
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        getProducts(50, 0).then(d => { setProducts(d); if (d.length > 0) setSelected(d[0]); });
    }, []);

    const runMultiSim = async () => {
        if (!selected) return;
        setIsRunning(true);
        
        // Initialize users
        const newSims = Array.from({ length: userCount }, (_, i) => ({
            id: i, status: 'idle', log: 'Waiting...'
        }));
        setSimulations(newSims);

        // Run simulations with staggered starts
        const promises = newSims.map(async (_, i) => {
            const updateSim = (status, log) => {
                setSimulations(prev => prev.map(s => s.id === i ? { ...s, status, log } : s));
            };

            updateSim('request', 'Buying...');
            await new Promise(r => setTimeout(r, 500 + (i * 200))); // Stagger
            
            updateSim('lock', 'Acquiring Lock...');
            await new Promise(r => setTimeout(r, 1000)); // Simulate DB Lock wait

            try {
                updateSim('db', 'Updating Stock...');
                await buyProduct(selected.product_id, 1, `user${i}@demo.com`);
                updateSim('success', 'Commit Success');
            } catch (e) {
                updateSim('error', 'Rollback (Locked)');
            }
        });

        await Promise.all(promises);
        setIsRunning(false);
    };

    return (
        <GlassCard title="ACID Concurrency Stress Test" icon={Clock}>
            {/* Controls */}
            <div className="flex flex-wrap gap-4 mb-8 items-end">
                <div className="flex-1 min-w-[200px]">
                    <label className="text-xs text-slate-400 mb-2 block uppercase font-bold">Target Product</label>
                    
                <select 
                    onChange={e => setSelected(products.find(p => p.product_id === e.target.value))} 
                    className="w-full p-3 rounded-xl bg-slate-800 text-white border border-white/10 outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    {products.map(p => (
                    <option key={p.product_id} value={p.product_id} className="bg-slate-800 text-white">
                        {p.name} (Qty: {p.quantity})
                    </option>
                    ))}
                </select>
                </div>
                <div className="w-32">
                    <label className="text-xs text-slate-400 mb-2 block uppercase font-bold">Concurrent Users</label>
                    <div className="flex items-center bg-black/20 border border-white/10 rounded-xl p-1">
                        <Users size={16} className="ml-2 text-slate-400"/>
                        <input type="number" min="1" max="5" value={userCount} onChange={e => setUserCount(Math.min(5, Math.max(1, parseInt(e.target.value))))} className="w-full bg-transparent text-center text-white outline-none p-2"/>
                    </div>
                </div>
                <button onClick={runMultiSim} disabled={isRunning} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 transition-all">
                    <Play size={18} fill="currentColor" /> {isRunning ? 'Running...' : 'Start Test'}
                </button>
            </div>

            {/* Animation Stage */}
            <div className="space-y-4">
                {simulations.length === 0 && <div className="text-center text-slate-500 py-10">Select users and click Start to visualize locking.</div>}
                
                {simulations.map((sim) => (
                    <div key={sim.id} className="relative h-16 bg-slate-900/50 rounded-xl border border-white/5 flex items-center px-4 overflow-hidden">
                        {/* Track Lines */}
                        <div className="absolute top-1/2 left-16 right-16 h-0.5 bg-white/5"></div>
                        
                        {/* Labels */}
                        <div className="absolute left-4 z-10 flex flex-col items-center">
                            <div className="bg-slate-700 p-1.5 rounded-full"><User size={14} className="text-slate-300"/></div>
                            <span className="text-[10px] text-slate-500 font-mono">User {sim.id+1}</span>
                        </div>
                        <div className="absolute right-4 z-10 flex flex-col items-center">
                            <div className="bg-slate-700 p-1.5 rounded-full"><Database size={14} className="text-slate-300"/></div>
                            <span className="text-[10px] text-slate-500 font-mono">DB</span>
                        </div>

                        {/* Moving Packet */}
                        <motion.div 
                            initial={{ left: '5%' }}
                            animate={{ 
                                left: sim.status === 'idle' ? '5%' : sim.status === 'request' ? '30%' : sim.status === 'lock' ? '50%' : sim.status === 'db' ? '70%' : '90%',
                                backgroundColor: sim.status === 'success' ? '#10b981' : sim.status === 'error' ? '#f43f5e' : sim.status === 'lock' ? '#eab308' : '#6366f1'
                            }}
                            className="absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg z-20 transition-all duration-500"
                        >
                            {sim.status === 'lock' && <Lock size={12} className="text-black"/>}
                        </motion.div>

                        {/* Status Text */}
                        <div className="absolute left-1/2 -translate-x-1/2 top-1 text-[10px] font-mono text-slate-400">
                            {sim.log}
                        </div>
                    </div>
                ))}
            </div>
        </GlassCard>
    );
};

// --- 3. INVENTORY TAB (Virtual Scroll + Search) ---
const InventoryTable = () => {
    const [inv, setInv] = useState([]);
    const [search, setSearch] = useState('');
    useEffect(() => { getProducts(500, 0).then(setInv); }, []);

    return (
        <GlassCard title="Inventory Management" icon={Package} className="h-[80vh] flex flex-col">
            <div className="mb-4"><input type="text" placeholder="Search SKU..." className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-slate-200 outline-none" onChange={e => setSearch(e.target.value)} /></div>
            <div className="flex-1 overflow-y-auto border border-white/10 rounded-xl custom-scrollbar">
                <table className="w-full text-sm text-left text-slate-400">
                    <thead className="bg-slate-900 sticky top-0 z-10"><tr><th className="px-6 py-3">Product</th><th className="px-6 py-3">Stock</th><th className="px-6 py-3">Status</th></tr></thead>
                    <tbody className="divide-y divide-white/5">{inv.filter(i => i.name.toLowerCase().includes(search.toLowerCase())).map(i => (
                        <tr key={i.product_id}><td className="px-6 py-3 text-white">{i.name}</td><td className="px-6 py-3 font-mono text-emerald-400">{i.quantity}</td><td className="px-6 py-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase 
                                ${i.quantity === 0 ? 'bg-slate-700 text-slate-300' : 
                                i.quantity < 5 ? 'bg-rose-500/20 text-rose-400' : 
                                'bg-emerald-500/20 text-emerald-400'}`}>
                                {i.quantity === 0 ? 'OUT OF STOCK' : i.quantity < 5 ? 'CRITICAL' : 'IN STOCK'}
                            </span>                            
                        </td></tr>
                    ))}</tbody>
                </table>
            </div>
        </GlassCard>
    );
};

// --- 4. AI TAB ---
const AIForecastingControl = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => { getForecastAnalytics().then(setData).catch(console.error); }, []);
    const runAI = async () => { setLoading(true); await triggerDemandForecast(); const res = await getForecastAnalytics(); setData(res); setLoading(false); };
    return (
        <div className="grid md:grid-cols-3 gap-6">
            <GlassCard title="AI Control" icon={Zap} className="h-fit"><button onClick={runAI} disabled={loading} className="w-full py-3 rounded-xl font-bold text-white bg-indigo-600 disabled:opacity-50">{loading?'Running...':'Run Forecast'}</button></GlassCard>
            <GlassCard title="Results" icon={TrendingDown} className="md:col-span-2"><div className="overflow-x-auto"><table className="w-full text-sm text-left text-slate-400"><thead className="bg-white/5"><tr><th className="p-3">Product</th><th className="p-3">Demand</th></tr></thead><tbody>{data.slice(0,5).map((r,i)=><tr key={i}><td className="p-3 text-white">{r.name}</td><td className="p-3 text-sky-400">{r.predicted_demand}</td></tr>)}</tbody></table></div></GlassCard>
        </div>
    );
};

// --- MAIN LAYOUT ---
const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('analytics');
    const tabs = [{id:'analytics',label:'Overview',icon:LayoutDashboard},{id:'ai',label:'AI Engine',icon:Zap},{id:'concurrency',label:'Concurrency',icon:Clock},{id:'inventory',label:'Inventory',icon:Package}];
    return (
        <div className="flex flex-col lg:flex-row min-h-[85vh] gap-6">
            <aside className="w-full lg:w-64 flex-shrink-0"><div className="glass-card rounded-2xl p-2 sticky top-24">{tabs.map(t=><button key={t.id} onClick={()=>setActiveTab(t.id)} className={`w-full flex gap-3 p-3 rounded-xl text-sm font-medium transition-all mb-1 ${activeTab===t.id?'bg-indigo-600 text-white':'text-slate-400 hover:bg-white/5'}`}><t.icon size={18}/>{t.label}</button>)}</div></aside>
            <main className="flex-1 min-w-0">{activeTab==='analytics'&&<AnalyticsOverview/>}{activeTab==='ai'&&<AIForecastingControl/>}{activeTab==='concurrency'&&<ConcurrencyVisualizer/>}{activeTab==='inventory'&&<InventoryTable/>}</main>
        </div>
    );
};
export default AdminDashboard;