#!/usr/bin/env python3
"""
ACTIP OASIS STIX 2.1 Threat Intelligence Bundle Generator
Produces valid STIX 2.1 JSON objects:
indicator, attack-pattern, malware, threat-actor, relationship
"""

import json
import uuid
from datetime import datetime, timezone
from typing import Dict, Any, List

class Stix21BundleGenerator:
    def __init__(self):
        self.spec_version = "2.1"

    def _now_iso(self) -> str:
        return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z")

    def generate_bundle(
        self,
        ip: str,
        domain: str,
        actor: str,
        malware: str,
        cve: str
    ) -> Dict[str, Any]:
        bundle_id = f"bundle--{uuid.uuid4()}"
        now = self._now_iso()

        actor_id = f"threat-actor--{uuid.uuid4()}"
        malware_id = f"malware--{uuid.uuid4()}"
        indicator_id = f"indicator--{uuid.uuid4()}"
        attack_pattern_id = f"attack-pattern--{uuid.uuid4()}"

        objects = [
            # 1. Threat Actor
            {
                "type": "threat-actor",
                "spec_version": self.spec_version,
                "id": actor_id,
                "created": now,
                "modified": now,
                "name": actor,
                "description": f"State-sponsored cyber espionage group attributed to {actor}.",
                "threat_actor_types": ["nation-state", "spy"],
                "sophistication": "advanced"
            },
            # 2. Malware
            {
                "type": "malware",
                "spec_version": self.spec_version,
                "id": malware_id,
                "created": now,
                "modified": now,
                "name": malware,
                "is_family": True,
                "malware_types": ["remote-access-trojan"]
            },
            # 3. Indicator
            {
                "type": "indicator",
                "spec_version": self.spec_version,
                "id": indicator_id,
                "created": now,
                "modified": now,
                "name": f"Malicious C2 beacon destination: {ip}",
                "pattern": f"[ipv4-addr:value = '{ip}']",
                "pattern_type": "stix",
                "valid_from": now
            },
            # 4. Attack Pattern (CVE)
            {
                "type": "attack-pattern",
                "spec_version": self.spec_version,
                "id": attack_pattern_id,
                "created": now,
                "modified": now,
                "name": f"Initial Access via {cve}",
                "external_references": [
                    {"source_name": "cve", "external_id": cve}
                ]
            },
            # 5. Relationships
            {
                "type": "relationship",
                "spec_version": self.spec_version,
                "id": f"relationship--{uuid.uuid4()}",
                "created": now,
                "modified": now,
                "relationship_type": "uses",
                "source_ref": actor_id,
                "target_ref": malware_id
            },
            {
                "type": "relationship",
                "spec_version": self.spec_version,
                "id": f"relationship--{uuid.uuid4()}",
                "created": now,
                "modified": now,
                "relationship_type": "indicates",
                "source_ref": indicator_id,
                "target_ref": malware_id
            }
        ]

        return {
            "type": "bundle",
            "id": bundle_id,
            "spec_version": self.spec_version,
            "objects": objects
        }
