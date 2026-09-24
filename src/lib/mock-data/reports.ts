export interface ThreatReport {
  id: string;
  title: string;
  tlp: 'WHITE' | 'GREEN' | 'AMBER' | 'RED';
  date: string;
  author: string;
  classification: string;
  investigationRef: string;
  confidenceScore: number;
  executiveSummary: string;
  investigationScope: string[];
  keyFindings: string[];
  threatActorAnalysis: {
    name: string;
    aliases: string[];
    attributionConfidence: number;
    summary: string;
    geopoliticalContext: string;
  };
  infrastructureAnalysis: {
    primaryNodes: string[];
    stagingNodes: string[];
    domains: string[];
    jarmFingerprints: string[];
    autonomousSystems: string[];
  };
  malwareAnalysis: {
    name: string;
    version: string;
    capabilities: string[];
    yaraRule: string;
  };
  vulnerabilityAnalysis: {
    cve: string;
    cvss: number;
    kevStatus: string;
    impact: string;
  };
  attackMapping: Array<{
    tactic: string;
    techniqueId: string;
    techniqueName: string;
    evidence: string;
  }>;
  timeline: Array<{
    date: string;
    event: string;
    category: string;
  }>;
  evidenceSummary: {
    totalSources: number;
    meanReliability: number;
    conflictingEvidenceResolved: boolean;
    conflictNote: string;
  };
  recommendedActions: string[];
  stixBundle: Record<string, any>;
}

export const mockReport: ThreatReport = {
  id: 'REP-2026-0842-ACTIP',
  title: 'Targeted Defense Intrusion Campaign Involving BlackVenom RAT and Edge Gateway RCE (CVE-2026-8912)',
  tlp: 'AMBER',
  date: '2026-09-16 11:55:00 UTC',
  author: 'ACTIP Automated Agentic CTI Engine & Tier-3 SOC Intel Desk',
  classification: 'RESTRICTED / TLP:AMBER / LAW ENFORCEMENT & PARTICIPATING SOCs',
  investigationRef: 'INV-2026-0842',
  confidenceScore: 89,
  executiveSummary:
    'During the first half of September 2026, threat hunting sensors and perimeter telemetry identified a coordinated espionage campaign targeting Western aerospace and defense industrial contractors. The adversary exploited an unauthenticated remote code execution vulnerability in enterprise perimeter edge gateways (CVE-2026-8912) to deploy a newly observed variant of BlackVenom RAT (v3.2). Operational infrastructure pivots directly to IP 185.220.101.5 and domain quantum-defense.org. Attribution analysis associates this activity with 91% confidence to state-sponsored threat group APT-84 (RedBanshee / Cobalt Frost). Immediate egress blocking and firmware mitigation are required.',
  investigationScope: [
    'Boundary ingress logs across DMZ edge gateway clusters (2026-08-01 to 2026-09-15)',
    'Passive DNS and TLS certificate telemetry for IP block 185.220.101.0/24',
    'Sandbox dynamic execution analysis of weaponized payload SHA256 7f9a2e88c014...',
    'Corroboration against MISP, AlienVault OTX, CERT-EU, and CISA KEV catalogs'
  ],
  keyFindings: [
    'Active Command-and-Control node 185.220.101.5 listening on TLS/8443 with proprietary JARM signature 27d36d2d000d000dc427d36d2d000d.',
    'Spoofed defense procurement portal quantum-defense.org used for secondary staging and decoy lure delivery.',
    'Weaponization of CVE-2026-8912 observed across 4 independent defense contractor networks prior to general vendor patching.',
    '1 contradictory attribution hypothesis from CrowdSensor #CS-994 (commercial proxy leasing) investigated and resolved: APT-84 utilized Solaris Networks VPS subnets as operational forward relays.',
    'Internal perimeter firewalls successfully blocked 14 inbound exploitation attempts matching signature ACTIP-SIG-8912.'
  ],
  threatActorAnalysis: {
    name: 'APT-84 (RedBanshee / Cobalt Frost)',
    aliases: ['Cobalt Frost', 'TEMP.Tundra', 'UAC-0098'],
    attributionConfidence: 91,
    summary:
      'APT-84 is an advanced cyber espionage actor focused on critical infrastructure, aerospace blueprints, and satellite telecommunications intelligence. The group exhibits disciplined operational security, utilizing multi-tier proxy relays and ephemeral domain registration cadence.',
    geopoliticalContext:
      'Timing aligns with international defense procurement summits and multilateral aerospace joint venture negotiations occurring throughout Q3 2026.'
  },
  infrastructureAnalysis: {
    primaryNodes: ['185.220.101.5 (Port 8443 HTTPS, Port 22 SSH)'],
    stagingNodes: ['185.220.101.19 (Shared TLS Certificate Serial 4A91B8820)'],
    domains: ['quantum-defense.org', 'portal-sync.quantum-defense.org', 'stage2.cdn-securegate.net'],
    jarmFingerprints: ['27d36d2d000d000dc427d36d2d000d'],
    autonomousSystems: ['AS49870 (Solaris Networks BV, Netherlands)']
  },
  malwareAnalysis: {
    name: 'BlackVenom RAT',
    version: '3.2 (Build 2026.08)',
    capabilities: [
      'In-memory NTDLL unhooking (EDR bypass)',
      'TLS 1.3 heartbeat beaconing with randomized jitter (30s - 180s)',
      'Direct system call invocation for LSASS memory reading',
      'Dual C2 fallback routing table'
    ],
    yaraRule: 'RULE_APT84_BLACKVENOM_LOADER_V3'
  },
  vulnerabilityAnalysis: {
    cve: 'CVE-2026-8912',
    cvss: 9.8,
    kevStatus: 'Added to CISA KEV on 2026-09-05 (Emergency Directive 26-02)',
    impact: 'Unauthenticated Remote Code Execution on perimeter gateway firmware'
  },
  attackMapping: [
    { tactic: 'Initial Access', techniqueId: 'T1190', techniqueName: 'Exploit Public-Facing Application', evidence: 'Exploit payload POST /api/v2/vpn/tunnel' },
    { tactic: 'Initial Access', techniqueId: 'T1566.002', techniqueName: 'Spearphishing Link', evidence: 'Lure email pointing to quantum-defense.org/rfp-2026' },
    { tactic: 'Execution', techniqueId: 'T1059.001', techniqueName: 'PowerShell Execution', evidence: 'Base64 encoded downloader script invoked via WMI' },
    { tactic: 'Defense Evasion', techniqueId: 'T1055.012', techniqueName: 'Process Hollowing', evidence: 'Injected into svchost.exe (PID 4820)' },
    { tactic: 'Command and Control', techniqueId: 'T1071.001', techniqueName: 'Web Protocols (HTTPS)', evidence: 'Port 8443 encrypted C2 traffic' }
  ],
  timeline: [
    { date: '2026-07-15', event: 'Domain quantum-defense.org registered under Njalla privacy shield', category: 'Infrastructure Acquisition' },
    { date: '2026-08-12', event: 'VPS 185.220.101.5 provisioned at Solaris Networks BV', category: 'Infrastructure Acquisition' },
    { date: '2026-08-25', event: 'CVE-2026-8912 vulnerability published in vendor pre-advisory', category: 'Vulnerability Disclosure' },
    { date: '2026-09-01', event: 'Weaponized exploit tested against external gateway testbed', category: 'Weaponization' },
    { date: '2026-09-05', event: 'CISA issues Emergency Directive adding CVE-2026-8912 to KEV', category: 'Regulatory Advisory' },
    { date: '2026-09-12', event: 'Sandbox detonation confirms BlackVenom RAT v3.2 payload beaconing', category: 'Malware Observation' },
    { date: '2026-09-15', event: 'Internal perimeter firewalls block 14 exploitation POST requests', category: 'Detection & Containment' }
  ],
  evidenceSummary: {
    totalSources: 9,
    meanReliability: 93.4,
    conflictingEvidenceResolved: true,
    conflictNote: 'Resolved attribution conflict from CrowdSensor CS-994 (SilverFox leasing vs APT-84); verified infrastructure co-residency.'
  },
  recommendedActions: [
    'Block IP subnet 185.220.101.0/24 at external edge firewalls and BGP peer boundary routers.',
    'Add domain quantum-defense.org and subdomains to corporate DNS sinkhole / RPZ feeds.',
    'Immediately patch EdgeSecure Gateway OS to firmware release v12.4.2.',
    'Execute memory sweep for JARM hash 27d36d2d000d000dc427d36d2d000d across all perimeter proxies.',
    'Share STIX 2.1 threat bundle with sectoral ISAC and national CERT coordinators.'
  ],
  stixBundle: {
    type: 'bundle',
    id: 'bundle--79a1f28b-4a30-4e2a-8991-d820491029ba',
    spec_version: '2.1',
    objects: [
      {
        type: 'threat-actor',
        spec_version: '2.1',
        id: 'threat-actor--e42b1029-4100-4b21-8729-192038475610',
        created: '2026-09-16T11:42:10.000Z',
        modified: '2026-09-16T11:42:10.000Z',
        name: 'APT-84 (RedBanshee)',
        threat_actor_types: ['nation-state', 'spy'],
        aliases: ['Cobalt Frost', 'TEMP.Tundra']
      },
      {
        type: 'malware',
        spec_version: '2.1',
        id: 'malware--49102938-5100-4c12-9812-283746192039',
        created: '2026-09-16T11:42:10.000Z',
        modified: '2026-09-16T11:42:10.000Z',
        name: 'BlackVenom RAT',
        is_family: true,
        malware_types: ['remote-access-trojan']
      },
      {
        type: 'indicator',
        spec_version: '2.1',
        id: 'indicator--91028374-6200-4d34-a923-394857201948',
        created: '2026-09-16T11:42:10.000Z',
        modified: '2026-09-16T11:42:10.000Z',
        name: 'Malicious C2 IPv4 Address',
        pattern: "[ipv4-addr:value = '185.220.101.5']",
        pattern_type: 'stix',
        valid_from: '2026-08-12T00:00:00Z'
      }
    ]
  }
};

