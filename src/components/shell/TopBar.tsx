'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldAlert,
  Search,
  PlusCircle,
  Bell,
  Activity,
  Terminal,
  UserCheck,
  ChevronDown
} from 'lucide-react';
import { useCTIStore } from '@/lib/store/cti-store';

export const TopBar: React.FC = () => {
  const router = useRouter();
  const {
    isInvestigating,
    investigationProgress,
    currentStageIndex,
    activeInvestigation,
    setSearchOpen,
    isNotificationsOpen,
    setNotificationsOpen,
    analystProfile
  } = useCTIStore();

  return (
    <header className="h-14 bg-[#0a0e17] border-b border-[#1c273c] px-4 flex items-center justify-between select-none z-30 sticky top-0">
      {/* Brand & Platform Identifier */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded bg-sky-950/80 border border-sky-600/60 flex items-center justify-center text-sky-400 group-hover:border-sky-400 transition-colors">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm tracking-wider text-slate-100">
                ACTIP
              </span>
              <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-sky-950 border border-sky-800 text-sky-300">
                AGENTIC CTI
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-none hidden sm:block">
              Evidence-Grounded Threat Intelligence Investigation
            </p>
          </div>
        </Link>
      </div>

      {/* Global Search Bar (Hotkeyed) */}
      <div className="flex-1 max-w-md mx-6 hidden md:block">
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded bg-[#0f1523] border border-[#1e2a44] text-xs text-slate-400 hover:border-sky-700/60 hover:text-slate-200 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-mono text-slate-400">Search IOC, CVE, Actor, Malware, TTP...</span>
          </div>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-400">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Action Controls & Analyst Profile */}
      <div className="flex items-center gap-3">
        {/* Live Investigation Pipeline Status */}
        <Link
          href="/investigate"
          className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#0f1626] border border-[#1d2b45] text-xs font-mono hover:border-sky-600/70 transition-colors"
        >
          {isInvestigating ? (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="text-amber-300">
                Investigating Stage {currentStageIndex + 1}/9 ({investigationProgress}%)
              </span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-slate-300 hidden lg:inline">Investigation Desk:</span>
              <span className="text-emerald-300 font-semibold">{activeInvestigation.id}</span>
            </>
          )}
        </Link>

        {/* New Investigation Button */}
        <button
          type="button"
          onClick={() => router.push('/investigate')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-slate-950 font-medium text-xs tracking-wide transition-colors font-mono shadow-sm"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Investigation</span>
        </button>

        {/* Notifications Trigger */}
        <button
          type="button"
          onClick={() => setNotificationsOpen(!isNotificationsOpen)}
          className="relative p-2 rounded bg-[#0f1626] border border-[#1d2b45] text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
          title="SOC Alert Stream"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
        </button>

        {/* Analyst Profile Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#1c273c]">
          <div className="w-7 h-7 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-mono text-slate-300 font-semibold">
            SV
          </div>
          <div className="hidden xl:block text-left text-xs">
            <div className="text-slate-200 font-medium leading-tight flex items-center gap-1">
              <span>{analystProfile.name}</span>
              <span className="text-[10px] text-sky-400 font-mono">[{analystProfile.badgeId}]</span>
            </div>
            <div className="text-[10px] text-slate-400 leading-tight">
              {analystProfile.role}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

