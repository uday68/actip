import {
  IOCRecord,
  ThreatActor,
  MalwareFamily,
  ThreatCampaign,
  CVERecord,
  AttackTechnique,
} from '@/types/cti';
import { InvestigationResult } from '@/types/investigation';
import { PipelineStageMetric, SourceConnector } from '@/types/pipeline';
import { ThreatReport } from '@/lib/mock-data/reports';
import { GraphNodeItem } from '@/lib/mock-data/graph';
import { primaryInvestigation } from '@/lib/mock-data/investigations';

export interface GlobalSearchResult {
  category: 'Threat Actors' | 'Malware' | 'Campaigns' | 'Infrastructure' | 'Vulnerabilities' | 'Techniques' | 'Reports';
  id: string;
  title: string;
  subtitle: string;
  severity?: string;
  url: string;
}

export const ctiService = {
  async getInvestigation(id?: string): Promise<InvestigationResult> {
    try {
      const url = id ? `/api/investigations/${id}` : '/api/investigations';
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (id && json.data) return json.data;
        if (Array.isArray(json.data) && json.data.length > 0) return json.data[0];
      }
    } catch (e) {
      console.warn('Backend fetch failed, using fallback:', e);
    }
    return primaryInvestigation;
  },

  async listInvestigations() {
    try {
      const res = await fetch('/api/investigations');
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.data)) {
          return json.data.map((inv: InvestigationResult) => ({
            id: inv.id,
            name: `Investigation: ${inv.query.split(',')[0]}`,
            query: inv.query,
            type: inv.type,
            status: inv.status,
            statusColor: inv.status === 'completed' ? 'verified' : 'running',
            confidence: `${inv.confidence.toUpperCase()} (${inv.confidenceScore}%)`,
            confidenceScore: inv.confidenceScore,
            updated: inv.updatedAt,
            analyst: inv.analyst,
            verdict: 'Malicious (APT-84)',
            entities: inv.relatedEntities?.length || 18,
            evidenceCount: inv.sourcesCount || 9
          }));
        }
      }
    } catch (e) {}

    // Fallback if needed
    const { recentInvestigationsTable } = await import('@/lib/mock-data/investigations');
    return recentInvestigationsTable;
  },

  async startInvestigation(query: string): Promise<InvestigationResult> {
    try {
      const res = await fetch('/api/investigations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) return json.data;
      }
    } catch (e) {
      console.error('Failed to trigger investigation API:', e);
    }
    return primaryInvestigation;
  },

  async getIocs(): Promise<IOCRecord[]> {
    try {
      const res = await fetch('/api/iocs');
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.data)) return json.data;
      }
    } catch (e) {}
    const { mockIocs } = await import('@/lib/mock-data/iocs');
    return mockIocs;
  },

  async enrichIoc(indicator: string): Promise<IOCRecord | null> {
    try {
      const res = await fetch('/api/iocs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ indicator })
      });
      if (res.ok) {
        const json = await res.json();
        return json.data || null;
      }
    } catch (e) {}
    return null;
  },

  async getThreatActors(): Promise<ThreatActor[]> {
    try {
      const res = await fetch('/api/threat-actors');
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.data)) return json.data;
      }
    } catch (e) {}
    const { mockThreatActors } = await import('@/lib/mock-data/actors');
    return mockThreatActors;
  },

  async getMalware(): Promise<MalwareFamily[]> {
    try {
      const res = await fetch('/api/malware');
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.data)) return json.data;
      }
    } catch (e) {}
    const { mockMalware } = await import('@/lib/mock-data/malware');
    return mockMalware;
  },

  async getCampaigns(): Promise<ThreatCampaign[]> {
    try {
      const res = await fetch('/api/campaigns');
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.data)) return json.data;
      }
    } catch (e) {}
    const { mockCampaigns } = await import('@/lib/mock-data/campaigns');
    return mockCampaigns;
  },

  async getCves(): Promise<CVERecord[]> {
    try {
      const res = await fetch('/api/cves');
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.data)) return json.data;
      }
    } catch (e) {}
    const { mockCves } = await import('@/lib/mock-data/cves');
    return mockCves;
  },

  async getAttackMatrix(): Promise<Record<string, AttackTechnique[]>> {
    try {
      const res = await fetch('/api/attack');
      if (res.ok) {
        const json = await res.json();
        if (json.data) return json.data;
      }
    } catch (e) {}
    const { mockAttackMatrix } = await import('@/lib/mock-data/attack');
    return mockAttackMatrix;
  },

  async getKnowledgeGraph(): Promise<{ nodes: GraphNodeItem[]; edges: any[] }> {
    try {
      const res = await fetch('/api/graph');
      if (res.ok) {
        const json = await res.json();
        if (json.data) return json.data;
      }
    } catch (e) {}
    const { initialGraphNodes, initialGraphEdges } = await import('@/lib/mock-data/graph');
    return { nodes: initialGraphNodes, edges: initialGraphEdges };
  },

  async getPipelineStages(): Promise<PipelineStageMetric[]> {
    try {
      const res = await fetch('/api/pipeline');
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.data)) return json.data;
      }
    } catch (e) {}
    const { mockPipelineStages } = await import('@/lib/mock-data/pipeline');
    return mockPipelineStages;
  },

  async getSourceConnectors(): Promise<SourceConnector[]> {
    try {
      const res = await fetch('/api/sources');
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.data)) return json.data;
      }
    } catch (e) {}
    const { mockSourceConnectors } = await import('@/lib/mock-data/pipeline');
    return mockSourceConnectors;
  },

  async syncSource(sourceId: string) {
    try {
      const res = await fetch('/api/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceId })
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return null;
  },

  async getReport(id?: string): Promise<ThreatReport> {
    try {
      const url = id ? `/api/reports?id=${id}` : '/api/reports';
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (id && json.data) return json.data;
        if (Array.isArray(json.data) && json.data.length > 0) return json.data[0];
      }
    } catch (e) {}
    const { mockReport } = await import('@/lib/mock-data/reports');
    return mockReport;
  },

  async generateReport(investigationId: string): Promise<ThreatReport | null> {
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ investigationId })
      });
      if (res.ok) {
        const json = await res.json();
        return json.data || null;
      }
    } catch (e) {}
    return null;
  },

  async globalSearch(query: string): Promise<GlobalSearchResult[]> {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const results: GlobalSearchResult[] = [];

    const actors = await this.getThreatActors();
    actors.forEach(actor => {
      if (actor.name.toLowerCase().includes(q) || actor.aliases.some(a => a.toLowerCase().includes(q))) {
        results.push({
          category: 'Threat Actors',
          id: actor.id,
          title: actor.name,
          subtitle: `Aliases: ${actor.aliases.join(', ')} • ${actor.confidence.toUpperCase()} confidence`,
          severity: 'critical',
          url: `/actors?id=${actor.id}`
        });
      }
    });

    const malware = await this.getMalware();
    malware.forEach(m => {
      if (m.name.toLowerCase().includes(q) || m.type.toLowerCase().includes(q)) {
        results.push({
          category: 'Malware',
          id: m.id,
          title: m.name,
          subtitle: `${m.type} • Active C2 Nodes: ${m.activeC2Nodes}`,
          severity: 'critical',
          url: `/malware?id=${m.id}`
        });
      }
    });

    const iocs = await this.getIocs();
    iocs.forEach(ioc => {
      if (ioc.indicator.toLowerCase().includes(q) || ioc.type.toLowerCase().includes(q) || (ioc.asn && ioc.asn.toLowerCase().includes(q))) {
        results.push({
          category: 'Infrastructure',
          id: ioc.id,
          title: ioc.indicator,
          subtitle: `${ioc.type.toUpperCase()} • ${ioc.country || ioc.asn || 'Malicious'} • Rep: ${ioc.reputationScore}/100`,
          severity: ioc.severity,
          url: `/iocs?indicator=${encodeURIComponent(ioc.indicator)}`
        });
      }
    });

    const cves = await this.getCves();
    cves.forEach(cve => {
      if (cve.id.toLowerCase().includes(q) || cve.title.toLowerCase().includes(q)) {
        results.push({
          category: 'Vulnerabilities',
          id: cve.id,
          title: cve.id,
          subtitle: `CVSS ${cve.cvss} • KEV: ${cve.cisaKev ? 'YES' : 'NO'} • Org Impact: ${cve.affectsOrganization}`,
          severity: cve.severity,
          url: `/cves?id=${cve.id}`
        });
      }
    });

    const campaigns = await this.getCampaigns();
    campaigns.forEach(c => {
      if (c.name.toLowerCase().includes(q) || c.codename.toLowerCase().includes(q)) {
        results.push({
          category: 'Campaigns',
          id: c.id,
          title: c.name,
          subtitle: `Codename: ${c.codename} • Actors: ${c.associatedActors.join(', ')}`,
          severity: 'high',
          url: `/campaigns?id=${c.id}`
        });
      }
    });

    return results;
  }
};
