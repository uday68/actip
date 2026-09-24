'use client';

import React, { useState } from 'react';
import {
  SearchCode,
  Sparkles,
  Server,
  Globe,
  Binary,
  AlertTriangle,
  Bug,
  ShieldAlert,
  Play,
  RotateCcw,
  Zap,
  Info,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal
} from 'lucide-react';
import { useCTIStore } from '@/lib/store/cti-store';

export const InvestigationLauncher: React.FC = () => {
  const { startNewInvestigation, isInvestigating, resetInvestigation } = useCTIStore();
  const [indicatorsText, setIndicatorsText] = useState(
    '185.220.101.5\nquantum-defense.org\nCVE-2026-8912'
  );
  const [selectedType, setSelectedType] = useState('hybrid');
  const [isExpanded, setIsExpanded] = useState(false);

  const presets = [
    {
      label: 'Edge Gateway RCE & BlackVenom RAT',
      type: 'hybrid',
      indicators: '185.220.101.5\nquantum-defense.org\nCVE-2026-8912'
    },
    {
      label: 'Cryptocurrency BEC Spearphishing',
      type: 'hybrid',
      indicators: '194.26.29.112\nswift-wire-auth.com\nVelvetChollima'
    },
    {
      label: 'Double-Extortion Ransomware Hash',
      type: 'malware',
      indicators: '9e32a10b48f1029384756102938475610293847561029384\nCVE-2026-4401'
    }
  ];

  const handleLaunch = () => {
    if (!indicatorsText.trim() || isInvestigating) return;
    startNewInvestigation(indicatorsText);
  };

  return (
    <div className="bg-[#0c1220] border border-[#1e2d4a] rounded-xl shadow-xl transition-all overflow-hidden">
      {/* Sleek Launcher Header Bar */}
      <div className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-950/80 border border-sky-600/70 text-sky-400 flex items-center justify-center shrink-0">
            <SearchCode className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-mono font-bold text-slate-100 tracking-wide">
                Agentic Threat Investigation Launcher
              </h2>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                LIVE ENGINE
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              Dispatch multi-stage hypothesis testing, live DNS/RDAP resolution, CISA KEV lookups, and ATT&CK correlation.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-2 rounded-lg bg-[#111828] hover:bg-[#182338] border border-[#1f2e4c] text-slate-300 text-xs font-mono flex items-center gap-2 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-sky-400" />
            <span>{isExpanded ? 'Hide Options' : 'Configure Targets'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={resetInvestigation}
            className="px-3 py-2 rounded-lg bg-[#111828] hover:bg-[#182338] text-slate-300 text-xs font-mono border border-[#1f2e4c] flex items-center gap-1.5 transition-colors"
            title="Reset to completed baseline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            type="button"
            onClick={handleLaunch}
            disabled={isInvestigating || !indicatorsText.trim()}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-mono font-bold transition-all shadow-lg ${
              isInvestigating
                ? 'bg-amber-600/60 text-slate-100 cursor-not-allowed border border-amber-500/50'
                : 'bg-sky-500 hover:bg-sky-400 text-slate-950 cursor-pointer shadow-sky-950/50'
            }`}
          >
            {isInvestigating ? (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                <span>9-Stage Pipeline Running...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Run Autonomous Investigation</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Expandable Configuration Area */}
      {isExpanded && (
        <div className="p-5 md:p-6 bg-[#090d18] border-t border-[#18253d] space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <label className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-2">
              <span>Target Observables & Threat Indicators (IPs, Domains, CVEs, Hashes):</span>
            </label>

            {/* Indicator Type Selector */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'hybrid', label: 'Multi-Indicator / Hybrid' },
                { id: 'ip', label: 'IP / Domain' },
                { id: 'cve', label: 'CVE Exploit' },
                { id: 'malware', label: 'Malware / Hash' },
                { id: 'nl', label: 'Hypothesis / Natural Language' }
              ].map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedType(t.id)}
                  className={`px-3 py-1 rounded-md text-xs font-mono transition-colors ${
                    selectedType === t.id
                      ? 'bg-sky-950 text-sky-300 border border-sky-600 font-bold'
                      : 'bg-[#111828] text-slate-400 border border-[#1e2a42] hover:text-slate-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <textarea
            rows={3}
            value={indicatorsText}
            onChange={e => setIndicatorsText(e.target.value)}
            placeholder="e.g. 185.220.101.5&#10;quantum-defense.org&#10;CVE-2026-8912"
            className="w-full bg-[#060a12] border border-[#1c2a44] rounded-xl px-4 py-3 text-sm font-mono text-slate-100 focus:outline-none focus:border-sky-500 transition-colors leading-relaxed placeholder:text-slate-600"
          />

          {/* Preset Buttons */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1 mr-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Quick Presets:
            </span>
            {presets.map(p => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setIndicatorsText(p.indicators);
                  setSelectedType(p.type);
                }}
                className="px-3 py-1 rounded-lg bg-[#111726] border border-[#1f2f4c] text-xs font-mono text-slate-300 hover:border-sky-500 hover:text-white transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
