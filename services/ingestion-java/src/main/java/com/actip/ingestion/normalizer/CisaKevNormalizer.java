package com.actip.ingestion.normalizer;

import com.actip.ingestion.model.NormalizedIndicator;
import com.fasterxml.jackson.databind.JsonNode;
import java.util.ArrayList;
import java.util.List;

public class CisaKevNormalizer implements IndicatorNormalizer {

    @Override
    public String getFeedName() {
        return "CISA_KEV";
    }

    @Override
    public List<NormalizedIndicator> normalize(JsonNode rootNode) {
        List<NormalizedIndicator> indicators = new ArrayList<>();
        if (rootNode == null) return indicators;

        JsonNode vulns = rootNode.has("vulnerabilities") ? rootNode.get("vulnerabilities") : rootNode;
        if (!vulns.isArray()) return indicators;

        for (JsonNode item : vulns) {
            String cveId = item.hasNonNull("cveID") ? item.get("cveID").asText().trim() : null;
            if (cveId == null || cveId.isEmpty()) continue;

            NormalizedIndicator ind = new NormalizedIndicator();
            ind.setId("cisa-" + cveId.toLowerCase());
            ind.setIndicator(cveId);
            ind.setType("CVE");
            ind.setSourceFeed("CISA_KEV");

            String ransomware = item.hasNonNull("knownRansomwareCampaignUse")
                ? item.get("knownRansomwareCampaignUse").asText()
                : "Unknown";

            boolean isRansomware = "Known".equalsIgnoreCase(ransomware);
            ind.setSeverity(isRansomware ? "CRITICAL" : "HIGH");
            ind.setConfidence(100);

            if (item.hasNonNull("dateAdded")) {
                ind.setFirstSeen(item.get("dateAdded").asText());
                ind.setLastSeen(item.get("dateAdded").asText());
            }

            String vulnName = item.hasNonNull("vulnerabilityName") ? item.get("vulnerabilityName").asText().trim() : "";
            String desc = item.hasNonNull("shortDescription") ? item.get("shortDescription").asText().trim() : "";
            ind.setDescription(vulnName.isEmpty() ? desc : vulnName + " - " + desc);

            List<String> tags = new ArrayList<>();
            tags.add("CISA-KEV");
            if (item.hasNonNull("vendorProject")) tags.add(item.get("vendorProject").asText());
            if (item.hasNonNull("product")) tags.add(item.get("product").asText());
            if (isRansomware) tags.add("Ransomware");
            if (item.has("cwes") && item.get("cwes").isArray()) {
                for (JsonNode cwe : item.get("cwes")) {
                    tags.add(cwe.asText());
                }
            }
            ind.setTags(tags);

            ind.getMetadata().put("vendorProject", item.hasNonNull("vendorProject") ? item.get("vendorProject").asText() : "");
            ind.getMetadata().put("product", item.hasNonNull("product") ? item.get("product").asText() : "");
            ind.getMetadata().put("requiredAction", item.hasNonNull("requiredAction") ? item.get("requiredAction").asText() : "");
            ind.getMetadata().put("knownRansomwareCampaignUse", ransomware);
            if (item.hasNonNull("dueDate")) {
                ind.getMetadata().put("dueDate", item.get("dueDate").asText());
            }

            indicators.add(ind);
        }

        return indicators;
    }
}
