'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CalendarDays,
  Filter,
  Search,
  Server,
  Globe,
  Binary,
  Bug,
  ShieldAlert,
  AlertTriangle,
  Layers,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';
import { StatusBadge } from '@/components/common/StatusBadge';
import { EntityPill } from '@/components/common/EntityPill';

interface TimelineEvent {
  id: string;
  year: string;
  date: string;
  title: string;
  category: 'infrastructure' | 'malware' | 'actor' | 'vulnerability' | 'campaign';
  entityType: 'ip' | 'domain' | 'malware' | 'actor' | 'cve' | 'campaign';
  entityLabel: string;
  source: string;
  description: string;
  details: string;
  confidence: number;
}

const mockTimelineData: TimelineEvent[] = [
  {
    id: 'ev-1',
    year: '2026',
    date: '2026-09-15 22:14 UTC',
    title: 'Active TLS 1.3 C2 Beaconing Observed on 185.220.101.5',
    category: 'infrastructure',
    entityType: 'ip',
    entityLabel: '185.220.101.5:8443',
    source: 'DMZ Perimeter Firewall & EDR Logs',
    description: 'Internal endpoints in DMZ cluster triggered alert on outbound TLS beacon matching BlackVenom JARM fingerprint.',
    details: 'Firewall session #91024 captured 14 POST transactions before connection was severed by automated perimeter ACL block.',
    confidence: 96
  },
  {
    id: 'ev-2',
    year: '2026',
    date: '2026-09-12 11:30 UTC',
    title: 'Weaponized BlackVenom RAT v3.2 Payload Detonated in Sandbox',
    category: 'malware',
    entityType: 'malware',
    entityLabel: 'BlackVenom RAT v3.2',
    source: 'Cuckoo Sandbox Cluster #4',
    description: 'Dynamic execution of dropped DLL confirmed in-memory NTDLL unhooking and direct system call execution to evade EDR hooks.',
    details: 'Payload attempted memory dump of LSASS process and staged encrypted RAR archives in AppData\\Local\\Temp.',
    confidence: 98
  },
  {
    id: 'ev-3',
    year: '2026',
    date: '2026-09-05 14:00 UTC',
    title: 'CISA Emergency Directive 26-02 Adds CVE-2026-8912 to KEV',
    category: 'vulnerability',
    entityType: 'cve',
    entityLabel: 'CVE-2026-8912',
    source: 'CISA KEV Catalog Feed',
    description: 'Federal binding operational directive requiring emergency mitigation of unauthenticated edge gateway RCE within 14 calendar days.',
    details: 'Vulnerability affects EdgeSecure Gateway OS v11.2 - v12.4 with active exploitation reported by foreign defense entities.',
    confidence: 100
  },
  {
    id: 'ev-4',
    year: '2026',
    date: '2026-09-01 10:20 UTC',
    title: 'Domain quantum-defense.org Configured with A-Record to 185.220.101.5',
    category: 'infrastructure',
    entityType: 'domain',
    entityLabel: 'quantum-defense.org',
    source: 'Passive DNS Sensor Network',
    description: 'First observed DNS resolution of spoofed defense contractor procurement portal to Solaris Networks VPS hosting.',
    details: 'SSL certificate registered with Let\'s Encrypt with subject alternative names for *.quantum-defense.org.',
    confidence: 94
  },
  {
    id: 'ev-5',
    year: '2026',
    date: '2026-06-15 08:00 UTC',
    title: 'Operation Arctic Ghost Campaign Inception Identified',
    category: 'campaign',
    entityType: 'campaign',
    entityLabel: 'Operation Arctic Ghost',
    source: 'European Aerospace ISAC Bulletin',
    description: 'Coordinated spearphishing and edge scanning campaign detected targeting defense industrial base suppliers across Western Europe.',
    details: 'Adversary leveraged bespoke DLL side-loading wrappers and legitimate VPS subnet proxy leasing.',
    confidence: 89
  },
  {
    id: 'ev-6',
    year: '2025',
    date: '2025-11-20 16:45 UTC',
    title: 'Early BlackVenom Prototype Observed in Eastern Europe Intrusions',
    category: 'malware',
    entityType: 'malware',
    entityLabel: 'BlackVenom RAT (Proto-1)',
    source: 'CERT-EU Threat Report #25-412',
    description: 'First historic telemetry citing modular malware with custom TLS encryption routines attributed to APT-84.',
    details: 'Sample lacked NTDLL unhooking capabilities present in modern 2026 variants.',
    confidence: 85
  },
  {
    id: 'ev-7',
    year: '2024',
    date: '2024-08-10 12:00 UTC',
    title: 'APT-84 Infrastructure Cluster Subnet Allocation',
    category: 'actor',
    entityType: 'actor',
    entityLabel: 'APT-84 (RedBanshee)',
    source: 'BGP Routing History / RIPE NCC',
    description: 'Commercial IP block registration at Solaris Networks BV historically associated with state-sponsored reconnaissance.',
    details: 'Initial footprint utilized for passive port scanning of European defense contractors.',
    confidence: 82
  }
];

export default function TimelinePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIds, setExpandedIds] = useState<string[]>(['ev-1', 'ev-2']);

  const toggleExpand = (id: string) => {
    setExpandedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filteredEvents = mockTimelineData.filter(evt => {
    const matchCat = selectedCategory === 'all' || evt.category === selectedCategory;
    const matchYear = selectedYear === 'all' || evt.year === selectedYear;
    const matchSearch =
      searchQuery.trim() === '' ||
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.entityLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchYear && matchSearch;
  });

  return (
    <div className="max-w-[1600px] w-full mx-auto px-6 lg:px-10 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-950/80 border border-sky-700 text-sky-300 font-bold uppercase">
              Temporal Threat Intelligence
            </span>
            <span className="text-xs font-mono text-slate-500">Multi-Year Chronological Provenance</span>
          </div>
          <h1 className="text-xl md:text-2xl font-mono font-bold text-slate-100 flex items-center gap-3">
            <span>Threat Activity Timeline</span>
          </h1>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#0c111d] border border-[#1d2940] rounded-lg p-3.5 shadow flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-400">Category:</span>
          {['all', 'infrastructure', 'malware', 'vulnerability', 'campaign', 'actor'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded transition-colors uppercase text-[11px] ${
                selectedCategory === cat
                  ? 'bg-sky-950 text-sky-300 border border-sky-600/80 font-bold'
                  : 'bg-[#101726] text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">Year:</span>
          {['all', '2026', '2025', '2024'].map(yr => (
            <button
              key={yr}
              onClick={() => setSelectedYear(yr)}
              className={`px-2 py-0.5 rounded transition-colors text-[11px] ${
                selectedYear === yr
                  ? 'bg-sky-950 text-sky-300 border border-sky-600/80 font-bold'
                  : 'bg-[#101726] text-slate-400 border border-slate-800'
              }`}
            >
              {yr}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-6 md:pl-10 space-y-6 before:absolute before:left-3 md:before:left-5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#1c2944]">
        {filteredEvents.map(evt => {
          const isExpanded = expandedIds.includes(evt.id);

          return (
            <div key={evt.id} className="relative group">
              {/* Timeline Marker Dot */}
              <div className="absolute -left-6 md:-left-10 top-3 w-6 h-6 rounded-full bg-[#080d16] border-2 border-sky-500 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              </div>

              {/* Event Card */}
              <div className="bg-[#0c111d] border border-[#1d2940] rounded-lg p-4 shadow-lg hover:border-[#2a3c60] transition-colors space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold text-sky-400">
                      {evt.date}
                    </span>
                    <EntityPill type={evt.entityType} label={evt.entityLabel} />
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 uppercase">
                      {evt.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                    <span>Source: <strong className="text-slate-200">{evt.source}</strong></span>
                    <button
                      onClick={() => toggleExpand(evt.id)}
                      className="p-1 rounded text-slate-400 hover:text-white"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-slate-100 font-sans">
                  {evt.title}
                </h3>
                <p className="text-xs font-sans text-slate-300 leading-relaxed">
                  {evt.description}
                </p>

                {isExpanded && (
                  <div className="mt-2 pt-2 border-t border-[#1a253a] space-y-2 font-mono text-xs text-slate-300">
                    <div className="p-2.5 rounded bg-[#080c14] border border-[#1b263b] text-[11px] leading-relaxed">
                      <span className="text-slate-500 block text-[10px] uppercase font-bold mb-0.5">TELEMETRY FORENSIC EVIDENCE:</span>
                      {evt.details}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Attribution Confidence: <strong className="text-emerald-400">{evt.confidence}%</strong></span>
                      <Link href="/investigate" className="text-sky-400 hover:text-sky-300 flex items-center gap-1">
                        <span>Investigate Event Observable</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

