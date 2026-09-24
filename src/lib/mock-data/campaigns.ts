import { ThreatCampaign } from '@/types/cti';

export const mockCampaigns: ThreatCampaign[] = [
  {
    id: 'camp-1',
    name: 'Operation Arctic Ghost',
    codename: 'OP-ARCTIC-GHOST',
    status: 'active',
    targetSectors: ['Aerospace & Defense', 'Energy Sector', 'Government Defense Contractors'],
    targetCountries: ['United States', 'United Kingdom', 'Norway', 'Germany', 'Poland'],
    associatedActors: ['APT-84 (RedBanshee)'],
    associatedMalware: ['BlackVenom RAT v3.2', 'CobaltLoader'],
    cvesExploited: ['CVE-2026-8912', 'CVE-2025-50211'],
    startDate: '2026-06-15',
    lastActivity: '2026-09-15',
    evidenceStrength: 92,
    killChainPhases: [
      {
        phase: 'Reconnaissance & Weaponization',
        description: 'Passive scanning of defense contractor IP ranges for unpatched edge gateways; weaponizing CVE-2026-8912 exploit wrapper.',
        techniques: ['T1595.002', 'T1588.006']
      },
      {
        phase: 'Initial Access',
        description: 'Exploitation of external EdgeSecure gateways and spearphishing emails masquerading as procurement notifications with quantum-defense.org links.',
        techniques: ['T1190', 'T1566.002']
      },
      {
        phase: 'Execution & Defense Evasion',
        description: 'Payload injection into svchost processes; custom JARM TLS handshakes to circumvent perimeter IDS/IPS inspection.',
        techniques: ['T1059.001', 'T1055.012', 'T1027.002']
      },
      {
        phase: 'Command and Control',
        description: 'Encrypted heartbeat beacons over TLS port 8443 back to 185.220.101.5 and secondary staging node 185.220.101.19.',
        techniques: ['T1071.001', 'T1573.002']
      },
      {
        phase: 'Exfiltration',
        description: 'Compression and staging of CAD diagrams and defense project documentation using encrypted RAR archives split into 10MB chunks.',
        techniques: ['T1560.001', 'T1041']
      }
    ]
  },
  {
    id: 'camp-2',
    name: 'Campaign Solstice',
    codename: 'SOLSTICE-CRYPTO-26',
    status: 'active',
    targetSectors: ['Cryptocurrency Exchanges', 'Institutional DeFi Funds', 'Fintech'],
    targetCountries: ['Singapore', 'Japan', 'United States', 'Switzerland'],
    associatedActors: ['VelvetChollima'],
    associatedMalware: ['StealthStealer v2'],
    cvesExploited: [],
    startDate: '2026-02-01',
    lastActivity: '2026-09-14',
    evidenceStrength: 88,
    killChainPhases: [
      {
        phase: 'Initial Access',
        description: 'LinkedIn recruiter impersonation delivering malicious Electron applications masquerading as trading interview coding tests.',
        techniques: ['T1566.001', 'T1204.002']
      },
      {
        phase: 'Credential Harvesting',
        description: 'Harvesting browser master passwords, private wallet seeds, and active 2FA browser session tokens.',
        techniques: ['T1555.003', 'T1005']
      }
    ]
  }
];

