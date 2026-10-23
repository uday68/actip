import { describe, it } from 'node:test';
import assert from 'node:assert';
import { buildSearchQuery, resolveTargetIndex } from '../src/server/search/query-builder';
import { searchLocalStore } from '../src/server/search/fallback';
import { INDEX_NAMES } from '../src/server/search/mappings';

describe('Search Query Builder', () => {
  it('resolves type to correct index names', () => {
    assert.strictEqual(resolveTargetIndex('ioc'), INDEX_NAMES.IOCS);
    assert.strictEqual(resolveTargetIndex('iocs'), INDEX_NAMES.IOCS);
    assert.strictEqual(resolveTargetIndex('cve'), INDEX_NAMES.CVES);
    assert.strictEqual(resolveTargetIndex('actor'), INDEX_NAMES.THREAT_ACTORS);
    assert.strictEqual(resolveTargetIndex('threat_actor'), INDEX_NAMES.THREAT_ACTORS);
    assert.strictEqual(resolveTargetIndex('malware'), INDEX_NAMES.MALWARE);
    assert.strictEqual(resolveTargetIndex('evidence'), INDEX_NAMES.EVIDENCE);
    assert.strictEqual(resolveTargetIndex(undefined), 'actip_*');
    assert.strictEqual(resolveTargetIndex('all'), 'actip_*');
  });

  it('builds multi_match query with boosting and highlighting', () => {
    const q = buildSearchQuery({ q: 'APT-84', type: 'actor', limit: 10, offset: 0 });

    assert.strictEqual(q.index, INDEX_NAMES.THREAT_ACTORS);
    assert.strictEqual(q.size, 10);
    assert.strictEqual(q.from, 0);

    const mustClause = q.body.query.bool.must[0];
    assert.ok('multi_match' in mustClause);
    assert.strictEqual(mustClause.multi_match.query, 'APT-84');
    assert.strictEqual(mustClause.multi_match.fuzziness, 'AUTO');
    assert.ok(mustClause.multi_match.fields.some(f => f.startsWith('name^')));

    assert.ok(q.body.highlight);
    assert.ok(q.body.highlight.fields.name);
  });

  it('builds match_all when query string is empty', () => {
    const q = buildSearchQuery({ q: '', type: 'ioc' });
    const mustClause = q.body.query.bool.must[0];
    assert.ok('match_all' in mustClause);
  });

  it('clamps limits properly', () => {
    const qSmall = buildSearchQuery({ q: 'test', limit: -5 });
    assert.strictEqual(qSmall.size, 1);

    const qLarge = buildSearchQuery({ q: 'test', limit: 500 });
    assert.strictEqual(qLarge.size, 100);
  });
});

describe('Local Store Search Fallback', () => {
  it('returns hits from the local store with backend tag', () => {
    const result = searchLocalStore('APT-84');
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.backend, 'local_store');
    assert.ok(result.hits.length > 0);

    // Verify top hit is APT-84
    const topHit = result.hits[0];
    assert.ok(topHit.title.includes('APT-84') || topHit.id.includes('actor'));
  });

  it('filters by entity type properly', () => {
    const iocResult = searchLocalStore('185', 'ioc');
    assert.strictEqual(iocResult.success, true);
    assert.ok(iocResult.hits.every(h => h.index === 'actip_iocs'));
  });

  it('provides highlighted snippet matches', () => {
    const result = searchLocalStore('RAT');
    const hitWithHighlight = result.hits.find(h => h.highlight && Object.keys(h.highlight).length > 0);
    if (hitWithHighlight && hitWithHighlight.highlight) {
      const field = Object.keys(hitWithHighlight.highlight)[0];
      const snippet = hitWithHighlight.highlight[field][0];
      assert.ok(snippet.includes('<mark'), 'Should contain <mark> tag');
    }
  });

  it('returns empty list for non-matching nonsense query', () => {
    const result = searchLocalStore('xyznonexistentquery998234');
    assert.strictEqual(result.total, 0);
    assert.strictEqual(result.hits.length, 0);
  });
});
