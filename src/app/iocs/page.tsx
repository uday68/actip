'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Binary,
  Globe,
  Server,
  ShieldAlert,
  Search,
  History,
  Activity,
  Calendar,
  FileCheck,
  ExternalLink,
  ChevronRight,
  Database,
  Crosshair,
  Bug,
  MapPin,
  Lock
} from 'lucide-react';
import { mockIocs } from '@/lib/mock-data/iocs';
import { IOCRecord } from '@/types/cti';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ConfidenceBar } from '@/components/common/ConfidenceBar';
import { useCTIStore } from '@/lib/store/cti-store';

export default function IocsPage() {
  const router = useRouter();
  const { startNewInvestigation } = useCTIStore();
  const [selectedIoc, setSelectedIoc] = useState<IOCRecord>(mockIocs[0]);
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'dns'
    | 'whois'
    | 'reputation'
    | 'malware'
    | 'actors'
    | 'campaigns'
    | 'geolocation'
    | 'timeline'
    | 'related'
    | 'evidence'
  >('overview');
  const [filterQuery, setFilterQuery] = useState('');

  const filteredList = mockIocs.filter(
    i =>
      i.indicator.toLowerCase().includes(filterQuery.toLowerCase()) ||
      i.type.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="max-w-[1600px] w-full mx-auto px-6 lg:px-10 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-950/80 border border-sky-700 text-sky-300 font-bold uppercase">
              IOC Intelligence Explorer
            </span>
            <span className="text-xs font-mono text-slate-500">Historical & Passive DNS Telemetry</span>
          </div>
          <h1 className="text-xl md:text-2xl font-mono font-bold text-slate-100 flex items-center gap-3">
            <span>Observable Threat Indicators</span>
          </h1>
        </div>

        <button
          onClick={() => {
            startNewInvestigation(selectedIoc.indicator);
            router.push('/investigate');
          }}
          className="px-4 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-slate-950 font-mono text-xs font-bold flex items-center gap-2 transition-colors self-start shadow-sm"
        >
          <span>Investigate in Agent Pipeline</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Grid: IOC Selector list on left, Deep-dive on right */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Indicator List & Search */}
        <div className="bg-[#0c111d] border border-[#1d2940] rounded-lg p-3 space-y-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={filterQuery}
              onChange={e => setFilterQuery(e.target.value)}
              placeholder="Filter observables..."
              className="w-full bg-[#080c14] border border-[#1e2a42] rounded pl-8 pr-3 py-1.5 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="space-y-1.5 max-h-[600px] overflow-y-auto">
            {filteredList.map(ioc => {
              const isSelected = selectedIoc.id === ioc.id;
              return (
                <button
                  key={ioc.id}
                  onClick={() => setSelectedIoc(ioc)}
                  className={`w-full text-left p-2.5 rounded border transition-colors ${
                    isSelected
                      ? 'bg-sky-950/60 border-sky-600/80 text-sky-200'
                      : 'bg-[#0a0f1b] border-[#182337] text-slate-300 hover:bg-[#121929]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700 uppercase">
                      {ioc.type}
                    </span>
                    <StatusBadge type="severity" value={ioc.severity} />
                  </div>
                  <div className="text-xs font-mono font-bold truncate">
                    {ioc.indicator}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 mt-1 flex items-center justify-between">
                    <span>Obs: {ioc.lastObserved.split(' ')[0]}</span>
                    <span className="text-red-400 font-bold">Rep: {ioc.reputationScore}%</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 3 Columns: Deep-dive Tabbed Explorer */}
        <div className="lg:col-span-3 bg-[#0c111d] border border-[#1d2940] rounded-lg p-5 shadow-lg space-y-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1b263b]">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 uppercase">
                  {selectedIoc.type.toUpperCase()}
                </span>
                <StatusBadge type="severity" value={selectedIoc.severity} />
                <span className="text-xs font-mono text-slate-500">
                  First Seen: {selectedIoc.firstObserved.split(' ')[0]}
                </span>
              </div>
              <h2 className="text-lg font-mono font-bold text-slate-100 mt-1">
                {selectedIoc.indicator}
              </h2>
            </div>

            <div className="w-48 shrink-0 bg-[#090d16] p-2.5 rounded border border-[#1b263b]">
              <ConfidenceBar score={selectedIoc.confidence} size="sm" />
            </div>
          </div>

          {/* 11 Tabs (User Prompt Specification) */}
          <div className="flex items-center gap-1.5 border-b border-[#1b263b] pb-2 overflow-x-auto text-xs font-mono">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'dns', label: 'Passive DNS' },
              { id: 'whois', label: 'WHOIS' },
              { id: 'reputation', label: 'Reputation' },
              { id: 'malware', label: 'Malware' },
              { id: 'actors', label: 'Threat Actors' },
              { id: 'campaigns', label: 'Campaigns' },
              { id: 'geolocation', label: 'Geolocation' },
              { id: 'timeline', label: 'Timeline' },
              { id: 'related', label: 'Related IOCs' },
              { id: 'evidence', label: 'Evidence' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-sky-950 text-sky-300 border border-sky-600/70 font-bold'
                    : 'bg-[#0f1422] text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Panels */}
          {activeTab === 'overview' && (
            <div className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div className="p-3 rounded bg-[#090d16] border border-[#1b263b]">
                  <span className="text-slate-500 block text-[10px] uppercase">ASN / Network Org</span>
                  <span className="text-slate-200 font-bold">{selectedIoc.asn || 'N/A'}</span>
                </div>
                <div className="p-3 rounded bg-[#090d16] border border-[#1b263b]">
                  <span className="text-slate-500 block text-[10px] uppercase">Country / Geolocation</span>
                  <span className="text-slate-200 font-bold">{selectedIoc.country || 'N/A'}</span>
                </div>
                <div className="p-3 rounded bg-[#090d16] border border-[#1b263b]">
                  <span className="text-slate-500 block text-[10px] uppercase">Malicious Reputation Score</span>
                  <span className="text-red-400 font-bold">{selectedIoc.reputationScore} / 100</span>
                </div>
              </div>

              <div className="p-3 rounded bg-[#090e18] border border-[#1a263c] space-y-2">
                <span className="text-slate-400 text-xs font-bold block">
                  Associated Threat Entities
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="p-2 rounded bg-[#0e1526] border border-[#1d2b45]">
                    <span className="text-slate-500 text-[10px] block">THREAT ACTORS:</span>
                    <span className="text-red-300 font-bold">{selectedIoc.associatedActors.join(', ') || 'None'}</span>
                  </div>
                  <div className="p-2 rounded bg-[#0e1526] border border-[#1d2b45]">
                    <span className="text-slate-500 text-[10px] block">MALWARE FAMILIES:</span>
                    <span className="text-purple-300 font-bold">{selectedIoc.associatedMalware.join(', ') || 'None'}</span>
                  </div>
                  <div className="p-2 rounded bg-[#0e1526] border border-[#1d2b45]">
                    <span className="text-slate-500 text-[10px] block">CAMPAIGNS:</span>
                    <span className="text-orange-300 font-bold">{selectedIoc.associatedCampaigns.join(', ') || 'None'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dns' && (
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>Historical Passive DNS Observations ({selectedIoc.dnsHistory.length} records)</span>
                <span>PDNS Sensor Fleet: Western Europe</span>
              </div>
              <div className="border border-[#1b263b] rounded overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-[#090d16] text-[10px] text-slate-500 uppercase border-b border-[#1b263b]">
                    <tr>
                      <th className="py-2 px-3">Record Type</th>
                      <th className="py-2 px-3">Resolved Value</th>
                      <th className="py-2 px-3">First Seen</th>
                      <th className="py-2 px-3">Last Seen</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#131c2d]">
                    {selectedIoc.dnsHistory.map((dns, dIdx) => (
                      <tr key={dIdx} className="hover:bg-[#0e1524]">
                        <td className="py-2 px-3 text-sky-400 font-bold">{dns.recordType}</td>
                        <td className="py-2 px-3 text-slate-200 font-bold">{dns.value}</td>
                        <td className="py-2 px-3 text-slate-400">{dns.firstSeen}</td>
                        <td className="py-2 px-3 text-slate-400">{dns.lastSeen}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'whois' && (
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded bg-[#090d16] border border-[#1b263b] space-y-2">
                <span className="text-slate-400 text-xs font-bold block">WHOIS Registration Records</span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>Registrar: <strong className="text-slate-200">{selectedIoc.whoisSummary.registrar}</strong></div>
                  <div>Registrant Org: <strong className="text-slate-200">{selectedIoc.whoisSummary.registrantOrg}</strong></div>
                  <div>Created Date: <strong className="text-slate-200">{selectedIoc.whoisSummary.created}</strong></div>
                  <div>Expiry Date: <strong className="text-slate-200">{selectedIoc.whoisSummary.expires}</strong></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reputation' && (
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded bg-[#090d16] border border-[#1b263b] space-y-2">
                <span className="text-slate-400 font-bold block">Multi-Feed Reputation Aggregation</span>
                <div className="flex items-center justify-between p-2 rounded bg-[#0d1424] border border-[#1a253a]">
                  <span>VirusTotal Engine Verdict:</span>
                  <span className="text-red-400 font-bold">34 / 72 Security Vendors Flagged</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-[#0d1424] border border-[#1a253a]">
                  <span>AlienVault OTX Pulse Score:</span>
                  <span className="text-orange-400 font-bold">4 Active Pulses (Arctic Ghost)</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-[#0d1424] border border-[#1a253a]">
                  <span>Internal Firewall Verdict:</span>
                  <span className="text-red-400 font-bold">14 Exploitation POSTs Blocked</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'malware' && (
            <div className="space-y-2 font-mono text-xs">
              {selectedIoc.associatedMalware.map(m => (
                <div key={m} className="p-3 rounded bg-[#090d16] border border-[#1b263b] flex items-center justify-between">
                  <span className="text-purple-300 font-bold">{m}</span>
                  <span className="text-[10px] text-emerald-400">96% Association Confidence</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'actors' && (
            <div className="space-y-2 font-mono text-xs">
              {selectedIoc.associatedActors.map(a => (
                <div key={a} className="p-3 rounded bg-[#090d16] border border-[#1b263b] flex items-center justify-between">
                  <span className="text-red-300 font-bold">{a}</span>
                  <span className="text-[10px] text-emerald-400">91% Attribution Score</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'campaigns' && (
            <div className="space-y-2 font-mono text-xs">
              {selectedIoc.associatedCampaigns.map(c => (
                <div key={c} className="p-3 rounded bg-[#090d16] border border-[#1b263b] flex items-center justify-between">
                  <span className="text-orange-300 font-bold">{c}</span>
                  <span className="text-[10px] text-sky-400">Active Campaign Infrastructure</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'geolocation' && (
            <div className="p-3 rounded bg-[#090d16] border border-[#1b263b] font-mono text-xs space-y-2">
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-sky-400" />
                <span>Geographic Location: {selectedIoc.country || 'Western Europe / Netherlands'}</span>
              </div>
              <div className="text-slate-400 text-[11px]">
                Autonomous System: {selectedIoc.asn || 'AS49870 (Solaris Networks BV)'}
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="p-3 rounded bg-[#090d16] border border-[#1b263b] font-mono text-xs space-y-2">
              <div className="text-slate-400">First Observed: {selectedIoc.firstObserved}</div>
              <div className="text-slate-400">Last Telemetry Beacon: {selectedIoc.lastObserved}</div>
              <div className="text-slate-400">Duration Active: 34 Days continuous</div>
            </div>
          )}

          {activeTab === 'related' && (
            <div className="space-y-2 font-mono text-xs">
              {selectedIoc.relatedIocs.map(rel => (
                <div key={rel.indicator} className="p-2.5 rounded bg-[#090d16] border border-[#1b263b] flex items-center justify-between">
                  <div>
                    <span className="text-slate-200 font-bold">{rel.indicator}</span>
                    <span className="text-[10px] text-slate-500 block">[{rel.relation}]</span>
                  </div>
                  <span className="text-emerald-400 font-bold">{rel.confidence}%</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'evidence' && (
            <div className="p-3 rounded bg-[#090d16] border border-[#1b263b] font-mono text-xs space-y-2">
              <span className="text-slate-400 block font-bold">Correlated Evidence IDs:</span>
              <div className="flex gap-2">
                {selectedIoc.evidenceIds.map(e => (
                  <span key={e} className="px-2 py-1 rounded bg-[#0e1628] border border-sky-900/50 text-sky-300 font-bold">
                    {e}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

