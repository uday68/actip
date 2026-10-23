package com.actip.ingestion;

import com.actip.ingestion.model.NormalizedIndicator;
import com.actip.ingestion.normalizer.CisaKevNormalizer;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class CisaKevNormalizerTest {

    private final ObjectMapper mapper = new ObjectMapper();
    private final CisaKevNormalizer normalizer = new CisaKevNormalizer();

    @Test
    @DisplayName("Normalizes CISA KEV vulnerability record with ransomware tag")
    void testNormalizeKevRansomwareRecord() throws Exception {
        String json = """
            {
              "vulnerabilities": [
                {
                  "cveID": "CVE-2026-9999",
                  "vendorProject": "Apache",
                  "product": "Tomcat",
                  "vulnerabilityName": "Apache Tomcat RCE",
                  "dateAdded": "2026-09-01",
                  "shortDescription": "Remote code execution flaw in Apache Tomcat",
                  "requiredAction": "Apply patch immediately.",
                  "dueDate": "2026-09-15",
                  "knownRansomwareCampaignUse": "Known",
                  "cwes": ["CWE-78"]
                }
              ]
            }
            """;

        JsonNode root = mapper.readTree(json);
        List<NormalizedIndicator> result = normalizer.normalize(root);

        assertNotNull(result);
        assertEquals(1, result.size());

        NormalizedIndicator ind = result.get(0);
        assertEquals("cisa-cve-2026-9999", ind.getId());
        assertEquals("CVE-2026-9999", ind.getIndicator());
        assertEquals("CVE", ind.getType());
        assertEquals("CISA_KEV", ind.getSourceFeed());
        assertEquals("CRITICAL", ind.getSeverity(), "Known ransomware campaign use should map to CRITICAL");
        assertEquals(100, ind.getConfidence());
        assertEquals("2026-09-01", ind.getFirstSeen());
        assertTrue(ind.getTags().contains("Ransomware"));
        assertTrue(ind.getTags().contains("Apache"));
        assertTrue(ind.getTags().contains("CWE-78"));
        assertEquals("Apply patch immediately.", ind.getMetadata().get("requiredAction"));
    }

    @Test
    @DisplayName("Normalizes standard CISA KEV entry as HIGH severity")
    void testNormalizeStandardKevRecord() throws Exception {
        String json = """
            {
              "vulnerabilities": [
                {
                  "cveID": "CVE-2026-1234",
                  "vendorProject": "Linux",
                  "product": "Kernel",
                  "vulnerabilityName": "Privilege Escalation",
                  "shortDescription": "Local privilege escalation vulnerability",
                  "knownRansomwareCampaignUse": "Unknown"
                }
              ]
            }
            """;

        JsonNode root = mapper.readTree(json);
        List<NormalizedIndicator> result = normalizer.normalize(root);

        assertEquals(1, result.size());
        assertEquals("HIGH", result.get(0).getSeverity());
    }

    @Test
    @DisplayName("Handles null or empty input gracefully")
    void testEmptyInput() {
        assertTrue(normalizer.normalize(null).isEmpty());
        assertTrue(normalizer.normalize(mapper.createObjectNode()).isEmpty());
    }
}
