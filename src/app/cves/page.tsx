'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  Search,
  ShieldAlert,
  Bug,
  Crosshair,
  CheckCircle2,
  XCircle,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  ExternalLink,
  Flame,
  ShieldCheck
} from 'lucide-react';
import { mockCves } from '@/lib/mock-data/cves';
import { CVERecord } from '@/types/cti';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useCTIStore } from '@/lib/store/cti-store';

export default function CvesPage() {
  const router = useRouter();
  const { startNewInvestigation } = useCTIStore();
  const [selectedCve, setSelectedCve] = useState<CVERecord>(mockCves[0]);
  const [search, setSearch] = useState('');

  const filtered = mockCves.filter(
    c =>
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1600px] w-full mx-auto px-6 lg:px-10 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-950/80 border border-sky-700 text-sky-300 font-bold uppercase">
              Vulnerability Intelligence & Exploitation (KEV)
            </span>
            <span className="text-xs font-mono text-slate-500">CISA Directives & Weaponization</span>
          </div>
          <h1 className="text-xl md:text-2xl font-mono font-bold text-slate-100 flex items-center gap-3">
            <span>CVE Intelligence Explorer</span>
          </h1>
        </div>

        <button
          onClick={() => {
            startNewInvestigation(selectedCve.id);
            router.push('/investigate');
          }}
          className="px-4 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-slate-950 font-mono text-xs font-bold flex items-center gap-2 transition-colors self-start shadow-sm"
        >
          <span>Investigate CVE Threat Chain</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Triple State Distinction Banner (Core User Principle) */}
      <div className="bg-[#0c111e] border border-[#1e2a44] rounded-lg p-3.5 text-xs font-mono">
        <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-2">
          CRITICAL TRIAGE PRINCIPLE: TRIPLE-STATE VULNERABILITY DISAMBIGUATION
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-2.5 rounded bg-[#080c14] border border-[#1b263b] flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-slate-300 font-bold">1</div>
            <div>
              <div className="text-slate-200 font-bold">Vulnerability Exists</div>
              <div className="text-[10px] text-slate-400">NVD & Vendor Catalog Record</div>
            </div>
          </div>
          <div className="p-2.5 rounded bg-[#080c14] border border-[#1b263b] flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-amber-950/80 border border-amber-700 flex items-center justify-center text-amber-300 font-bold">≠ 2</div>
            <div>
              <div className="text-amber-300 font-bold">Actively Exploited (In Wild)</div>
              <div className="text-[10px] text-slate-400">CISA KEV, Honeypots & Threat Feeds</div>
            </div>
          </div>
          <div className="p-2.5 rounded bg-[#080c14] border border-[#1b263b] flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-rose-950/80 border border-rose-700 flex items-center justify-center text-rose-300 font-bold">≠ 3</div>
            <div>
              <div className="text-rose-300 font-bold">Affects This Organization</div>
              <div className="text-[10px] text-slate-400">Internal Asset Inventory & Telemetry</div>
            </div>
          </div>
        </div>
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
              placeholder="Filter CVEs..."
              className="w-full bg-[#080c14] border border-[#1e2a42] rounded pl-8 pr-3 py-1.5 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="space-y-1.5">
            {filtered.map(cve => (
              <button
                key={cve.id}
                onClick={() => setSelectedCve(cve)}
                className={`w-full text-left p-3 rounded border transition-colors ${
                  selectedCve.id === cve.id
                    ? 'bg-sky-950/60 border-sky-600/80 text-sky-200'
                    : 'bg-[#0a0f1b] border-[#182337] text-slate-300 hover:bg-[#121929]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-xs">{cve.id}</span>
                  <StatusBadge type="severity" value={cve.severity} />
                </div>
                <div className="text-[11px] font-mono text-slate-400 truncate">
                  {cve.title}
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-1 flex items-center justify-between">
                  <span>CVSS: {cve.cvss}</span>
                  <span className={cve.cisaKev ? 'text-red-400 font-bold' : 'text-slate-400'}>
                    {cve.cisaKev ? 'CISA KEV: YES' : 'No KEV'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right 2 Cols: CVE Intelligence Dossier */}
        <div className="lg:col-span-2 bg-[#0c111d] border border-[#1d2940] rounded-lg p-5 shadow-lg space-y-5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-[#1b263b]">
            <div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <h2 className="text-lg font-mono font-bold text-slate-100">
                  {selectedCve.id}
                </h2>
                <StatusBadge type="severity" value={selectedCve.severity} />
              </div>
              <h3 className="text-xs font-semibold text-slate-200 mt-1 font-sans">
                {selectedCve.title}
              </h3>
              <div className="text-xs font-mono text-slate-400 mt-1 flex gap-4">
                <span>Published: {selectedCve.publishedDate}</span>
                <span>Modified: {selectedCve.modifiedDate}</span>
              </div>
            </div>

            <div className="p-2.5 rounded bg-[#090d16] border border-[#1b263b] text-center font-mono shrink-0">
              <span className="text-[10px] text-slate-500 block">CVSS v3.1 BASE</span>
              <span className="text-xl font-bold text-rose-400">{selectedCve.cvss}</span>
            </div>
          </div>

          {/* Tri-State Assessment Indicators for This Specific CVE */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-xs">
            <div className="p-2.5 rounded bg-[#080d16] border border-[#19243a]">
              <span className="text-slate-500 block text-[10px]">1. VULNERABILITY STATUS</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed Disclosed
              </span>
            </div>
            <div className="p-2.5 rounded bg-[#080d16] border border-[#19243a]">
              <span className="text-slate-500 block text-[10px]">2. EXPLOITATION IN WILD</span>
              <span className={selectedCve.knownExploitation ? 'text-red-400 font-bold flex items-center gap-1 mt-0.5' : 'text-slate-400 flex items-center gap-1 mt-0.5'}>
                {selectedCve.knownExploitation ? <Flame className="w-3.5 h-3.5 fill-current" /> : <XCircle className="w-3.5 h-3.5" />}
                {selectedCve.knownExploitation ? 'Actively Exploited (KEV)' : 'No Public Exploits'}
              </span>
            </div>
            <div className="p-2.5 rounded bg-[#080d16] border border-[#19243a]">
              <span className="text-slate-500 block text-[10px]">3. ORGANIZATIONAL IMPACT</span>
              <span className={
                selectedCve.affectsOrganization === 'confirmed'
                  ? 'text-rose-400 font-bold flex items-center gap-1 mt-0.5'
                  : selectedCve.affectsOrganization === 'suspected'
                  ? 'text-amber-400 font-bold flex items-center gap-1 mt-0.5'
                  : 'text-slate-400 flex items-center gap-1 mt-0.5'
              }>
                <AlertTriangle className="w-3.5 h-3.5" />
                {selectedCve.affectsOrganization === 'confirmed'
                  ? 'Confirmed Affected (DMZ)'
                  : selectedCve.affectsOrganization === 'suspected'
                  ? 'Suspected Assets'
                  : 'No Internal Exposure'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <span className="text-slate-400 font-mono text-[10px] block uppercase font-bold">
              Vulnerability Description:
            </span>
            <p className="text-xs font-sans text-slate-300 leading-relaxed p-3 rounded bg-[#090e18] border border-[#182337]">
              {selectedCve.description}
            </p>
          </div>

          {/* Remediation */}
          <div className="space-y-1">
            <span className="text-emerald-400 font-mono text-[10px] block uppercase font-bold">
              Recommended Remediation & Mitigating Controls:
            </span>
            <p className="text-xs font-sans text-slate-200 leading-relaxed p-3 rounded bg-emerald-950/20 border border-emerald-800/50">
              {selectedCve.remediation}
            </p>
          </div>

          {/* Affected Products */}
          <div className="p-3 rounded bg-[#090d16] border border-[#1b263b] font-mono text-xs space-y-1.5">
            <span className="text-slate-500 block text-[10px] uppercase">Affected Products & CPEs:</span>
            <div className="space-y-1">
              {selectedCve.affectedProducts.map(p => (
                <div key={p} className="text-slate-200 text-xs">
                  • {p}
                </div>
              ))}
            </div>
          </div>

          {/* Threat Entity Corroboration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
            <div className="p-2.5 rounded bg-[#090d16] border border-[#1b263b]">
              <span className="text-red-400 block text-[10px] uppercase">THREAT ACTORS:</span>
              <span className="text-slate-200 font-bold">{selectedCve.associatedActors.join(', ') || 'None'}</span>
            </div>
            <div className="p-2.5 rounded bg-[#090d16] border border-[#1b263b]">
              <span className="text-purple-400 block text-[10px] uppercase">MALWARE:</span>
              <span className="text-slate-200 font-bold">{selectedCve.associatedMalware.join(', ') || 'None'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

