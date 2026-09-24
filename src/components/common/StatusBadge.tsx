import React from 'react';
import { Severity, VerificationState } from '@/types/cti';

interface StatusBadgeProps {
  type?: 'severity' | 'verification' | 'stage' | 'status';
  value: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  type = 'severity',
  value,
  size = 'sm'
}) => {
  const v = value.toLowerCase();
  let bg = 'bg-slate-800/80 text-slate-300 border-slate-700';

  if (v === 'critical' || v === 'failed' || v === 'red') {
    bg = 'bg-red-950/60 text-red-300 border-red-800/80';
  } else if (v === 'high' || v === 'warning' || v === 'amber') {
    bg = 'bg-orange-950/60 text-orange-300 border-orange-800/80';
  } else if (v === 'medium') {
    bg = 'bg-amber-950/60 text-amber-300 border-amber-800/80';
  } else if (v === 'low' || v === 'green') {
    bg = 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80';
  } else if (v === 'info' || v === 'running' || v === 'syncing') {
    bg = 'bg-sky-950/60 text-sky-300 border-sky-800/80';
  } else if (v === 'completed' || v === 'verified' || v === 'source_fact' || v === 'analyst_verified') {
    bg = 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80';
  } else if (v === 'ai_interpretation') {
    bg = 'bg-indigo-950/60 text-indigo-300 border-indigo-800/80';
  } else if (v === 'unverified') {
    bg = 'bg-slate-900 text-slate-400 border-slate-700';
  }

  const formatLabel = (text: string) => {
    switch (text) {
      case 'source_fact':
        return 'SOURCE FACT';
      case 'ai_interpretation':
        return 'AI INFERENCE';
      case 'analyst_verified':
        return 'ANALYST VERIFIED';
      case 'unverified':
        return 'UNVERIFIED';
      default:
        return text.toUpperCase();
    }
  };

  const pad = size === 'sm' ? 'px-1.5 py-0.5 text-[11px]' : 'px-2 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center font-mono font-medium border rounded tracking-wider uppercase whitespace-nowrap ${pad} ${bg}`}
    >
      {formatLabel(v)}
    </span>
  );
};

