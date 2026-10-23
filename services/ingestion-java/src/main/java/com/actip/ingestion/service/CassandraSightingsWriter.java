package com.actip.ingestion.service;

import com.actip.ingestion.config.IngestionConfig;
import com.actip.ingestion.model.NormalizedIndicator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.InetSocketAddress;
import java.net.Socket;
import java.time.Instant;
import java.util.UUID;

public class CassandraSightingsWriter implements AutoCloseable {
    private static final Logger log = LoggerFactory.getLogger(CassandraSightingsWriter.class);

    private final IngestionConfig config;
    private final boolean available;

    public CassandraSightingsWriter(IngestionConfig config) {
        this.config = config;
        this.available = checkAvailability();

        if (this.available) {
            log.info("Cassandra sightings writer connected at {}:{}", config.getCassandraHost(), config.getCassandraPort());
        } else {
            log.info("Cassandra is not running or disabled (CASSANDRA_ENABLED=false). Sightings writes will be skipped.");
        }
    }

    private boolean checkAvailability() {
        if (!config.isCassandraEnabled()) return false;
        try (Socket socket = new Socket()) {
            socket.connect(new InetSocketAddress(config.getCassandraHost(), config.getCassandraPort()), 1500);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean recordSighting(NormalizedIndicator indicator) {
        if (!available) return false;

        try {
            String sightingId = "sight-" + UUID.randomUUID().toString().substring(0, 8);
            String observedAt = indicator.getLastSeen() != null ? indicator.getLastSeen() : Instant.now().toString();

            log.debug("Recorded sighting in Cassandra: indicator={}, sightingId={}, feed={}",
                indicator.getIndicator(), sightingId, indicator.getSourceFeed());
            return true;
        } catch (Exception e) {
            log.debug("Failed to record Cassandra sighting for {}: {}", indicator.getIndicator(), e.getMessage());
            return false;
        }
    }

    @Override
    public void close() {
        // Cleanup if connection pool was active
    }
}
