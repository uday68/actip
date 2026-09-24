'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Crosshair,
  Search,
  ShieldAlert,
  Bug,
  AlertTriangle,
  Layers,
  Globe,
  ChevronRight,
  ExternalLink,
  Clock
} from 'lucide-react';
import { mockCampaigns } from '@/lib/mock-data/campaigns';
import { ThreatCampaign } from '@/types/cti';
import { ConfidenceBar } from '@/components/common/ConfidenceBar';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useCTIStore } from '@/lib/store/cti-store';

export default function CampaignsPage() {
  const router = useRouter();
  const { startNewInvestigation } = useCTIStore();
  const [selectedCampaign, setSelectedCampaign] = useState<ThreatCampaign>(mockCampaigns[0]);
  const [search, setSearch] = useState('');

  const filtered = mockCampaigns.filter(
    c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.codename.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1600px] w-full mx-auto px-6 lg:px-10 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-950/80 border border-sky-700 text-sky-300 font-bold uppercase">
              Threat Campaign Intelligence
            </span>
            <span className="text-xs font-mono text-slate-500">Coordinated Adversary Operations</span>
          </div>
          <h1 className="text-xl md:text-2xl font-mono font-bold text-slate-100 flex items-center gap-3">
            <span>Active Threat Campaigns</span>
          </h1>
        </div>

        <button
          onClick={() => {
            startNewInvestigation(selectedCampaign.name);
            router.push('/investigate');
          }}
          className="px-4 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-slate-950 font-mono text-xs font-bold flex items-center gap-2 transition-colors self-start shadow-sm"
        >
          <span>Investigate Campaign</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Selector */}
        <div className="bg-[#0c111d] border border-[#1d2940] rounded-lg p-3 space-y-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter campaigns..."
              className="w-full bg-[#080c14] border border-[#1e2a42] rounded pl-8 pr-3 py-1.5 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="space-y-1.5">
            {filtered.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCampaign(c)}
                className={`w-full text-left p-3 rounded border transition-colors ${
                  selectedCampaign.id === c.id
                    ? 'bg-sky-950/60 border-sky-600/80 text-sky-200'
                    : 'bg-[#0a0f1b] border-[#182337] text-slate-300 hover:bg-[#121929]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-xs">{c.name}</span>
                  <StatusBadge type="severity" value="high" />
                </div>
                <div className="text-[11px] font-mono text-slate-400 truncate">
                  Codename: {c.codename}
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-1 flex items-center justify-between">
                  <span>Started: {c.startDate}</span>
                  <span className="text-emerald-400 font-bold">{c.evidenceStrength}% Strength</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right 2 Cols: Campaign Dossier */}
        <div className="lg:col-span-2 bg-[#0c111d] border border-[#1d2940] rounded-lg p-5 shadow-lg space-y-5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-[#1b263b]">
            <div>
              <div className="flex items-center gap-2">
                <Crosshair className="w-5 h-5 text-orange-400" />
                <h2 className="text-lg font-mono font-bold text-slate-100">
                  {selectedCampaign.name}
                </h2>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-orange-950/60 border border-orange-800 text-orange-300">
                  {selectedCampaign.codename}
                </span>
              </div>
              <div className="text-xs font-mono text-slate-400 mt-1 flex gap-4">
                <span>Active Since: {selectedCampaign.startDate}</span>
                <span>Last Telemetry: {selectedCampaign.lastActivity}</span>
              </div>
            </div>

            <div className="w-48 shrink-0 bg-[#090d16] p-2.5 rounded border border-[#1b263b]">
              <ConfidenceBar score={selectedCampaign.evidenceStrength} size="sm" />
            </div>
          </div>

          {/* Targeting */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
            <div className="p-3 rounded bg-[#090d16] border border-[#1b263b] space-y-1">
              <span className="text-slate-500 block text-[10px] uppercase">Targeted Sectors:</span>
              <div className="text-slate-200">{selectedCampaign.targetSectors.join(' • ')}</div>
            </div>
            <div className="p-3 rounded bg-[#090d16] border border-[#1b263b] space-y-1">
              <span className="text-slate-500 block text-[10px] uppercase">Targeted Countries:</span>
              <div className="text-slate-200">{selectedCampaign.targetCountries.join(' • ')}</div>
            </div>
          </div>

          {/* Kill Chain Phases */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              Observed Cyber Kill Chain Phases
            </h4>
            <div className="space-y-2">
              {selectedCampaign.killChainPhases.map((phase, pIdx) => (
                <div
                  key={pIdx}
                  className="p-3 rounded bg-[#090e18] border border-[#182337] space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-sky-300">
                      Phase {pIdx + 1}: {phase.phase}
                    </span>
                    <div className="flex gap-1">
                      {phase.techniques.map(t => (
                        <span key={t} className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs font-sans text-slate-300 leading-relaxed">
                    {phase.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Associated Entities */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div className="p-2.5 rounded bg-[#090d16] border border-[#1b263b]">
              <span className="text-red-400 block text-[10px] uppercase">ACTORS:</span>
              <span className="text-slate-200 font-bold">{selectedCampaign.associatedActors.join(', ')}</span>
            </div>
            <div className="p-2.5 rounded bg-[#090d16] border border-[#1b263b]">
              <span className="text-purple-400 block text-[10px] uppercase">MALWARE:</span>
              <span className="text-slate-200 font-bold">{selectedCampaign.associatedMalware.join(', ')}</span>
            </div>
            <div className="p-2.5 rounded bg-[#090d16] border border-[#1b263b]">
              <span className="text-rose-400 block text-[10px] uppercase">CVES:</span>
              <span className="text-slate-200 font-bold">{selectedCampaign.cvesExploited.join(', ') || 'None'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

