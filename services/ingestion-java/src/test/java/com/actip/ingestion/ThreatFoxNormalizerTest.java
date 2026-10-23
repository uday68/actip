package com.actip.ingestion;

import com.actip.ingestion.model.NormalizedIndicator;
import com.actip.ingestion.normalizer.ThreatFoxNormalizer;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class ThreatFoxNormalizerTest {

    private final ObjectMapper mapper = new ObjectMapper();
    private final ThreatFoxNormalizer normalizer = new ThreatFoxNormalizer();

    @Test
    @DisplayName("Normalizes ThreatFox map-structured IOCs with botnet_cc")
    void testNormalizeThreatFoxMapFormat() throws Exception {
        String json = """
            {
              "223357": [
                {
                  "ioc_value": "198.51.100.23:8080",
                  "ioc_type": "ip:port",
                  "threat_type": "botnet_cc",
                  "malware_printable": "Cobalt Strike",
                  "first_seen_utc": "2026-09-01 10:00:00",
                  "last_seen_utc": "2026-09-20 12:00:00",
                  "confidence_level": 100,
                  "tags": "CobaltStrike,C2,drb_ra"
                }
              ]
            }
            """;

        JsonNode root = mapper.readTree(json);
        List<NormalizedIndicator> result = normalizer.normalize(root);

        assertNotNull(result);
        assertEquals(1, result.size());

        NormalizedIndicator ind = result.get(0);
        assertEquals("tf-223357", ind.getId());
        assertEquals("198.51.100.23:8080", ind.getIndicator());
        assertEquals("IP_PORT", ind.getType());
        assertEquals("THREATFOX", ind.getSourceFeed());
        assertEquals("CRITICAL", ind.getSeverity(), "Botnet CC with 100 confidence should be CRITICAL");
        assertEquals(100, ind.getConfidence());
        assertEquals("2026-09-01 10:00:00", ind.getFirstSeen());
        assertEquals("2026-09-20 12:00:00", ind.getLastSeen());
        assertTrue(ind.getTags().contains("CobaltStrike"));
        assertTrue(ind.getTags().contains("C2"));
        assertEquals("Cobalt Strike", ind.getMetadata().get("malwarePrintable"));
    }

    @Test
    @DisplayName("Normalizes domain and hash types correctly")
    void testNormalizeDomainAndHash() throws Exception {
        String json = """
            [
              {
                "ioc_value": "evil-domain-c2.com",
                "ioc_type": "domain",
                "threat_type": "payload_delivery",
                "confidence_level": 75
              },
              {
                "ioc_value": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                "ioc_type": "sha256_hash",
                "threat_type": "payload",
                "confidence_level": 60
              }
            ]
            """;

        JsonNode root = mapper.readTree(json);
        List<NormalizedIndicator> result = normalizer.normalize(root);

        assertEquals(2, result.size());
        assertEquals("DOMAIN", result.get(0).getType());
        assertEquals("HIGH", result.get(0).getSeverity());
        assertEquals("HASH", result.get(1).getType());
        assertEquals("MEDIUM", result.get(1).getSeverity());
    }
}
