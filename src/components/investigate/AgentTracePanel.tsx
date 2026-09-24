'use client';

import React, { useState } from 'react';
import {
  Terminal,
  Clock,
  Wrench,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Cpu,
  ShieldCheck,
  Activity,
  Layers
} from 'lucide-react';
import { useCTIStore } from '@/lib/store/cti-store';

export const AgentTracePanel: React.FC = () => {
  const { activeInvestigation } = useCTIStore();
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const getTraceIcon = (level: string) => {
    switch (level) {
      case 'tool_call':
        return <Wrench className="w-4 h-4 text-sky-400" />;
      case 'correlation':
        return <Search className="w-4 h-4 text-cyan-400" />;
      case 'conflict':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'verification':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      default:
        return <Terminal className="w-4 h-4 text-slate-400" />;
    }
  };

  const filteredTraces = activeInvestigation.agentTraces.filter(trace => {
    if (levelFilter !== 'all' && trace.level !== levelFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        trace.action.toLowerCase().includes(q) ||
        (trace.tool && trace.tool.toLowerCase().includes(q)) ||
        (trace.details && trace.details.toLowerCase().includes(q)) ||
        (trace.target && trace.target.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="bg-[#0c1220] border border-[#1e2d4a] rounded-xl p-6 md:p-8 shadow-2xl space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#1b2844]">
        <div>
          <div className="flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-sky-400" />
            <h3 className="text-lg font-mono font-bold text-slate-100 uppercase tracking-wide">
              Audited Agent Operational Log & Trace Telemetry
            </h3>
          </div>
          <p className="text-sm text-slate-300 mt-1 leading-relaxed">
            Real-time auditable stream of autonomous actions, tool executions, and external API queries. Raw internal thinking is suppressed to maintain verifiable operational safety.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-800 px-3 py-1 rounded-md font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            CRYPTOGRAPHIC AUDIT SECURED
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search operational logs, tool names, targets..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#080d18] border border-[#1d2a44] rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'all', label: 'All Logs' },
            { id: 'tool_call', label: 'Tool Calls' },
            { id: 'correlation', label: 'Correlations' },
            { id: 'conflict', label: 'Conflicts' },
            { id: 'verification', label: 'Verifications' }
          ].map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => setLevelFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                levelFilter === f.id
                  ? 'bg-sky-950 text-sky-300 border border-sky-600 font-bold'
                  : 'bg-[#101728] text-slate-400 hover:text-slate-200 border border-[#1b263e]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Trace Log Entries */}
      <div className="bg-[#070b16] border border-[#17243c] rounded-xl p-4 md:p-5 max-h-[500px] overflow-y-auto space-y-3 font-mono">
        {filteredTraces.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            No operational trace events match the specified filter criteria.
          </div>
        ) : (
          filteredTraces.map((trace, idx) => (
            <div
              key={trace.id}
              className="p-3.5 rounded-lg bg-[#0c1220] border border-[#18263f] hover:border-sky-500/40 transition-colors flex items-start gap-4"
            >
              <div className="flex items-center gap-1.5 text-slate-400 text-xs shrink-0 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>{trace.timestamp}</span>
              </div>

              <div className="mt-0.5 shrink-0">{getTraceIcon(trace.level)}</div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-slate-100 font-semibold text-xs md:text-sm">
                    {trace.action}
                  </span>
                  {trace.tool && (
                    <span className="text-xs px-2 py-0.5 rounded bg-sky-950/90 text-sky-300 border border-sky-800">
                      Tool: {trace.tool}
                    </span>
                  )}
                  {trace.target && (
                    <span className="text-xs px-2 py-0.5 rounded bg-[#131b2e] text-slate-300 border border-[#203050]">
                      Target: {trace.target}
                    </span>
                  )}
                  {trace.recordsCount !== undefined && (
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                      {trace.recordsCount} records
                    </span>
                  )}
                </div>

                {trace.details && (
                  <p className="text-xs md:text-sm text-slate-300 font-sans leading-relaxed pt-0.5">
                    {trace.details}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400 pt-2 border-t border-[#162238] font-mono">
        <span>Security Note: System complies with NIST SP 800-61 audit traceability.</span>
        <span className="text-emerald-400 font-bold">Audit Ledger Digest: SHA256:7f9a2e88...</span>
      </div>
    </div>
  );
};
