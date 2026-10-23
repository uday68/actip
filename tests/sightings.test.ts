import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getLocalStoreSightings, querySightings } from '../src/server/storage/cassandra';

describe('Cassandra Sightings & Local Store Fallback', () => {
  it('retrieves sightings for known IOC from local fallback', async () => {
    const result = await querySightings('185.220.101.5');

    assert.strictEqual(result.success, true);
    assert.strictEqual(result.indicator, '185.220.101.5');
    assert.ok(result.backend === 'local_store' || result.backend === 'cassandra');
    assert.ok(result.totalSightings >= 1);
    assert.ok(result.firstSeen !== null);
    assert.ok(result.lastSeen !== null);

    const firstSighting = result.sightings[0];
    assert.strictEqual(firstSighting.indicator, '185.220.101.5');
    assert.ok(firstSighting.severity);
    assert.ok(firstSighting.confidence > 0);
  });

  it('retrieves sightings for known CVE from local fallback', async () => {
    const result = getLocalStoreSightings('CVE-2026-8912');

    assert.strictEqual(result.success, true);
    assert.strictEqual(result.indicator, 'CVE-2026-8912');
    assert.strictEqual(result.backend, 'local_store');
    assert.ok(result.totalSightings >= 1);
    assert.ok(result.sightings[0].sourceFeed.includes('CISA KEV'));
  });

  it('handles unknown indicator gracefully without error', async () => {
    const result = await querySightings('non-existent-indicator-0.0.0.0');

    assert.strictEqual(result.success, true);
    assert.strictEqual(result.totalSightings, 0);
    assert.strictEqual(result.firstSeen, null);
    assert.strictEqual(result.lastSeen, null);
    assert.deepStrictEqual(result.sightings, []);
  });
});
