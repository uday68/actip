#pragma once
#include <string>
#include <vector>

namespace actip {

struct JarmResult {
    std::string ip;
    int port;
    std::string jarmHash;
    std::string matchedFamily;
    int confidence;
    bool isKnownMalicious;
};

class JarmFingerprinter {
public:
    static std::string computeSimulatedJarm(const std::string& ip, int port, const std::string& cipherPreset);
    static JarmResult evaluateTarget(const std::string& ip, int port, const std::string& serviceType = "c2_tls");
};

} // namespace actip
