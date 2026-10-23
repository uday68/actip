export const INDEX_NAMES = {
  IOCS: 'actip_iocs',
  CVES: 'actip_cves',
  THREAT_ACTORS: 'actip_threat_actors',
  MALWARE: 'actip_malware',
  EVIDENCE: 'actip_evidence',
} as const;

export type SearchIndexKey = keyof typeof INDEX_NAMES;
export type SearchIndexName = typeof INDEX_NAMES[SearchIndexKey];

export const ALL_ACTIP_INDICES = [
  INDEX_NAMES.IOCS,
  INDEX_NAMES.CVES,
  INDEX_NAMES.THREAT_ACTORS,
  INDEX_NAMES.MALWARE,
  INDEX_NAMES.EVIDENCE
];

export const INDEX_MAPPINGS: Record<SearchIndexName, Record<string, unknown>> = {
  [INDEX_NAMES.IOCS]: {
    properties: {
      id: { type: 'keyword' },
      indicator: {
        type: 'text',
        fields: {
          keyword: { type: 'keyword' }
        }
      },
      type: { type: 'keyword' },
      severity: { type: 'keyword' },
      confidence: { type: 'keyword' },
      reputationScore: { type: 'integer' },
      country: { type: 'keyword' },
      asn: {
        type: 'text',
        fields: { keyword: { type: 'keyword' } }
      },
      firstObserved: { type: 'keyword' },
      lastObserved: { type: 'keyword' },
      associatedMalware: { type: 'keyword' },
      associatedActors: { type: 'keyword' },
      associatedCampaigns: { type: 'keyword' },
      rawText: { type: 'text' }
    }
  },

  [INDEX_NAMES.CVES]: {
    properties: {
      id: {
        type: 'text',
        fields: { keyword: { type: 'keyword' } }
      },
      title: { type: 'text' },
      description: { type: 'text' },
      cvss: { type: 'float' },
      severity: { type: 'keyword' },
      cisaKev: { type: 'boolean' },
      epssScore: { type: 'float' },
      affectedProducts: { type: 'keyword' },
      rawText: { type: 'text' }
    }
  },

  [INDEX_NAMES.THREAT_ACTORS]: {
    properties: {
      id: { type: 'keyword' },
      name: {
        type: 'text',
        fields: { keyword: { type: 'keyword' } }
      },
      aliases: {
        type: 'text',
        fields: { keyword: { type: 'keyword' } }
      },
      origin: { type: 'keyword' },
      description: { type: 'text' },
      targetedSectors: { type: 'keyword' },
      targetedRegions: { type: 'keyword' },
      motivations: { type: 'keyword' },
      confidence: { type: 'keyword' },
      rawText: { type: 'text' }
    }
  },

  [INDEX_NAMES.MALWARE]: {
    properties: {
      id: { type: 'keyword' },
      name: {
        type: 'text',
        fields: { keyword: { type: 'keyword' } }
      },
      type: { type: 'keyword' },
      capabilities: { type: 'keyword' },
      associatedActors: { type: 'keyword' },
      activeC2Nodes: { type: 'integer' },
      techniques: { type: 'keyword' },
      rawText: { type: 'text' }
    }
  },

  [INDEX_NAMES.EVIDENCE]: {
    properties: {
      id: { type: 'keyword' },
      claimId: { type: 'keyword' },
      claimText: { type: 'text' },
      sourceName: {
        type: 'text',
        fields: { keyword: { type: 'keyword' } }
      },
      sourceType: { type: 'keyword' },
      relationship: { type: 'text' },
      excerpt: { type: 'text' },
      tlp: { type: 'keyword' },
      reliabilityScore: { type: 'integer' },
      rawText: { type: 'text' }
    }
  }
};
