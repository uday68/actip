import React from 'react';

interface ConfidenceBarProps {
  score: number; // 0 to 100
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export const ConfidenceBar: React.FC<ConfidenceBarProps> = ({
  score,
  showLabel = true,
  size = 'md'
}) => {
  const clamped = Math.max(0, Math.min(100, score));

  let colorClass = 'bg-emerald-500';
  let textClass = 'text-emerald-400';
  let label = 'High';

  if (clamped < 50) {
    colorClass = 'bg-slate-500';
    textClass = 'text-slate-400';
    label = 'Low';
  } else if (clamped < 75) {
    colorClass = 'bg-amber-500';
    textClass = 'text-amber-400';
    label = 'Moderate';
  } else if (clamped < 90) {
    colorClass = 'bg-sky-500';
    textClass = 'text-sky-400';
    label = 'Strong';
  } else {
    colorClass = 'bg-emerald-500';
    textClass = 'text-emerald-400';
    label = 'Very Strong';
  }

  const heightClass = size === 'sm' ? 'h-1.5' : 'h-2';

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex items-center justify-between text-xs mb-1 font-mono">
          <span className="text-slate-400">Confidence: <span className={textClass}>{label}</span></span>
          <span className="text-slate-200 font-semibold">{clamped}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-800/80 rounded-full overflow-hidden ${heightClass} border border-slate-700/50`}>
        <div
          className={`${heightClass} rounded-full transition-all duration-500 ${colorClass}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};

