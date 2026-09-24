'use client';

import React, { useState } from 'react';
import {
  FileText,
  Download,
  Share2,
  Printer,
  ShieldCheck,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Copy,
  Check,
  ShieldAlert,
  Bug,
  Crosshair,
  Binary
} from 'lucide-react';
import { mockReport } from '@/lib/mock-data/reports';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ConfidenceBar } from '@/components/common/ConfidenceBar';

export default function ReportsPage() {
  const [report] = useState(mockReport);
  const [stixModalOpen, setStixModalOpen] = useState(false);
  const [copiedStix, setCopiedStix] = useState(false);

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${report.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyStix = () => {
    navigator.clipboard.writeText(JSON.stringify(report.stixBundle, null, 2));
    setCopiedStix(true);
    setTimeout(() => setCopiedStix(false), 2000);
  };

  return (
    <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-10 py-8 space-y-8">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1b263c]">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono px-3 py-1 rounded-md bg-amber-950/80 border border-amber-700 text-amber-300 font-bold uppercase tracking-wider">
              TLP:AMBER RESTRICTED
            </span>
            <span className="text-xs font-mono text-slate-400 bg-[#0e1526] px-3 py-1 rounded-md border border-[#1c283f]">
              Report Ref: {report.id}
            </span>
          </div>
          <h1 className="text-2xl font-mono font-bold text-slate-100">
            Threat Intelligence Assessment Dossier
          </h1>
        </div>

        {/* 4 Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-[#0f1626] hover:bg-[#182338] border border-[#1e2a44] text-slate-200 text-xs font-mono flex items-center gap-2 transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-400" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={handleExportJson}
            className="px-4 py-2 rounded-xl bg-[#0f1626] hover:bg-[#182338] border border-[#1e2a44] text-slate-200 text-xs font-mono flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4 text-sky-400" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={() => setStixModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-2 transition-colors shadow-lg shadow-sky-950/50"
          >
            <Download className="w-4 h-4" />
            <span>Export STIX 2.1</span>
          </button>
          <button
            onClick={() => alert('Report dissemination link generated and signed for Tier-3 SOC stakeholders.')}
            className="px-4 py-2 rounded-xl bg-[#0f1626] hover:bg-[#182338] border border-[#1e2a44] text-slate-200 text-xs font-mono flex items-center gap-2 transition-colors"
          >
            <Share2 className="w-4 h-4 text-slate-400" />
            <span>Share Report</span>
          </button>
        </div>
      </div>

      {/* Main Report Document Sheet */}
      <div className="bg-[#0c1220] border border-[#1e2d4a] rounded-2xl p-8 md:p-12 shadow-2xl space-y-8 font-sans text-slate-200">
        {/* Document Header */}
        <div className="border-b border-[#1b273e] pb-6 space-y-3">
          <div className="flex flex-wrap items-center justify-between text-xs font-mono text-slate-400">
            <span>AUTHORITY: Cyber Threat Intelligence Unit & SOC Investigation Desk</span>
            <span>PUBLISHED: {report.date}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-mono text-slate-100 leading-snug">
            {report.title}
          </h2>
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-1">
            <span>Primary Author: <strong className="text-slate-200">{report.author}</strong></span>
            <span>•</span>
            <span>Classification: <strong className="text-amber-300">{report.classification}</strong></span>
            <span>•</span>
            <span>Attribution Confidence: <strong className="text-emerald-400">{report.confidenceScore}%</strong></span>
          </div>
        </div>

        {/* 1. Executive Summary */}
        <section className="space-y-3">
          <h3 className="text-sm font-mono font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-sky-400" />
            1. Executive Threat Summary
          </h3>
          <p className="text-sm md:text-base leading-relaxed text-slate-200 bg-[#080d18] p-5 md:p-6 rounded-xl border border-[#172338]">
            {report.executiveSummary}
          </p>
        </section>

        {/* 2. Investigation Scope */}
        <section className="space-y-3">
          <h3 className="text-sm font-mono font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400" />
            2. Investigation Scope & Methodology
          </h3>
          <ul className="space-y-2 text-sm text-slate-200 font-sans list-disc list-inside bg-[#080d18] p-5 rounded-xl border border-[#172338]">
            {report.investigationScope.map((scope, idx) => (
              <li key={idx} className="leading-relaxed">{scope}</li>
            ))}
          </ul>
        </section>

        {/* 3. Key Findings */}
        <section className="space-y-3">
          <h3 className="text-sm font-mono font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            3. Key Intelligence Findings
          </h3>
          <div className="space-y-3">
            {report.keyFindings.map((finding, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#080d18] border border-[#18253d] text-sm md:text-base flex items-start gap-3.5">
                <span className="w-6 h-6 rounded-md bg-sky-950 border border-sky-700 text-sky-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-slate-100 leading-relaxed">{finding}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Threat Actor Analysis */}
        <section className="space-y-3">
          <h3 className="text-sm font-mono font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            4. Threat Actor Attribution: {report.threatActorAnalysis.name}
          </h3>
          <div className="p-5 md:p-6 rounded-xl bg-[#080d18] border border-[#1a263e] space-y-3">
            <p className="text-sm md:text-base text-slate-200 leading-relaxed">{report.threatActorAnalysis.summary}</p>
            <div className="p-3.5 rounded-lg bg-[#0e1628] border border-[#1c2a44] font-mono text-xs text-slate-300">
              <strong className="text-slate-200">Geopolitical & Sector Context:</strong> {report.threatActorAnalysis.geopoliticalContext}
            </div>
          </div>
        </section>

        {/* 5. Infrastructure & Malware Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="space-y-3">
            <h3 className="text-sm font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Binary className="w-4 h-4 text-cyan-400" />
              5. Infrastructure Analysis
            </h3>
            <div className="p-5 rounded-xl bg-[#080d18] border border-[#18253d] text-xs font-mono space-y-2.5">
              <div>Primary Nodes: <span className="text-slate-100 font-bold">{report.infrastructureAnalysis.primaryNodes.join(', ')}</span></div>
              <div>Staging Relays: <span className="text-slate-100 font-bold">{report.infrastructureAnalysis.stagingNodes.join(', ')}</span></div>
              <div>Domains: <span className="text-slate-100 font-bold">{report.infrastructureAnalysis.domains.join(', ')}</span></div>
              <div>JARM Hash: <span className="text-sky-300 font-bold">{report.infrastructureAnalysis.jarmFingerprints.join(', ')}</span></div>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-mono font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
              <Bug className="w-4 h-4 text-purple-400" />
              6. Malware Analysis: {report.malwareAnalysis.name}
            </h3>
            <div className="p-5 rounded-xl bg-[#080d18] border border-[#18253d] text-sm space-y-2">
              <div className="font-mono text-xs text-slate-400">Version: <strong className="text-slate-200">{report.malwareAnalysis.version}</strong></div>
              <ul className="list-disc list-inside text-slate-200 space-y-1 leading-relaxed">
                {report.malwareAnalysis.capabilities.map(cap => (
                  <li key={cap}>{cap}</li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        {/* 7. Vulnerability Analysis */}
        <section className="space-y-3">
          <h3 className="text-sm font-mono font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            7. Exploited Vulnerability Analysis ({report.vulnerabilityAnalysis.cve})
          </h3>
          <div className="p-5 rounded-xl bg-[#080d18] border border-[#18253d] space-y-2">
            <div className="flex flex-wrap items-center justify-between text-xs font-mono gap-2">
              <span>CVSS v3.1 Score: <strong className="text-rose-400 text-sm font-bold">{report.vulnerabilityAnalysis.cvss} (Critical)</strong></span>
              <span className="text-amber-300 font-bold bg-amber-950/70 border border-amber-800 px-2.5 py-0.5 rounded">{report.vulnerabilityAnalysis.kevStatus}</span>
            </div>
            <p className="font-sans text-sm md:text-base text-slate-200 leading-relaxed pt-1">
              Impact: {report.vulnerabilityAnalysis.impact}
            </p>
          </div>
        </section>

        {/* 8. MITRE ATT&CK Mapping */}
        <section className="space-y-3">
          <h3 className="text-sm font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            8. MITRE ATT&CK Framework Mapping
          </h3>
          <div className="border border-[#18253d] rounded-xl overflow-hidden font-mono text-xs">
            <table className="w-full text-left">
              <thead className="bg-[#080d18] text-slate-400 uppercase border-b border-[#18253d]">
                <tr>
                  <th className="py-3 px-4">Tactic</th>
                  <th className="py-3 px-4">Technique ID</th>
                  <th className="py-3 px-4">Technique Name</th>
                  <th className="py-3 px-4">Observed Telemetry Evidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#152035]">
                {report.attackMapping.map((att, idx) => (
                  <tr key={idx} className="hover:bg-[#0e1628] transition-colors">
                    <td className="py-3 px-4 text-slate-300 font-medium">{att.tactic}</td>
                    <td className="py-3 px-4 text-emerald-400 font-bold">{att.techniqueId}</td>
                    <td className="py-3 px-4 text-slate-100">{att.techniqueName}</td>
                    <td className="py-3 px-4 text-slate-200 font-sans text-sm">{att.evidence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 9. Recommended Analyst Actions & Playbook */}
        <section className="space-y-3">
          <h3 className="text-sm font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            9. Recommended Incident Containment Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {report.recommendedActions.map((act, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/60 flex items-start gap-3 text-sm font-sans text-slate-100">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{act}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* STIX 2.1 Export Modal */}
      {stixModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e1526] border border-[#233555] rounded-xl max-w-3xl w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#1e2d4a]">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-sky-400" />
                <h4 className="text-sm font-mono font-bold text-slate-100 uppercase tracking-wide">
                  STIX 2.1 JSON Threat Intelligence Bundle
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyStix}
                  className="px-3 py-1.5 rounded-lg bg-[#152136] hover:bg-[#1d2e4a] border border-[#223554] text-xs font-mono text-slate-200 flex items-center gap-1.5 transition-colors"
                >
                  {copiedStix ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedStix ? 'Copied' : 'Copy JSON'}</span>
                </button>
                <button
                  onClick={() => setStixModalOpen(false)}
                  className="text-xs font-mono text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg bg-slate-800"
                >
                  CLOSE
                </button>
              </div>
            </div>

            <pre className="p-4 rounded-xl bg-[#070b16] border border-[#172338] text-xs font-mono text-sky-200 overflow-y-auto max-h-[500px] leading-relaxed">
              {JSON.stringify(report.stixBundle, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
