'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldAlert,
  Search,
  Crosshair,
  Bug,
  Server,
  Layers,
  Globe,
  ExternalLink,
  ChevronRight,
  Calendar,
  Activity
} from 'lucide-react';
import { mockThreatActors } from '@/lib/mock-data/actors';
import { ThreatActor } from '@/types/cti';
import { ConfidenceBar } from '@/components/common/ConfidenceBar';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useCTIStore } from '@/lib/store/cti-store';

export default function ActorsPage() {
  const router = useRouter();
  const { startNewInvestigation } = useCTIStore();
  const [selectedActor, setSelectedActor] = useState<ThreatActor>(mockThreatActors[0]);
  const [search, setSearch] = useState('');

  const filtered = mockThreatActors.filter(
    a =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.aliases.some(alias => alias.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-[1600px] w-full mx-auto px-6 lg:px-10 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-950/80 border border-sky-700 text-sky-300 font-bold uppercase">
              Threat Actor Intelligence
            </span>
            <span className="text-xs font-mono text-slate-500">Adversary Dossiers & Diamond Model</span>
          </div>
          <h1 className="text-xl md:text-2xl font-mono font-bold text-slate-100 flex items-center gap-3">
            <span>Tracked Threat Actors</span>
          </h1>
        </div>

        <button
          onClick={() => {
            startNewInvestigation(selectedActor.name);
            router.push('/investigate');
          }}
          className="px-4 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-slate-950 font-mono text-xs font-bold flex items-center gap-2 transition-colors self-start shadow-sm"
        >
          <span>Investigate Adversary</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Actor Selector */}
        <div className="bg-[#0c111d] border border-[#1d2940] rounded-lg p-3 space-y-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search actors or aliases..."
              className="w-full bg-[#080c14] border border-[#1e2a42] rounded pl-8 pr-3 py-1.5 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="space-y-1.5">
            {filtered.map(actor => (
              <button
                key={actor.id}
                onClick={() => setSelectedActor(actor)}
                className={`w-full text-left p-3 rounded border transition-colors ${
                  selectedActor.id === actor.id
                    ? 'bg-sky-950/60 border-sky-600/80 text-sky-200'
                    : 'bg-[#0a0f1b] border-[#182337] text-slate-300 hover:bg-[#121929]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-xs">{actor.name}</span>
                  <StatusBadge type="severity" value="critical" />
                </div>
                <div className="text-[11px] font-mono text-slate-400 truncate">
                  Aliases: {actor.aliases.join(', ')}
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-1 flex items-center justify-between">
                  <span>Active: {actor.lastActive}</span>
                  <span className="text-emerald-400 font-bold">{actor.confidence.toUpperCase()}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right 2 Cols: Actor Dossier */}
        <div className="lg:col-span-2 bg-[#0c111d] border border-[#1d2940] rounded-lg p-5 shadow-lg space-y-5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-[#1b263b]">
            <div>
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-400" />
                <h2 className="text-lg font-mono font-bold text-slate-100">
                  {selectedActor.name}
                </h2>
                <StatusBadge type="severity" value="critical" />
              </div>
              <p className="text-xs font-mono text-slate-400 mt-1">
                Known Aliases: <span className="text-slate-200">{selectedActor.aliases.join(' • ')}</span>
              </p>
              <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                Origin / Geopolitical: {selectedActor.origin}
              </p>
            </div>

            <div className="w-48 shrink-0 bg-[#090d16] p-2.5 rounded border border-[#1b263b]">
              <ConfidenceBar score={selectedActor.evidenceStrength} size="sm" />
            </div>
          </div>

          {/* Description */}
          <div className="p-3 rounded bg-[#090e18] border border-[#1a263c] text-xs font-sans text-slate-300 leading-relaxed">
            {selectedActor.description}
          </div>

          {/* Targeted Sectors & Regions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
            <div className="p-3 rounded bg-[#090d16] border border-[#1b263b] space-y-1.5">
              <span className="text-slate-500 block text-[10px] uppercase">Targeted Industrial Sectors:</span>
              <div className="flex flex-wrap gap-1">
                {selectedActor.targetedSectors.map(sec => (
                  <span key={sec} className="px-2 py-0.5 rounded bg-[#10192a] border border-[#1d2d48] text-slate-200 text-[11px]">
                    {sec}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-3 rounded bg-[#090d16] border border-[#1b263b] space-y-1.5">
              <span className="text-slate-500 block text-[10px] uppercase">Targeted Geographic Regions:</span>
              <div className="flex flex-wrap gap-1">
                {selectedActor.targetedRegions.map(reg => (
                  <span key={reg} className="px-2 py-0.5 rounded bg-[#10192a] border border-[#1d2d48] text-slate-200 text-[11px]">
                    {reg}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Associated Malware & Campaigns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
            <div className="p-3 rounded bg-[#090d16] border border-[#1b263b] space-y-1.5">
              <span className="text-purple-400 block text-[10px] uppercase flex items-center gap-1">
                <Bug className="w-3.5 h-3.5" /> Associated Malware Families:
              </span>
              <div className="flex flex-wrap gap-1">
                {selectedActor.associatedMalware.map(m => (
                  <Link
                    key={m}
                    href="/malware"
                    className="px-2 py-0.5 rounded bg-purple-950/40 border border-purple-800/60 text-purple-300 text-[11px] hover:border-purple-500"
                  >
                    {m}
                  </Link>
                ))}
              </div>
            </div>

            <div className="p-3 rounded bg-[#090d16] border border-[#1b263b] space-y-1.5">
              <span className="text-orange-400 block text-[10px] uppercase flex items-center gap-1">
                <Crosshair className="w-3.5 h-3.5" /> Observed Threat Campaigns:
              </span>
              <div className="flex flex-wrap gap-1">
                {selectedActor.campaigns.map(c => (
                  <Link
                    key={c}
                    href="/campaigns"
                    className="px-2 py-0.5 rounded bg-orange-950/40 border border-orange-800/60 text-orange-300 text-[11px] hover:border-orange-500"
                  >
                    {c}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Infrastructure Metrics & MITRE ATT&CK Techniques */}
          <div className="p-3 rounded bg-[#090d16] border border-[#1b263b] font-mono text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Infrastructure Footprint:</span>
              <div className="flex gap-3 text-slate-300">
                <span>{selectedActor.infrastructureCount.ips} Active IPs</span>
                <span>{selectedActor.infrastructureCount.domains} Domains</span>
                <span>{selectedActor.sourcesCount} Verified Sources</span>
              </div>
            </div>
            <div className="pt-2 border-t border-[#182337] flex flex-wrap gap-1.5 items-center">
              <span className="text-emerald-400 text-[10px] mr-1 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" /> ATT&CK TTPs:
              </span>
              {selectedActor.techniques.map(t => (
                <Link
                  key={t}
                  href={`/attack?id=${t}`}
                  className="px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-[11px] hover:border-emerald-500"
                >
                  {t}
                </Link>
              ))}
            </div>
          </div>

          {/* Graph Pivot Action */}
          <div className="pt-2 flex items-center justify-between">
            <Link
              href="/graph"
              className="text-xs font-mono text-sky-400 hover:text-sky-300 flex items-center gap-1"
            >
              <span>View adversary cluster in Knowledge Graph</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

