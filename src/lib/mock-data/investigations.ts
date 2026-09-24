import { InvestigationResult, InvestigationStage, AgentTraceEntry } from '@/types/investigation';

export const primaryInvestigation: InvestigationResult = {
  id: 'INV-2026-0842',
  query: '185.220.101.5, quantum-defense.org, CVE-2026-8912',
  type: 'hybrid',
  status: 'completed',
  confidence: 'high',
  confidenceScore: 89,
  updatedAt: '5 min ago',
  createdAt: '2026-09-16 11:42:10 UTC',
  analyst: 'Tier-3 Threat Intel Team',
  executiveSummary:
    'High-confidence malicious infrastructure identified. The primary indicator 185.220.101.5 operates as a dual-role Command-and-Control (C2) and staging node for BlackVenom RAT. Passive DNS correlations reveal active resolution to quantum-defense.org (spoofed defense contractor domain) hosting weaponized payload CVE-2026-8912 exploits. Attribution correlates with 91% confidence to threat group APT-84 (RedBanshee / Cobalt Frost) under Operation Arctic Ghost targeting aerospace and energy sectors.',
  evidenceStrength: 'Strong',
  lastObserved: '2026-09-15 22:14:00 UTC',
  sourcesCount: 9,
  keyFindings: [
    'IP 185.220.101.5 identified as active C2 server communicating with BlackVenom RAT v3.2 beacons via HTTPS over port 8443.',
    'Domain quantum-defense.org registered via Njalla privacy shield; passive DNS historical overlap shows co-location with known APT-84 staging clusters.',
    'Zero-day vulnerability CVE-2026-8912 (Edge Gateway RCE) actively weaponized for initial boundary penetration.',
    '6 independent intelligence feeds verify attribution; 1 source flags possible infrastructure leasing to sub-contractor proxy farm (reviewed & resolved).',
    '3 MITRE ATT&CK techniques confirmed in internal telemetry logs matching active beacon patterns.'
  ],
  attackTechniques: ['T1190', 'T1059.001', 'T1071.001', 'T1566.002', 'T1027.002', 'T1083'],
  claims: [
    {
      id: 'claim-1',
      claimText: 'IP 185.220.101.5 acts as Command & Control (C2) node for BlackVenom RAT v3.2',
      provenanceType: 'source_fact',
      strengthPercentage: 94,
      supportingCount: 5,
      contradictionCount: 0,
      supportingEvidence: [
        {
          id: 'ev-101',
          sourceName: 'CERT-EU Threat Advisory #26-081',
          sourceType: 'CERT Advisory',
          publishedDate: '2026-08-28',
          observedDate: '2026-08-27',
          relationship: 'IP 185.220.101.5 → BlackVenom C2 listener on TLS/8443',
          url: 'https://cert.europa.eu/advisories/2026-081',
          excerpt: 'Observed TLS certificate fingerprint matching BlackVenom default beacon self-signed cert on 185.220.101.5.',
          reliabilityScore: 95,
          tlp: 'WHITE'
        },
        {
          id: 'ev-102',
          sourceName: 'MISP Threat Exchange Community',
          sourceType: 'MISP Instance',
          publishedDate: '2026-09-02',
          observedDate: '2026-09-01',
          relationship: 'Attribute: ip-dst 185.220.101.5 tagged #BlackVenom #APT84',
          excerpt: 'Corroborated by 3 participating financial and aerospace SOCs reporting outbound beacons from isolated workstations.',
          reliabilityScore: 90,
          tlp: 'GREEN'
        },
        {
          id: 'ev-103',
          sourceName: 'Sandbox Detonation Cluster #4',
          sourceType: 'Sandbox Execution',
          publishedDate: '2026-09-12',
          observedDate: '2026-09-12',
          relationship: 'Payload hash sha256:7f9a... connected to 185.220.101.5:8443',
          excerpt: 'Dynamic behavioral analysis confirmed encrypted handshake with JARM hash 27d36d2d000d000dc427d36d2d000d matching BlackVenom C2 profile.',
          reliabilityScore: 98,
          tlp: 'AMBER'
        }
      ]
    },
    {
      id: 'claim-2',
      claimText: 'Domain quantum-defense.org belongs to Operation Arctic Ghost campaign infrastructure',
      provenanceType: 'ai_interpretation',
      strengthPercentage: 86,
      supportingCount: 4,
      contradictionCount: 1,
      supportingEvidence: [
        {
          id: 'ev-201',
          sourceName: 'AlienVault OTX Pulse: Arctic Ghost Infrastructure',
          sourceType: 'Commercial Feed',
          publishedDate: '2026-09-08',
          observedDate: '2026-09-07',
          relationship: 'Domain quantum-defense.org resolved to 185.220.101.5 (2026-09-01 to 2026-09-15)',
          excerpt: 'Passive DNS pivot confirmed registration pattern matches prior APT-84 spearphishing domain registration cadence.',
          reliabilityScore: 88,
          tlp: 'WHITE'
        },
        {
          id: 'ev-202',
          sourceName: 'VirusTotal Graph Enterprise Intelligence',
          sourceType: 'Commercial Feed',
          publishedDate: '2026-09-14',
          observedDate: '2026-09-13',
          relationship: 'Domain hosting weaponized LNK lure and PDF decoy documents',
          excerpt: '7 engines flagged domain as malicious phishing host masquerading as Quantum Defense Systems procurement portal.',
          reliabilityScore: 92,
          tlp: 'GREEN'
        }
      ],
      contradictoryEvidence: [
        {
          id: 'contra-1',
          sourceName: 'CrowdSensor Threat Feed #CS-994',
          observedDate: '2026-09-04',
          dissentingClaim: 'Attributed infrastructure cluster to commercial proxy operator "SilverFox Leasing"',
          reason: 'ASN 49870 contains shared VPS hosting providers used by both cybercrime syndicates and state actors. Analyst review determined APT-84 rented space within this VPS subnet.',
          severity: 'medium',
          resolved: true
        }
      ],
      analystNote: 'Resolved by Lead Analyst: Infrastructure overlap is consistent with APT-84 tactical tradecraft of leasing legitimate VPS commercial IP blocks to evade geographic blocking.'
    },
    {
      id: 'claim-3',
      claimText: 'CVE-2026-8912 is weaponized for perimeter foothold prior to BlackVenom execution',
      provenanceType: 'source_fact',
      strengthPercentage: 92,
      supportingCount: 3,
      contradictionCount: 0,
      supportingEvidence: [
        {
          id: 'ev-301',
          sourceName: 'CISA Known Exploited Vulnerabilities (KEV) Catalog',
          sourceType: 'CERT Advisory',
          publishedDate: '2026-09-05',
          observedDate: '2026-09-03',
          relationship: 'CVE-2026-8912 added to KEV catalog with ransomware & espionage exploitation tags',
          excerpt: 'Zero-day vulnerability in Edge Gateway firmware enabling unauthenticated remote code execution. Mandatory federal patch order issued.',
          reliabilityScore: 99,
          tlp: 'WHITE'
        },
        {
          id: 'ev-302',
          sourceName: 'Internal Perimeter Firewall & EDR Telemetry',
          sourceType: 'Internal Telemetry',
          publishedDate: '2026-09-15',
          observedDate: '2026-09-15',
          relationship: 'Blocked inbound exploit POST requests originating from 185.220.101.5 targeting /api/v2/vpn/tunnel',
          excerpt: 'Signature ACTIP-SIG-8912 triggered 14 times against external DMZ cluster.',
          reliabilityScore: 100,
          tlp: 'RED'
        }
      ]
    }
  ],
  relatedEntities: [
    { type: 'actor', label: 'APT-84 (RedBanshee)', relation: 'attributed_to', confidence: 91, severity: 'critical' },
    { type: 'malware', label: 'BlackVenom RAT v3.2', relation: 'uses', confidence: 96, severity: 'critical' },
    { type: 'campaign', label: 'Operation Arctic Ghost', relation: 'associated_with', confidence: 88, severity: 'high' },
    { type: 'cve', label: 'CVE-2026-8912', relation: 'exploits', confidence: 94, severity: 'critical' },
    { type: 'domain', label: 'quantum-defense.org', relation: 'resolves_to', confidence: 98, severity: 'high' },
    { type: 'ip', label: '185.220.101.5', relation: 'controls', confidence: 95, severity: 'critical' },
    { type: 'technique', label: 'T1190 Exploit Public-Facing App', relation: 'uses', confidence: 95, severity: 'high' },
    { type: 'technique', label: 'T1071.001 Web Protocols', relation: 'uses', confidence: 92, severity: 'medium' }
  ],
  stages: [
    {
      id: 'stage-1',
      name: 'Entity Disambiguation & Normalization',
      description: 'Parse raw input indicators into canonical STIX 2.1 cyber observable objects.',
      status: 'completed',
      toolName: 'EntityNormalizer',
      query: '185.220.101.5, quantum-defense.org, CVE-2026-8912',
      resultSummary: '3 valid observables recognized: 1 IPv4, 1 FQDN, 1 CVE Identifier.',
      evidenceCount: 3,
      durationMs: 140,
      substeps: ['IPv4 parsed and RFC1918 checked (Public routable)', 'Domain FQDN canonicalized and Punycode verified', 'CVE validated against NVD schema v5'],
      findings: [
        { title: 'Primary IP', value: '185.220.101.5', badge: 'Public Routable' },
        { title: 'FQDN', value: 'quantum-defense.org', badge: 'Active Resolution' },
        { title: 'CVE', value: 'CVE-2026-8912', badge: 'CVSS 9.8' }
      ]
    },
    {
      id: 'stage-2',
      name: 'IOC Enrichment (Passive DNS & WHOIS)',
      description: 'Query passive DNS repositories, WHOIS ownership history, and BGP AS routing.',
      status: 'completed',
      toolName: 'PassiveDnsIntelligence',
      query: '185.220.101.5 & quantum-defense.org',
      resultSummary: 'Found 7 co-hosted domains, ASN 49870 (Solaris Hosting), registration via Njalla privacy shield.',
      evidenceCount: 4,
      durationMs: 380,
      substeps: ['BGP Routing: AS49870 (Solaris Networks BV, Netherlands)', 'Passive DNS: 7 historical hostnames identified', 'SSL Cert: Self-signed certificate issued to *.quantum-defense.org'],
      findings: [
        { title: 'ASN / Org', value: 'AS49870 Solaris Networks BV', badge: 'Netherlands' },
        { title: 'Historical Domains', value: '7 related hostnames', badge: 'High Overlap' },
        { title: 'JARM Fingerprint', value: '27d36d2d000d000dc427d36d2d000d', badge: 'C2 Match' }
      ]
    },
    {
      id: 'stage-3',
      name: 'Commercial & Community Threat Feeds',
      description: 'Cross-reference indicators against MISP, AlienVault OTX, VirusTotal, and CERT bulletins.',
      status: 'completed',
      toolName: 'ThreatFeedAggregator',
      query: '185.220.101.5 & quantum-defense.org',
      resultSummary: '14 matching threat intelligence reports retrieved from 5 distinct feeds.',
      evidenceCount: 14,
      durationMs: 620,
      substeps: ['MISP: Attribute matched event #8410', 'AlienVault: 4 pulses matched (Arctic Ghost tag)', 'VirusTotal: 34/72 engines malicious'],
      findings: [
        { title: 'Threat Pulses', value: '4 AlienVault Pulses', badge: 'Active' },
        { title: 'MISP Events', value: 'Event #8410 (Aerospace Targeting)', badge: 'Verified' },
        { title: 'Reputation Score', value: '94/100 Malicious', badge: 'Critical' }
      ]
    },
    {
      id: 'stage-4',
      name: 'MITRE ATT&CK Correlation',
      description: 'Map observed telemetry and infrastructure characteristics to ATT&CK tactics and techniques.',
      status: 'completed',
      toolName: 'AttackMatrixCorrelator',
      query: 'Observed traffic patterns, beacon headers & exploit signatures',
      resultSummary: '6 ATT&CK techniques correlated with >85% confidence score.',
      evidenceCount: 6,
      durationMs: 410,
      substeps: ['Initial Access: T1190 (Exploit Public-Facing Application)', 'Execution: T1059.001 (PowerShell Scripting)', 'Command & Control: T1071.001 (Web Protocols HTTPS)'],
      findings: [
        { title: 'Initial Access', value: 'T1190 Exploit Public-Facing App', badge: 'CVE-2026-8912' },
        { title: 'Command & Control', value: 'T1071.001 HTTPS Beaconing', badge: 'Port 8443' },
        { title: 'Defense Evasion', value: 'T1027.002 Software Packing', badge: 'BlackVenom' }
      ]
    },
    {
      id: 'stage-5',
      name: 'Infrastructure Analysis & Pivot Expansion',
      description: 'Graph traversal across co-located IPs, shared TLS certs, and SSH keys.',
      status: 'completed',
      toolName: 'GraphInfrastructureExpander',
      query: 'Nodes related to 185.220.101.5 within 2 hops',
      resultSummary: 'Expanded graph to 18 nodes and 24 validated edges. Discovered 2 secondary staging IPs.',
      evidenceCount: 8,
      durationMs: 510,
      substeps: ['Pivot on TLS Certificate Serial #4A91B8820', 'Discovered secondary IP 185.220.101.19', 'Correlated with quantum-defense.org subdomains'],
      findings: [
        { title: 'Secondary C2', value: '185.220.101.19', badge: 'Staging Server' },
        { title: 'Shared TLS Serial', value: '4A91B8820', badge: 'Identical Keypair' },
        { title: 'Graph Expansion', value: '18 entities connected', badge: 'Cluster Identified' }
      ]
    },
    {
      id: 'stage-6',
      name: 'Malware Family Signature Correlation',
      description: 'Compare beaconing payload headers and binary hashes against YARA & static rules.',
      status: 'completed',
      toolName: 'MalwareSignatureEngine',
      query: 'Payload SHA256: 7f9a2e88c014... & TLS Handshake JARM',
      resultSummary: 'Confirmed match with BlackVenom RAT v3.2. Payload contains encrypted reverse shell module.',
      evidenceCount: 5,
      durationMs: 460,
      substeps: ['YARA match: RULE_APT84_BLACKVENOM_LOADER_V3', 'Imphash match with known 2026 samples', 'Configuration extraction succeeded: C2 list parsed'],
      findings: [
        { title: 'Malware Family', value: 'BlackVenom RAT v3.2', badge: 'Espionage RAT' },
        { title: 'YARA Match', value: 'RULE_APT84_BLACKVENOM', badge: '100% Match' },
        { title: 'Extracted Config', value: 'Fallbacks: 185.220.101.19', badge: 'Decrypted' }
      ]
    },
    {
      id: 'stage-7',
      name: 'Threat Actor Attribution Analysis',
      description: 'Hypothesis testing and attribution scoring against known APT threat actor profiles.',
      status: 'completed',
      toolName: 'AttributionEngine',
      query: 'Cluster signature, TTP overlap, victimology',
      resultSummary: 'Primary attribution: APT-84 (RedBanshee / Cobalt Frost) with 91% confidence.',
      evidenceCount: 7,
      durationMs: 590,
      substeps: ['Victimology match: Aerospace & Defense contractors in Western Europe', 'Tooling overlap: BlackVenom RAT is proprietary to APT-84', 'Working hours alignment: UTC+3 to UTC+5'],
      findings: [
        { title: 'Attributed Group', value: 'APT-84 (RedBanshee)', badge: '91% Confidence' },
        { title: 'Known Campaign', value: 'Operation Arctic Ghost', badge: 'Targeted Espionage' },
        { title: 'Target Sector', value: 'Defense & Aerospace', badge: 'Critical Sector' }
      ]
    },
    {
      id: 'stage-8',
      name: 'Evidence Provenance & Contradiction Verification',
      description: 'Trace claims to primary sources, evaluate reliability weights, and flag dissenting reports.',
      status: 'completed',
      toolName: 'EvidenceVerifier',
      query: 'Claims provenance check across 9 ingested sources',
      resultSummary: 'Verified 3 core claims. Detected 1 minor contradiction regarding proxy infrastructure (reviewed & resolved).',
      evidenceCount: 9,
      durationMs: 340,
      substeps: ['Provenance tracking: all 3 claims linked to immutable source IDs', 'Reliability weighted average: 93.4%', 'Contradiction flagged: CrowdSensor report #CS-994'],
      findings: [
        { title: 'Verified Claims', value: '3 Major Findings', badge: 'Traceable' },
        { title: 'Dissenting Sources', value: '1 Resolved Flag', badge: 'Reviewed' },
        { title: 'Mean Reliability', value: '93.4%', badge: 'High Provenance' }
      ]
    },
    {
      id: 'stage-9',
      name: 'Final Assessment & Action Guidance',
      description: 'Synthesize evidence-grounded intelligence assessment and actionable containment recommendations.',
      status: 'completed',
      toolName: 'ExecutiveSynthesizer',
      query: 'Generate executive summary and mitigation priorities',
      resultSummary: 'Assessment completed. Formatted into executive dossier with STIX 2.1 export bundle.',
      evidenceCount: 4,
      durationMs: 220,
      substeps: ['Emergency blocklist generated for perimeter firewalls', 'YARA hunting rules published to EDR agents', 'Incident response playbook trigger prepared'],
      findings: [
        { title: 'Severity Rating', value: 'Critical (Severity 5)', badge: 'Immediate Action' },
        { title: 'Containment State', value: 'Egress Block Recommended', badge: 'Priority 1' },
        { title: 'Export Package', value: 'STIX 2.1 Bundle Ready', badge: 'Exportable' }
      ]
    }
  ],
  agentTraces: [
    { id: 'tr-1', timestamp: '11:42:10', level: 'info', action: 'Received investigation dispatch for targets: 185.220.101.5, quantum-defense.org, CVE-2026-8912', tool: 'Dispatcher' },
    { id: 'tr-2', timestamp: '11:42:11', level: 'tool_call', action: 'Executing Passive DNS and WHOIS query for 185.220.101.5', tool: 'PassiveDnsIntelligence', target: '185.220.101.5', recordsCount: 7 },
    { id: 'tr-3', timestamp: '11:42:11', level: 'tool_call', action: 'Querying MISP & AlienVault threat feeds for indicator overlaps', tool: 'ThreatFeedAggregator', recordsCount: 14 },
    { id: 'tr-4', timestamp: '11:42:12', level: 'correlation', action: 'Extracted 18 related entities across 2 degrees of separation', tool: 'GraphEngine', recordsCount: 18 },
    { id: 'tr-5', timestamp: '11:42:12', level: 'tool_call', action: 'Evaluating TLS fingerprint JARM and payload hashes against YARA repository', tool: 'MalwareSignatureEngine', target: 'BlackVenom RAT v3.2' },
    { id: 'tr-6', timestamp: '11:42:13', level: 'conflict', action: 'Detected conflicting attribution in source CS-994 (SilverFox Leasing proxy vs APT-84)', tool: 'EvidenceVerifier', details: 'Automated hypothesis check: ISP ASN 49870 is commercial VPS utilized by APT-84. Resolving contradiction.' },
    { id: 'tr-7', timestamp: '11:42:13', level: 'verification', action: 'Mapped 6 MITRE ATT&CK techniques with verified internal DMZ firewall telemetry logs', tool: 'AttackMatrixCorrelator' },
    { id: 'tr-8', timestamp: '11:42:14', level: 'completed', action: 'Generated final evidence-grounded assessment and executive intelligence brief', tool: 'ExecutiveSynthesizer' }
  ],
  recommendedActions: [
    'Emergency perimeter firewall block on IPv4 range 185.220.101.0/24 (Solaris Networks BV).',
    'Sinkhole DNS resolution for domain quantum-defense.org and all associated subdomains.',
    'Immediately patch Edge Gateway firmware to mitigate CVE-2026-8912 per CISA Emergency Directive.',
    'Deploy YARA rule APT84_BLACKVENOM_LOADER across all endpoints and sweep memory buffers for JARM 27d36d2d000d000dc427d36d2d000d.',
    'Initiate retroactive hunting on SIEM for TLS handshakes to port 8443 dating back to 2026-08-01.'
  ]
};

export const recentInvestigationsTable = [
  {
    id: 'INV-2026-0842',
    name: 'Suspicious Infrastructure & Gateway RCE',
    query: '185.220.101.5 / quantum-defense.org',
    type: 'Hybrid (IOC + CVE)',
    status: 'Completed',
    statusColor: 'verified',
    confidence: 'High (89%)',
    confidenceScore: 89,
    updated: '5 min ago',
    analyst: 'Tier-3 Intel Desk',
    verdict: 'Malicious (APT-84)',
    entities: 18,
    evidenceCount: 9
  },
  {
    id: 'INV-2026-0839',
    name: 'Critical Boundary Gateway Vulnerability',
    query: 'CVE-2026-8912 Edge VPN RCE',
    type: 'Vulnerability',
    status: 'Completed',
    statusColor: 'critical',
    confidence: 'High (96%)',
    confidenceScore: 96,
    updated: '24 min ago',
    analyst: 'Vulnerability Research',
    verdict: 'Actively Exploited (KEV)',
    entities: 12,
    evidenceCount: 15
  },
  {
    id: 'INV-2026-0834',
    name: 'DarkLocker Ransomware Stage-1 Infiltration',
    query: 'hash: 9e32a10b48... / svchost-injection.dll',
    type: 'Malware',
    status: 'Review',
    statusColor: 'medium',
    confidence: 'Medium (68%)',
    confidenceScore: 68,
    updated: '1 hour ago',
    analyst: 'SOC Incident Responder',
    verdict: 'Suspicious (Pending sandbox)',
    entities: 8,
    evidenceCount: 6
  },
  {
    id: 'INV-2026-0828',
    name: 'VelvetChollima Financial BEC Infrastructure',
    query: 'swift-wire-auth.com / 194.26.29.112',
    type: 'Threat Actor',
    status: 'Completed',
    statusColor: 'verified',
    confidence: 'High (94%)',
    confidenceScore: 94,
    updated: '3 hours ago',
    analyst: 'Threat Hunter #4',
    verdict: 'Attributed to VelvetChollima',
    entities: 24,
    evidenceCount: 19
  },
  {
    id: 'INV-2026-0820',
    name: 'Industrial SCADA Protocol Anomalies',
    query: '10.240.12.8 / Modbus TCP Function 43',
    type: 'IOC / Telemetry',
    status: 'Completed',
    statusColor: 'low',
    confidence: 'Low (42%)',
    confidenceScore: 42,
    updated: '6 hours ago',
    analyst: 'OT Security Lead',
    verdict: 'False Positive (Firmware sweep)',
    entities: 5,
    evidenceCount: 4
  }
];

