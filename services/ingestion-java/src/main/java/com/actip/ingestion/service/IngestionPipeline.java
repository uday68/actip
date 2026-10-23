package com.actip.ingestion.service;

import com.actip.ingestion.config.IngestionConfig;
import com.actip.ingestion.model.NormalizedIndicator;
import com.actip.ingestion.normalizer.CisaKevNormalizer;
import com.actip.ingestion.normalizer.MitreAttackNormalizer;
import com.actip.ingestion.normalizer.ThreatFoxNormalizer;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

public class IngestionPipeline {
    private static final Logger log = LoggerFactory.getLogger(IngestionPipeline.java);

    private final IngestionConfig config;
    private final ObjectMapper objectMapper;
    private final ElasticsearchBulkIndexer indexer;
    private final KafkaEventProducer kafkaProducer;

    public IngestionPipeline(IngestionConfig config) {
        this.config = config;
        this.objectMapper = new ObjectMapper();
        this.indexer = new ElasticsearchBulkIndexer(config);
        this.kafkaProducer = new KafkaEventProducer(config);
    }

    public void run() {
        log.info("Starting ACTIP Ingestion Pipeline...");
        boolean esAvailable = indexer.isAvailable();
        log.info("Elasticsearch target: {} (Available: {})", config.getElasticsearchUrl(), esAvailable);

        if (esAvailable) {
            indexer.ensureIndexExists();
        } else {
            log.warn("Elasticsearch is currently unreachable. Indicators will be parsed and validated without remote indexing.");
        }

        File dataDir = resolveDataDirectory();
        log.info("Reading threat feeds from directory: {}", dataDir.getAbsolutePath());

        int totalCount = 0;

        // 1. Ingest CISA KEV
        totalCount += ingestFeed(
            new File(dataDir, "cisa-kev-catalog.json"),
            new CisaKevNormalizer(),
            esAvailable
        );

        // 2. Ingest ThreatFox
        totalCount += ingestFeed(
            new File(dataDir, "threatfox-recent.json"),
            new ThreatFoxNormalizer(),
            esAvailable
        );

        // 3. Ingest MITRE ATT&CK
        totalCount += ingestFeed(
            new File(dataDir, "mitre-attack-enterprise.json"),
            new MitreAttackNormalizer(),
            esAvailable
        );

        log.info("ACTIP Ingestion Pipeline finished. Total normalized indicators processed: {}", totalCount);
        kafkaProducer.close();
    }

    private int ingestFeed(File feedFile, com.actip.ingestion.normalizer.IndicatorNormalizer normalizer, boolean esAvailable) {
        if (!feedFile.exists()) {
            log.warn("Feed file not found: {}", feedFile.getAbsolutePath());
            return 0;
        }

        try {
            log.info("Parsing feed [{}] from {}...", normalizer.getFeedName(), feedFile.getName());
            JsonNode root = objectMapper.readTree(feedFile);
            List<NormalizedIndicator> indicators = normalizer.normalize(root);
            log.info("Normalized {} indicators from feed [{}]", indicators.size(), normalizer.getFeedName());

            // Process in batches of 500
            int batchSize = 500;
            List<NormalizedIndicator> currentBatch = new ArrayList<>(batchSize);

            for (NormalizedIndicator ind : indicators) {
                currentBatch.add(ind);
                kafkaProducer.publish(ind);

                if (currentBatch.size() >= batchSize) {
                    if (esAvailable) {
                        indexer.indexBatch(currentBatch);
                    }
                    currentBatch.clear();
                }
            }

            if (!currentBatch.isEmpty() && esAvailable) {
                indexer.indexBatch(currentBatch);
            }

            return indicators.size();
        } catch (Exception e) {
            log.error("Failed to ingest feed [{}]: {}", normalizer.getFeedName(), e.getMessage(), e);
            return 0;
        }
    }

    private File resolveDataDirectory() {
        String configured = config.getDataDir();
        File dir = new File(configured);
        if (dir.exists() && dir.isDirectory()) return dir;

        // Try relative to workspace root
        Path cwd = Paths.get("").toAbsolutePath();
        File candidate = cwd.resolve("data").toFile();
        if (candidate.exists() && candidate.isDirectory()) return candidate;

        candidate = cwd.resolve("../../data").toFile();
        if (candidate.exists() && candidate.isDirectory()) return candidate;

        return dir;
    }
}
