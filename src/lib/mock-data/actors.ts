import { ThreatActor } from '@/types/cti';

export const mockThreatActors: ThreatActor[] = [
  {
    id: 'actor-1',
    name: 'APT-84',
    aliases: ['RedBanshee', 'Cobalt Frost', 'TEMP.Tundra', 'UAC-0098'],
    origin: 'Eastern Europe / State-Sponsored Hypothesis',
    motivations: ['Strategic Espionage', 'Defense Technology Exfiltration', 'Critical Infrastructure Sabotage'],
    targetedSectors: ['Aerospace & Defense', 'Energy & Power Grids', 'Government Agencies', 'Telecommunications'],
    targetedRegions: ['Western Europe', 'North America', 'Baltic States', 'East Asia'],
    firstObserved: '2021-04-10',
    lastActive: '2026-09-15',
    confidence: 'high',
    associatedMalware: ['BlackVenom RAT v3.2', 'CobaltLoader', 'ShadowInjector', 'TundraWiper'],
    campaigns: ['Operation Arctic Ghost', 'Operation DeepVolt', 'Titan Harvest'],
    techniques: ['T1190', 'T1059.001', 'T1071.001', 'T1566.002', 'T1027.002', 'T1083', 'T1055'],
    infrastructureCount: {
      ips: 38,
      domains: 29
    },
    description:
      'APT-84 (RedBanshee) is a highly capable advanced persistent threat group known for sophisticated multi-stage intrusions against defense industrial base contractors. The group frequently acquires commercial VPS subnets, leverages custom encrypted RAT variants with dynamic JARM fingerprints, and exploits public-facing gateway zero-days to bypass MFA perimeters.',
    sourcesCount: 18,
    evidenceStrength: 91
  },
  {
    id: 'actor-2',
    name: 'VelvetChollima',
    aliases: ['Labyrinth Chollima', 'NickelAcademy', 'CryptoJackal'],
    origin: 'East Asia / State-Sponsored Financial',
    motivations: ['Financial Theft', 'Cryptocurrency Laundering', 'SWIFT Interception'],
    targetedSectors: ['Financial Services', 'Cryptocurrency Exchanges', 'Defense', 'Fintech'],
    targetedRegions: ['Global', 'Southeast Asia', 'North America'],
    firstObserved: '2019-08-15',
    lastActive: '2026-09-14',
    confidence: 'high',
    associatedMalware: ['StealthStealer v2', 'BankerLoader', 'GhostRAT-Variant'],
    campaigns: ['Campaign Solstice', 'Operation CoinSweep'],
    techniques: ['T1566.001', 'T1059.003', 'T1021.001', 'T1078'],
    infrastructureCount: {
      ips: 52,
      domains: 44
    },
    description:
      'VelvetChollima specializes in revenue generation through high-value crypto heists and SWIFT terminal intrusions, often deploying legitimate job-lure lures to breach internal engineering workstations.',
    sourcesCount: 22,
    evidenceStrength: 89
  },
  {
    id: 'actor-3',
    name: 'PhantomPanda',
    aliases: ['Bronze Riverside', 'RedHydra', 'MustangSilk'],
    origin: 'Asia-Pacific',
    motivations: ['Economic Espionage', 'Intellectual Property Theft', 'Diplomatic Surveillance'],
    targetedSectors: ['Semiconductors', 'Renewable Energy', 'Foreign Ministries', 'Maritime Transport'],
    targetedRegions: ['Indo-Pacific', 'European Union', 'United States'],
    firstObserved: '2018-02-12',
    lastActive: '2026-09-11',
    confidence: 'medium',
    associatedMalware: ['SilkWeaver Loader', 'PlugX Mod 2026', 'ShadowPad 4.0'],
    campaigns: ['Operation Maritime Watch', 'Project Silicon Shield'],
    techniques: ['T1190', 'T1078', 'T1003.001', 'T1041'],
    infrastructureCount: {
      ips: 64,
      domains: 58
    },
    description:
      'Focuses on persistent stealth operations and long-term intellectual property exfiltration from advanced semiconductor and maritime engineering firms.',
    sourcesCount: 16,
    evidenceStrength: 82
  }
];

