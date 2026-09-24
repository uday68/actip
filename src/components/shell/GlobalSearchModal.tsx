'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, ShieldAlert, Bug, Crosshair, Server, AlertTriangle, Layers, FileText, ArrowRight } from 'lucide-react';
import { useCTIStore } from '@/lib/store/cti-store';
import { ctiService, GlobalSearchResult } from '@/lib/api/cti-service';

export const GlobalSearchModal: React.FC = () => {
  const router = useRouter();
  const { isSearchOpen, setSearchOpen } = useCTIStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GlobalSearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(!isSearchOpen);
      } else if (e.key === 'Escape' && isSearchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setSearchOpen]);

  // Auto focus input when opened
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      ctiService.globalSearch(query).then(setResults);
    }
  }, [isSearchOpen]);

  const handleSearch = async (val: string) => {
    setQuery(val);
    const res = await ctiService.globalSearch(val);
    setResults(res);
  };

  const handleSelect = (url: string) => {
    setSearchOpen(false);
    router.push(url);
  };

  if (!isSearchOpen) return null;

  // Group results by category
  const categories = Array.from(new Set(results.map(r => r.category)));

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Threat Actors':
        return <ShieldAlert className="w-3.5 h-3.5 text-red-400" />;
      case 'Malware':
        return <Bug className="w-3.5 h-3.5 text-purple-400" />;
      case 'Campaigns':
        return <Crosshair className="w-3.5 h-3.5 text-orange-400" />;
      case 'Infrastructure':
        return <Server className="w-3.5 h-3.5 text-cyan-400" />;
      case 'Vulnerabilities':
        return <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />;
      case 'Techniques':
        return <Layers className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-start justify-center pt-16 px-4">
      <div className="bg-[#0e1320] border border-[#22314d] rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-[#1c283f] gap-3">
          <Search className="w-5 h-5 text-sky-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Search IP, domain, hash, CVE-2026-..., APT actor, malware family..."
            className="bg-transparent text-sm text-slate-100 placeholder-slate-500 w-full focus:outline-none font-mono"
          />
          {query && (
            <button
              onClick={() => handleSearch('')}
              className="text-slate-400 hover:text-white p-1 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setSearchOpen(false)}
            className="text-xs font-mono text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 border border-slate-700"
          >
            ESC
          </button>
        </div>

        {/* Search Results / Suggestions */}
        <div className="max-h-[60vh] overflow-y-auto p-3 divide-y divide-[#182338]">
          {query.trim() === '' ? (
            <div className="py-6 px-4 text-center">
              <p className="text-xs text-slate-400 mb-3">Try searching for high-priority intelligence entities:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['185.220.101.5', 'CVE-2026-8912', 'APT-84', 'BlackVenom RAT', 'T1190', 'quantum-defense.org'].map(term => (
                  <button
                    key={term}
                    onClick={() => handleSearch(term)}
                    className="px-2.5 py-1 text-xs font-mono rounded bg-[#131b2c] border border-[#202e48] text-sky-300 hover:border-sky-500 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No intelligence entities found matching &quot;<span className="text-slate-200">{query}</span>&quot;
            </div>
          ) : (
            categories.map(cat => (
              <div key={cat} className="py-2.5 first:pt-0 last:pb-0">
                <div className="flex items-center gap-2 text-[11px] font-mono font-semibold uppercase text-slate-400 tracking-wider mb-1.5 px-2">
                  {getCategoryIcon(cat)}
                  <span>{cat}</span>
                </div>
                <div className="space-y-1">
                  {results
                    .filter(r => r.category === cat)
                    .map(item => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelect(item.url)}
                        className="w-full text-left px-3 py-2 rounded bg-[#111726]/70 hover:bg-[#182238] border border-transparent hover:border-[#2a3c61] flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <div className="text-xs font-mono font-semibold text-slate-200 group-hover:text-sky-300">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate max-w-lg">
                            {item.subtitle}
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 transition-transform group-hover:translate-x-0.5 shrink-0" />
                      </button>
                    ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="bg-[#090d16] px-4 py-2 border-t border-[#1a253a] flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Targeting: Local CTI Knowledge Graph & TAXII Cache</span>
          <span>Press <kbd className="text-slate-300 font-bold">ENTER</kbd> to view details</span>
        </div>
      </div>
    </div>
  );
};

