import React from 'react';
import { EntityType } from '@/types/cti';
import {
  ShieldAlert,
  Bug,
  Crosshair,
  Server,
  Globe,
  Link2,
  Binary,
  AlertTriangle,
  Layers,
  Building2
} from 'lucide-react';

interface EntityPillProps {
  type: EntityType;
  label: string;
  onClick?: () => void;
  className?: string;
}

export const EntityPill: React.FC<EntityPillProps> = ({
  type,
  label,
  onClick,
  className = ''
}) => {
  const getIcon = () => {
    switch (type) {
      case 'actor':
        return <ShieldAlert className="w-3.5 h-3.5 text-red-400" />;
      case 'malware':
        return <Bug className="w-3.5 h-3.5 text-purple-400" />;
      case 'campaign':
        return <Crosshair className="w-3.5 h-3.5 text-orange-400" />;
      case 'ip':
        return <Server className="w-3.5 h-3.5 text-cyan-400" />;
      case 'domain':
        return <Globe className="w-3.5 h-3.5 text-blue-400" />;
      case 'url':
        return <Link2 className="w-3.5 h-3.5 text-indigo-400" />;
      case 'hash':
        return <Binary className="w-3.5 h-3.5 text-amber-400" />;
      case 'cve':
        return <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />;
      case 'technique':
        return <Layers className="w-3.5 h-3.5 text-emerald-400" />;
      case 'organization':
        return <Building2 className="w-3.5 h-3.5 text-slate-400" />;
      default:
        return <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'actor':
        return 'border-red-800/60 bg-red-950/30 text-red-200';
      case 'malware':
        return 'border-purple-800/60 bg-purple-950/30 text-purple-200';
      case 'campaign':
        return 'border-orange-800/60 bg-orange-950/30 text-orange-200';
      case 'ip':
        return 'border-cyan-800/60 bg-cyan-950/30 text-cyan-200';
      case 'domain':
        return 'border-blue-800/60 bg-blue-950/30 text-blue-200';
      case 'hash':
        return 'border-amber-800/60 bg-amber-950/30 text-amber-200';
      case 'cve':
        return 'border-rose-800/60 bg-rose-950/30 text-rose-200';
      case 'technique':
        return 'border-emerald-800/60 bg-emerald-950/30 text-emerald-200';
      default:
        return 'border-slate-700 bg-slate-900/60 text-slate-300';
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono font-medium border transition-colors ${getBorderColor()} ${
        onClick ? 'hover:brightness-125 cursor-pointer' : 'cursor-default'
      } ${className}`}
    >
      {getIcon()}
      <span className="truncate max-w-[200px]">{label}</span>
    </button>
  );
};

