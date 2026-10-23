# Build Stage
FROM gradle:8.10-jdk21-alpine AS builder

WORKDIR /app

# Cache gradle dependencies first
COPY build.gradle.kts settings.gradle.kts ./
RUN gradle build --no-daemon -x test > /dev/null 2>&1 || true

# Copy source and build jar
COPY src ./src
RUN gradle installDist --no-daemon -x test

# Runtime Stage (Multi-stage, Non-Root)
FROM eclipse-temurin:21-jre-alpine

LABEL maintainer="ACTIP Platform Engineers"
LABEL description="Java 21 Ingestion Service for Cyber Threat Intelligence Feeds"

# Create a non-root group and user
RUN addgroup -g 10001 actipgroup && \
    adduser -u 10001 -G actipgroup -s /bin/sh -D actipuser

WORKDIR /opt/actip-ingestion

# Copy application distribution from build stage
COPY --from=builder --chown=actipuser:actipgroup /app/build/install/actip-ingestion-service ./

# Set environment defaults
ENV ELASTICSEARCH_URL="http://elasticsearch:9200" \
    KAFKA_ENABLED="false" \
    DATA_DIR="/opt/actip-ingestion/data"

# Switch to non-root user
USER actipuser

ENTRYPOINT ["./bin/actip-ingestion-service"]
