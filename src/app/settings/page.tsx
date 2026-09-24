'use client';

import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  Database,
  Key,
  Sliders,
  Bell,
  RefreshCw,
  UserCheck,
  CheckCircle2
} from 'lucide-react';
import { useCTIStore } from '@/lib/store/cti-store';

export default function SettingsPage() {
  const { analystProfile, resetInvestigation } = useCTIStore();
  const [minConfidence, setMinConfidence] = useState(75);
  const [mockMode, setMockMode] = useState(true);
  const [autoResolveConflicts, setAutoResolveConflicts] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-10 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#1b263c]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-950/80 border border-sky-700 text-sky-300 font-bold uppercase">
              Configuration & Engine Parameters
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-mono font-bold text-slate-100">
            Platform Settings & Investigation Policies
          </h1>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-slate-950 font-mono text-xs font-bold flex items-center gap-2 transition-colors shadow-sm"
        >
          {saved ? <CheckCircle2 className="w-4 h-4 text-slate-950" /> : <Settings className="w-4 h-4" />}
          <span>{saved ? 'Saved!' : 'Save Configuration'}</span>
        </button>
      </div>

      <div className="space-y-5 font-mono text-xs">
        {/* Analyst Identity */}
        <div className="bg-[#0c111d] border border-[#1d2940] rounded-lg p-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-sky-400" />
            <span>Active Analyst Identity & Clearance</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-2.5 rounded bg-[#080c14] border border-[#172338]">
              <span className="text-slate-500 block text-[10px]">ANALYST OPERATOR:</span>
              <span className="text-slate-200 font-bold">{analystProfile.name}</span>
            </div>
            <div className="p-2.5 rounded bg-[#080c14] border border-[#172338]">
              <span className="text-slate-500 block text-[10px]">ORGANIZATIONAL ROLE:</span>
              <span className="text-slate-200">{analystProfile.role}</span>
            </div>
            <div className="p-2.5 rounded bg-[#080c14] border border-[#172338]">
              <span className="text-slate-500 block text-[10px]">SECURITY CLEARANCE:</span>
              <span className="text-amber-400 font-bold">{analystProfile.clearance}</span>
            </div>
            <div className="p-2.5 rounded bg-[#080c14] border border-[#172338]">
              <span className="text-slate-500 block text-[10px]">BADGE ID:</span>
              <span className="text-sky-300">{analystProfile.badgeId}</span>
            </div>
          </div>
        </div>

        {/* Inference & Evidence Verification Thresholds */}
        <div className="bg-[#0c111d] border border-[#1d2940] rounded-lg p-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span>Agentic Investigation Policies</span>
          </h3>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Minimum Claim Confidence Threshold:</span>
              <span className="text-emerald-400 font-bold">{minConfidence}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              value={minConfidence}
              onChange={e => setMinConfidence(Number(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500 font-sans">
              Claims with correlation confidence below this threshold will be flagged as &apos;Unverified Telemetry&apos; and require human analyst sign-off.
            </p>
          </div>

          <div className="pt-3 border-t border-[#182338] flex items-center justify-between">
            <div>
              <span className="text-slate-200 block">Automated Conflict Reconciliation</span>
              <span className="text-[11px] text-slate-500 font-sans">
                Allow engine to auto-reconcile low-severity attribution dissent using ISP ASN co-residency heuristic.
              </span>
            </div>
            <input
              type="checkbox"
              checked={autoResolveConflicts}
              onChange={e => setAutoResolveConflicts(e.target.checked)}
              className="w-4 h-4 accent-sky-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Backend & Mock Mode Toggle */}
        <div className="bg-[#0c111d] border border-[#1d2940] rounded-lg p-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <span>Backend Integration & Mock Service Layer</span>
          </h3>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-slate-200 block">Synthetic Demo Dataset Mode</span>
              <span className="text-[11px] text-slate-500 font-sans">
                Use built-in high-fidelity synthetic threat telemetry instead of live /api/* REST endpoints.
              </span>
            </div>
            <button
              onClick={() => setMockMode(!mockMode)}
              className={`px-3 py-1 rounded border text-xs font-mono font-bold ${
                mockMode
                  ? 'bg-amber-950/60 border-amber-600 text-amber-300'
                  : 'bg-emerald-950/60 border-emerald-600 text-emerald-300'
              }`}
            >
              {mockMode ? 'DEMO MOCK ACTIVE' : 'LIVE API (CONNECTED)'}
            </button>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                resetInvestigation();
                alert('Investigation cache and state reset to initial baseline.');
              }}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              Reset Platform Investigation Cache
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

