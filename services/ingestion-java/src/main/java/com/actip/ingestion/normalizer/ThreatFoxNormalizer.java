package com.actip.ingestion.normalizer;

import com.actip.ingestion.model.NormalizedIndicator;
import com.fasterxml.jackson.databind.JsonNode;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

public class ThreatFoxNormalizer implements IndicatorNormalizer {

    @Override
    public String getFeedName() {
        return "THREATFOX";
    }

    @Override
    public List<NormalizedIndicator> normalize(JsonNode rootNode) {
        List<NormalizedIndicator> indicators = new ArrayList<>();
        if (rootNode == null) return indicators;

        if (rootNode.isArray()) {
            for (JsonNode item : rootNode) {
                parseSingleItem(null, item, indicators);
            }
        } else if (rootNode.isObject()) {
            Iterator<Map.Entry<String, JsonNode>> fields = rootNode.fields();
            while (fields.hasNext()) {
                Map.Entry<String, JsonNode> entry = fields.next();
                String key = entry.getKey();
                JsonNode val = entry.getValue();
                if (val.isArray()) {
                    for (JsonNode item : val) {
                        parseSingleItem(key, item, indicators);
                    }
                } else if (val.isObject()) {
                    parseSingleItem(key, val, indicators);
                }
            }
        }

        return indicators;
    }

    private void parseSingleItem(String entryKey, JsonNode item, List<NormalizedIndicator> indicators) {
        if (!item.hasNonNull("ioc_value")) return;

        String iocValue = item.get("ioc_value").asText().trim();
        if (iocValue.isEmpty()) return;

        String rawType = item.hasNonNull("ioc_type") ? item.get("ioc_type").asText() : "UNKNOWN";
        String threatType = item.hasNonNull("threat_type") ? item.get("threat_type").asText() : "";
        String malwarePrintable = item.hasNonNull("malware_printable") ? item.get("malware_printable").asText() : "";
        int confidence = item.hasNonNull("confidence_level") ? item.get("confidence_level").asInt(75) : 75;

        NormalizedIndicator ind = new NormalizedIndicator();
        String idPrefix = entryKey != null ? entryKey : String.valueOf(Math.abs(iocValue.hashCode()));
        ind.setId("tf-" + idPrefix);
        ind.setIndicator(iocValue);
        ind.setType(mapIocType(rawType));
        ind.setSourceFeed("THREATFOX");
        ind.setConfidence(confidence);

        // Derive severity
        if (confidence >= 90 && "botnet_cc".equalsIgnoreCase(threatType)) {
            ind.setSeverity("CRITICAL");
        } else if (confidence >= 75) {
            ind.setSeverity("HIGH");
        } else if (confidence >= 50) {
            ind.setSeverity("MEDIUM");
        } else {
            ind.setSeverity("LOW");
        }

        if (item.hasNonNull("first_seen_utc")) ind.setFirstSeen(item.get("first_seen_utc").asText());
        if (item.hasNonNull("last_seen_utc")) ind.setLastSeen(item.get("last_seen_utc").asText());

        ind.setDescription(String.format("ThreatFox %s associated with %s (%s)",
            threatType,
            malwarePrintable.isEmpty() ? "Unknown Malware" : malwarePrintable,
            rawType
        ));

        List<String> tagList = new ArrayList<>();
        tagList.add("ThreatFox");
        if (!threatType.isEmpty()) tagList.add(threatType);
        if (!malwarePrintable.isEmpty()) tagList.add(malwarePrintable);

        if (item.hasNonNull("tags") && !item.get("tags").isNull()) {
            String rawTags = item.get("tags").asText();
            String[] splitTags = rawTags.split("[,;]");
            for (String t : splitTags) {
                String clean = t.trim();
                if (!clean.isEmpty() && !tagList.contains(clean)) {
                    tagList.add(clean);
                }
            }
        }
        ind.setTags(tagList);

        ind.getMetadata().put("rawIocType", rawType);
        ind.getMetadata().put("threatType", threatType);
        ind.getMetadata().put("malwarePrintable", malwarePrintable);
        if (item.hasNonNull("reporter")) ind.getMetadata().put("reporter", item.get("reporter").asText());

        indicators.add(ind);
    }

    private String mapIocType(String raw) {
        String lower = raw.toLowerCase().trim();
        if (lower.contains("ip:port") || lower.contains("ip_port")) return "IP_PORT";
        if (lower.contains("ip")) return "IP";
        if (lower.contains("domain")) return "DOMAIN";
        if (lower.contains("url")) return "URL";
        if (lower.contains("hash") || lower.contains("md5") || lower.contains("sha256")) return "HASH";
        return raw.toUpperCase();
    }
}
