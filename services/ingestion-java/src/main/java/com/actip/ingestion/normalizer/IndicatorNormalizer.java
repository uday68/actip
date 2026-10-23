package com.actip.ingestion.normalizer;

import com.actip.ingestion.model.NormalizedIndicator;
import com.fasterxml.jackson.databind.JsonNode;
import java.util.List;

public interface IndicatorNormalizer {
    String getFeedName();
    List<NormalizedIndicator> normalize(JsonNode rootNode);
}
