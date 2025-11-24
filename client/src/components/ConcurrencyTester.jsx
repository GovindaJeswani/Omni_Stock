/* eslint-disable no-unused-vars */
import React, { useState, useRef } from 'react';
import { buyProduct } from '../lib/api';
import { Clock, Loader, Play } from 'lucide-react';

const ConcurrencyTester = ({ productId, productName, initialStock }) => {
    const [log, setLog] = useState([]);
    const [running, setRunning] = useState(false);
    const logRef = useRef(null);

    const addLog = (type, msg, time) => {
        setLog(prev => [...prev, { type, msg, time }]);
        setTimeout(() => logRef.current?.scrollTo(0, 99999), 50);
    };

    const runSim = async () => {
        setRunning(true); setLog([]);
        addLog('info', `STARTING 5 CONCURRENT TXNS ON ${productName || 'Product'}...`);
        
        const promises = Array(5).fill(0).map(async (_, i) => {
            const start = Date.now();
            try {
                addLog('pending', `[Txn ${i+1}] Requesting lock...`);
                const res = await buyProduct(productId || 'demo', 1, `user${i}@test.com`);
                addLog('success', `[Txn ${i+1}] COMMIT (Stock: ${res.new_stock})`, Date.now()-start);
            } catch (e) {
                addLog('error', `[Txn ${i+1}] ROLLBACK (Locked)`, Date.now()-start);
            }
        });
        
        await Promise.all(promises);
        setRunning(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                <div>
                    <h4 className="font-bold text-indigo-300">ACID Transaction Stress Test</h4>
                    <p className="text-xs text-indigo-400/70">Simulates row-level locking collisions</p>
                </div>
                <button 
                    onClick={runSim} 
                    disabled={running}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-all disabled:opacity-50"
                >
                    {running ? <Loader size={16} className="animate-spin" /> : <Play size={16} />}
                    Start Test
                </button>
            </div>

            <div 
                ref={logRef}
                className="h-80 overflow-y-auto bg-black/40 rounded-xl border border-white/10 p-4 font-mono text-xs space-y-1 shadow-inner"
            >
                {log.length === 0 && <div className="text-slate-600 text-center mt-32">Ready to start simulation...</div>}
                {log.map((l, i) => (
                    <div key={i} className={`flex justify-between py-1 border-b border-white/5 ${l.type === 'success' ? 'text-emerald-400' : l.type === 'error' ? 'text-rose-400' : l.type === 'pending' ? 'text-sky-400' : 'text-slate-400'}`}>
                        <span>{l.msg}</span>
                        {l.time && <span className="opacity-50">{l.time}ms</span>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ConcurrencyTester;