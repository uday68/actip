#include "bgp_trie.hpp"
#include <sstream>

namespace actip {

uint32_t BgpTrie::ipToUint(const std::string& ipStr) {
    std::stringstream ss(ipStr);
    std::string item;
    uint32_t ip = 0;
    int shift = 24;
    while (std::getline(ss, item, '.') && shift >= 0) {
        ip |= (static_cast<uint32_t>(std::stoi(item)) & 0xFF) << shift;
        shift -= 8;
    }
    return ip;
}

BgpTrie::BgpTrie() : root(std::make_unique<TrieNode>()) {
    // Seed core known intelligence prefixes
    insert("185.220.101.0/24", "AS49870", "Solaris Networks BV", "Netherlands", 88);
    insert("194.26.29.0/24", "AS200052", "Velvet Fast-Flux Hosting", "Panama", 95);
    insert("45.142.214.0/24", "AS58224", "Offshore VPS Bulletproof", "Seychelles", 84);
    insert("8.8.8.0/24", "AS15169", "Google LLC", "United States", 5);
    insert("1.1.1.0/24", "AS13335", "Cloudflare Inc", "United States", 10);
}

void BgpTrie::insert(const std::string& cidr, const std::string& asn, const std::string& org, const std::string& country, int riskScore) {
    size_t slashPos = cidr.find('/');
    std::string ipPart = (slashPos != std::string::npos) ? cidr.substr(0, slashPos) : cidr;
    int prefixLen = (slashPos != std::string::npos) ? std::stoi(cidr.substr(slashPos + 1)) : 32;

    uint32_t ip = ipToUint(ipPart);
    TrieNode* current = root.get();

    for (int i = 31; i >= 32 - prefixLen; --i) {
        int bit = (ip >> i) & 1;
        if (!current->children[bit]) {
            current->children[bit] = std::make_unique<TrieNode>();
        }
        current = current->children[bit].get();
    }

    current->isTerminal = true;
    current->record = {cidr, asn, org, country, riskScore};
}

AsnRecord BgpTrie::lookupLongestPrefix(const std::string& ipStr) const {
    uint32_t ip = ipToUint(ipStr);
    const TrieNode* current = root.get();
    const TrieNode* bestMatch = nullptr;

    for (int i = 31; i >= 0 && current != nullptr; --i) {
        if (current->isTerminal) {
            bestMatch = current;
        }
        int bit = (ip >> i) & 1;
        current = current->children[bit].get();
    }

    if (current && current->isTerminal) {
        bestMatch = current;
    }

    if (bestMatch) {
        return bestMatch->record;
    }

    return {"0.0.0.0/0", "AS-UNKNOWN", "Unallocated / Global Routing Table", "Unknown", 50};
}

} // namespace actip
