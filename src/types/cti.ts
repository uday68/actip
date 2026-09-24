export type EntityType =
  | 'actor'
  | 'malware'
  | 'campaign'
  | 'ip'
  | 'domain'
  | 'url'
  | 'hash'
  | 'cve'
  | 'technique'
  | 'organization';

export type RelationType =
  | 'uses'
  | 'controls'
  | 'targets'
  | 'communicates_with'
  | 'exploits'
  | 'associated_with'
  | 'attributed_to'
  | 'hosts'
  | 'resolves_to'
  | 'related_to';

export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export type ConfidenceScore = 'high' | 'medium' | 'low' | 'unverified';

export type VerificationState =
  | 'source_fact'       // Derived directly from verified third-party/telemetry sources
  | 'ai_interpretation' // Synthesized or correlated by agent models
  | 'analyst_verified'   // Human-reviewed and verified by analyst
  | 'unverified';       // Raw, unvetted telemetry or low-confidence signal

export interface IOCRecord {
  id: string;
  indicator: string;
  type: 'ip' | 'domain' | 'url' | 'hash';
  severity: Severity;
  confidence: number; // 0 - 100
  firstObserved: string;
  lastObserved: string;
  asn?: string;
  country?: string;
  registrar?: string;
  reputationScore: number; // 0 - 100 malicious score
  associatedMalware: string[];
  associatedActors: string[];
  associatedCampaigns: string[];
  passiveDnsCount: number;
  whoisSummary: {
    registrar: string;
    created: string;
    expires: string;
    registrantOrg: string;
  };
  dnsHistory: Array<{
    recordType: string;
    value: string;
    firstSeen: string;
    lastSeen: string;
  }>;
  relatedIocs: Array<{
    indicator: string;
    type: string;
    relation: string;
    confidence: number;
  }>;
  evidenceIds: string[];
}

export interface ThreatActor {
  id: string;
  name: string;
  aliases: string[];
  origin?: string;
  motivations: string[];
  targetedSectors: string[];
  targetedRegions: string[];
  firstObserved: string;
  lastActive: string;
  confidence: ConfidenceScore;
  associatedMalware: string[];
  campaigns: string[];
  techniques: string[]; // e.g. T1059, T1566
  infrastructureCount: {
    ips: number;
    domains: number;
  };
  description: string;
  sourcesCount: number;
  evidenceStrength: number;
}

export interface MalwareFamily {
  id: string;
  name: string;
  type: string; // e.g. RAT, Ransomware, Loader, Infostealer
  firstObserved: string;
  lastObserved: string;
  associatedActors: string[];
  associatedCampaigns: string[];
  capabilities: string[];
  techniques: string[];
  relatedCves: string[];
  activeC2Nodes: number;
  yaraRules: string[];
  hashes: string[];
  evidenceCount: number;
  confidence: number;
}

export interface ThreatCampaign {
  id: string;
  name: string;
  codename: string;
  status: 'active' | 'dormant' | 'historic';
  targetSectors: string[];
  targetCountries: string[];
  associatedActors: string[];
  associatedMalware: string[];
  cvesExploited: string[];
  startDate: string;
  lastActivity: string;
  killChainPhases: Array<{
    phase: string;
    description: string;
    techniques: string[];
  }>;
  evidenceStrength: number;
}

export interface CVERecord {
  id: string; // CVE-2026-XXXX
  title: string;
  cvss: number;
  severity: Severity;
  publishedDate: string;
  modifiedDate: string;
  cisaKev: boolean;
  knownExploitation: boolean;
  affectsOrganization: 'confirmed' | 'suspected' | 'none';
  affectedProducts: string[];
  associatedMalware: string[];
  associatedActors: string[];
  associatedCampaigns: string[];
  epssScore: number;
  description: string;
  remediation: string;
}

export interface AttackTechnique {
  id: string; // e.g. T1059.001
  name: string;
  tactic: string; // Execution, Persistence, etc.
  description: string;
  associatedActors: string[];
  associatedMalware: string[];
  observedCampaigns: string[];
  evidenceCount: number;
  detectionGuidance: string;
}

export interface GraphNodeData {
  id: string;
  label: string;
  type: EntityType;
  severity?: Severity;
  confidence?: number;
  subtitle?: string;
  details?: Record<string, any>;
  isTarget?: boolean;
}

export interface GraphEdgeData {
  id: string;
  source: string;
  target: string;
  label: RelationType;
  confidence: number;
  sourceCount: number;
  verified: boolean;
}

