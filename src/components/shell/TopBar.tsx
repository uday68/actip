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
  ChevronDown,
  Sun,
  Moon
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
    analystProfile,
    theme,
    toggleTheme
  } = useCTIStore();

  const isLight = theme === 'light';

  return (
    <header className="h-14 px-4 flex items-center justify-between select-none z-30 sticky top-0 transition-colors duration-150 border-b">
      {/* Brand & Platform Identifier */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-sky-600/20 border border-sky-500 flex items-center justify-center text-sky-400 group-hover:border-sky-400 transition-colors shadow-sm">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm tracking-wider">
                ACTIP
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-600/20 border border-sky-500 text-sky-500 font-bold">
                AGENTIC CTI
              </span>
            </div>
            <p className="text-[10px] opacity-70 leading-none hidden sm:block">
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
          className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg border text-xs transition-colors ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
              : 'bg-[#0f1523] hover:border-sky-700/60 border-[#1e2a44] text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 opacity-60" />
            <span className="font-mono">Search IOC, CVE, Actor, Malware, TTP...</span>
          </div>
          <kbd className={`px-1.5 py-0.5 rounded border text-[10px] font-mono ${
            isLight ? 'bg-white border-slate-300 text-slate-600' : 'bg-slate-800 border-slate-700 text-slate-400'
          }`}>
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Action Controls & Analyst Profile */}
      <div className="flex items-center gap-2.5">
        {/* Live Investigation Pipeline Status */}
        <Link
          href="/investigate"
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
              : 'bg-[#0f1626] hover:border-sky-600/70 border-[#1d2b45]'
          }`}
        >
          {isInvestigating ? (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span className="text-amber-600 font-bold">
                Stage {currentStageIndex + 1}/9 ({investigationProgress}%)
              </span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="opacity-70 hidden lg:inline">Desk:</span>
              <span className="text-emerald-600 font-bold">{activeInvestigation.id}</span>
            </>
          )}
        </Link>

        {/* Theme Switcher Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all shadow-sm ${
            isLight
              ? 'bg-amber-100/80 hover:bg-amber-100 border-amber-300 text-amber-900'
              : 'bg-[#141d30] hover:bg-[#1a263e] border-[#253556] text-sky-300'
          }`}
          title={isLight ? 'Switch to Dark Mode' : 'Switch to High-Visibility Light Mode'}
        >
          {isLight ? (
            <>
              <Sun className="w-4 h-4 text-amber-600 fill-amber-500/20" />
              <span>Light Theme</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-sky-400 fill-sky-400/20" />
              <span>Dark Theme</span>
            </>
          )}
        </button>

        {/* New Investigation Button */}
        <button
          type="button"
          onClick={() => router.push('/investigate')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs tracking-wide transition-colors font-mono shadow-sm"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Investigation</span>
        </button>

        {/* Notifications Trigger */}
        <button
          type="button"
          onClick={() => setNotificationsOpen(!isNotificationsOpen)}
          className={`relative p-2 rounded-lg border transition-colors ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
              : 'bg-[#0f1626] hover:border-slate-600 border-[#1d2b45] text-slate-300 hover:text-white'
          }`}
          title="SOC Alert Stream"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
        </button>

        {/* Analyst Profile Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-300 dark:border-slate-700">
          <div className="w-7 h-7 rounded-lg bg-sky-700 text-white flex items-center justify-center text-xs font-mono font-bold shadow-sm">
            SV
          </div>
          <div className="hidden xl:block text-left text-xs">
            <div className="font-semibold leading-tight flex items-center gap-1">
              <span>{analystProfile.name}</span>
              <span className="text-[10px] text-sky-600 font-mono font-bold">[{analystProfile.badgeId}]</span>
            </div>
            <div className="text-[10px] opacity-70 leading-tight">
              {analystProfile.role}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
