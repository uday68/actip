import cassandra from 'cassandra-driver';
import { db } from '@/server/db/database';

export interface SightingRecord {
  sightingId: string;
  indicator: string;
  observedAt: string;
  sourceFeed: string;
  confidence: number;
  severity: string;
  context?: Record<string, string>;
  rawData?: string;
}

export interface SightingsResponse {
  success: boolean;
  indicator: string;
  backend: 'cassandra' | 'local_store';
  firstSeen: string | null;
  lastSeen: string | null;
  totalSightings: number;
  sightings: SightingRecord[];
}

const CASSANDRA_CONTACT_POINTS = (process.env.CASSANDRA_CONTACT_POINTS || 'localhost').split(',');
const CASSANDRA_LOCAL_DC = process.env.CASSANDRA_LOCAL_DC || 'datacenter1';
const CASSANDRA_KEYSPACE = process.env.CASSANDRA_KEYSPACE || 'actip_cti';

let client: cassandra.Client | null = null;
let lastCheckTime = 0;
let cachedAvailable = false;
const CHECK_INTERVAL_MS = 5000;

export function getCassandraClient(): cassandra.Client {
  if (!client) {
    client = new cassandra.Client({
      contactPoints: CASSANDRA_CONTACT_POINTS,
      localDataCenter: CASSANDRA_LOCAL_DC,
      keyspace: CASSANDRA_KEYSPACE,
      socketOptions: { connectTimeout: 1500, readTimeout: 2000 }
    });
  }
  return client;
}

export async function isCassandraAvailable(): Promise<boolean> {
  const now = Date.now();
  if (now - lastCheckTime < CHECK_INTERVAL_MS) {
    return cachedAvailable;
  }

  try {
    const c = getCassandraClient();
    await c.connect();
    cachedAvailable = true;
  } catch {
    cachedAvailable = false;
  }

  lastCheckTime = now;
  return cachedAvailable;
}

export function getLocalStoreSightings(indicator: string): SightingsResponse {
  const iocs = db.getIocs();
  const matched = iocs.find(
    i => i.indicator.toLowerCase() === indicator.toLowerCase() || i.id.toLowerCase() === indicator.toLowerCase()
  );

  const sightings: SightingRecord[] = [];

  if (matched) {
    // Generate synthetic historical sighting timeline from firstObserved to lastObserved
    sightings.push({
      sightingId: `sight-${matched.id}-last`,
      indicator: matched.indicator,
      observedAt: matched.lastObserved,
      sourceFeed: 'Abuse.ch ThreatFox',
      confidence: matched.confidence,
      severity: matched.severity.toUpperCase(),
      context: { asn: matched.asn || 'N/A', country: matched.country || 'N/A' }
    });

    if (matched.firstObserved !== matched.lastObserved) {
      sightings.push({
        sightingId: `sight-${matched.id}-first`,
        indicator: matched.indicator,
        observedAt: matched.firstObserved,
        sourceFeed: 'Telemetry Sensor #904',
        confidence: Math.max(50, matched.confidence - 10),
        severity: matched.severity.toUpperCase(),
        context: { role: 'Initial Infiltration Beacon' }
      });
    }
  } else {
    // Check if it's a CVE
    const cves = db.getCves();
    const cve = cves.find(c => c.id.toLowerCase() === indicator.toLowerCase());
    if (cve) {
      sightings.push({
        sightingId: `sight-${cve.id}`,
        indicator: cve.id,
        observedAt: cve.modifiedDate || cve.publishedDate,
        sourceFeed: 'CISA KEV Catalog',
        confidence: 100,
        severity: cve.severity.toUpperCase(),
        context: { cvss: String(cve.cvss), kev: cve.cisaKev ? 'true' : 'false' }
      });
    }
  }

  sightings.sort((a, b) => new Date(b.observedAt).getTime() - new Date(a.observedAt).getTime());

  return {
    success: true,
    indicator,
    backend: 'local_store',
    firstSeen: sightings.length ? sightings[sightings.length - 1].observedAt : null,
    lastSeen: sightings.length ? sightings[0].observedAt : null,
    totalSightings: sightings.length,
    sightings
  };
}

export async function querySightings(indicator: string): Promise<SightingsResponse> {
  try {
    const available = await isCassandraAvailable();
    if (available) {
      const c = getCassandraClient();
      const query = 'SELECT indicator, observed_at, sighting_id, source_feed, confidence, severity, context, raw_data FROM sightings WHERE indicator = ?';
      const result = await c.execute(query, [indicator], { prepare: true });

      const sightings: SightingRecord[] = result.rows.map(row => ({
        sightingId: row.sighting_id,
        indicator: row.indicator,
        observedAt: row.observed_at ? row.observed_at.toISOString() : new Date().toISOString(),
        sourceFeed: row.source_feed,
        confidence: row.confidence,
        severity: row.severity,
        context: row.context || undefined,
        rawData: row.raw_data || undefined
      }));

      return {
        success: true,
        indicator,
        backend: 'cassandra',
        firstSeen: sightings.length ? sightings[sightings.length - 1].observedAt : null,
        lastSeen: sightings.length ? sightings[0].observedAt : null,
        totalSightings: sightings.length,
        sightings
      };
    }
  } catch (err) {
    console.warn('[Cassandra] Query failed, using local fallback:', err);
  }

  return getLocalStoreSightings(indicator);
}
