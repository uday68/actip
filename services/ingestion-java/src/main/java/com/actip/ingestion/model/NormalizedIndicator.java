package com.actip.ingestion.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class NormalizedIndicator {
    private String id;
    private String indicator;
    private String type;         // "CVE", "IP_PORT", "DOMAIN", "HASH", "ATTACK_TECHNIQUE"
    private String sourceFeed;   // "CISA_KEV", "THREATFOX", "MITRE_ATTACK"
    private String severity;     // "CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"
    private Integer confidence;  // 0 - 100
    private String firstSeen;
    private String lastSeen;
    private String description;
    private List<String> tags = new ArrayList<>();
    private Map<String, Object> metadata = new HashMap<>();

    public NormalizedIndicator() {}

    public NormalizedIndicator(String id, String indicator, String type, String sourceFeed) {
        this.id = id;
        this.indicator = indicator;
        this.type = type;
        this.sourceFeed = sourceFeed;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getIndicator() { return indicator; }
    public void setIndicator(String indicator) { this.indicator = indicator; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getSourceFeed() { return sourceFeed; }
    public void setSourceFeed(String sourceFeed) { this.sourceFeed = sourceFeed; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public Integer getConfidence() { return confidence; }
    public void setConfidence(Integer confidence) { this.confidence = confidence; }

    public String getFirstSeen() { return firstSeen; }
    public void setFirstSeen(String firstSeen) { this.firstSeen = firstSeen; }

    public String getLastSeen() { return lastSeen; }
    public void setLastSeen(String lastSeen) { this.lastSeen = lastSeen; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags != null ? tags : new ArrayList<>(); }

    public Map<String, Object> getMetadata() { return metadata; }
    public void setMetadata(Map<String, Object> metadata) { this.metadata = metadata != null ? metadata : new HashMap<>(); }
}
