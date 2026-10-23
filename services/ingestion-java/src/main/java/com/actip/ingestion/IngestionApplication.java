package com.actip.ingestion;

import com.actip.ingestion.config.IngestionConfig;
import com.actip.ingestion.service.IngestionPipeline;

public class IngestionApplication {
    public static void main(String[] args) {
        IngestionConfig config = new IngestionConfig();
        IngestionPipeline pipeline = new IngestionPipeline(config);
        pipeline.run();
    }
}
