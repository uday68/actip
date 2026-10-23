package com.actip.ingestion.service;

import com.actip.ingestion.config.IngestionConfig;
import com.actip.ingestion.model.NormalizedIndicator;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.serialization.StringSerializer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Properties;

public class KafkaEventProducer implements AutoCloseable {
    private static final Logger log = LoggerFactory.getLogger(KafkaEventProducer.class);

    private final IngestionConfig config;
    private final KafkaProducer<String, String> producer;
    private final ObjectMapper objectMapper;

    public KafkaEventProducer(IngestionConfig config) {
        this.config = config;
        this.objectMapper = new ObjectMapper();

        if (config.isKafkaEnabled()) {
            log.info("Kafka is ENABLED. Connecting to bootstrap servers: {}", config.getKafkaBootstrapServers());
            Properties props = new Properties();
            props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, config.getKafkaBootstrapServers());
            props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
            props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
            props.put(ProducerConfig.ACKS_CONFIG, "1");
            props.put(ProducerConfig.RETRIES_CONFIG, 1);
            props.put(ProducerConfig.REQUEST_TIMEOUT_MS_CONFIG, 2000);
            props.put(ProducerConfig.MAX_BLOCK_MS_CONFIG, 2000);

            KafkaProducer<String, String> p = null;
            try {
                p = new KafkaProducer<>(props);
            } catch (Exception e) {
                log.warn("Kafka producer initialization failed: {}. Continuing without Kafka.", e.getMessage());
            }
            this.producer = p;
        } else {
            log.info("Kafka producer is DISABLED (KAFKA_ENABLED=false). Skipping Kafka streaming.");
            this.producer = null;
        }
    }

    public void publish(NormalizedIndicator indicator) {
        if (producer == null || !config.isKafkaEnabled()) return;

        try {
            String json = objectMapper.writeValueAsString(indicator);
            ProducerRecord<String, String> record = new ProducerRecord<>(
                config.getKafkaTopic(),
                indicator.getId(),
                json
            );
            producer.send(record, (metadata, exception) -> {
                if (exception != null) {
                    log.debug("Kafka send error for {}: {}", indicator.getId(), exception.getMessage());
                }
            });
        } catch (Exception e) {
            log.debug("Error serializing indicator for Kafka: {}", e.getMessage());
        }
    }

    @Override
    public void close() {
        if (producer != null) {
            producer.close();
        }
    }
}
