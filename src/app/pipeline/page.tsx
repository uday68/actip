'use client';

import React, { useState } from 'react';
import {
  Workflow,
  ArrowDown,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Zap,
  Server,
  Database,
  Layers,
  RefreshCw
} from 'lucide-react';
import { mockPipelineStages } from '@/lib/mock-data/pipeline';
import { PipelineStageMetric } from '@/types/pipeline';
import { StatusBadge } from '@/components/common/StatusBadge';

export default function PipelinePage() {
  const [stages] = useState<PipelineStageMetric[]>(mockPipelineStages);

  return (
    <div className="max-w-[1600px] w-full mx-auto px-6 lg:px-10 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-950/80 border border-sky-700 text-sky-300 font-bold uppercase">
              Data Engineering Telemetry
            </span>
            <span className="text-xs font-mono text-slate-500">Continuous Ingestion & Graph Indexing</span>
          </div>
          <h1 className="text-xl md:text-2xl font-mono font-bold text-slate-100 flex items-center gap-3">
            <span>CTI Ingestion & Normalization Pipeline</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded bg-[#0b101c] border border-[#1b263b] text-xs font-mono text-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Throughput: ~1.2k events/sec</span>
          </div>
        </div>
      </div>

      {/* Production Pipeline Flow Diagram (Vertical Flow per User Spec) */}
      <div className="space-y-4">
        {stages.map((stg, idx) => (
          <React.Fragment key={stg.id}>
            <div className="bg-[#0c111d] border border-[#1d2940] rounded-lg p-4 shadow-lg hover:border-[#2a3c60] transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#182338]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-sky-950 border border-sky-700/80 flex items-center justify-center text-sky-400 font-mono font-bold text-xs">
                    0{stg.order}
                  </div>
                  <div>
                    <h3 className="text-sm font-mono font-bold text-slate-100">
                      {stg.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-sans mt-0.5">
                      {stg.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs">
                  <StatusBadge type="status" value={stg.status} />
                  <span className="text-slate-500 text-[11px]">Last run: {stg.lastRun}</span>
                </div>
              </div>

              {/* Real-time Stage Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3 font-mono text-xs">
                <div className="p-2.5 rounded bg-[#080d16] border border-[#172338]">
                  <span className="text-slate-500 block text-[10px] uppercase">Processed</span>
                  <span className="text-slate-100 font-bold text-sm">
                    {stg.recordsProcessed.toLocaleString()}
                  </span>
                </div>

                <div className="p-2.5 rounded bg-[#080d16] border border-[#172338]">
                  <span className="text-emerald-500 block text-[10px] uppercase">Successful</span>
                  <span className="text-emerald-400 font-bold text-sm">
                    {stg.successful.toLocaleString()}
                  </span>
                </div>

                <div className="p-2.5 rounded bg-[#080d16] border border-[#172338]">
                  <span className="text-rose-500 block text-[10px] uppercase">Failed / Filtered</span>
                  <span className={stg.failed > 0 ? 'text-rose-400 font-bold text-sm' : 'text-slate-400 font-bold text-sm'}>
                    {stg.failed.toLocaleString()}
                  </span>
                </div>

                <div className="p-2.5 rounded bg-[#080d16] border border-[#172338]">
                  <span className="text-sky-500 block text-[10px] uppercase">Mean Latency</span>
                  <span className="text-sky-300 font-bold text-sm">
                    {stg.latencyMs} ms
                  </span>
                </div>

                <div className="p-2.5 rounded bg-[#080d16] border border-[#172338]">
                  <span className="text-slate-500 block text-[10px] uppercase">Error Rate</span>
                  <span className={stg.errorRate > 0.3 ? 'text-amber-400 font-bold text-sm' : 'text-slate-300 font-bold text-sm'}>
                    {stg.errorRate}%
                  </span>
                </div>
              </div>
            </div>

            {/* Connecting Flow Arrow */}
            {idx < stages.length - 1 && (
              <div className="flex justify-center my-1">
                <div className="w-7 h-7 rounded-full bg-[#0b101c] border border-[#1d2b42] flex items-center justify-center text-sky-400">
                  <ArrowDown className="w-3.5 h-3.5" />
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

