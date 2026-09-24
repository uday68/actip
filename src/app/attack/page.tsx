'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Layers,
  Search,
  ShieldAlert,
  Bug,
  Crosshair,
  FileCheck,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Info
} from 'lucide-react';
import { mockAttackMatrix } from '@/lib/mock-data/attack';
import { AttackTechnique } from '@/types/cti';
import { useCTIStore } from '@/lib/store/cti-store';

export default function AttackPage() {
  const router = useRouter();
  const { startNewInvestigation } = useCTIStore();
  const tactics = Object.keys(mockAttackMatrix);
  const [selectedTechnique, setSelectedTechnique] = useState<AttackTechnique>(
    mockAttackMatrix['Initial Access'][0]
  );
  const [search, setSearch] = useState('');

  return (
    <div className="max-w-[1600px] w-full mx-auto px-6 lg:px-10 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-950/80 border border-sky-700 text-sky-300 font-bold uppercase">
              MITRE ATT&CK Enterprise Matrix v15.1
            </span>
            <span className="text-xs font-mono text-slate-500">Tactics, Techniques & Procedures (TTPs)</span>
          </div>
          <h1 className="text-xl md:text-2xl font-mono font-bold text-slate-100 flex items-center gap-3">
            <span>Adversary Tactics & Techniques Navigator</span>
          </h1>
        </div>

        <button
          onClick={() => {
            startNewInvestigation(selectedTechnique.id);
            router.push('/investigate');
          }}
          className="px-4 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-slate-950 font-mono text-xs font-bold flex items-center gap-2 transition-colors self-start shadow-sm"
        >
          <span>Hunt Technique in Telemetry</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive Tactics & Techniques Matrix Grid */}
      <div className="bg-[#0c111d] border border-[#1d2940] rounded-lg p-4 shadow-lg space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#1a253a]">
          <h3 className="text-xs font-mono font-bold text-slate-100 uppercase tracking-wide flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Matrix Tactics Overview (Click technique to inspect)</span>
          </h3>
          <span className="text-[11px] font-mono text-slate-400">Enterprise Framework</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
          {tactics.map(tactic => (
            <div
              key={tactic}
              className="bg-[#080d16] border border-[#1a263c] rounded p-2.5 space-y-2 flex flex-col"
            >
              <div className="text-xs font-mono font-bold text-sky-300 border-b border-[#172337] pb-1 uppercase tracking-wider">
                {tactic}
              </div>
              <div className="space-y-1.5 flex-1">
                {mockAttackMatrix[tactic].map(tech => {
                  const isSelected = selectedTechnique.id === tech.id;
                  return (
                    <button
                      key={tech.id}
                      onClick={() => setSelectedTechnique(tech)}
                      className={`w-full text-left p-2 rounded border transition-colors ${
                        isSelected
                          ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                          : 'bg-[#0e1628] border-[#1a2842] text-slate-300 hover:bg-[#152038]'
                      }`}
                    >
                      <div className="text-[10px] font-mono text-emerald-400 font-bold">
                        {tech.id}
                      </div>
                      <div className="text-xs font-medium truncate mt-0.5">
                        {tech.name}
                      </div>
                      <div className="text-[9px] font-mono text-slate-500 mt-1">
                        {tech.evidenceCount} Evidences
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Technique Inspector Panel */}
      <div className="bg-[#0c111d] border border-[#1d2940] rounded-lg p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-[#1b263b]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-700 text-emerald-300 font-bold">
                {selectedTechnique.id}
              </span>
              <h2 className="text-base font-mono font-bold text-slate-100">
                {selectedTechnique.name}
              </h2>
            </div>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Tactic Domain: <span className="text-sky-300">{selectedTechnique.tactic}</span>
            </p>
          </div>

          <div className="p-2 rounded bg-[#090d16] border border-[#1b263b] text-xs font-mono text-slate-300 shrink-0">
            <span>Validated Telemetry Citations: </span>
            <strong className="text-emerald-400">{selectedTechnique.evidenceCount} sources</strong>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <span className="text-slate-400 font-mono text-[10px] block uppercase font-bold">
            Technique Description:
          </span>
          <p className="text-xs font-sans text-slate-300 leading-relaxed p-3 rounded bg-[#090e18] border border-[#182337]">
            {selectedTechnique.description}
          </p>
        </div>

        {/* Detection Guidance */}
        <div className="space-y-1">
          <span className="text-sky-400 font-mono text-[10px] block uppercase font-bold">
            Analyst Detection Guidance & SIEM Hunting Rule:
          </span>
          <p className="text-xs font-sans text-slate-200 leading-relaxed p-3 rounded bg-sky-950/20 border border-sky-800/50">
            {selectedTechnique.detectionGuidance}
          </p>
        </div>

        {/* Associated Threat Actors, Malware, and Campaigns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
          <div className="p-3 rounded bg-[#090d16] border border-[#1b263b] space-y-1.5">
            <span className="text-red-400 block text-[10px] uppercase flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" /> Associated Threat Actors:
            </span>
            <div className="space-y-1">
              {selectedTechnique.associatedActors.map(a => (
                <Link key={a} href="/actors" className="block text-slate-200 font-bold hover:text-sky-300">
                  {a}
                </Link>
              ))}
            </div>
          </div>

          <div className="p-3 rounded bg-[#090d16] border border-[#1b263b] space-y-1.5">
            <span className="text-purple-400 block text-[10px] uppercase flex items-center gap-1">
              <Bug className="w-3.5 h-3.5" /> Associated Malware:
            </span>
            <div className="space-y-1">
              {selectedTechnique.associatedMalware.map(m => (
                <Link key={m} href="/malware" className="block text-slate-200 font-bold hover:text-sky-300">
                  {m}
                </Link>
              ))}
            </div>
          </div>

          <div className="p-3 rounded bg-[#090d16] border border-[#1b263b] space-y-1.5">
            <span className="text-orange-400 block text-[10px] uppercase flex items-center gap-1">
              <Crosshair className="w-3.5 h-3.5" /> Observed Campaigns:
            </span>
            <div className="space-y-1">
              {selectedTechnique.observedCampaigns.map(c => (
                <Link key={c} href="/campaigns" className="block text-slate-200 font-bold hover:text-sky-300">
                  {c}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

