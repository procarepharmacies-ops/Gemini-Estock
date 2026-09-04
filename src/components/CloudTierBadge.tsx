import React from "react";
import { Sparkles, Shield, Zap, Flame, Database } from "lucide-react";

export const CloudTierBadge: React.FC<{ score: number }> = ({ score }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 relative overflow-hidden shadow-sm">
      {/* Subtle Bento Background Geometric Graphic */}
      <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
        <div className="w-36 h-36 border-[12px] border-indigo-500 rounded-full"></div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Infrastructure Modernization Engine</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Cloud Migration & Scalability Forecast
          </h2>
          <p className="text-xs text-slate-400 max-w-xl mt-1 leading-relaxed">
            Refactoring 15 years of legacy SQL Server 2008 architecture for modern serverless and free cloud tiers.
          </p>
        </div>

        {/* Suitability Score Bento Tile */}
        <div className="shrink-0 flex items-center space-x-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl px-5 py-3">
          <div className="text-right">
            <span className="block text-[10px] uppercase tracking-widest text-slate-500 font-bold">Cloud Readiness</span>
            <span className="text-xs text-emerald-400 font-medium">Free Tier Viable</span>
          </div>
          <div className="w-px h-8 bg-slate-800"></div>
          <div className="text-3xl sm:text-4xl font-black italic text-white tracking-tight">
            {score}<span className="text-sm font-normal text-indigo-400 font-sans not-italic ml-0.5">/100</span>
          </div>
        </div>
      </div>

      {/* Free Tier highlights bento grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-800/80 relative z-10">
        <div className="flex items-start space-x-3 bg-slate-950/50 rounded-xl p-3 border border-slate-800/50">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-semibold text-white">Cloud Firestore</h5>
              <span className="text-[10px] font-mono text-indigo-400">NoSQL</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
              50,000 reads & 20,000 writes/day free. Decoupled JSON documents & real-time listeners.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3 bg-slate-950/50 rounded-xl p-3 border border-slate-800/50">
          <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0 mt-0.5">
            <Database className="w-4 h-4 text-sky-400" />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-semibold text-white">PostgreSQL 16+</h5>
              <span className="text-[10px] font-mono text-sky-400">SQL</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
              Modern relational DDL with pgcrypto UUIDv4, TIMESTAMPTZ, and zero locking bottlenecks.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3 bg-slate-950/50 rounded-xl p-3 border border-slate-800/50">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-semibold text-white">Serverless Scale</h5>
              <span className="text-[10px] font-mono text-emerald-400">Zero Idle</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
              Zero server upkeep, scale-to-zero when idle, automated failover and zero hardware licenses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
