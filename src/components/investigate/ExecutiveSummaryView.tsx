'use client';

import React from 'react';
import Link from 'next/link';
import {
  FileText,
  ShieldAlert,
  Calendar,
  Layers,
  CheckCircle2,
  AlertCircle,
  Network,
  Download,
  Share2,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Crosshair,
  Bug,
  AlertTriangle,
  Lock,
  ArrowUpRight
} from 'lucide-react';
import { useCTIStore } from '@/lib/store/cti-store';
import { ConfidenceBar } from '@/components/common/ConfidenceBar';
import { StatusBadge } from '@/components/common/StatusBadge';
import { EntityPill } from '@/components/common/EntityPill';

export const ExecutiveSummaryView: React.FC = () => {
  const { activeInvestigation } = useCTIStore();

  return (
    <div className="bg-[#0c1220] border border-[#1e2d4a] rounded-xl p-6 md:p-8 shadow-2xl space-y-8">
      {/* Header & Meta Summary */}
      <div className="space-y-4 pb-6 border-b border-[#1b2844]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-md bg-sky-950/90 border border-sky-600/80 text-sky-300">
              CASE: {activeInvestigation.id}
            </span>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-md bg-rose-950/80 border border-rose-600/80 text-rose-300 uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              CRITICAL SEVERITY
            </span>
            <span className="text-xs font-mono text-slate-400 bg-[#101728] px-3 py-1 rounded-md border border-[#1b263e]">
              Last Updated: {activeInvestigation.updatedAt}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/reports"
              className="px-3.5 py-1.5 rounded-lg bg-[#141d30] hover:bg-[#1b2844] border border-[#223354] text-slate-200 text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-sky-400" />
              <span>Full Intelligence Dossier</span>
            </Link>
            <Link
              href="/graph"
              className="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-slate-950 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Network className="w-3.5 h-3.5" />
              <span>Pivot Graph</span>
            </Link>
          </div>
        </div>

        <div>
          <h2 className="text-xl md:text-2xl font-mono font-bold text-slate-100 tracking-tight">
            Threat Intelligence Executive Assessment & Attribution Dossier
          </h2>
          <div className="text-xs text-slate-400 mt-1 font-mono flex items-center gap-3">
            <span>Primary Analyst: <strong className="text-slate-200">{activeInvestigation.analyst}</strong></span>
            <span>•</span>
            <span>Target Observables: <strong className="text-sky-300">{activeInvestigation.query}</strong></span>
          </div>
        </div>

        {/* Narrative Executive Summary with High Readability */}
        <div className="bg-[#090e1a] border border-[#18253d] rounded-xl p-5 md:p-6 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400 font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            Executive Narrative & Threat Context
          </div>
          <p className="text-sm md:text-base font-sans text-slate-200 leading-relaxed">
            {activeInvestigation.executiveSummary}
          </p>
        </div>
      </div>

      {/* 4 Core Intelligence Pillars (Actor, Exploit, Malware, Campaign) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Threat Actor */}
        <div className="p-4 rounded-xl bg-[#090e1a] border border-[#1c2942] hover:border-red-500/40 transition-colors space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              Threat Actor
            </span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
              91% Attribution
            </span>
          </div>
          <div className="text-base font-bold text-slate-100 font-mono">
            {activeInvestigation.relatedEntities.find(e => e.type === 'actor')?.label || 'APT-84 (RedBanshee / Cobalt Frost)'}
          </div>
          <div className="text-xs text-slate-400 leading-relaxed">
            Nation-state cyber espionage actor targeting aerospace, defense blueprints, and critical boundary appliances.
          </div>
        </div>

        {/* Initial Access Exploit */}
        <div className="p-4 rounded-xl bg-[#090e1a] border border-[#1c2942] hover:border-amber-500/40 transition-colors space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Initial Access
            </span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
              CISA KEV Listed
            </span>
          </div>
          <div className="text-base font-bold text-slate-100 font-mono">
            CVE-2026-8912
          </div>
          <div className="text-xs text-slate-400 leading-relaxed">
            Unauthenticated Remote Code Execution on perimeter edge gateway firmware. CVSS 9.8 Critical severity.
          </div>
        </div>

        {/* Malware Family */}
        <div className="p-4 rounded-xl bg-[#090e1a] border border-[#1c2942] hover:border-purple-500/40 transition-colors space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <Bug className="w-4 h-4 text-purple-400" />
              Malware Family
            </span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
              v3.2 Observed
            </span>
          </div>
          <div className="text-base font-bold text-slate-100 font-mono">
            BlackVenom RAT
          </div>
          <div className="text-xs text-slate-400 leading-relaxed">
            In-memory NTDLL unhooking, TLS 1.3 heartbeat beaconing to port 8443, and direct syscall invocation for EDR evasion.
          </div>
        </div>

        {/* Campaign */}
        <div className="p-4 rounded-xl bg-[#090e1a] border border-[#1c2942] hover:border-orange-500/40 transition-colors space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
              <Crosshair className="w-4 h-4 text-orange-400" />
              Active Campaign
            </span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-orange-950 text-orange-300 border border-orange-800">
              Espionage
            </span>
          </div>
          <div className="text-base font-bold text-slate-100 font-mono">
            Operation Arctic Ghost
          </div>
          <div className="text-xs text-slate-400 leading-relaxed">
            Targeting Western aerospace defense contractors and international procurement consortiums across Q3 2026.
          </div>
        </div>
      </div>

      {/* Vital Analytical Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#090e1a] border border-[#19253d] text-center space-y-1">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Evidence Strength</span>
          <div className="text-2xl font-mono font-bold text-emerald-400">
            {activeInvestigation.evidenceStrength}
          </div>
          <span className="text-xs text-slate-500 font-mono block">Zero Uncorroborated Claims</span>
        </div>

        <div className="p-4 rounded-xl bg-[#090e1a] border border-[#19253d] text-center space-y-1">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Verified Sources</span>
          <div className="text-2xl font-mono font-bold text-sky-400">
            {activeInvestigation.sourcesCount} Feeds
          </div>
          <span className="text-xs text-slate-500 font-mono block">DNS, RDAP, KEV, ThreatFox</span>
        </div>

        <div className="p-4 rounded-xl bg-[#090e1a] border border-[#19253d] text-center space-y-1">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Confidence Rating</span>
          <div className="text-2xl font-mono font-bold text-emerald-300">
            {activeInvestigation.confidenceScore}%
          </div>
          <span className="text-xs text-slate-500 font-mono block">High Attribution Threshold</span>
        </div>

        <div className="p-4 rounded-xl bg-[#090e1a] border border-[#19253d] text-center space-y-1">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Containment Actions</span>
          <div className="text-2xl font-mono font-bold text-amber-400">
            {activeInvestigation.recommendedActions.length} Defined
          </div>
          <span className="text-xs text-slate-500 font-mono block">Immediate Tier-2/3 Playbook</span>
        </div>
      </div>

      {/* Key Intelligence Findings Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Key Analytical Findings ({activeInvestigation.keyFindings.length})</span>
          </h4>
          <span className="text-xs font-mono text-slate-400">Chronologically Corroborated</span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {activeInvestigation.keyFindings.map((finding, idx) => (
            <div
              key={idx}
              className="p-4 md:p-5 rounded-xl bg-[#090e1a] border border-[#1a263e] hover:border-[#283b5e] transition-colors flex items-start gap-4"
            >
              <span className="w-7 h-7 rounded-lg bg-sky-950/80 border border-sky-600/70 text-sky-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <div className="space-y-1">
                <p className="text-sm md:text-base font-sans text-slate-100 leading-relaxed">
                  {finding}
                </p>
                <div className="flex items-center gap-3 text-xs font-mono text-slate-400 pt-1">
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Corroborated by Telemetry
                  </span>
                  <span>•</span>
                  <span>Confidence: 94%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Playbook & Containment Actions */}
      <div className="space-y-4 pt-4 border-t border-[#1b2844]">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Recommended Incident Containment Playbook</span>
          </h4>
          <span className="text-xs font-mono text-amber-300 bg-amber-950/60 border border-amber-800/80 px-2.5 py-0.5 rounded">
            ACTION REQUIRED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {activeInvestigation.recommendedActions.map((action, aIdx) => (
            <div
              key={aIdx}
              className="p-4 rounded-xl bg-[#090f1c] border border-[#1c2c49] flex items-start gap-3.5 hover:border-emerald-500/40 transition-colors"
            >
              <div className="w-6 h-6 rounded-md bg-emerald-950 border border-emerald-700 text-emerald-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {aIdx + 1}
              </div>
              <div className="space-y-1">
                <div className="text-xs font-mono font-semibold text-emerald-300 uppercase tracking-wider">
                  Remediation Step #{aIdx + 1}
                </div>
                <p className="text-sm font-sans text-slate-200 leading-relaxed">
                  {action}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Correlated Graph Entities */}
      <div className="space-y-3 pt-4 border-t border-[#1b2844]">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Network className="w-4 h-4 text-sky-400" />
            <span>Correlated Graph Entities ({activeInvestigation.relatedEntities.length})</span>
          </h4>
          <Link
            href="/graph"
            className="text-xs font-mono text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors"
          >
            <span>Open Fullscreen Knowledge Graph</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {activeInvestigation.relatedEntities.map(ent => (
            <div
              key={ent.label}
              className="flex items-center gap-2 bg-[#090e1a] px-3 py-1.5 rounded-lg border border-[#1c2a44] hover:border-sky-500/50 transition-colors"
            >
              <EntityPill type={ent.type} label={ent.label} />
              <span className="text-xs font-mono text-slate-400">[{ent.relation}]</span>
              <span className="text-xs font-mono font-bold text-emerald-400">{ent.confidence}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
