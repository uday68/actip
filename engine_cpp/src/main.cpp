#include <iostream>
#include <vector>
#include <string>
#include <chrono>
#include "jarm_fingerprint.hpp"
#include "vector_similarity.hpp"
#include "snort_rule_generator.hpp"
#include "bgp_trie.hpp"

int main(int argc, char* argv[]) {
    std::string mode = "benchmark";
    std::string targetIp = "185.220.101.5";
    int targetPort = 8443;
    std::string domain = "quantum-defense.org";
    std::string malware = "BlackVenom RAT v3.2";
    std::string actor = "APT-84";

    for (int i = 1; i < argc; ++i) {
        std::string arg = argv[i];
        if (arg == "--mode" && i + 1 < argc) {
            mode = argv[++i];
        } else if (arg == "--ip" && i + 1 < argc) {
            targetIp = argv[++i];
        } else if (arg == "--port" && i + 1 < argc) {
            targetPort = std::stoi(argv[++i]);
        } else if (arg == "--domain" && i + 1 < argc) {
            domain = argv[++i];
        } else if (arg == "--malware" && i + 1 < argc) {
            malware = argv[++i];
        } else if (arg == "--actor" && i + 1 < argc) {
            actor = argv[++i];
        } else if (arg == "--benchmark") {
            mode = "benchmark";
        }
    }

    if (mode == "jarm") {
        actip::JarmResult res = actip::JarmFingerprinter::evaluateTarget(targetIp, targetPort, "blackvenom");
        std::cout << "{\n"
                  << "  \"engine\": \"ACTIP_C++_NATIVE_CORE\",\n"
                  << "  \"ip\": \"" << res.ip << "\",\n"
                  << "  \"port\": " << res.port << ",\n"
                  << "  \"jarmHash\": \"" << res.jarmHash << "\",\n"
                  << "  \"matchedFamily\": \"" << res.matchedFamily << "\",\n"
                  << "  \"confidence\": " << res.confidence << ",\n"
                  << "  \"isKnownMalicious\": " << (res.isKnownMalicious ? "true" : "false") << "\n"
                  << "}\n";
        return 0;
    }

    if (mode == "bgp") {
        actip::BgpTrie trie;
        actip::AsnRecord rec = trie.lookupLongestPrefix(targetIp);
        std::cout << "{\n"
                  << "  \"engine\": \"ACTIP_C++_BGP_LPM_TRIE\",\n"
                  << "  \"queriedIp\": \"" << targetIp << "\",\n"
                  << "  \"matchedCidr\": \"" << rec.cidr << "\",\n"
                  << "  \"asn\": \"" << rec.asn << "\",\n"
                  << "  \"orgName\": \"" << rec.orgName << "\",\n"
                  << "  \"country\": \"" << rec.country << "\",\n"
                  << "  \"riskScore\": " << rec.riskScore << "\n"
                  << "}\n";
        return 0;
    }

    if (mode == "snort") {
        actip::ThreatObservable obs{targetIp, targetPort, domain, malware, actor, "CVE-2026-8912"};
        std::string snortRule = actip::SnortRuleGenerator::generateSnort3Rule(obs);
        std::string ciscoAcl = actip::SnortRuleGenerator::generateCiscoAcl(obs);
        std::cout << "=== Cisco Snort 3 Rule ===\n" << snortRule << "\n";
        std::cout << "=== Cisco ASA ACL Rule ===\n" << ciscoAcl << "\n";
        return 0;
    }

    // Default: Run High-Performance Benchmark
    std::cout << "=========================================================\n";
    std::cout << " ACTIP C++20 High-Performance Network & Vector Engine     \n";
    std::cout << "=========================================================\n";

    // 1. Benchmark BGP LPM Trie
    actip::BgpTrie trie;
    auto t1 = std::chrono::high_resolution_clock::now();
    for (int i = 0; i < 50000; ++i) {
        auto rec = trie.lookupLongestPrefix("185.220.101.5");
    }
    auto t2 = std::chrono::high_resolution_clock::now();
    auto bgpDuration = std::chrono::duration_cast<std::chrono::microseconds>(t2 - t1).count();

    std::cout << "[1] BGP Trie Longest Prefix Match (LPM):\n";
    std::cout << "    - Target IP: " << targetIp << "\n";
    auto rec = trie.lookupLongestPrefix(targetIp);
    std::cout << "    - Matched ASN: " << rec.asn << " (" << rec.orgName << ", " << rec.country << ")\n";
    std::cout << "    - Benchmark: 50,000 lookups completed in " << bgpDuration << " us (~"
              << (50000.0 / (bgpDuration / 1000000.0)) << " lookups/sec)\n\n";

    // 2. Benchmark JARM Fingerprinter
    std::cout << "[2] Active TLS JARM Server Fingerprint Evaluation:\n";
    actip::JarmResult jarmRes = actip::JarmFingerprinter::evaluateTarget(targetIp, targetPort, "blackvenom");
    std::cout << "    - IP/Port: " << jarmRes.ip << ":" << jarmRes.port << "\n";
    std::cout << "    - JARM Hash: " << jarmRes.jarmHash << "\n";
    std::cout << "    - Signature: " << jarmRes.matchedFamily << " (" << jarmRes.confidence << "% confidence)\n\n";

    // 3. Benchmark Vector Similarity Engine
    std::cout << "[3] Vector Cosine Similarity Engine (ATT&CK Vector RAG):\n";
    std::vector<actip::TechniqueVector> corpus = {
        {"T1055", "Process Injection", "Defense Evasion", {0.82f, 0.45f, 0.12f, 0.91f, 0.33f, 0.76f, 0.19f, 0.88f}},
        {"T1562.001", "Impair Defenses: Disable Tools", "Defense Evasion", {0.79f, 0.51f, 0.20f, 0.88f, 0.40f, 0.72f, 0.25f, 0.85f}},
        {"T1071.001", "Application Layer Protocol: Web Protocols", "Command and Control", {0.35f, 0.88f, 0.72f, 0.15f, 0.82f, 0.30f, 0.65f, 0.41f}},
        {"T1190", "Exploit Public-Facing Application", "Initial Access", {0.91f, 0.22f, 0.15f, 0.75f, 0.19f, 0.64f, 0.88f, 0.33f}},
        {"T1059.001", "Command and Scripting Interpreter: PowerShell", "Execution", {0.60f, 0.40f, 0.50f, 0.30f, 0.70f, 0.65f, 0.45f, 0.55f}}
    };

    std::vector<float> queryVec = {0.81f, 0.46f, 0.15f, 0.89f, 0.36f, 0.74f, 0.22f, 0.87f};
    actip::VectorSimilarityEngine vecEngine;

    auto vt1 = std::chrono::high_resolution_clock::now();
    for (int i = 0; i < 100000; ++i) {
        auto topMatches = vecEngine.searchTopK(queryVec, corpus, 3, 0.70f);
    }
    auto vt2 = std::chrono::high_resolution_clock::now();
    auto vecDuration = std::chrono::duration_cast<std::chrono::microseconds>(vt2 - vt1).count();

    auto topMatches = vecEngine.searchTopK(queryVec, corpus, 3, 0.70f);
    std::cout << "    - Query Concept: \"NTDLL in-memory unhooking & direct syscalls\"\n";
    std::cout << "    - Top Matches:\n";
    for (const auto& m : topMatches) {
        std::cout << "      * [" << m.id << "] " << m.name << " (" << m.tactic << ") - Cosine Sim: " << m.score << "\n";
    }
    std::cout << "    - Benchmark: 100,000 Top-K vector searches completed in " << vecDuration << " us (~"
              << (100000.0 / (vecDuration / 1000000.0)) << " searches/sec)\n\n";

    // 4. Cisco Snort 3 & ACL Containment Output
    std::cout << "[4] Automated Cisco Snort 3 & ASA Access Control Rule Generation:\n";
    actip::ThreatObservable obs{targetIp, targetPort, domain, malware, actor, "CVE-2026-8912"};
    std::cout << actip::SnortRuleGenerator::generateSnort3Rule(obs);
    std::cout << actip::SnortRuleGenerator::generateCiscoAcl(obs);
    std::cout << "=========================================================\n";

    return 0;
}
