package com.actip.ingestion.normalizer;

import com.actip.ingestion.model.NormalizedIndicator;
import com.fasterxml.jackson.databind.JsonNode;
import java.util.ArrayList;
import java.util.List;

public class MitreAttackNormalizer implements IndicatorNormalizer {

    @Override
    public String getFeedName() {
        return "MITRE_ATTACK";
    }

    @Override
    public List<NormalizedIndicator> normalize(JsonNode rootNode) {
        List<NormalizedIndicator> indicators = new ArrayList<>();
        if (rootNode == null) return indicators;

        JsonNode objects = rootNode.has("objects") ? rootNode.get("objects") : rootNode;
        if (!objects.isArray()) return indicators;

        for (JsonNode obj : objects) {
            String stixType = obj.hasNonNull("type") ? obj.get("type").asText() : "";
            boolean isRevoked = obj.hasNonNull("revoked") && obj.get("revoked").asBoolean(false);
            boolean isDeprecated = obj.hasNonNull("x_mitre_deprecated") && obj.get("x_mitre_deprecated").asBoolean(false);
            if (isRevoked || isDeprecated) continue;

            if ("attack-pattern".equals(stixType) || "intrusion-set".equals(stixType) || "malware".equals(stixType)) {
                NormalizedIndicator ind = new NormalizedIndicator();
                String stixId = obj.hasNonNull("id") ? obj.get("id").asText() : "";
                String name = obj.hasNonNull("name") ? obj.get("name").asText().trim() : "Unnamed";

                String externalId = name;
                if (obj.has("external_references") && obj.get("external_references").isArray()) {
                    for (JsonNode ref : obj.get("external_references")) {
                        if (ref.hasNonNull("external_id") && ref.hasNonNull("source_name") &&
                            "mitre-attack".equalsIgnoreCase(ref.get("source_name").asText())) {
                            externalId = ref.get("external_id").asText();
                            break;
                        }
                    }
                }

                String type;
                if ("attack-pattern".equals(stixType)) {
                    type = "ATTACK_TECHNIQUE";
                    ind.setId("mitre-technique-" + externalId.toLowerCase());
                } else if ("intrusion-set".equals(stixType)) {
                    type = "THREAT_ACTOR";
                    ind.setId("mitre-actor-" + externalId.toLowerCase().replaceAll("\\s+", "-"));
                } else {
                    type = "MALWARE";
                    ind.setId("mitre-malware-" + externalId.toLowerCase().replaceAll("\\s+", "-"));
                }

                ind.setIndicator(externalId);
                ind.setType(type);
                ind.setSourceFeed("MITRE_ATTACK");
                ind.setSeverity("HIGH");
                ind.setConfidence(95);

                if (obj.hasNonNull("created")) ind.setFirstSeen(obj.get("created").asText());
                if (obj.hasNonNull("modified")) ind.setLastSeen(obj.get("modified").asText());

                String desc = obj.hasNonNull("description") ? obj.get("description").asText() : "";
                ind.setDescription(name + (desc.isEmpty() ? "" : ": " + (desc.length() > 250 ? desc.substring(0, 250) + "..." : desc)));

                List<String> tags = new ArrayList<>();
                tags.add("MITRE-ATT&CK");
                tags.add(type);
                tags.add(name);

                if (obj.has("kill_chain_phases") && obj.get("kill_chain_phases").isArray()) {
                    for (JsonNode phase : obj.get("kill_chain_phases")) {
                        if (phase.hasNonNull("phase_name")) {
                            tags.add(phase.get("phase_name").asText());
                        }
                    }
                }

                if (obj.has("x_mitre_platforms") && obj.get("x_mitre_platforms").isArray()) {
                    for (JsonNode platform : obj.get("x_mitre_platforms")) {
                        tags.add(platform.asText());
                    }
                }

                ind.setTags(tags);
                ind.getMetadata().put("stixId", stixId);
                ind.getMetadata().put("stixType", stixType);
                ind.getMetadata().put("name", name);

                indicators.add(ind);
            }
        }

        return indicators;
    }
}
