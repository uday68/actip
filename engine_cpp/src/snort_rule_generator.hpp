#pragma once
#include <string>
#include <vector>

namespace actip {

struct ThreatObservable {
    std::string ip;
    int port;
    std::string domain;
    std::string malwareFamily;
    std::string actor;
    std::string cve;
};

class SnortRuleGenerator {
public:
    static std::string generateSnort3Rule(const ThreatObservable& obs, int sid = 1000001);
    static std::string generateCiscoAcl(const ThreatObservable& obs);
};

} // namespace actip
