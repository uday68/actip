import { getElasticsearchClient } from './client';
import { ALL_ACTIP_INDICES, INDEX_MAPPINGS, SearchIndexName } from './mappings';

export async function ensureIndicesExist(): Promise<void> {
  const client = getElasticsearchClient();

  for (const index of ALL_ACTIP_INDICES) {
    const exists = await client.indices.exists({ index });
    if (!exists) {
      console.log(`[Search Indexer] Creating index: ${index}`);
      await client.indices.create({
        index,
        mappings: INDEX_MAPPINGS[index as SearchIndexName] as any
      });
    }
  }
}

export async function bulkIndexDocuments(
  index: SearchIndexName,
  documents: Array<{ id: string; [key: string]: unknown }>
): Promise<{ indexed: number; errors: number }> {
  if (documents.length === 0) return { indexed: 0, errors: 0 };
  const client = getElasticsearchClient();

  const operations = documents.flatMap(doc => [
    { index: { _index: index, _id: doc.id } },
    doc
  ]);

  const bulkResponse = await client.bulk({ refresh: true, operations });

  if (bulkResponse.errors) {
    const errorCount = bulkResponse.items.filter(item => item.index?.error).length;
    console.warn(`[Search Indexer] Bulk index on ${index} had ${errorCount} errors`);
    return { indexed: documents.length - errorCount, errors: errorCount };
  }

  return { indexed: documents.length, errors: 0 };
}
