#pragma once
#include <string>
#include <vector>
#include <memory>
#include <cstdint>

namespace actip {

struct AsnRecord {
    std::string cidr;
    std::string asn;
    std::string orgName;
    std::string country;
    int riskScore;
};

class BgpTrie {
private:
    struct TrieNode {
        std::unique_ptr<TrieNode> children[2];
        bool isTerminal;
        AsnRecord record;

        TrieNode() : isTerminal(false) {}
    };

    std::unique_ptr<TrieNode> root;

    static uint32_t ipToUint(const std::string& ipStr);

public:
    BgpTrie();
    void insert(const std::string& cidr, const std::string& asn, const std::string& org, const std::string& country, int riskScore);
    AsnRecord lookupLongestPrefix(const std::string& ipStr) const;
};

} // namespace actip
