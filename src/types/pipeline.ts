export interface PipelineStageMetric {
  id: string;
  name: string;
  order: number;
  recordsProcessed: number;
  successful: number;
  failed: number;
  latencyMs: number;
  lastRun: string;
  errorRate: number; // percentage
  status: 'healthy' | 'degraded' | 'syncing' | 'idle';
  description: string;
}

export interface SourceConnector {
  id: string;
  name: string;
  type: 'Structured Feed' | 'STIX 2.1 TAXII' | 'MISP Instance' | 'Commercial API' | 'Internal EDR Telemetry';
  status: 'connected' | 'warning' | 'error' | 'syncing';
  lastSync: string;
  syncIntervalMinutes: number;
  recordsIngestedTotal: number;
  recordsIngested24h: number;
  reliability: number; // 0 - 100
  recentErrors: Array<{
    timestamp: string;
    message: string;
    code: string;
  }>;
  format: string;
  enabled: boolean;
}

