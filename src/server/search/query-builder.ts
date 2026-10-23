import { ALL_ACTIP_INDICES, INDEX_NAMES, SearchIndexName } from './mappings';

export interface SearchQueryParams {
  q: string;
  type?: string;
  limit?: number;
  offset?: number;
}

export function resolveTargetIndex(type?: string): string {
  if (!type) return 'actip_*';
  const cleanType = type.toLowerCase().trim();

  switch (cleanType) {
    case 'ioc':
    case 'iocs':
    case 'infrastructure':
      return INDEX_NAMES.IOCS;
    case 'cve':
    case 'cves':
    case 'vulnerability':
    case 'vulnerabilities':
      return INDEX_NAMES.CVES;
    case 'actor':
    case 'actors':
    case 'threat_actor':
    case 'threat-actors':
    case 'threat_actors':
      return INDEX_NAMES.THREAT_ACTORS;
    case 'malware':
      return INDEX_NAMES.MALWARE;
    case 'evidence':
    case 'claim':
    case 'claims':
      return INDEX_NAMES.EVIDENCE;
    default:
      return 'actip_*';
  }
}

export function buildSearchQuery(params: SearchQueryParams) {
  const { q, type, limit = 20, offset = 0 } = params;
  const index = resolveTargetIndex(type);

  // If query is blank, match all
  const mustClause = q.trim()
    ? {
        multi_match: {
          query: q.trim(),
          fields: [
            'id^4',
            'indicator^5',
            'name^4',
            'title^4',
            'aliases^3',
            'campaign^2',
            'asn^2',
            'description^1.5',
            'excerpt^1.5',
            'claimText^1.5',
            'tags^2',
            'affectedProducts^2',
            'rawText^1'
          ],
          type: 'best_fields',
          fuzziness: 'AUTO',
          prefix_length: 2
        }
      }
    : {
        match_all: {}
      };

  return {
    index,
    from: Math.max(0, offset),
    size: Math.min(Math.max(1, limit), 100),
    body: {
      query: {
        bool: {
          must: [mustClause]
        }
      },
      highlight: {
        pre_tags: ['<mark class="bg-amber-500/20 text-amber-200 font-semibold px-0.5 rounded">'],
        post_tags: ['</mark>'],
        fields: {
          indicator: { number_of_fragments: 0 },
          name: { number_of_fragments: 0 },
          title: { number_of_fragments: 0 },
          aliases: { number_of_fragments: 0 },
          description: { fragment_size: 150, number_of_fragments: 1 },
          excerpt: { fragment_size: 150, number_of_fragments: 1 },
          claimText: { fragment_size: 150, number_of_fragments: 1 },
          rawText: { fragment_size: 150, number_of_fragments: 1 }
        }
      }
    }
  };
}
