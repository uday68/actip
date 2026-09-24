import { IOCRecord } from '@/types/cti';

export const mockIocs: IOCRecord[] = [
  {
    id: 'ioc-1',
    indicator: '185.220.101.5',
    type: 'ip',
    severity: 'critical',
    confidence: 94,
    firstObserved: '2026-08-12 04:22:19 UTC',
    lastObserved: '2026-09-15 22:14:00 UTC',
    asn: 'AS49870 (Solaris Networks BV)',
    country: 'Netherlands (NL)',
    reputationScore: 94,
    associatedMalware: ['BlackVenom RAT v3.2', 'CobaltLoader'],
    associatedActors: ['APT-84 (RedBanshee)'],
    associatedCampaigns: ['Operation Arctic Ghost'],
    passiveDnsCount: 7,
    whoisSummary: {
      registrar: 'Njalla Privacy Shield (1337 Services LLC)',
      created: '2026-07-15',
      expires: '2027-07-15',
      registrantOrg: 'Withheld for Privacy Purpose'
    },
    dnsHistory: [
      { recordType: 'A', value: 'quantum-defense.org', firstSeen: '2026-09-01', lastSeen: '2026-09-15' },
      { recordType: 'A', value: 'portal-sync.quantum-defense.org', firstSeen: '2026-09-03', lastSeen: '2026-09-14' },
      { recordType: 'A', value: 'update.aerocorp-cloud.com', firstSeen: '2026-08-20', lastSeen: '2026-08-30' },
      { recordType: 'A', value: 'stage2.cdn-securegate.net', firstSeen: '2026-08-12', lastSeen: '2026-08-22' }
    ],
    relatedIocs: [
      { indicator: 'quantum-defense.org', type: 'domain', relation: 'resolves_to', confidence: 98 },
      { indicator: '185.220.101.19', type: 'ip', relation: 'shared_tls_cert', confidence: 91 },
      { indicator: 'portal-sync.quantum-defense.org', type: 'domain', relation: 'subdomain_of', confidence: 95 },
      { indicator: '7f9a2e88c014... (SHA256)', type: 'hash', relation: 'hosted_payload', confidence: 96 }
    ],
    evidenceIds: ['ev-101', 'ev-102', 'ev-103', 'ev-201']
  },
  {
    id: 'ioc-2',
    indicator: 'quantum-defense.org',
    type: 'domain',
    severity: 'high',
    confidence: 96,
    firstObserved: '2026-09-01 10:14:02 UTC',
    lastObserved: '2026-09-15 21:50:11 UTC',
    country: 'Netherlands (NL)',
    registrar: 'Njalla Privacy Shield',
    reputationScore: 92,
    associatedMalware: ['BlackVenom RAT v3.2'],
    associatedActors: ['APT-84 (RedBanshee)'],
    associatedCampaigns: ['Operation Arctic Ghost'],
    passiveDnsCount: 4,
    whoisSummary: {
      registrar: 'Njalla (1337 Services LLC)',
      created: '2026-08-29',
      expires: '2027-08-29',
      registrantOrg: 'Redacted Privacy'
    },
    dnsHistory: [
      { recordType: 'A', value: '185.220.101.5', firstSeen: '2026-09-01', lastSeen: '2026-09-15' },
      { recordType: 'MX', value: 'mail.quantum-defense.org', firstSeen: '2026-09-02', lastSeen: '2026-09-15' }
    ],
    relatedIocs: [
      { indicator: '185.220.101.5', type: 'ip', relation: 'resolves_to', confidence: 98 },
      { indicator: 'CVE-2026-8912', type: 'cve', relation: 'weaponizes', confidence: 94 }
    ],
    evidenceIds: ['ev-201', 'ev-202']
  },
  {
    id: 'ioc-3',
    indicator: '7f9a2e88c014bb98d41e712398fa21e90b88d2031ac82b99',
    type: 'hash',
    severity: 'critical',
    confidence: 98,
    firstObserved: '2026-08-25 14:00:23 UTC',
    lastObserved: '2026-09-14 18:22:00 UTC',
    reputationScore: 99,
    associatedMalware: ['BlackVenom RAT v3.2'],
    associatedActors: ['APT-84 (RedBanshee)'],
    associatedCampaigns: ['Operation Arctic Ghost'],
    passiveDnsCount: 0,
    whoisSummary: {
      registrar: 'N/A',
      created: 'N/A',
      expires: 'N/A',
      registrantOrg: 'Executable Binary / DLL'
    },
    dnsHistory: [],
    relatedIocs: [
      { indicator: '185.220.101.5', type: 'ip', relation: 'communicates_with', confidence: 98 },
      { indicator: '185.220.101.19', type: 'ip', relation: 'fallback_c2', confidence: 90 }
    ],
    evidenceIds: ['ev-103']
  },
  {
    id: 'ioc-4',
    indicator: '194.26.29.112',
    type: 'ip',
    severity: 'high',
    confidence: 88,
    firstObserved: '2026-08-01 09:30:00 UTC',
    lastObserved: '2026-09-14 16:11:00 UTC',
    asn: 'AS57523 (Chang Way Technologies)',
    country: 'Hong Kong (HK)',
    reputationScore: 88,
    associatedMalware: ['StealthStealer v2'],
    associatedActors: ['VelvetChollima'],
    associatedCampaigns: ['Campaign Solstice'],
    passiveDnsCount: 11,
    whoisSummary: {
      registrar: 'Alibaba Cloud Computing',
      created: '2025-11-10',
      expires: '2026-11-10',
      registrantOrg: 'Chang Way Tech'
    },
    dnsHistory: [
      { recordType: 'A', value: 'swift-wire-auth.com', firstSeen: '2026-08-10', lastSeen: '2026-09-14' }
    ],
    relatedIocs: [
      { indicator: 'swift-wire-auth.com', type: 'domain', relation: 'resolves_to', confidence: 95 }
    ],
    evidenceIds: ['ev-401']
  }
];

