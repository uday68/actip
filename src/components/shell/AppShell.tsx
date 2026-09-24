'use client';

import React from 'react';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { GlobalSearchModal } from './GlobalSearchModal';
import { NotificationsDrawer } from './NotificationsDrawer';
import { DemoBanner } from '../common/DemoBanner';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#07090e] text-slate-200 flex flex-col font-sans">
      <DemoBanner />
      <TopBar />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-[#080c14] relative">
          {children}
        </main>
      </div>
      <GlobalSearchModal />
      <NotificationsDrawer />
    </div>
  );
};

