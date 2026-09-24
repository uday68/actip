'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  SearchCode,
  ShieldAlert,
  Layers,
  FileText,
  Clock,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Share2,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Network,
  Download,
  Terminal,
  Activity,
  ChevronRight
} from 'lucide-react';
import { useCTIStore } from '@/lib/store/cti-store';
import { InvestigationLauncher } from '@/components/investigate/InvestigationLauncher';
import { ExecutionPipeline } from '@/components/investigate/ExecutionPipeline';
import { EvidencePanel } from '@/components/investigate/EvidencePanel';
import { ExecutiveSummaryView } from '@/components/investigate/ExecutiveSummaryView';
import { AgentTracePanel } from '@/components/investigate/AgentTracePanel';

export default function InvestigatePage() {
  const { activeInvestigation, isInvestigating, currentStageIndex } = useCTIStore();
  const [activeTab, setActiveTab] = useState<'summary' | 'evidence' | 'pipeline' | 'trace' | 'all'>('summary');

  return (
    <div className="max-w-[1600px] w-full mx-auto px-6 lg:px-10 py-8 space-y-8">
      {/* Page Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-md bg-sky-950/80 border border-sky-600/80 text-sky-300 uppercase tracking-wider">
              CTI Investigation Workbench
            </span>
            <span className="text-xs font-mono text-slate-400 bg-[#0f1728] px-3 py-1 rounded-md border border-[#1b2742]">
              Case ID: <strong className="text-slate-200">{activeInvestigation.id}</strong>
            </span>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/70 px-3 py-1 rounded-md border border-emerald-800 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              STATUS: {isInvestigating ? 'ANALYZING' : 'ANALYSIS COMPLETE'}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-mono font-bold text-slate-100 tracking-tight flex items-center gap-3">
            <span>Agentic Cyber Threat Intelligence Investigation</span>
          </h1>

          <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
            Multi-stage autonomous threat investigation combining live network telemetry, real DNS/RDAP resolution, official CISA KEV feeds, and verified evidence provenance.
          </p>
        </div>

        {/* Quick Observables Card */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="p-3.5 rounded-xl bg-[#0c1220] border border-[#1e2d4a] text-right font-mono">
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Primary Target:</div>
            <div className="text-sky-300 font-bold text-sm truncate max-w-xs">{activeInvestigation.query}</div>
            <div className="text-xs text-slate-400 mt-0.5">
              Assigned: <span className="text-slate-200">{activeInvestigation.analyst}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Investigation Launcher Bar */}
      <InvestigationLauncher />

      {/* Spacious View Switcher Navigation */}
      <div className="border-b border-[#1b2844] pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { id: 'summary', label: 'Executive Findings & Playbook', icon: FileText, badge: 'Overview' },
              { id: 'evidence', label: 'Evidence & Provenance Matrix', icon: ShieldCheck, badge: `${activeInvestigation.claims.length} Claims` },
              { id: 'pipeline', label: 'Autonomous 9-Stage Pipeline', icon: Layers, badge: isInvestigating ? 'Active' : 'Completed' },
              { id: 'trace', label: 'Audited Operational Log', icon: Cpu, badge: `${activeInvestigation.agentTraces.length} Traces` },
              { id: 'all', label: 'Complete Unified Dossier', icon: Sparkles, badge: 'Full View' }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-mono whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-sky-950 text-sky-200 border border-sky-500 font-bold shadow-lg shadow-sky-950/40'
                      : 'bg-[#0c1220] text-slate-300 hover:text-white hover:bg-[#131b2e] border border-[#1b2842]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    isActive
                      ? 'bg-sky-900 text-sky-200 border border-sky-600'
                      : 'bg-[#141c2c] text-slate-400'
                  }`}>
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-4 text-xs font-mono shrink-0">
            <div className="flex items-center gap-2 bg-[#0c1220] px-3.5 py-1.5 rounded-lg border border-[#1b2842]">
              <span className="text-slate-400">Attribution Confidence:</span>
              <span className="text-emerald-400 font-bold text-sm">{activeInvestigation.confidenceScore}%</span>
            </div>
            <Link
              href="/reports"
              className="text-sky-400 hover:text-sky-300 flex items-center gap-1 font-semibold transition-colors"
            >
              <span>Export STIX 2.1</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Tab Contents - Clean, Focused, Analysable */}
      {activeTab === 'summary' && (
        <div className="space-y-8 animate-in fade-in duration-150">
          <ExecutiveSummaryView />
        </div>
      )}

      {activeTab === 'evidence' && (
        <div className="space-y-8 animate-in fade-in duration-150">
          <EvidencePanel />
        </div>
      )}

      {activeTab === 'pipeline' && (
        <div className="space-y-8 animate-in fade-in duration-150">
          <ExecutionPipeline />
        </div>
      )}

      {activeTab === 'trace' && (
        <div className="space-y-8 animate-in fade-in duration-150">
          <AgentTracePanel />
        </div>
      )}

      {activeTab === 'all' && (
        <div className="space-y-8 animate-in fade-in duration-150">
          <ExecutiveSummaryView />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ExecutionPipeline />
            <AgentTracePanel />
          </div>
          <EvidencePanel />
        </div>
      )}
    </div>
  );
}
