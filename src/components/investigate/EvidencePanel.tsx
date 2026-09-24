'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  ExternalLink,
  AlertTriangle,
  FileCheck,
  Layers,
  HelpCircle,
  Clock,
  Eye,
  CheckCircle2,
  XCircle,
  FileText,
  Filter,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { useCTIStore } from '@/lib/store/cti-store';
import { ConfidenceBar } from '@/components/common/ConfidenceBar';
import { StatusBadge } from '@/components/common/StatusBadge';
import { EvidenceSourceItem, ContradictionItem } from '@/types/evidence';

export const EvidencePanel: React.FC = () => {
  const { activeInvestigation } = useCTIStore();
  const [selectedSourceModal, setSelectedSourceModal] = useState<EvidenceSourceItem | null>(null);
  const [reviewConflictModal, setReviewConflictModal] = useState<ContradictionItem | null>(null);
  const [provenanceFilter, setProvenanceFilter] = useState<'all' | 'source_fact' | 'ai_interpretation' | 'analyst_verified'>('all');

  const filteredClaims = activeInvestigation.claims.filter(claim => {
    if (provenanceFilter === 'all') return true;
    return claim.provenanceType === provenanceFilter;
  });

  return (
    <div className="bg-[#0c1220] border border-[#1e2d4a] rounded-xl p-6 md:p-8 shadow-2xl space-y-6">
      {/* Evidence Panel Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#1b2844]">
        <div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-mono font-bold text-slate-100 uppercase tracking-wide">
              Evidence Provenance & Verification Matrix
            </h3>
          </div>
          <p className="text-sm text-slate-300 mt-1 max-w-4xl leading-relaxed">
            Every analytical claim is strictly verified against cryptographic hashes, BGP routing announcements, CERT bulletins, and passive DNS telemetry. Distinguishes verifiable source facts from AI-derived inferences.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {[
            { id: 'all', label: 'All Claims' },
            { id: 'source_fact', label: 'Source-Derived Facts' },
            { id: 'ai_interpretation', label: 'AI Inferences' },
            { id: 'analyst_verified', label: 'Analyst Verified' }
          ].map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => setProvenanceFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                provenanceFilter === f.id
                  ? 'bg-sky-950 text-sky-300 border border-sky-600 font-bold'
                  : 'bg-[#10172a] text-slate-400 hover:text-slate-200 border border-[#1d2a44]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Claims List */}
      <div className="space-y-6">
        {filteredClaims.map((claim, cIdx) => (
          <div
            key={claim.id}
            className="rounded-xl border border-[#1f2f4c] bg-[#090e1a] p-5 md:p-6 space-y-5 hover:border-[#2a3f68] transition-colors"
          >
            {/* Claim Header & Categorization */}
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-[#131b2e] text-slate-300 border border-[#213050]">
                    CLAIM #{cIdx + 1} ({claim.id})
                  </span>
                  <StatusBadge type="verification" value={claim.provenanceType} />
                  <span className="text-xs font-mono text-slate-400">
                    Corroborated by {claim.supportingEvidence.length} primary source feeds
                  </span>
                </div>
                <h4 className="text-base md:text-lg font-sans font-semibold text-slate-100 leading-snug">
                  &ldquo;{claim.claimText}&rdquo;
                </h4>
              </div>

              {/* Evidence Strength Meter */}
              <div className="lg:w-56 shrink-0 bg-[#0d1424] p-3 rounded-xl border border-[#1b2944] space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Trust Score:</span>
                  <span className="text-emerald-400 font-bold">{claim.strengthPercentage}%</span>
                </div>
                <ConfidenceBar score={claim.strengthPercentage} size="md" />
              </div>
            </div>

            {/* Supporting Evidence Cards */}
            <div className="space-y-3 pt-2 border-t border-[#162238]">
              <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-emerald-400">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  Primary Verifiable Evidence Citations ({claim.supportingEvidence.length}):
                </span>
                <span className="text-slate-500 hidden sm:inline">Cryptographically & Telemetrically Verified</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {claim.supportingEvidence.map(ev => (
                  <div
                    key={ev.id}
                    className="p-4 rounded-xl bg-[#0c1220] border border-[#1a2742] hover:border-sky-500/50 transition-colors flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-mono font-bold text-sky-300 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                          {ev.sourceName}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-800 px-2 py-0.5 rounded">
                            {ev.reliabilityScore}% Rel
                          </span>
                          <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {ev.tlp}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs font-mono text-slate-400">
                        <span>Published: <strong className="text-slate-300">{ev.publishedDate}</strong></span>
                        <span className="mx-2">•</span>
                        <span>Type: <strong className="text-slate-300">{ev.sourceType}</strong></span>
                      </div>

                      {/* Readable Full Excerpt */}
                      <p className="text-sm font-sans text-slate-200 italic bg-[#080d18] p-3 rounded-lg border border-[#152035] leading-relaxed">
                        &quot;{ev.excerpt}&quot;
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#162238] flex items-center justify-between text-xs font-mono">
                      <span className="text-sky-400 font-semibold truncate max-w-[200px]">
                        Relation: {ev.relationship}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedSourceModal(ev)}
                        className="px-2.5 py-1 rounded bg-[#131b2e] hover:bg-sky-950 text-slate-300 hover:text-sky-300 border border-[#213050] hover:border-sky-600/70 flex items-center gap-1 transition-colors"
                      >
                        <span>Full Dossier</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contradictory Evidence Alert & Resolution */}
            {claim.contradictoryEvidence && claim.contradictoryEvidence.length > 0 && (
              <div className="p-4 md:p-5 rounded-xl bg-amber-950/20 border border-amber-800/70 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                    <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
                      Contradictory Hypothesis Investigated & Resolved
                    </span>
                  </div>
                  {claim.contradictoryEvidence[0].resolved && (
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ANALYST VERIFIED RESOLUTION
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-[#090d18] border border-amber-900/40 space-y-1">
                    <span className="font-mono text-amber-400 font-bold block uppercase">
                      Dissenting Signal:
                    </span>
                    <p className="text-sm font-sans text-slate-200 leading-relaxed">
                      {claim.contradictoryEvidence[0].dissentingClaim}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#090d18] border border-emerald-900/40 space-y-1">
                    <span className="font-mono text-emerald-400 font-bold block uppercase">
                      Resolution Finding:
                    </span>
                    <p className="text-sm font-sans text-slate-200 leading-relaxed">
                      {claim.analystNote || claim.contradictoryEvidence[0].reason}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => setReviewConflictModal(claim.contradictoryEvidence![0])}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-900/40 hover:bg-amber-800/60 border border-amber-700 text-amber-200 text-xs font-mono flex items-center gap-1.5 transition-colors"
                  >
                    <span>Inspect Full Conflict Analysis</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Source Inspection Modal */}
      {selectedSourceModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e1526] border border-[#233555] rounded-xl max-w-xl w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#1e2d4a]">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-sky-400" />
                <h4 className="text-sm font-mono font-bold text-slate-100 uppercase tracking-wide">
                  Intelligence Source Provenance Record
                </h4>
              </div>
              <button
                onClick={() => setSelectedSourceModal(null)}
                className="text-xs font-mono text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-800"
              >
                CLOSE
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-[#090e1a] border border-[#1c2a44]">
                <span className="text-slate-400 block text-xs mb-0.5">SOURCE IDENTIFIER & AUTHORITY:</span>
                <span className="text-slate-100 font-bold text-sm">{selectedSourceModal.sourceName}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-[#090e1a] border border-[#1c2a44]">
                  <span className="text-slate-400 block text-xs mb-0.5">FEED TYPE:</span>
                  <span className="text-slate-200 font-semibold">{selectedSourceModal.sourceType}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#090e1a] border border-[#1c2a44]">
                  <span className="text-slate-400 block text-xs mb-0.5">OBSERVED DATE:</span>
                  <span className="text-slate-200 font-semibold">{selectedSourceModal.observedDate}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#090e1a] border border-[#1c2a44]">
                <span className="text-slate-400 block text-xs mb-0.5">CORRELATED RELATIONSHIP:</span>
                <span className="text-sky-300 font-bold text-sm">{selectedSourceModal.relationship}</span>
              </div>

              <div className="p-4 rounded-lg bg-[#080d18] border border-sky-800/40 font-sans space-y-1.5">
                <span className="text-sky-400 font-mono text-xs font-bold block uppercase">VERBATIM RECORD EXCERPT:</span>
                <p className="text-slate-100 leading-relaxed text-sm italic">
                  &ldquo;{selectedSourceModal.excerpt}&rdquo;
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 text-xs">
                <span className="text-slate-300">Reliability Weight: <strong className="text-emerald-400 font-bold">{selectedSourceModal.reliabilityScore}/100</strong></span>
                <span className="text-slate-300">TLP Classification: <strong className="text-amber-400 font-bold">{selectedSourceModal.tlp}</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Conflict Modal */}
      {reviewConflictModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e1526] border border-[#233555] rounded-xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1e2d4a]">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h4 className="text-sm font-mono font-bold text-amber-200 uppercase tracking-wide">
                  Contradictory Attribution Analysis
                </h4>
              </div>
              <button
                onClick={() => setReviewConflictModal(null)}
                className="text-xs font-mono text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-800"
              >
                CLOSE
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-4 rounded-lg bg-amber-950/20 border border-amber-900/50 space-y-1">
                <span className="text-amber-400 block text-xs font-bold uppercase">DISSENTING OBSERVATION (CrowdSensor #CS-994):</span>
                <p className="text-slate-100 font-sans text-sm leading-relaxed mt-0.5">{reviewConflictModal.dissentingClaim}</p>
              </div>

              <div className="p-4 rounded-lg bg-[#090e1a] border border-[#1c2a44] font-sans space-y-1">
                <span className="text-slate-400 font-mono text-xs font-bold block uppercase">EVALUATION RATIONALE:</span>
                <p className="text-slate-200 text-sm leading-relaxed">{reviewConflictModal.reason}</p>
              </div>

              <div className="p-4 rounded-lg bg-emerald-950/30 border border-emerald-800/80 font-sans flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-emerald-400 font-mono text-xs font-bold uppercase block">
                    Definitive Analyst Determination:
                  </span>
                  <p className="text-emerald-200 text-sm leading-relaxed">
                    APT-84 verified to co-reside in VPS subnet AS49870. The dissenting source misattributed leased infrastructure to commercial proxy farm SilverFox. Threat attribution to APT-84 confirmed with 91% confidence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
