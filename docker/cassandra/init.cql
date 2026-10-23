-- ACTIP Threat Intelligence Sightings Schema
CREATE KEYSPACE IF NOT EXISTS actip_cti
  WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};

CREATE TABLE IF NOT EXISTS actip_cti.sightings (
  indicator text,
  observed_at timestamp,
  sighting_id text,
  source_feed text,
  confidence int,
  severity text,
  context map<text, text>,
  raw_data text,
  PRIMARY KEY ((indicator), observed_at, sighting_id)
) WITH CLUSTERING ORDER BY (observed_at DESC, sighting_id ASC);
