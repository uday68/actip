import { isElasticsearchAvailable } from './client';
import { ensureIndicesExist, bulkIndexDocuments } from './indexer';
import { INDEX_NAMES } from './mappings';
import { db } from '../db/database';

async function seedElasticsearch() {
  console.log('[Search Seed] Verifying Elasticsearch availability...');
  const available = await isElasticsearchAvailable();

  if (!available) {
    console.warn('[Search Seed] Elasticsearch is not currently reachable at http://localhost:9200.');
    console.warn('[Search Seed] To run Elasticsearch locally, start docker compose:');
    console.warn('             docker compose up -d elasticsearch');
    console.warn('[Search Seed] The ACTIP platform will automatically fall back to the in-memory JSON store.');
    process.exit(0);
  }

  console.log('[Search Seed] Connected to Elasticsearch. Ensuring indices and mappings...');
  await ensureIndicesExist();

  // 1. Seed Threat Actors
  const actors = db.getThreatActors();
  const actorDocs = actors.map(a => ({
    id: a.id,
    name: a.name,
    aliases: a.aliases,
    origin: a.origin,
    description: a.description,
    targetedSectors: a.targetedSectors,
    targetedRegions: a.targetedRegions,
    motivations: a.motivations,
    confidence: a.confidence,
    rawText: `${a.name} ${(a.aliases || []).join(' ')} ${a.description} ${(a.targetedSectors || []).join(' ')}`
  }));
  const actorRes = await bulkIndexDocuments(INDEX_NAMES.THREAT_ACTORS, actorDocs);
  console.log(`[Search Seed] Indexed ${actorRes.indexed} Threat Actors into ${INDEX_NAMES.THREAT_ACTORS}`);

  // 2. Seed Malware
  const malware = db.getMalware();
  const malwareDocs = malware.map(m => ({
    id: m.id,
    name: m.name,
    type: m.type,
    capabilities: m.capabilities,
    associatedActors: m.associatedActors,
    activeC2Nodes: m.activeC2Nodes,
    techniques: m.techniques,
    rawText: `${m.name} ${m.type} ${(m.capabilities || []).join(' ')} ${(m.techniques || []).join(' ')}`
  }));
  const malRes = await bulkIndexDocuments(INDEX_NAMES.MALWARE, malwareDocs);
  console.log(`[Search Seed] Indexed ${malRes.indexed} Malware families into ${INDEX_NAMES.MALWARE}`);

  // 3. Seed IOCs
  const iocs = db.getIocs();
  const iocDocs = iocs.map(ioc => ({
    id: ioc.id,
    indicator: ioc.indicator,
    type: ioc.type,
    severity: ioc.severity,
    confidence: ioc.confidence,
    reputationScore: ioc.reputationScore,
    country: ioc.country,
    asn: ioc.asn,
    firstObserved: ioc.firstObserved,
    lastObserved: ioc.lastObserved,
    associatedMalware: ioc.associatedMalware,
    associatedActors: ioc.associatedActors,
    associatedCampaigns: ioc.associatedCampaigns,
    rawText: `${ioc.indicator} ${ioc.type} ${ioc.asn || ''} ${(ioc.associatedMalware || []).join(' ')}`
  }));
  const iocRes = await bulkIndexDocuments(INDEX_NAMES.IOCS, iocDocs);
  console.log(`[Search Seed] Indexed ${iocRes.indexed} IOCs into ${INDEX_NAMES.IOCS}`);

  // 4. Seed CVEs
  const cves = db.getCves();
  const cveDocs = cves.map(cve => ({
    id: cve.id,
    title: cve.title,
    description: cve.description,
    cvss: cve.cvss,
    severity: cve.severity,
    cisaKev: cve.cisaKev,
    epssScore: cve.epssScore,
    affectedProducts: cve.affectedProducts,
    rawText: `${cve.id} ${cve.title} ${cve.description} ${cve.affectedProducts.join(' ')}`
  }));
  const cveRes = await bulkIndexDocuments(INDEX_NAMES.CVES, cveDocs);
  console.log(`[Search Seed] Indexed ${cveRes.indexed} CVEs into ${INDEX_NAMES.CVES}`);

  // 5. Seed Evidence
  const investigations = db.getInvestigations();
  const evidenceDocs: Array<{ id: string; [key: string]: unknown }> = [];
  investigations.forEach(inv => {
    if (inv && Array.isArray(inv.claims)) {
      inv.claims.forEach(claim => {
        claim.supportingEvidence.forEach(ev => {
          evidenceDocs.push({
            id: ev.id,
            claimId: claim.id,
            claimText: claim.claimText,
            sourceName: ev.sourceName,
            sourceType: ev.sourceType,
            relationship: ev.relationship,
            excerpt: ev.excerpt,
            tlp: ev.tlp,
            reliabilityScore: ev.reliabilityScore,
            rawText: `${ev.sourceName} ${ev.relationship} ${ev.excerpt} ${claim.claimText}`
          });
        });
      });
    }
  });
  const evRes = await bulkIndexDocuments(INDEX_NAMES.EVIDENCE, evidenceDocs);
  console.log(`[Search Seed] Indexed ${evRes.indexed} Evidence records into ${INDEX_NAMES.EVIDENCE}`);

  console.log('[Search Seed] Elasticsearch seeding completed successfully.');
}

seedElasticsearch().catch(err => {
  console.error('[Search Seed] Error during seeding:', err);
  process.exit(1);
});
