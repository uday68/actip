#!/usr/bin/env python3
"""
ACTIP Unified Python AI & Threat Intelligence CLI / IPC Bridge
Provides CLI and JSON endpoints for:
1. SecBERT Named Entity Recognition (NER)
2. Bayesian Diamond Model Threat Attribution
3. Cisco Talos Intelligence Cross-Referencing
4. OASIS STIX 2.1 JSON Bundle Compilation
"""

import sys
import json
import argparse
from secbert_ner import SecBertNerExtractor
from diamond_model_attribution import DiamondModelAttributionEngine
from cisco_talos_enricher import CiscoTalosEnricher
from stix_generator import Stix21BundleGenerator

def main():
    parser = argparse.ArgumentParser(description="ACTIP Python AI & CTI Engine")
    parser.add_argument("--mode", choices=["ner", "attribution", "talos", "stix", "full"], default="full")
    parser.add_argument("--text", type=str, default="Suspicious beacon to 185.220.101.5 on port 8443 exploiting CVE-2026-8912 with BlackVenom RAT by APT-84")
    parser.add_argument("--ip", type=str, default="185.220.101.5")
    parser.add_argument("--domain", type=str, default="quantum-defense.org")
    parser.add_argument("--cve", type=str, default="CVE-2026-8912")
    parser.add_argument("--actor", type=str, default="APT-84")
    parser.add_argument("--malware", type=str, default="BlackVenom RAT v3.2")
    parser.add_argument("--asn", type=str, default="AS49870")
    parser.add_argument("--port", type=int, default=8443)
    parser.add_argument("--sector", type=str, default="Defense")

    args = parser.parse_args()

    ner_engine = SecBertNerExtractor()
    attrib_engine = DiamondModelAttributionEngine()
    talos_engine = CiscoTalosEnricher()
    stix_engine = Stix21BundleGenerator()

    if args.mode == "ner":
        res = ner_engine.extract_entities(args.text)
        print(json.dumps(res, indent=2))
        return

    if args.mode == "attribution":
        res = attrib_engine.evaluate_attribution(
            infrastructure={"asn": args.asn, "port": args.port},
            capabilities=[args.malware, args.cve, "NTDLL Unhooking"],
            victim_sector=args.sector
        )
        print(json.dumps(res, indent=2))
        return

    if args.mode == "talos":
        res = talos_engine.enrich_observable(args.ip)
        incident = talos_engine.generate_cisco_xdr_incident(args.ip, args.actor, args.cve)
        print(json.dumps({"enrichment": res, "ciscoXdrPayload": incident}, indent=2))
        return

    if args.mode == "stix":
        bundle = stix_engine.generate_bundle(args.ip, args.domain, args.actor, args.malware, args.cve)
        print(json.dumps(bundle, indent=2))
        return

    # Default: FULL PIPELINE EXECUTION
    ner_result = ner_engine.extract_entities(args.text)
    primary_ip = ner_result["observables"]["ips"][0] if ner_result["observables"]["ips"] else args.ip
    primary_cve = ner_result["observables"]["cves"][0] if ner_result["observables"]["cves"] else args.cve

    attribution_result = attrib_engine.evaluate_attribution(
        infrastructure={"asn": args.asn, "port": args.port},
        capabilities=[args.malware, primary_cve, "NTDLL Unhooking"],
        victim_sector=args.sector
    )

    talos_result = talos_engine.enrich_observable(primary_ip)
    cisco_xdr = talos_engine.generate_cisco_xdr_incident(primary_ip, args.actor, primary_cve)
    stix_bundle = stix_engine.generate_bundle(primary_ip, args.domain, args.actor, args.malware, primary_cve)

    output = {
        "status": "SUCCESS",
        "engine": "ACTIP_PYTHON_AI_COGNITIVE_STACK_v2.4",
        "ner": ner_result,
        "attribution": attribution_result,
        "ciscoTalos": talos_result,
        "ciscoXdrIncident": cisco_xdr,
        "stix21BundleSummary": {
            "bundleId": stix_bundle["id"],
            "totalObjects": len(stix_bundle["objects"]),
            "types": list(set(o["type"] for o in stix_bundle["objects"]))
        }
    }

    print(json.dumps(output, indent=2))

if __name__ == "__main__":
    main()
