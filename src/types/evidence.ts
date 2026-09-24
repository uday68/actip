import { VerificationState } from './cti';

export interface EvidenceSourceItem {
  id: string;
  sourceName: string;
  sourceType:
    | 'Threat Report'
    | 'OSINT Feed'
    | 'Commercial Feed'
    | 'Internal Telemetry'
    | 'Sandbox Execution'
    | 'CERT Advisory'
    | 'MISP Instance'
    | 'TAXII Stream'
    | string;
  publishedDate: string;
  observedDate: string;
  relationship: string; // e.g. "IP → Malware (C2 beaconing)"
  url?: string;
  excerpt: string;
  reliabilityScore: number; // 0 - 100
  tlp: 'WHITE' | 'GREEN' | 'AMBER' | 'RED';
  hash?: string;
}

export interface ContradictionItem {
  id: string;
  sourceName: string;
  observedDate: string;
  dissentingClaim: string;
  reason: string;
  severity: 'high' | 'medium' | 'low';
  resolved: boolean;
}

export interface EvidenceClaim {
  id: string;
  claimText: string;
  provenanceType: VerificationState;
  strengthPercentage: number; // 0 - 100
  supportingCount: number;
  contradictionCount: number;
  supportingEvidence: EvidenceSourceItem[];
  contradictoryEvidence?: ContradictionItem[];
  analystNote?: string;
}
