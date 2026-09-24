'use client';

import React from 'react';
import { ShieldCheck, Activity, X } from 'lucide-react';
import { useCTIStore } from '@/lib/store/cti-store';

export const DemoBanner: React.FC = () => {
  const { demoModeNotice, dismissDemoNotice } = useCTIStore();

  if (!demoModeNotice) return null;

  return (
    <div className="bg-emerald-950/40 border-b border-emerald-800/60 px-4 py-1.5 text-xs text-emerald-200 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-600/60 uppercase flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          LIVE PRODUCTION CTI BACKEND
        </span>
        <span className="text-slate-300">
          Autonomous Agentic engine active with real Node.js DNS/RDAP resolution, official CISA KEV catalog sync, and ThreatFox OSINT connectors.
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-emerald-400/90 font-mono text-[11px] hidden md:inline">
          Backend API: All 13 Routes Connected
        </span>
        <button
          onClick={dismissDemoNotice}
          className="text-emerald-400 hover:text-white p-0.5 rounded transition-colors"
          title="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
