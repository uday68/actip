#!/usr/bin/env python3
"""
ACTIP Diamond Threat Model & Bayesian Attribution Engine
Evaluates: Adversary, Capability, Infrastructure, Victimology
"""

from typing import Dict, Any, List

class DiamondModelAttributionEngine:
    def __init__(self):
        # Known adversary profiles
        self.adversary_profiles = {
            "APT-84": {
                "name": "APT-84 (RedBanshee / Cobalt Frost)",
                "origin": "Eastern Europe / State-Sponsored",
                "knownTooling": ["BlackVenom RAT", "CVE-2026-8912", "NTDLL Unhooking"],
                "infrastructureHabits": ["AS49870", "Commercial VPS Leasing", "Port 8443"],
                "targetSectors": ["Defense", "Aerospace", "Government"],
                "baseConfidence": 0.85
            },
            "VelvetChollima": {
                "name": "VelvetChollima (Lazarus Sub-Group)",
                "origin": "East Asia / Financial Cybercrime",
                "knownTooling": ["Fast-Flux Loader", "SWIFT Sniffer"],
                "infrastructureHabits": ["AS200052", "Dynamic DNS", "Port 443"],
                "targetSectors": ["Banking", "Cryptocurrency", "FinTech"],
                "baseConfidence": 0.80
            }
        }

    def evaluate_attribution(
        self,
        infrastructure: Dict[str, Any],
        capabilities: List[str],
        victim_sector: str
    ) -> Dict[str, Any]:
        scored_candidates = []

        for actor_id, profile in self.adversary_profiles.items():
            # 1. Capability Overlap (Weight: 0.35)
            cap_matches = [c for c in capabilities if any(k.lower() in c.lower() for k in profile["knownTooling"])]
            cap_score = len(cap_matches) / max(len(profile["knownTooling"]), 1)

            # 2. Infrastructure Match (Weight: 0.30)
            infra_matches = 0
            asn = infrastructure.get("asn", "")
            port = infrastructure.get("port", 0)
            if any(asn in h for h in profile["infrastructureHabits"]):
                infra_matches += 1
            if any(str(port) in h for h in profile["infrastructureHabits"]):
                infra_matches += 1
            infra_score = infra_matches / 2.0

            # 3. Victimology Alignment (Weight: 0.25)
            victim_score = 1.0 if any(victim_sector.lower() in s.lower() for s in profile["targetSectors"]) else 0.2

            # 4. Bayesian Posterior Calculation
            w_cap = 0.35
            w_infra = 0.30
            w_vic = 0.25
            w_base = 0.10

            posterior = (
                (w_cap * cap_score) +
                (w_infra * infra_score) +
                (w_vic * victim_score) +
                (w_base * profile["baseConfidence"])
            ) / (w_cap + w_infra + w_vic + w_base)

            confidence_pct = int(min(posterior * 100, 98.0))

            scored_candidates.append({
                "actorId": actor_id,
                "actorName": profile["name"],
                "confidencePercentage": confidence_pct,
                "evidenceMatches": {
                    "capabilities": cap_matches,
                    "matchedAsn": asn,
                    "victimology": victim_sector
                }
            })

        # Sort descending by confidence
        scored_candidates.sort(key=lambda x: x["confidencePercentage"], reverse=True)
        top = scored_candidates[0] if scored_candidates else None

        return {
            "engine": "Bayesian_Diamond_Model_v3",
            "primaryAttribution": top,
            "allCandidates": scored_candidates
        }
