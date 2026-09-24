import fs from 'fs';
import path from 'path';
import {
  IOCRecord,
  ThreatActor,
  MalwareFamily,
  ThreatCampaign,
  CVERecord,
  AttackTechnique,
  GraphNodeData,
  GraphEdgeData
} from '@/types/cti';
import { InvestigationResult } from '@/types/investigation';
import { PipelineStageMetric, SourceConnector } from '@/types/pipeline';
import { ThreatReport } from '@/lib/mock-data/reports';
import { primaryInvestigation, recentInvestigationsTable } from '@/lib/mock-data/investigations';
import { mockIocs } from '@/lib/mock-data/iocs';
import { mockThreatActors } from '@/lib/mock-data/actors';
import { mockMalware } from '@/lib/mock-data/malware';
import { mockCves } from '@/lib/mock-data/cves';
import { mockCampaigns } from '@/lib/mock-data/campaigns';
import { mockAttackMatrix } from '@/lib/mock-data/attack';
import { initialGraphNodes, initialGraphEdges, GraphNodeItem } from '@/lib/mock-data/graph';
import { mockPipelineStages, mockSourceConnectors } from '@/lib/mock-data/pipeline';
import { mockReport } from '@/lib/mock-data/reports';

interface DatabaseSchema {
  investigations: Record<string, InvestigationResult>;
  iocs: Record<string, IOCRecord>;
  threatActors: Record<string, ThreatActor>;
  malware: Record<string, MalwareFamily>;
  campaigns: Record<string, ThreatCampaign>;
  cves: Record<string, CVERecord>;
  attackMatrix: Record<string, AttackTechnique[]>;
  graphNodes: Record<string, GraphNodeItem>;
  graphEdges: Record<string, GraphEdgeData>;
  reports: Record<string, ThreatReport>;
  sourceConnectors: Record<string, SourceConnector>;
  pipelineStages: Record<string, PipelineStageMetric>;
}

class CtiDatabase {
  private dataDir: string;
  private dbFilePath: string;
  private db: DatabaseSchema;
  private initialized: boolean = false;

  constructor() {
    this.dataDir = path.join(process.cwd(), 'data');
    this.dbFilePath = path.join(this.dataDir, 'actip-store.json');
    this.db = this.getDefaultSchema();
    this.init();
  }

  private getDefaultSchema(): DatabaseSchema {
    const investigations: Record<string, InvestigationResult> = {
      [primaryInvestigation.id]: primaryInvestigation
    };

    const iocs: Record<string, IOCRecord> = {};
    mockIocs.forEach(ioc => {
      iocs[ioc.id] = ioc;
    });

    const threatActors: Record<string, ThreatActor> = {};
    mockThreatActors.forEach(actor => {
      threatActors[actor.id] = actor;
    });

    const malware: Record<string, MalwareFamily> = {};
    mockMalware.forEach(m => {
      malware[m.id] = m;
    });

    const campaigns: Record<string, ThreatCampaign> = {};
    mockCampaigns.forEach(c => {
      campaigns[c.id] = c;
    });

    const cves: Record<string, CVERecord> = {};
    mockCves.forEach(cve => {
      cves[cve.id] = cve;
    });

    const graphNodes: Record<string, GraphNodeItem> = {};
    initialGraphNodes.forEach(node => {
      graphNodes[node.id] = node;
    });

    const graphEdges: Record<string, GraphEdgeData> = {};
    initialGraphEdges.forEach(edge => {
      graphEdges[edge.id] = edge;
    });

    const reports: Record<string, ThreatReport> = {
      [mockReport.id]: mockReport
    };

    const sourceConnectors: Record<string, SourceConnector> = {};
    mockSourceConnectors.forEach(src => {
      sourceConnectors[src.id] = src;
    });

    const pipelineStages: Record<string, PipelineStageMetric> = {};
    mockPipelineStages.forEach(stg => {
      pipelineStages[stg.id] = stg;
    });

    return {
      investigations,
      iocs,
      threatActors,
      malware,
      campaigns,
      cves,
      attackMatrix: mockAttackMatrix,
      graphNodes,
      graphEdges,
      reports,
      sourceConnectors,
      pipelineStages
    };
  }

  private init() {
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }

      if (fs.existsSync(this.dbFilePath)) {
        const raw = fs.readFileSync(this.dbFilePath, 'utf-8');
        const parsed = JSON.parse(raw);
        this.db = { ...this.getDefaultSchema(), ...parsed };
      } else {
        this.persist();
      }
      this.initialized = true;
    } catch (err) {
      console.error('[CtiDatabase] Initialization error, falling back to in-memory schema:', err);
      this.db = this.getDefaultSchema();
    }
  }

  private persist() {
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }
      const tmpPath = `${this.dbFilePath}.tmp`;
      fs.writeFileSync(tmpPath, JSON.stringify(this.db, null, 2), 'utf-8');
      fs.renameSync(tmpPath, this.dbFilePath);
    } catch (err) {
      console.error('[CtiDatabase] Persist error:', err);
    }
  }

  // --- Investigations ---
  public getInvestigations(): InvestigationResult[] {
    return Object.values(this.db.investigations).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public getInvestigationById(id: string): InvestigationResult | null {
    return this.db.investigations[id] || null;
  }

  public saveInvestigation(inv: InvestigationResult) {
    this.db.investigations[inv.id] = inv;
    this.persist();
    return inv;
  }

  // --- IOCs ---
  public getIocs(): IOCRecord[] {
    return Object.values(this.db.iocs);
  }

  public getIocByIndicator(indicator: string): IOCRecord | null {
    const q = indicator.toLowerCase().trim();
    return Object.values(this.db.iocs).find(i => i.indicator.toLowerCase() === q) || null;
  }

  public saveIoc(ioc: IOCRecord) {
    this.db.iocs[ioc.id] = ioc;
    this.persist();
    return ioc;
  }

  // --- Threat Actors ---
  public getThreatActors(): ThreatActor[] {
    return Object.values(this.db.threatActors);
  }

  public getThreatActorById(id: string): ThreatActor | null {
    return this.db.threatActors[id] || null;
  }

  public saveThreatActor(actor: ThreatActor) {
    this.db.threatActors[actor.id] = actor;
    this.persist();
    return actor;
  }

  // --- Malware ---
  public getMalware(): MalwareFamily[] {
    return Object.values(this.db.malware);
  }

  public getMalwareById(id: string): MalwareFamily | null {
    return this.db.malware[id] || null;
  }

  public saveMalware(m: MalwareFamily) {
    this.db.malware[m.id] = m;
    this.persist();
    return m;
  }

  // --- Campaigns ---
  public getCampaigns(): ThreatCampaign[] {
    return Object.values(this.db.campaigns);
  }

  public getCampaignById(id: string): ThreatCampaign | null {
    return this.db.campaigns[id] || null;
  }

  public saveCampaign(c: ThreatCampaign) {
    this.db.campaigns[c.id] = c;
    this.persist();
    return c;
  }

  // --- CVEs ---
  public getCves(): CVERecord[] {
    return Object.values(this.db.cves);
  }

  public getCveById(id: string): CVERecord | null {
    return this.db.cves[id] || null;
  }

  public saveCve(cve: CVERecord) {
    this.db.cves[cve.id] = cve;
    this.persist();
    return cve;
  }

  // --- ATT&CK Matrix ---
  public getAttackMatrix(): Record<string, AttackTechnique[]> {
    return this.db.attackMatrix;
  }

  // --- Knowledge Graph ---
  public getGraph(): { nodes: GraphNodeItem[]; edges: GraphEdgeData[] } {
    return {
      nodes: Object.values(this.db.graphNodes),
      edges: Object.values(this.db.graphEdges)
    };
  }

  public addGraphNode(node: GraphNodeItem) {
    this.db.graphNodes[node.id] = node;
    this.persist();
  }

  public addGraphEdge(edge: GraphEdgeData) {
    this.db.graphEdges[edge.id] = edge;
    this.persist();
  }

  // --- Reports ---
  public getReports(): ThreatReport[] {
    return Object.values(this.db.reports);
  }

  public getReportById(id: string): ThreatReport | null {
    return this.db.reports[id] || null;
  }

  public saveReport(rep: ThreatReport) {
    this.db.reports[rep.id] = rep;
    this.persist();
    return rep;
  }

  // --- Source Connectors & Pipeline ---
  public getSourceConnectors(): SourceConnector[] {
    return Object.values(this.db.sourceConnectors);
  }

  public updateSourceConnector(id: string, updates: Partial<SourceConnector>) {
    if (this.db.sourceConnectors[id]) {
      this.db.sourceConnectors[id] = { ...this.db.sourceConnectors[id], ...updates };
      this.persist();
      return this.db.sourceConnectors[id];
    }
    return null;
  }

  public getPipelineStages(): PipelineStageMetric[] {
    return Object.values(this.db.pipelineStages).sort((a, b) => a.order - b.order);
  }

  public updatePipelineStage(id: string, updates: Partial<PipelineStageMetric>) {
    if (this.db.pipelineStages[id]) {
      this.db.pipelineStages[id] = { ...this.db.pipelineStages[id], ...updates };
      this.persist();
      return this.db.pipelineStages[id];
    }
    return null;
  }
}

// Global singleton for Next.js server runtime
const globalForDb = global as unknown as { ctiDatabase: CtiDatabase };
export const db = globalForDb.ctiDatabase || new CtiDatabase();
if (process.env.NODE_ENV !== 'production') globalForDb.ctiDatabase = db;
