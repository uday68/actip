'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Loader2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Terminal,
  Clock,
  ShieldCheck,
  ExternalLink,
  Layers,
  Wrench,
  Sparkles
} from 'lucide-react';
import { useCTIStore } from '@/lib/store/cti-store';
import { StatusBadge } from '@/components/common/StatusBadge';

export const ExecutionPipeline: React.FC = () => {
  const { activeInvestigation, isInvestigating, currentStageIndex } = useCTIStore();
  const [expandedStageId, setExpandedStageId] = useState<string | null>(
    activeInvestigation.stages[4]?.id || null
  );

  const toggleExpand = (id: string) => {
    setExpandedStageId(expandedStageId === id ? null : id);
  };

  return (
    <div className="bg-[#0c1220] border border-[#1e2d4a] rounded-xl p-6 md:p-8 shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#1b2844]">
        <div>
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-sky-400" />
            <h3 className="text-lg font-mono font-bold text-slate-100 uppercase tracking-wide">
              Autonomous 9-Stage Investigation Pipeline
            </h3>
          </div>
          <p className="text-sm text-slate-300 mt-1 leading-relaxed">
            Multi-stage autonomous pipeline executing observable extraction, live DNS/RDAP enrichment, KEV correlation, graph traversal, and STIX 2.1 synthesis.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <span className="text-xs font-mono text-slate-400">Status:</span>
          <span className={`px-3 py-1 rounded-md text-xs font-mono font-bold uppercase flex items-center gap-1.5 ${
            isInvestigating
              ? 'bg-amber-950/80 text-amber-300 border border-amber-600 animate-pulse'
              : 'bg-emerald-950/80 text-emerald-300 border border-emerald-600'
          }`}>
            {isInvestigating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Pipeline Active ({currentStageIndex + 1}/9)
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                All 9 Stages Verified
              </>
            )}
          </span>
        </div>
      </div>

      {/* Pipeline Stage List */}
      <div className="space-y-3">
        {activeInvestigation.stages.map((stage, idx) => {
          const isCurrent = isInvestigating && idx === currentStageIndex;
          const isCompleted = stage.status === 'completed' || idx < currentStageIndex;
          const isPending = !isCompleted && !isCurrent;
          const isExpanded = expandedStageId === stage.id || isCurrent;

          let icon = <Circle className="w-5 h-5 text-slate-600 shrink-0" />;
          let borderStyle = 'border-[#19253d] bg-[#090e1a]';

          if (isCompleted) {
            icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
            borderStyle = 'border-[#1c2c48] bg-[#0c1322]';
          } else if (isCurrent) {
            icon = <Loader2 className="w-5 h-5 text-sky-400 animate-spin shrink-0" />;
            borderStyle = 'border-sky-500/80 bg-sky-950/30 shadow-lg shadow-sky-950/50';
          }

          return (
            <div
              key={stage.id}
              className={`rounded-xl border transition-all overflow-hidden ${borderStyle}`}
            >
              {/* Stage Header Line */}
              <button
                type="button"
                onClick={() => toggleExpand(stage.id)}
                className="w-full p-4 md:p-5 flex items-center justify-between text-left hover:bg-slate-800/20 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  {icon}
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#141d30] text-slate-300 border border-[#223354]">
                        STAGE {idx + 1}
                      </span>
                      <span className="text-sm md:text-base font-mono font-bold text-slate-100">
                        {stage.name}
                      </span>
                      {stage.toolName && (
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800/80 text-sky-300 border border-slate-700 flex items-center gap-1">
                          <Wrench className="w-3 h-3 text-sky-400" />
                          {stage.toolName}
                        </span>
                      )}
                    </div>
                    <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                      {stage.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-3">
                  {stage.evidenceCount !== undefined && stage.evidenceCount > 0 && (
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-800 hidden sm:inline">
                      {stage.evidenceCount} Sources
                    </span>
                  )}
                  {stage.durationMs && (
                    <span className="text-xs font-mono text-slate-400 hidden md:inline">
                      {stage.durationMs}ms
                    </span>
                  )}
                  <span className="text-slate-400 p-1 rounded hover:bg-slate-800">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </span>
                </div>
              </button>

              {/* Stage Detailed Execution Breakdown */}
              {isExpanded && (
                <div className="p-5 border-t border-[#18263f] bg-[#070b16] text-xs font-mono space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-lg bg-[#0b1120] border border-[#1b2844] space-y-1">
                      <span className="text-slate-400 block text-xs">AGENT TOOL INVOCATION:</span>
                      <span className="text-sky-300 font-bold text-sm">{stage.toolName || 'InternalCorrelator'}</span>
                    </div>
                    <div className="p-3.5 rounded-lg bg-[#0b1120] border border-[#1b2844] space-y-1">
                      <span className="text-slate-400 block text-xs">OBSERVED TARGET / QUERY INPUT:</span>
                      <span className="text-slate-200 font-semibold text-sm truncate block">{stage.query || 'Global context traversal'}</span>
                    </div>
                  </div>

                  {stage.resultSummary && (
                    <div className="p-4 rounded-xl bg-[#0c1426] border border-sky-900/50 space-y-1.5">
                      <span className="text-sky-400 font-bold block text-xs tracking-wider uppercase">
                        STAGE SYNTHESIS RESULT & EVIDENCE SUMMARY:
                      </span>
                      <p className="text-slate-100 font-sans text-sm leading-relaxed">
                        {stage.resultSummary}
                      </p>
                    </div>
                  )}

                  {/* Findings Badges */}
                  {stage.findings && stage.findings.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-slate-400 text-xs font-bold block uppercase tracking-wider">
                        CORRELATED TELEMETRY & ATTRIBUTES:
                      </span>
                      <div className="flex flex-wrap gap-2.5">
                        {stage.findings.map(f => (
                          <div
                            key={f.title}
                            className="px-3 py-1.5 rounded-lg bg-[#0c1220] border border-[#1e2d4a] text-xs flex items-center gap-2"
                          >
                            <span className="text-slate-400">{f.title}:</span>
                            <span className="text-slate-100 font-bold">{f.value}</span>
                            {f.badge && (
                              <span className="text-xs px-1.5 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800 font-semibold">
                                {f.badge}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Substeps checklist */}
                  {stage.substeps && stage.substeps.length > 0 && (
                    <div className="pt-2 border-t border-[#152035] space-y-2">
                      <span className="text-slate-400 text-xs font-bold block uppercase tracking-wider">
                        VERIFIED OPERATIONAL SUBSTEPS:
                      </span>
                      <ul className="space-y-2 text-sm text-slate-200 font-sans">
                        {stage.substeps.map((sub, sIdx) => (
                          <li key={sIdx} className="flex items-center gap-2.5 bg-[#090e1a] p-2.5 rounded-lg border border-[#17243c]">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>{sub}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
