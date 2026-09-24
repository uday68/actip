import { PipelineStageMetric, SourceConnector } from '@/types/pipeline';

export const mockPipelineStages: PipelineStageMetric[] = [
  {
    id: 'stage-source',
    name: '1. Ingestion / Connectors',
    order: 1,
    recordsProcessed: 148290,
    successful: 147810,
    failed: 480,
    latencyMs: 142,
    lastRun: '12s ago',
    errorRate: 0.32,
    status: 'healthy',
    description: 'Pulls raw threat pulses, TAXII 2.1 bundles, and telemetry JSON payloads from 6 active connectors.'
  },
  {
    id: 'stage-parser',
    name: '2. Syntactic Parser',
    order: 2,
    recordsProcessed: 147810,
    successful: 147650,
    failed: 160,
    latencyMs: 85,
    lastRun: '12s ago',
    errorRate: 0.11,
    status: 'healthy',
    description: 'Deserializes heterogeneous schemas into intermediate AST representations; filters malformed payloads.'
  },
  {
    id: 'stage-normalizer',
    name: '3. STIX 2.1 Normalizer',
    order: 3,
    recordsProcessed: 147650,
    successful: 147520,
    failed: 130,
    latencyMs: 110,
    lastRun: '10s ago',
    errorRate: 0.09,
    status: 'healthy',
    description: 'Converts observable indicators, identities, attack patterns, and relationships into canonical STIX 2.1 entities.'
  },
  {
    id: 'stage-resolution',
    name: '4. Entity Resolution & Deduplication',
    order: 4,
    recordsProcessed: 147520,
    successful: 146900,
    failed: 620,
    latencyMs: 245,
    lastRun: '8s ago',
    errorRate: 0.42,
    status: 'healthy',
    description: 'Fuzzy matching on aliases, WHOIS registrant clusters, JARM hash clusters, and co-located BGP autonomous systems.'
  },
  {
    id: 'stage-graph',
    name: '5. Knowledge Graph Ingestion',
    order: 5,
    recordsProcessed: 146900,
    successful: 146810,
    failed: 90,
    latencyMs: 310,
    lastRun: '5s ago',
    errorRate: 0.06,
    status: 'healthy',
    description: 'Persists verified nodes and directed provenance edges into graph datastore; updates transitive centrality scores.'
  },
  {
    id: 'stage-vector',
    name: '6. Semantic Vector Index',
    order: 6,
    recordsProcessed: 146810,
    successful: 146810,
    failed: 0,
    latencyMs: 190,
    lastRun: '3s ago',
    errorRate: 0.00,
    status: 'healthy',
    description: 'Embeds threat descriptions, attribution hypotheses, and unstructured CERT reports for semantic hybrid retrieval.'
  }
];

export const mockSourceConnectors: SourceConnector[] = [
  {
    id: 'src-1',
    name: 'MITRE ATT&CK Enterprise v15.1',
    type: 'STIX 2.1 TAXII',
    status: 'connected',
    lastSync: '12 min ago',
    syncIntervalMinutes: 60,
    recordsIngestedTotal: 42180,
    recordsIngested24h: 310,
    reliability: 99,
    format: 'STIX 2.1 / JSON',
    enabled: true,
    recentErrors: []
  },
  {
    id: 'src-2',
    name: 'MISP Threat Exchange Community',
    type: 'MISP Instance',
    status: 'connected',
    lastSync: '4 min ago',
    syncIntervalMinutes: 5,
    recordsIngestedTotal: 384100,
    recordsIngested24h: 18240,
    reliability: 94,
    format: 'MISP Event JSON',
    enabled: true,
    recentErrors: []
  },
  {
    id: 'src-3',
    name: 'AlienVault OTX (Direct API)',
    type: 'Commercial API',
    status: 'connected',
    lastSync: '7 min ago',
    syncIntervalMinutes: 10,
    recordsIngestedTotal: 210400,
    recordsIngested24h: 9420,
    reliability: 88,
    format: 'OTX Pulses API v1',
    enabled: true,
    recentErrors: []
  },
  {
    id: 'src-4',
    name: 'CISA Known Exploited Vulnerabilities (KEV)',
    type: 'Structured Feed',
    status: 'connected',
    lastSync: '18 min ago',
    syncIntervalMinutes: 30,
    recordsIngestedTotal: 1240,
    recordsIngested24h: 3,
    reliability: 100,
    format: 'NVD JSON v2.0',
    enabled: true,
    recentErrors: []
  },
  {
    id: 'src-5',
    name: 'VirusTotal Enterprise Threat Intelligence',
    type: 'Commercial API',
    status: 'warning',
    lastSync: '42 min ago',
    syncIntervalMinutes: 15,
    recordsIngestedTotal: 84120,
    recordsIngested24h: 3120,
    reliability: 95,
    format: 'VT Graph / API v3',
    enabled: true,
    recentErrors: [
      {
        timestamp: '11:20:14 UTC',
        message: 'Rate limit threshold reached on secondary quota tier (HTTP 429)',
        code: 'ERR_VT_RATE_LIMIT'
      }
    ]
  },
  {
    id: 'src-6',
    name: 'Internal DMZ Firewall & EDR Telemetry Stream',
    type: 'Internal EDR Telemetry',
    status: 'connected',
    lastSync: '22s ago',
    syncIntervalMinutes: 1,
    recordsIngestedTotal: 2490100,
    recordsIngested24h: 110400,
    reliability: 99,
    format: 'Kafka Stream / Syslog CEF',
    enabled: true,
    recentErrors: []
  }
];

