import '@/styles/globals.css';
import type { Metadata } from 'next';
import { AppShell } from '@/components/shell/AppShell';

export const metadata: Metadata = {
  title: 'ACTIP | Evidence-Grounded Agentic Cyber Threat Intelligence Investigation Platform',
  description: 'Enterprise AI-powered Cyber Threat Intelligence Investigation System for SOC & Threat Hunting',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#07090e] text-slate-200 antialiased selection:bg-sky-500/30 selection:text-sky-200">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

