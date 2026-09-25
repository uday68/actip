#include "jarm_fingerprint.hpp"
#include <sstream>
#include <iomanip>

namespace actip {

static unsigned long simpleHash(const std::string& str) {
    unsigned long hash = 5381;
    for (char c : str) {
        hash = ((hash << 5) + hash) + static_cast<unsigned char>(c);
    }
    return hash;
}

std::string JarmFingerprinter::computeSimulatedJarm(const std::string& ip, int port, const std::string& cipherPreset) {
    // Standard JARM format: 62 characters (30 hex chars + 32 hex chars)
    // 30 chars: Ciphers chosen by server across 10 TLS client hellos
    // 32 chars: SHA256 / extension hashes
    std::string seed = ip + ":" + std::to_string(port) + ":" + cipherPreset;
    unsigned long h1 = simpleHash(seed + "_ciphers");
    unsigned long h2 = simpleHash(seed + "_exts");

    std::stringstream ss;
    if (cipherPreset == "blackvenom") {
        return "27d36d2d000d000dc427d36d2d000d4a91b8820f18a5140802906012345678";
    } else if (cipherPreset == "cobalt_strike") {
        return "07d14d20d21d21d07c42d41d00041d24a458a375eef0c576d23a7bab9a9fb1";
    } else if (cipherPreset == "sliver") {
        return "29d29d15d29d29d00041d43d29d43d52c803874f63c87f2e46b0a996f428cb";
    }

    ss << std::hex << std::setfill('0');
    ss << std::setw(8) << h1;
    ss << std::setw(8) << (h1 ^ 0xDEADBEEF);
    ss << std::setw(8) << (h2 ^ 0xCAFEBABE);
    ss << std::setw(6) << (h1 & 0xFFFFFF);
    ss << std::setw(8) << h2;
    ss << std::setw(8) << (h2 ^ 0x12345678);
    ss << std::setw(8) << (h1 ^ 0x87654321);
    ss << std::setw(8) << (h2 & 0xFFFFFFFF);

    std::string res = ss.str();
    if (res.length() > 62) res = res.substr(0, 62);
    while (res.length() < 62) res += "0";
    return res;
}

JarmResult JarmFingerprinter::evaluateTarget(const std::string& ip, int port, const std::string& serviceType) {
    JarmResult res;
    res.ip = ip;
    res.port = port;

    if (ip == "185.220.101.5" || ip == "185.220.101.19" || serviceType == "blackvenom") {
        res.jarmHash = computeSimulatedJarm(ip, port, "blackvenom");
        res.matchedFamily = "BlackVenom RAT C2 Listener (APT-84)";
        res.confidence = 94;
        res.isKnownMalicious = true;
    } else if (serviceType == "cobalt_strike") {
        res.jarmHash = computeSimulatedJarm(ip, port, "cobalt_strike");
        res.matchedFamily = "Cobalt Strike TeamServer HTTPS";
        res.confidence = 96;
        res.isKnownMalicious = true;
    } else {
        res.jarmHash = computeSimulatedJarm(ip, port, "standard_tls");
        res.matchedFamily = "Standard OpenSSL / Nginx Reverse Proxy";
        res.confidence = 45;
        res.isKnownMalicious = false;
    }

    return res;
}

} // namespace actip
