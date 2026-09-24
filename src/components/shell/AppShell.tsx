'use client';

import React, { useEffect } from 'react';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { GlobalSearchModal } from './GlobalSearchModal';
import { NotificationsDrawer } from './NotificationsDrawer';
import { DemoBanner } from '../common/DemoBanner';
import { useCTIStore } from '@/lib/store/cti-store';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { theme, setTheme } = useCTIStore();

  useEffect(() => {
    const savedTheme = localStorage.getItem('actip_theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, [setTheme]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (theme === 'light') {
        document.documentElement.classList.remove('theme-dark', 'dark');
        document.documentElement.classList.add('theme-light', 'light');
      } else {
        document.documentElement.classList.remove('theme-light', 'light');
        document.documentElement.classList.add('theme-dark', 'dark');
      }
    }
  }, [theme]);

  const isLight = theme === 'light';

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-150 ${
      isLight ? 'theme-light bg-[#f8fafc] text-slate-900' : 'theme-dark bg-[#080c14] text-slate-100'
    }`}>
      <DemoBanner />
      <TopBar />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />
        <main className={`flex-1 overflow-y-auto relative transition-colors duration-150 ${
          isLight ? 'bg-[#f8fafc]' : 'bg-[#080c14]'
        }`}>
          {children}
        </main>
      </div>
      <GlobalSearchModal />
      <NotificationsDrawer />
    </div>
  );
};
