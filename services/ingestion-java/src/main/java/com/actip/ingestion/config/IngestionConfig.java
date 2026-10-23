package com.actip.ingestion.config;

public class IngestionConfig {
    private final String elasticsearchUrl;
    private final String elasticsearchIndex;
    private final boolean kafkaEnabled;
    private final String kafkaBootstrapServers;
    private final String kafkaTopic;
    private final String dataDir;

    public IngestionConfig() {
        this.elasticsearchUrl = getEnvOrDefault("ELASTICSEARCH_URL", "http://localhost:9200");
        this.elasticsearchIndex = getEnvOrDefault("ELASTICSEARCH_INDEX", "actip_normalized_indicators");
        this.kafkaEnabled = Boolean.parseBoolean(getEnvOrDefault("KAFKA_ENABLED", "false"));
        this.kafkaBootstrapServers = getEnvOrDefault("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092");
        this.kafkaTopic = getEnvOrDefault("KAFKA_TOPIC", "actip.threat.indicators");
        this.dataDir = getEnvOrDefault("DATA_DIR", "../../data");
    }

    private static String getEnvOrDefault(String key, String fallback) {
        String val = System.getenv(key);
        return (val != null && !val.trim().isEmpty()) ? val.trim() : fallback;
    }

    public String getElasticsearchUrl() { return elasticsearchUrl; }
    public String getElasticsearchIndex() { return elasticsearchIndex; }
    public boolean isKafkaEnabled() { return kafkaEnabled; }
    public String getKafkaBootstrapServers() { return kafkaBootstrapServers; }
    public String getKafkaTopic() { return kafkaTopic; }
    public String getDataDir() { return dataDir; }
}
