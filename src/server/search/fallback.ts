import { db } from '@/server/db/database';
import { resolveTargetIndex } from './query-builder';

export interface SearchHit {
  id: string;
  index: string;
  type: string;
  score: number;
  title: string;
  subtitle: string;
  category: string;
  severity?: string;
  url: string;
  highlight?: Record<string, string[]>;
  source: Record<string, unknown>;
}

export interface SearchResponse {
  success: boolean;
  backend: 'elasticsearch' | 'local_store';
  total: number;
  query: string;
  hits: SearchHit[];
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlightSnippet(text: string, query: string, maxLen: number = 160): string {
  if (!text) return '';
  if (!query.trim()) return text.slice(0, maxLen);

  const words = query.trim().split(/\s+/).filter(Boolean);
  const pattern = new RegExp(`(${words.map(escapeRegex).join('|')})`, 'gi');
  const matchIndex = text.search(pattern);

  let snippet = text;
  if (matchIndex > -1 && text.length > maxLen) {
    const start = Math.max(0, matchIndex - 40);
    const end = Math.min(text.length, start + maxLen);
    snippet = (start > 0 ? '...' : '') + text.substring(start, end) + (end < text.length ? '...' : '');
  } else if (text.length > maxLen) {
    snippet = text.slice(0, maxLen) + '...';
  }

  return snippet.replace(pattern, '<mark class="bg-amber-500/20 text-amber-200 font-semibold px-0.5 rounded">$1</mark>');
}

export function searchLocalStore(q: string, type?: string, limit: number = 20): SearchResponse {
  const query = q.trim().toLowerCase();
  const targetIndex = resolveTargetIndex(type);
  const hits: SearchHit[] = [];

  const shouldSearch = (idx: string) => targetIndex === 'actip_*' || targetIndex === idx;

  // 1. Threat Actors
  if (shouldSearch('actip_threat_actors')) {
    const actors = db.getThreatActors();
    actors.forEach(actor => {
      const matchName = actor.name ? actor.name.toLowerCase().includes(query) : false;
      const matchAliases = Array.isArray(actor.aliases) ? actor.aliases.some(a => a.toLowerCase().includes(query)) : false;
      const matchDesc = actor.description ? actor.description.toLowerCase().includes(query) : false;
      const matchSectors = Array.isArray(actor.targetedSectors) ? actor.targetedSectors.some(s => s.toLowerCase().includes(query)) : false;

      if (!query || matchName || matchAliases || matchDesc || matchSectors) {
        let score = 1.0;
        if (query) {
          if (actor.name && actor.name.toLowerCase() === query) score = 10.0;
          else if (matchName) score = 7.0;
          else if (matchAliases) score = 5.0;
          else if (matchDesc) score = 2.0;
        }

        const highlight: Record<string, string[]> = {};
        if (query && (matchName || matchDesc)) {
          highlight.description = [highlightSnippet(actor.description || '', query)];
        }

        hits.push({
          id: actor.id,
          index: 'actip_threat_actors',
          type: 'threat_actor',
          score,
          title: actor.name,
          subtitle: `Aliases: ${(actor.aliases || []).join(', ')} • ${(actor.confidence || 'HIGH').toUpperCase()} confidence`,
          category: 'Threat Actors',
          severity: 'critical',
          url: `/actors?id=${actor.id}`,
          highlight: Object.keys(highlight).length ? highlight : undefined,
          source: actor as unknown as Record<string, unknown>
        });
      }
    });
  }

  // 2. Malware
  if (shouldSearch('actip_malware')) {
    const malwareList = db.getMalware();
    malwareList.forEach(m => {
      const matchName = m.name ? m.name.toLowerCase().includes(query) : false;
      const matchType = m.type ? m.type.toLowerCase().includes(query) : false;
      const matchCaps = Array.isArray(m.capabilities) ? m.capabilities.some(c => c.toLowerCase().includes(query)) : false;

      if (!query || matchName || matchType || matchCaps) {
        let score = 1.0;
        if (query) {
          if (m.name && m.name.toLowerCase() === query) score = 10.0;
          else if (matchName) score = 7.0;
          else if (matchCaps) score = 4.0;
        }

        const highlight: Record<string, string[]> = {};
        if (query && matchCaps) {
          highlight.capabilities = [highlightSnippet((m.capabilities || []).join(', '), query)];
        }

        hits.push({
          id: m.id,
          index: 'actip_malware',
          type: 'malware',
          score,
          title: m.name,
          subtitle: `${m.type} • Active C2 Nodes: ${m.activeC2Nodes}`,
          category: 'Malware',
          severity: 'critical',
          url: `/malware?id=${m.id}`,
          highlight: Object.keys(highlight).length ? highlight : undefined,
          source: m as unknown as Record<string, unknown>
        });
      }
    });
  }

  // 3. IOCs
  if (shouldSearch('actip_iocs')) {
    const iocs = db.getIocs();
    iocs.forEach(ioc => {
      const matchInd = ioc.indicator ? ioc.indicator.toLowerCase().includes(query) : false;
      const matchType = ioc.type ? ioc.type.toLowerCase().includes(query) : false;
      const matchAsn = ioc.asn ? ioc.asn.toLowerCase().includes(query) : false;
      const matchMal = Array.isArray(ioc.associatedMalware) ? ioc.associatedMalware.some(m => m.toLowerCase().includes(query)) : false;

      if (!query || matchInd || matchType || matchAsn || matchMal) {
        let score = 1.0;
        if (query) {
          if (ioc.indicator.toLowerCase() === query) score = 10.0;
          else if (matchInd) score = 8.0;
          else if (matchAsn) score = 3.0;
        }

        const highlight: Record<string, string[]> = {};
        if (query && matchInd) {
          highlight.indicator = [highlightSnippet(ioc.indicator, query)];
        }

        hits.push({
          id: ioc.id,
          index: 'actip_iocs',
          type: 'ioc',
          score,
          title: ioc.indicator,
          subtitle: `${ioc.type.toUpperCase()} • ${ioc.country || ioc.asn || 'Malicious'} • Rep: ${ioc.reputationScore}/100`,
          category: 'Infrastructure',
          severity: ioc.severity,
          url: `/iocs?indicator=${encodeURIComponent(ioc.indicator)}`,
          highlight: Object.keys(highlight).length ? highlight : undefined,
          source: ioc as unknown as Record<string, unknown>
        });
      }
    });
  }

  // 4. CVEs
  if (shouldSearch('actip_cves')) {
    const cves = db.getCves();
    cves.forEach(cve => {
      const matchId = cve.id.toLowerCase().includes(query);
      const matchTitle = cve.title.toLowerCase().includes(query);
      const matchDesc = cve.description.toLowerCase().includes(query);

      if (!query || matchId || matchTitle || matchDesc) {
        let score = 1.0;
        if (query) {
          if (cve.id.toLowerCase() === query) score = 10.0;
          else if (matchId) score = 8.0;
          else if (matchTitle) score = 5.0;
          else if (matchDesc) score = 2.0;
        }

        const highlight: Record<string, string[]> = {};
        if (query && (matchTitle || matchDesc)) {
          highlight.description = [highlightSnippet(cve.description, query)];
        }

        hits.push({
          id: cve.id,
          index: 'actip_cves',
          type: 'cve',
          score,
          title: cve.id,
          subtitle: `CVSS ${cve.cvss} • KEV: ${cve.cisaKev ? 'YES' : 'NO'} • Org Impact: ${cve.affectsOrganization}`,
          category: 'Vulnerabilities',
          severity: cve.severity,
          url: `/cves?id=${cve.id}`,
          highlight: Object.keys(highlight).length ? highlight : undefined,
          source: cve as unknown as Record<string, unknown>
        });
      }
    });
  }

  // 5. Evidence (from investigation claims)
  if (shouldSearch('actip_evidence')) {
    const investigations = db.getInvestigations();
    investigations.forEach(inv => {
      if (inv && Array.isArray(inv.claims)) {
        inv.claims.forEach(claim => {
          const matchClaim = claim.claimText ? claim.claimText.toLowerCase().includes(query) : false;
          (claim.supportingEvidence || []).forEach(ev => {
            const matchSource = ev.sourceName ? ev.sourceName.toLowerCase().includes(query) : false;
            const matchExcerpt = ev.excerpt ? ev.excerpt.toLowerCase().includes(query) : false;
            const matchRel = ev.relationship ? ev.relationship.toLowerCase().includes(query) : false;

            if (!query || matchClaim || matchSource || matchExcerpt || matchRel) {
              let score = 1.0;
              if (query) {
                if (matchSource) score = 4.0;
                if (matchExcerpt) score = 3.0;
              }

              const highlight: Record<string, string[]> = {};
              if (query && matchExcerpt) {
                highlight.excerpt = [highlightSnippet(ev.excerpt || '', query)];
              }

              hits.push({
                id: ev.id,
                index: 'actip_evidence',
                type: 'evidence',
                score,
                title: `${ev.sourceName}: ${ev.relationship}`,
                subtitle: `Claim: ${(claim.claimText || '').slice(0, 80)}... • Reliability: ${ev.reliabilityScore}%`,
                category: 'Evidence',
                severity: 'medium',
                url: `/investigate?claimId=${claim.id}`,
                highlight: Object.keys(highlight).length ? highlight : undefined,
                source: {
                  ...ev,
                  claimId: claim.id,
                  claimText: claim.claimText
                }
              });
            }
          });
        });
      }
    });
  }

  // Sort by score desc
  hits.sort((a, b) => b.score - a.score);

  return {
    success: true,
    backend: 'local_store',
    total: hits.length,
    query: q,
    hits: hits.slice(0, limit)
  };
}
