package com.actip.ingestion.service;

import com.actip.ingestion.config.IngestionConfig;
import com.actip.ingestion.model.NormalizedIndicator;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;

public class ElasticsearchBulkIndexer {
    private static final Logger log = LoggerFactory.getLogger(ElasticsearchBulkIndexer.class);

    private final IngestionConfig config;
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    public ElasticsearchBulkIndexer(IngestionConfig config) {
        this.config = config;
        this.httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(3))
            .build();
        this.objectMapper = new ObjectMapper();
    }

    public boolean isAvailable() {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(config.getElasticsearchUrl()))
                .timeout(Duration.ofSeconds(2))
                .GET()
                .build();
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            return response.statusCode() >= 200 && response.statusCode() < 300;
        } catch (Exception e) {
            return false;
        }
    }

    public void ensureIndexExists() {
        try {
            URI indexUri = URI.create(config.getElasticsearchUrl() + "/" + config.getElasticsearchIndex());
            HttpRequest headReq = HttpRequest.newBuilder()
                .uri(indexUri)
                .timeout(Duration.ofSeconds(2))
                .method("HEAD", HttpRequest.BodyPublishers.noBody())
                .build();
            HttpResponse<Void> headRes = httpClient.send(headReq, HttpResponse.BodyHandlers.discarding());

            if (headRes.statusCode() == 404) {
                log.info("Creating Elasticsearch index '{}'...", config.getElasticsearchIndex());
                String mappingJson = """
                    {
                      "mappings": {
                        "properties": {
                          "id": { "type": "keyword" },
                          "indicator": { "type": "text", "fields": { "keyword": { "type": "keyword" } } },
                          "type": { "type": "keyword" },
                          "sourceFeed": { "type": "keyword" },
                          "severity": { "type": "keyword" },
                          "confidence": { "type": "integer" },
                          "firstSeen": { "type": "date" },
                          "lastSeen": { "type": "date" },
                          "description": { "type": "text" },
                          "tags": { "type": "keyword" }
                        }
                      }
                    }
                    """;
                HttpRequest createReq = HttpRequest.newBuilder()
                    .uri(indexUri)
                    .header("Content-Type", "application/json")
                    .PUT(HttpRequest.BodyPublishers.ofString(mappingJson))
                    .build();
                httpClient.send(createReq, HttpResponse.BodyHandlers.ofString());
            }
        } catch (Exception e) {
            log.warn("Failed to check or create index: {}", e.getMessage());
        }
    }

    public int indexBatch(List<NormalizedIndicator> batch) {
        if (batch.isEmpty()) return 0;
        try {
            StringBuilder ndjson = new StringBuilder();
            for (NormalizedIndicator ind : batch) {
                ndjson.append(String.format("{\"index\":{\"_index\":\"%s\",\"_id\":\"%s\"}}\n",
                    config.getElasticsearchIndex(), ind.getId()));
                ndjson.append(objectMapper.writeValueAsString(ind)).append("\n");
            }

            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(config.getElasticsearchUrl() + "/_bulk"))
                .header("Content-Type", "application/x-ndjson")
                .timeout(Duration.ofSeconds(10))
                .POST(HttpRequest.BodyPublishers.ofString(ndjson.toString()))
                .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                return batch.size();
            } else {
                log.error("Elasticsearch bulk index failed with code {}: {}", response.statusCode(), response.body());
                return 0;
            }
        } catch (Exception e) {
            log.error("Error bulk indexing batch of {}: {}", batch.size(), e.getMessage());
            return 0;
        }
    }
}
