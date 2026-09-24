'use client';

import React from 'react';
import { X, AlertTriangle, CheckCircle2, RefreshCw, ShieldAlert } from 'lucide-react';
import { useCTIStore } from '@/lib/store/cti-store';

export const NotificationsDrawer: React.FC = () => {
  const { isNotificationsOpen, setNotificationsOpen } = useCTIStore();

  if (!isNotificationsOpen) return null;

  const mockAlerts = [
    {
      id: 'notif-1',
      title: 'CISA Emergency Directive 26-02 Added',
      desc: 'CVE-2026-8912 officially added to Known Exploited Vulnerabilities catalog. Mandatory remediation due in 14 days.',
      time: '18 min ago',
      type: 'critical'
    },
    {
      id: 'notif-2',
      title: 'Attribution Pivot Correlated',
      desc: 'Investigator Agent linked TLS JARM 27d36d2d... from 185.220.101.5 to BlackVenom RAT v3.2 payload.',
      time: '42 min ago',
      type: 'info'
    },
    {
      id: 'notif-3',
      title: 'VirusTotal API Connector Warning',
      desc: 'Secondary quota rate limit reached (HTTP 429). Retrying in 15 minutes with exponential backoff.',
      time: '1 hour ago',
      type: 'warning'
    },
    {
      id: 'notif-4',
      title: 'MISP Feed Synchronization Complete',
      desc: 'Ingested 1,420 new observable indicators and 18 threat events from European Aerospace ISAC.',
      time: '2 hours ago',
      type: 'success'
    }
  ];

  return (
    <div className="fixed inset-y-0 right-0 w-80 md:w-96 bg-[#0c111c] border-l border-[#1f2c45] shadow-2xl z-40 flex flex-col animate-in slide-in-from-right duration-200">
      <div className="p-4 border-b border-[#1c273e] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-sky-400" />
          <h3 className="text-xs font-mono font-bold text-slate-100 uppercase tracking-wider">
            SOC Intelligence Alerts
          </h3>
        </div>
        <button
          onClick={() => setNotificationsOpen(false)}
          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {mockAlerts.map(a => {
          let border = 'border-slate-800';
          let icon = <CheckCircle2 className="w-4 h-4 text-slate-400" />;

          if (a.type === 'critical') {
            border = 'border-red-800/70 bg-red-950/20';
            icon = <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />;
          } else if (a.type === 'warning') {
            border = 'border-amber-800/70 bg-amber-950/20';
            icon = <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
          } else if (a.type === 'info') {
            border = 'border-sky-800/70 bg-sky-950/20';
            icon = <RefreshCw className="w-4 h-4 text-sky-400 shrink-0" />;
          } else {
            border = 'border-emerald-800/70 bg-emerald-950/20';
            icon = <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
          }

          return (
            <div key={a.id} className={`p-3 rounded border ${border} transition-colors`}>
              <div className="flex items-start gap-2.5">
                {icon}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-slate-200">{a.title}</h4>
                    <span className="text-[10px] font-mono text-slate-400">{a.time}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{a.desc}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-3 border-t border-[#1c273e] text-center">
        <button
          onClick={() => setNotificationsOpen(false)}
          className="text-xs font-mono text-slate-400 hover:text-sky-300 transition-colors"
        >
          Mark all as acknowledged
        </button>
      </div>
    </div>
  );
};

