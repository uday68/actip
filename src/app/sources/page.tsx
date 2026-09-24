'use client';

import React, { useState } from 'react';
import {
  Database,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ShieldCheck,
  Search,
  Sliders,
  ExternalLink
} from 'lucide-react';
import { mockSourceConnectors } from '@/lib/mock-data/pipeline';
import { SourceConnector } from '@/types/pipeline';
import { StatusBadge } from '@/components/common/StatusBadge';

export default function SourcesPage() {
  const [sources, setSources] = useState<SourceConnector[]>(mockSourceConnectors);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const toggleSource = (id: string) => {
    setSources(prev =>
      prev.map(s => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const syncSource = (id: string) => {
    setSyncingId(id);
    setTimeout(() => {
      setSources(prev =>
        prev.map(s =>
          s.id === id
            ? { ...s, lastSync: 'Just now', status: 'connected', recordsIngestedTotal: s.recordsIngestedTotal + 15 }
            : s
        )
      );
      setSyncingId(null);
    }, 1200);
  };

  return (
    <div className="max-w-[1600px] w-full mx-auto px-6 lg:px-10 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-950/80 border border-sky-700 text-sky-300 font-bold uppercase">
              Threat Intelligence Connectors
            </span>
            <span className="text-xs font-mono text-slate-500">STIX / TAXII / MISP / Open Source Feeds</span>
          </div>
          <h1 className="text-xl md:text-2xl font-mono font-bold text-slate-100 flex items-center gap-3">
            <span>Threat Feed & Source Provenance Management</span>
          </h1>
        </div>

        <button
          onClick={() => sources.forEach(s => syncSource(s.id))}
          className="px-3.5 py-1.5 rounded bg-[#0f1626] hover:bg-[#182338] border border-[#1e2a44] text-slate-200 text-xs font-mono flex items-center gap-2 transition-colors self-start shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${syncingId ? 'animate-spin text-sky-400' : ''}`} />
          <span>Sync All Feeds</span>
        </button>
      </div>

      {/* Grid of Feed Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sources.map(src => {
          const isSyncing = syncingId === src.id;

          return (
            <div
              key={src.id}
              className={`p-4 rounded-lg bg-[#0c111d] border transition-colors flex flex-col justify-between ${
                src.status === 'warning'
                  ? 'border-amber-800/60'
                  : src.status === 'error'
                  ? 'border-red-800/60'
                  : 'border-[#1d2940] hover:border-[#2a3c60]'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-mono font-bold text-slate-100 truncate">
                      {src.name}
                    </h3>
                    <span className="text-[10px] font-mono text-slate-400">
                      Format: {src.format}
                    </span>
                  </div>
                  <StatusBadge type="status" value={src.status} />
                </div>

                <div className="space-y-1.5 font-mono text-xs text-slate-300 bg-[#080d16] p-2.5 rounded border border-[#172338]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Feed Type:</span>
                    <span className="text-slate-200">{src.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Last Synchronization:</span>
                    <span className="text-slate-200">{src.lastSync}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">24h Ingested Volume:</span>
                    <span className="text-sky-400 font-bold">{src.recordsIngested24h.toLocaleString()} records</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Records:</span>
                    <span className="text-slate-200">{src.recordsIngestedTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Source Reliability:</span>
                    <span className="text-emerald-400 font-bold">{src.reliability}%</span>
                  </div>
                </div>

                {src.recentErrors.length > 0 && (
                  <div className="p-2 rounded bg-amber-950/30 border border-amber-800/50 text-[11px] font-mono text-amber-200">
                    <div className="font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-400" />
                      <span>{src.recentErrors[0].code}</span>
                    </div>
                    <p className="mt-0.5 text-amber-300/80 font-sans text-xs">
                      {src.recentErrors[0].message}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Controls */}
              <div className="pt-3 mt-3 border-t border-[#1a253a] flex items-center justify-between font-mono text-xs">
                <button
                  type="button"
                  onClick={() => toggleSource(src.id)}
                  className={`text-[11px] px-2 py-0.5 rounded border ${
                    src.enabled
                      ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60'
                      : 'bg-slate-900 text-slate-500 border-slate-800'
                  }`}
                >
                  {src.enabled ? 'ENABLED' : 'DISABLED'}
                </button>

                <button
                  type="button"
                  onClick={() => syncSource(src.id)}
                  disabled={isSyncing}
                  className="text-sky-400 hover:text-sky-300 flex items-center gap-1 text-[11px]"
                >
                  <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

