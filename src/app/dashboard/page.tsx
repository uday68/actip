'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  SearchCode,
  AlertTriangle,
  Bug,
  Crosshair,
  Binary,
  Database,
  Calendar,
  Activity,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Filter,
  CheckCircle2,
  ExternalLink,
  Layers,
  ChevronRight,
  Network,
  ShieldCheck,
  Radio
} from 'lucide-react';
import { useCTIStore } from '@/lib/store/cti-store';
import { recentInvestigationsTable } from '@/lib/mock-data/investigations';
import { StatusBadge } from '@/components/common/StatusBadge';
import { EntityPill } from '@/components/common/EntityPill';

export default function DashboardPage() {
  const { startNewInvestigation } = useCTIStore();
  const [timelineFilter, setTimelineFilter] = useState('all');

  const stats = [
    { title: 'Active Investigations', value: '4', change: '+1 in progress', icon: SearchCode, color: 'text-sky-400', badge: 'Tier-3 Lead' },
    { title: 'New Threat Indicators', value: '284', change: 'Past 24h Telemetry', icon: Binary, color: 'text-cyan-400', badge: 'DNS / IP / Hash' },
    { title: 'Critical CVEs (KEV)', value: '12', change: '3 unmitigated perimeter', icon: AlertTriangle, color: 'text-rose-400', badge: 'Emergency Directives' },
    { title: 'Active Campaigns', value: '3', change: 'Operation Arctic Ghost', icon: Crosshair, color: 'text-orange-400', badge: 'Espionage' },
    { title: 'Tracked Threat Actors', value: '19', change: 'APT-84 high activity', icon: ShieldAlert, color: 'text-red-400', badge: 'State-Sponsored' },
    { title: 'Malware Families', value: '38', change: 'BlackVenom v3.2 new', icon: Bug, color: 'text-purple-400', badge: 'Memory Unhooking' },
    { title: 'Intelligence Feeds', value: '6/6', change: 'All synchronized', icon: Database, color: 'text-emerald-400', badge: 'Real Feeds' },
    { title: 'Unverified Telemetry', value: '18', change: 'Requires analyst triage', icon: Activity, color: 'text-amber-400', badge: 'Pending Review' },
  ];

  const timelineEvents = [
    {
      date: '2026-09-15 22:14 UTC',
      category: 'New IOC Observed',
      type: 'ip' as const,
      label: '185.220.101.5 (Port 8443)',
      desc: 'Active TLS 1.3 heartbeat beaconing detected with JARM match (27d36d2d000d000dc427d36d2d000d) to BlackVenom C2 profile.',
      severity: 'critical'
    },
    {
      date: '2026-09-14 18:30 UTC',
      category: 'Malware Variant Observed',
      type: 'malware' as const,
      label: 'BlackVenom RAT v3.2',
      desc: 'New obfuscated DLL dropped from quantum-defense.org staging node using direct unhooked NTDLL calls for EDR evasion.',
      severity: 'critical'
    },
    {
      date: '2026-09-12 09:15 UTC',
      category: 'Threat Actor Activity',
      type: 'actor' as const,
      label: 'APT-84 (RedBanshee)',
      desc: 'Observed targeting Western European aerospace defense contractors via spearphishing procurement lure documents.',
      severity: 'high'
    },
    {
      date: '2026-09-05 14:00 UTC',
      category: 'CVE Catalog Update',
      type: 'cve' as const,
      label: 'CVE-2026-8912',
      desc: 'CISA issues Emergency Directive 26-02 mandating federal boundary patching of Edge Gateway unauthenticated RCE.',
      severity: 'critical'
    }
  ];

  return (
    <div className="max-w-[1600px] w-full mx-auto px-6 lg:px-10 py-8 space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-md bg-sky-950/80 border border-sky-600/80 text-sky-300 uppercase tracking-wider">
              SOC Threat Intelligence Desk
            </span>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-800 px-3 py-1 rounded-md font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              LIVE TELEMETRY ACTIVE
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-mono font-bold text-slate-100 tracking-tight flex items-center gap-3">
            <span>Threat Intelligence Environment Overview</span>
          </h1>

          <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
            Real-time cyber threat landscape, active intrusion investigations, CISA KEV zero-day monitoring, and correlated MITRE ATT&CK telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/investigate"
            className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs md:text-sm font-mono font-bold flex items-center gap-2 transition-colors shadow-lg shadow-sky-950/50"
          >
            <SearchCode className="w-4 h-4" />
            <span>Launch New Investigation</span>
          </Link>
          <Link
            href="/graph"
            className="px-4 py-2.5 rounded-xl bg-[#0e1628] hover:bg-[#152038] border border-[#203050] text-slate-200 text-xs md:text-sm font-mono flex items-center gap-2 transition-colors"
          >
            <Network className="w-4 h-4 text-sky-400" />
            <span>Knowledge Graph</span>
          </Link>
        </div>
      </div>

      {/* Spacious 4-Column KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <div
              key={s.title}
              className="p-5 md:p-6 rounded-xl bg-[#0c1220] border border-[#1e2d4a] hover:border-[#2f436e] transition-all flex flex-col justify-between space-y-4 shadow-xl group"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-[#111828] border border-[#1d2b45] flex items-center justify-center">
                  <Icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#101728] text-slate-400 border border-[#1c283f] font-semibold">
                  {s.badge}
                </span>
              </div>

              <div>
                <div className="text-3xl font-mono font-bold text-slate-100 group-hover:text-sky-300 transition-colors">
                  {s.value}
                </div>
                <div className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mt-1">
                  {s.title}
                </div>
                <div className="text-xs font-mono text-slate-400 mt-1">
                  {s.change}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Recent Investigations & Threat Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Recent Investigations Table */}
        <div className="lg:col-span-2 bg-[#0c1220] border border-[#1e2d4a] rounded-xl p-6 md:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#1b2844]">
            <div className="flex items-center gap-2.5">
              <SearchCode className="w-5 h-5 text-sky-400" />
              <h3 className="text-base font-mono font-bold text-slate-100 uppercase tracking-wide">
                Recent Agentic Investigations ({recentInvestigationsTable.length})
              </h3>
            </div>
            <Link
              href="/investigate"
              className="text-xs font-mono text-sky-400 hover:text-sky-300 flex items-center gap-1 font-semibold transition-colors"
            >
              <span>Open Active Workbench</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-[#18263f] text-xs text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-3">Investigation Name</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Confidence</th>
                  <th className="py-3 px-3">Last Updated</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#152035]">
                {recentInvestigationsTable.map(inv => (
                  <tr
                    key={inv.id}
                    className="hover:bg-[#10172a] transition-colors group cursor-pointer"
                  >
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-sm text-slate-100 group-hover:text-sky-300">
                        {inv.name}
                      </div>
                      <div className="text-xs text-slate-400 font-mono truncate max-w-sm mt-0.5">
                        {inv.query}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-300 text-xs">
                      {inv.type}
                    </td>
                    <td className="py-3.5 px-3">
                      <StatusBadge type="status" value={inv.status} />
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-emerald-400 font-bold text-sm">{inv.confidence}</span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-400 text-xs">
                      {inv.updated}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <Link
                        href="/investigate"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141d30] border border-[#223354] text-slate-300 hover:text-white hover:border-sky-500 text-xs font-mono transition-colors"
                      >
                        <span>Analyze</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Threat Activity Timeline */}
        <div className="bg-[#0c1220] border border-[#1e2d4a] rounded-xl p-6 md:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#1b2844]">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-mono font-bold text-slate-100 uppercase tracking-wide">
                Threat Telemetry Stream
              </h3>
            </div>
            <Link
              href="/timeline"
              className="text-xs font-mono text-sky-400 hover:text-sky-300 flex items-center gap-1 font-semibold transition-colors"
            >
              <span>Full Timeline</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-4 pt-1">
            {timelineEvents.map((evt, idx) => (
              <div key={idx} className="relative pl-6 pb-4 last:pb-0 border-l border-[#1d2a44] space-y-1.5">
                <span className="absolute -left-1.5 top-1 w-3.5 h-3.5 rounded-full bg-[#0c1220] border-2 border-sky-400" />
                <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
                  <span>{evt.date}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase font-bold">
                    {evt.category}
                  </span>
                </div>
                <div>
                  <EntityPill type={evt.type} label={evt.label} />
                </div>
                <p className="text-xs md:text-sm font-sans text-slate-200 leading-relaxed">
                  {evt.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Threat Landscape: Cross-Entity Correlation Matrix */}
      <div className="bg-[#0c1220] border border-[#1e2d4a] rounded-xl p-6 md:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1b2844]">
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-sky-400" />
            <div>
              <h3 className="text-base font-mono font-bold text-slate-100 uppercase tracking-wide">
                Threat Landscape & Cross-Entity Correlation Matrix
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Multi-dimensional correlation across adversary infrastructure, malware families, and active campaigns.
              </p>
            </div>
          </div>
          <Link
            href="/graph"
            className="text-xs font-mono text-sky-400 hover:text-sky-300 flex items-center gap-1.5 font-semibold transition-colors"
          >
            <span>Fullscreen Knowledge Graph</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Actors */}
          <div className="p-5 rounded-xl bg-[#090e1a] border border-[#1a263e] space-y-3">
            <div className="text-xs font-mono font-bold text-red-400 flex items-center gap-2 uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" /> Tracked Threat Actors
            </div>
            <div className="space-y-2 text-xs font-mono">
              <div className="p-3 rounded-lg bg-[#0e1526] border border-[#1c2a44] space-y-1">
                <div className="font-bold text-slate-100 text-sm">APT-84 (RedBanshee / Cobalt Frost)</div>
                <div className="text-slate-400 text-xs">State-Sponsored • Targeting Aerospace & Defense</div>
              </div>
              <div className="p-3 rounded-lg bg-[#0e1526] border border-[#1c2a44] space-y-1">
                <div className="font-bold text-slate-100 text-sm">VelvetChollima (Lazarus Group)</div>
                <div className="text-slate-400 text-xs">Financial Espionage • Crypto Exchange BEC Lures</div>
              </div>
            </div>
          </div>

          {/* Malware */}
          <div className="p-5 rounded-xl bg-[#090e1a] border border-[#1a263e] space-y-3">
            <div className="text-xs font-mono font-bold text-purple-400 flex items-center gap-2 uppercase tracking-wider">
              <Bug className="w-4 h-4" /> Active Malware Families
            </div>
            <div className="space-y-2 text-xs font-mono">
              <div className="p-3 rounded-lg bg-[#0e1526] border border-[#1c2a44] space-y-1">
                <div className="font-bold text-slate-100 text-sm">BlackVenom RAT v3.2</div>
                <div className="text-slate-400 text-xs">Memory Unhooking • TLS 1.3 Heartbeat C2</div>
              </div>
              <div className="p-3 rounded-lg bg-[#0e1526] border border-[#1c2a44] space-y-1">
                <div className="font-bold text-slate-100 text-sm">StealthStealer v2</div>
                <div className="text-slate-400 text-xs">Browser Master Key Dumping • Telegram C2</div>
              </div>
            </div>
          </div>

          {/* Campaigns */}
          <div className="p-5 rounded-xl bg-[#090e1a] border border-[#1a263e] space-y-3">
            <div className="text-xs font-mono font-bold text-orange-400 flex items-center gap-2 uppercase tracking-wider">
              <Crosshair className="w-4 h-4" /> Tracked Campaigns
            </div>
            <div className="space-y-2 text-xs font-mono">
              <div className="p-3 rounded-lg bg-[#0e1526] border border-[#1c2a44] space-y-1">
                <div className="font-bold text-slate-100 text-sm">Operation Arctic Ghost</div>
                <div className="text-slate-400 text-xs">Western Defense Contractor Boundary Exploitation</div>
              </div>
              <div className="p-3 rounded-lg bg-[#0e1526] border border-[#1c2a44] space-y-1">
                <div className="font-bold text-slate-100 text-sm">Campaign Solstice</div>
                <div className="text-slate-400 text-xs">Multi-Stage Cryptocurrency Treasury Theft</div>
              </div>
            </div>
          </div>

          {/* Infrastructure */}
          <div className="p-5 rounded-xl bg-[#090e1a] border border-[#1a263e] space-y-3">
            <div className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-2 uppercase tracking-wider">
              <Binary className="w-4 h-4" /> Monitored Infrastructure
            </div>
            <div className="space-y-2 text-xs font-mono">
              <div className="p-3 rounded-lg bg-[#0e1526] border border-[#1c2a44] space-y-1">
                <div className="font-bold text-slate-100 text-sm">185.220.101.5 (Port 8443)</div>
                <div className="text-slate-400 text-xs">AS60729 / Solaris BV • Active C2 Heartbeat Node</div>
              </div>
              <div className="p-3 rounded-lg bg-[#0e1526] border border-[#1c2a44] space-y-1">
                <div className="font-bold text-slate-100 text-sm">quantum-defense.org</div>
                <div className="text-slate-400 text-xs">Spoofed Procurement Staging & Decoy Domain</div>
              </div>
            </div>
          </div>

          {/* Vulnerabilities */}
          <div className="p-5 rounded-xl bg-[#090e1a] border border-[#1a263e] space-y-3">
            <div className="text-xs font-mono font-bold text-rose-400 flex items-center gap-2 uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" /> KEV Critical Vulnerabilities
            </div>
            <div className="space-y-2 text-xs font-mono">
              <div className="p-3 rounded-lg bg-[#0e1526] border border-[#1c2a44] space-y-1">
                <div className="font-bold text-slate-100 text-sm">CVE-2026-8912 (CVSS 9.8)</div>
                <div className="text-rose-400 text-xs font-semibold">CISA KEV Listed • Edge Gateway Remote Code Execution</div>
              </div>
              <div className="p-3 rounded-lg bg-[#0e1526] border border-[#1c2a44] space-y-1">
                <div className="font-bold text-slate-100 text-sm">CVE-2026-4401 (CVSS 8.8)</div>
                <div className="text-amber-400 text-xs font-semibold">CISA KEV Listed • SMBv3 Unauthenticated Relay</div>
              </div>
            </div>
          </div>

          {/* ATT&CK */}
          <div className="p-5 rounded-xl bg-[#090e1a] border border-[#1a263e] space-y-3">
            <div className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-2 uppercase tracking-wider">
              <Layers className="w-4 h-4" /> ATT&CK Enterprise Techniques
            </div>
            <div className="space-y-2 text-xs font-mono">
              <div className="p-3 rounded-lg bg-[#0e1526] border border-[#1c2a44] space-y-1">
                <div className="font-bold text-slate-100 text-sm">T1190: Exploit Public App</div>
                <div className="text-slate-400 text-xs">Initial Perimeter Boundary Access via Edge Gateway</div>
              </div>
              <div className="p-3 rounded-lg bg-[#0e1526] border border-[#1c2a44] space-y-1">
                <div className="font-bold text-slate-100 text-sm">T1071.001: Web Protocols (C2)</div>
                <div className="text-slate-400 text-xs">HTTPS TLS 1.3 Beacons with Unique JARM Profile</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
