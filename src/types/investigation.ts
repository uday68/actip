import { ConfidenceScore, EntityType, Severity, VerificationState } from './cti';
import { EvidenceClaim } from './evidence';

export type StageStatus = 'pending' | 'running' | 'completed' | 'failed' | 'warning';

export interface InvestigationStage {
  id: string;
  name: string;
  description: string;
  status: StageStatus;
  toolName?: string;
  query?: string;
  resultSummary?: string;
  evidenceCount?: number;
  durationMs?: number;
  substeps?: string[];
  findings?: Array<{
    title: string;
    value: string;
    badge?: string;
  }>;
}

export interface AgentTraceEntry {
  id: string;
  timestamp: string; // e.g. "12:31:01"
  level: 'info' | 'tool_call' | 'correlation' | 'conflict' | 'verification' | 'completed';
  action: string;
  tool?: string;
  target?: string;
  recordsCount?: number;
  evidenceRefId?: string;
  details?: string;
}

export interface InvestigationResult {
  id: string;
  query: string;
  type: 'ioc' | 'vulnerability' | 'malware' | 'actor' | 'hybrid';
  status: 'running' | 'completed' | 'review' | 'failed';
  confidence: ConfidenceScore;
  confidenceScore: number; // 0 - 100
  updatedAt: string;
  createdAt: string;
  analyst: string;
  executiveSummary: string;
  evidenceStrength: 'Very Strong' | 'Strong' | 'Moderate' | 'Weak' | 'Contested';
  lastObserved: string;
  sourcesCount: number;
  keyFindings: string[];
  claims: EvidenceClaim[];
  relatedEntities: Array<{
    type: EntityType;
    label: string;
    relation: string;
    confidence: number;
    severity?: Severity;
  }>;
  attackTechniques: string[];
  stages: InvestigationStage[];
  agentTraces: AgentTraceEntry[];
  recommendedActions: string[];
}

