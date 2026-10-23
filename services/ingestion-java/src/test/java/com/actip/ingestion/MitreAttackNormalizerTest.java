package com.actip.ingestion;

import com.actip.ingestion.model.NormalizedIndicator;
import com.actip.ingestion.normalizer.MitreAttackNormalizer;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class MitreAttackNormalizerTest {

    private final ObjectMapper mapper = new ObjectMapper();
    private final MitreAttackNormalizer normalizer = new MitreAttackNormalizer();

    @Test
    @DisplayName("Normalizes MITRE ATT&CK pattern with external_id")
    void testNormalizeAttackPattern() throws Exception {
        String json = """
            {
              "objects": [
                {
                  "type": "attack-pattern",
                  "id": "attack-pattern--12345678",
                  "name": "Process Injection",
                  "description": "Adversaries may inject code into processes to evade defenses.",
                  "created": "2020-01-01T00:00:00.000Z",
                  "modified": "2026-06-01T00:00:00.000Z",
                  "kill_chain_phases": [
                    { "kill_chain_name": "mitre-attack", "phase_name": "defense-evasion" }
                  ],
                  "x_mitre_platforms": ["Windows", "Linux"],
                  "external_references": [
                    {
                      "source_name": "mitre-attack",
                      "external_id": "T1055"
                    }
                  ]
                }
              ]
            }
            """;

        JsonNode root = mapper.readTree(json);
        List<NormalizedIndicator> result = normalizer.normalize(root);

        assertNotNull(result);
        assertEquals(1, result.size());

        NormalizedIndicator ind = result.get(0);
        assertEquals("mitre-technique-t1055", ind.getId());
        assertEquals("T1055", ind.getIndicator());
        assertEquals("ATTACK_TECHNIQUE", ind.getType());
        assertEquals("MITRE_ATTACK", ind.getSourceFeed());
        assertEquals("HIGH", ind.getSeverity());
        assertEquals(95, ind.getConfidence());
        assertTrue(ind.getTags().contains("defense-evasion"));
        assertTrue(ind.getTags().contains("Windows"));
        assertTrue(ind.getTags().contains("Process Injection"));
    }

    @Test
    @DisplayName("Ignores revoked or deprecated techniques")
    void testIgnoreRevoked() throws Exception {
        String json = """
            {
              "objects": [
                {
                  "type": "attack-pattern",
                  "name": "Old Deprecated Technique",
                  "revoked": true
                },
                {
                  "type": "attack-pattern",
                  "name": "Another Old Technique",
                  "x_mitre_deprecated": true
                }
              ]
            }
            """;

        JsonNode root = mapper.readTree(json);
        List<NormalizedIndicator> result = normalizer.normalize(root);
        assertEquals(0, result.size());
    }
}
