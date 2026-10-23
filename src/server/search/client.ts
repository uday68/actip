import { Client } from '@elastic/elasticsearch';

const ELASTICSEARCH_URL = process.env.ELASTICSEARCH_URL || 'http://localhost:9200';

let esClient: Client | null = null;
let lastCheckTime = 0;
let cachedAvailable = false;
const CHECK_INTERVAL_MS = 5000; // Cache connectivity check for 5 seconds

export function getElasticsearchClient(): Client {
  if (!esClient) {
    esClient = new Client({
      node: ELASTICSEARCH_URL,
      maxRetries: 1,
      requestTimeout: 2000,
      sniffOnStart: false
    });
  }
  return esClient;
}

export async function isElasticsearchAvailable(): Promise<boolean> {
  const now = Date.now();
  if (now - lastCheckTime < CHECK_INTERVAL_MS) {
    return cachedAvailable;
  }

  try {
    const client = getElasticsearchClient();
    const pingResult = await client.ping();
    cachedAvailable = Boolean(pingResult);
  } catch {
    cachedAvailable = false;
  }

  lastCheckTime = now;
  return cachedAvailable;
}

export function resetConnectivityCache(): void {
  lastCheckTime = 0;
  cachedAvailable = false;
}
