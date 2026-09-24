'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  SearchCode,
  Binary,
  ShieldAlert,
  Bug,
  Crosshair,
  AlertTriangle,
  Layers,
  Network,
  CalendarDays,
  FileText,
  Database,
  Workflow,
  Settings,
  ChevronLeft,
  ChevronRight,
  Flame
} from 'lucide-react';
import { useCTIStore } from '@/lib/store/cti-store';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { isInvestigating } = useCTIStore();

  const navItems: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    {
      name: 'Investigate',
      href: '/investigate',
      icon: SearchCode,
      badge: isInvestigating ? 'ACTIVE' : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-600/50'
    },
    { name: 'IOCs', href: '/iocs', icon: Binary },
    { name: 'Threat Actors', href: '/actors', icon: ShieldAlert },
    { name: 'Malware', href: '/malware', icon: Bug },
    { name: 'Campaigns', href: '/campaigns', icon: Crosshair },
    { name: 'CVEs', href: '/cves', icon: AlertTriangle, badge: 'KEV', badgeColor: 'bg-red-950 text-red-300 border-red-800' },
    { name: 'MITRE ATT&CK', href: '/attack', icon: Layers },
    { name: 'Knowledge Graph', href: '/graph', icon: Network },
    { name: 'Threat Timeline', href: '/timeline', icon: CalendarDays },
    { name: 'Reports', href: '/reports', icon: FileText },
    { name: 'Data Sources', href: '/sources', icon: Database },
    { name: 'Pipeline Health', href: '/pipeline', icon: Workflow },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside
      className={`h-[calc(100vh-3.5rem)] bg-[#0a0e17] border-r border-[#1c273c] flex flex-col justify-between transition-all duration-200 select-none z-20 ${
        collapsed ? 'w-16' : 'w-56'
      }`}
    >
      <div className="py-3 overflow-y-auto flex-1 px-2 space-y-1">
        {navItems.map(item => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded text-xs font-medium transition-colors group relative ${
                isActive
                  ? 'bg-sky-950/60 text-sky-300 border border-sky-800/80'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#121927] border border-transparent'
              }`}
              title={collapsed ? item.name : undefined}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-sky-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
              {!collapsed && (
                <div className="flex items-center justify-between flex-1 truncate">
                  <span className="truncate">{item.name}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono px-1 py-0.2 rounded border font-semibold ml-1.5 shrink-0 ${
                        item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Collapse Toggle Footer */}
      <div className="p-2 border-t border-[#1c273c] flex items-center justify-between text-xs text-slate-500">
        {!collapsed && (
          <div className="flex items-center gap-1.5 px-2 font-mono text-[10px] text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>TLP:AMBER ENV</span>
          </div>
        )}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors mx-auto"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};

