import { GraphNodeData, GraphEdgeData } from '@/types/cti';

export interface GraphNodeItem {
  id: string;
  data: GraphNodeData;
  position: { x: number; y: number };
}

export const initialGraphNodes: GraphNodeItem[] = [
  // Center Threat Actor
  {
    id: 'node-apt84',
    data: {
      id: 'node-apt84',
      label: 'APT-84 (RedBanshee)',
      type: 'actor',
      severity: 'critical',
      confidence: 91,
      subtitle: 'Attributed Threat Group',
      isTarget: false,
      details: {
        aliases: ['Cobalt Frost', 'TEMP.Tundra'],
        origin: 'Eastern Europe / State-Sponsored',
        activeSince: '2021',
        motivation: 'Defense Espionage & Sabotage',
        evidenceCount: 18
      }
    },
    position: { x: 380, y: 180 }
  },
  // Campaign
  {
    id: 'node-camp-arctic',
    data: {
      id: 'node-camp-arctic',
      label: 'Operation Arctic Ghost',
      type: 'campaign',
      severity: 'high',
      confidence: 88,
      subtitle: 'Active Cyber Espionage Campaign',
      details: {
        targets: 'Defense Industrial Base, Aerospace, NATO allies',
        status: 'Active (Q3 2026)',
        evidenceCount: 12
      }
    },
    position: { x: 680, y: 120 }
  },
  // Target Organization
  {
    id: 'node-target-aero',
    data: {
      id: 'node-target-aero',
      label: 'AeroSpace Dynamics Ltd',
      type: 'organization',
      severity: 'high',
      confidence: 95,
      subtitle: 'Target Organization (Defense Tier-1)',
      details: {
        industry: 'Aerospace & Defense Contractor',
        location: 'United Kingdom / Germany',
        compromiseStatus: 'Perimeter Blocked'
      }
    },
    position: { x: 960, y: 120 }
  },
  // Malware
  {
    id: 'node-malware-bv',
    data: {
      id: 'node-malware-bv',
      label: 'BlackVenom RAT v3.2',
      type: 'malware',
      severity: 'critical',
      confidence: 96,
      subtitle: 'Proprietary In-Memory C2 Agent',
      details: {
        family: 'BlackVenom',
        capabilities: 'TLS 1.3 Beaconing, Memory Unhooking, LSASS Dump',
        yaraMatch: 'RULE_APT84_BLACKVENOM_LOADER_V3',
        evidenceCount: 14
      }
    },
    position: { x: 140, y: 320 }
  },
  // Secondary Malware
  {
    id: 'node-malware-loader',
    data: {
      id: 'node-malware-loader',
      label: 'CobaltLoader',
      type: 'malware',
      severity: 'high',
      confidence: 89,
      subtitle: 'Stage-1 DLL Stager',
      details: {
        purpose: 'Process Hollowing into svchost.exe',
        evidenceCount: 8
      }
    },
    position: { x: 80, y: 180 }
  },
  // Primary IP (Investigated Target)
  {
    id: 'node-ip-primary',
    data: {
      id: 'node-ip-primary',
      label: '185.220.101.5',
      type: 'ip',
      severity: 'critical',
      confidence: 95,
      subtitle: 'Primary C2 & Exploit Staging Node',
      isTarget: true,
      details: {
        asn: 'AS49870 (Solaris Networks BV)',
        country: 'Netherlands',
        ports: '8443 (HTTPS), 443, 22',
        jarm: '27d36d2d000d000dc427d36d2d000d',
        evidenceCount: 15
      }
    },
    position: { x: 420, y: 440 }
  },
  // Secondary IP
  {
    id: 'node-ip-secondary',
    data: {
      id: 'node-ip-secondary',
      label: '185.220.101.19',
      type: 'ip',
      severity: 'high',
      confidence: 91,
      subtitle: 'Fallback Staging Node',
      details: {
        asn: 'AS49870 (Solaris Networks BV)',
        relationship: 'Identical TLS Certificate Serial',
        evidenceCount: 7
      }
    },
    position: { x: 680, y: 460 }
  },
  // Primary Domain
  {
    id: 'node-domain-primary',
    data: {
      id: 'node-domain-primary',
      label: 'quantum-defense.org',
      type: 'domain',
      severity: 'high',
      confidence: 98,
      subtitle: 'Spoofed Defense Procurement Portal',
      isTarget: true,
      details: {
        registrar: 'Njalla Privacy Shield',
        created: '2026-08-29',
        dnsRecords: 'A -> 185.220.101.5',
        evidenceCount: 9
      }
    },
    position: { x: 180, y: 560 }
  },
  // Vulnerability CVE
  {
    id: 'node-cve-8912',
    data: {
      id: 'node-cve-8912',
      label: 'CVE-2026-8912',
      type: 'cve',
      severity: 'critical',
      confidence: 94,
      subtitle: 'Edge Gateway Unauthenticated RCE',
      isTarget: true,
      details: {
        cvss: 9.8,
        cisaKev: true,
        epssScore: '94.1%',
        affected: 'EdgeSecure Gateway OS v11.2 - v12.4',
        evidenceCount: 11
      }
    },
    position: { x: 740, y: 300 }
  },
  // Hash
  {
    id: 'node-hash-payload',
    data: {
      id: 'node-hash-payload',
      label: '7f9a2e88c014... (SHA256)',
      type: 'hash',
      severity: 'critical',
      confidence: 98,
      subtitle: 'BlackVenom Dropper Binary',
      details: {
        fileType: 'PE32+ executable (DLL) x86-64',
        imphash: 'a21f89bc1029',
        evidenceCount: 8
      }
    },
    position: { x: 400, y: 640 }
  },
  // MITRE Techniques
  {
    id: 'node-tech-t1190',
    data: {
      id: 'node-tech-t1190',
      label: 'T1190: Exploit Public App',
      type: 'technique',
      severity: 'high',
      confidence: 95,
      subtitle: 'MITRE ATT&CK Initial Access',
      details: {
        tactic: 'Initial Access',
        observedTool: 'CVE-2026-8912 Exploit Wrapper',
        evidenceCount: 18
      }
    },
    position: { x: 960, y: 320 }
  },
  {
    id: 'node-tech-t1071',
    data: {
      id: 'node-tech-t1071',
      label: 'T1071.001: Web Protocols (HTTPS)',
      type: 'technique',
      severity: 'medium',
      confidence: 92,
      subtitle: 'MITRE ATT&CK Command & Control',
      details: {
        tactic: 'Command and Control',
        observedPort: 'TLS 8443 with JARM match',
        evidenceCount: 22
      }
    },
    position: { x: 700, y: 620 }
  }
];

export const initialGraphEdges: GraphEdgeData[] = [
  { id: 'e-1', source: 'node-apt84', target: 'node-malware-bv', label: 'uses', confidence: 94, sourceCount: 14, verified: true },
  { id: 'e-2', source: 'node-apt84', target: 'node-malware-loader', label: 'uses', confidence: 89, sourceCount: 6, verified: true },
  { id: 'e-3', source: 'node-apt84', target: 'node-camp-arctic', label: 'associated_with', confidence: 91, sourceCount: 12, verified: true },
  { id: 'e-4', source: 'node-camp-arctic', target: 'node-target-aero', label: 'targets', confidence: 95, sourceCount: 8, verified: true },
  { id: 'e-5', source: 'node-apt84', target: 'node-ip-primary', label: 'controls', confidence: 92, sourceCount: 9, verified: true },
  { id: 'e-6', source: 'node-ip-primary', target: 'node-domain-primary', label: 'resolves_to', confidence: 98, sourceCount: 7, verified: true },
  { id: 'e-7', source: 'node-malware-bv', target: 'node-ip-primary', label: 'communicates_with', confidence: 96, sourceCount: 11, verified: true },
  { id: 'e-8', source: 'node-malware-bv', target: 'node-ip-secondary', label: 'communicates_with', confidence: 88, sourceCount: 5, verified: true },
  { id: 'e-9', source: 'node-camp-arctic', target: 'node-cve-8912', label: 'exploits', confidence: 94, sourceCount: 10, verified: true },
  { id: 'e-10', source: 'node-cve-8912', target: 'node-tech-t1190', label: 'related_to', confidence: 95, sourceCount: 15, verified: true },
  { id: 'e-11', source: 'node-ip-primary', target: 'node-hash-payload', label: 'hosts', confidence: 97, sourceCount: 8, verified: true },
  { id: 'e-12', source: 'node-malware-bv', target: 'node-tech-t1071', label: 'uses', confidence: 92, sourceCount: 16, verified: true },
  { id: 'e-13', source: 'node-ip-primary', target: 'node-ip-secondary', label: 'associated_with', confidence: 90, sourceCount: 4, verified: true }
];

