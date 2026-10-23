import { NextRequest, NextResponse } from 'next/server';
import { getElasticsearchClient, isElasticsearchAvailable } from '@/server/search/client';
import { buildSearchQuery } from '@/server/search/query-builder';
import { searchLocalStore, SearchHit, SearchResponse } from '@/server/search/fallback';

export const dynamic = 'force-dynamic';

function mapEsHitToSearchHit(hit: any): SearchHit {
  const index = hit._index;
  const source = hit._source || {};
  const highlight = hit.highlight;

  let category = 'Entities';
  let title = source.name || source.title || source.indicator || source.id || 'Unknown';
  let subtitle = source.description || '';
  let severity = source.severity;
  let url = '/';

  if (index.includes('threat_actors')) {
    category = 'Threat Actors';
    title = source.name || source.id;
    subtitle = `Aliases: ${(source.aliases || []).join(', ')} • ${(source.confidence || 'HIGH').toUpperCase()} confidence`;
    severity = 'critical';
    url = `/actors?id=${source.id}`;
  } else if (index.includes('malware')) {
    category = 'Malware';
    title = source.name || source.id;
    subtitle = `${source.type || 'Malware'} • Active C2 Nodes: ${source.activeC2Nodes || 0}`;
    severity = 'critical';
    url = `/malware?id=${source.id}`;
  } else if (index.includes('iocs')) {
    category = 'Infrastructure';
    title = source.indicator || source.id;
    subtitle = `${(source.type || 'IP').toUpperCase()} • ${source.country || source.asn || 'Malicious'} • Rep: ${source.reputationScore ?? 80}/100`;
    severity = source.severity || 'high';
    url = `/iocs?indicator=${encodeURIComponent(source.indicator || source.id)}`;
  } else if (index.includes('cves')) {
    category = 'Vulnerabilities';
    title = source.id;
    subtitle = `CVSS ${source.cvss || 'N/A'} • KEV: ${source.cisaKev ? 'YES' : 'NO'}`;
    severity = source.severity || 'high';
    url = `/cves?id=${source.id}`;
  } else if (index.includes('evidence')) {
    category = 'Evidence';
    title = `${source.sourceName || 'Source'}: ${source.relationship || 'Evidence'}`;
    subtitle = `Claim: ${(source.claimText || '').slice(0, 80)}... • Reliability: ${source.reliabilityScore || 90}%`;
    severity = 'medium';
    url = `/investigate?claimId=${source.claimId || source.id}`;
  }

  return {
    id: hit._id,
    index,
    type: source.type || index.replace('actip_', ''),
    score: hit._score || 1.0,
    title,
    subtitle,
    category,
    severity,
    url,
    highlight,
    source
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const type = searchParams.get('type') || undefined;
  const limitParam = searchParams.get('limit');
  const limit = limitParam ? Math.min(Math.max(1, parseInt(limitParam, 10)), 100) : 20;

  try {
    const esAvailable = await isElasticsearchAvailable();

    if (esAvailable) {
      const client = getElasticsearchClient();
      const esQuery = buildSearchQuery({ q, type, limit });
      const esResponse = await client.search(esQuery as any);

      const rawHits = esResponse.hits.hits || [];
      const totalHits = typeof esResponse.hits.total === 'number'
        ? esResponse.hits.total
        : (esResponse.hits.total?.value || rawHits.length);

      const hits = rawHits.map(mapEsHitToSearchHit);

      console.log(`[Search] Served by: ELASTICSEARCH (q="${q}", type="${type || 'all'}", hits=${hits.length})`);

      const response: SearchResponse = {
        success: true,
        backend: 'elasticsearch',
        total: totalHits,
        query: q,
        hits
      };

      return NextResponse.json(response);
    }
  } catch (error) {
    console.warn('[Search] Elasticsearch query failed, engaging local fallback:', error);
  }

  // Fallback path
  console.log(`[Search] Served by: LOCAL_STORE_FALLBACK (q="${q}", type="${type || 'all'}")`);
  const fallbackResult = searchLocalStore(q, type, limit);
  return NextResponse.json(fallbackResult);
}
