#include "snort_rule_generator.hpp"
#include <sstream>

namespace actip {

std::string SnortRuleGenerator::generateSnort3Rule(const ThreatObservable& obs, int sid) {
    std::stringstream ss;
    // Cisco Snort 3 rule format
    ss << "# ACTIP Automated Containment Signature - Cisco Snort 3 / Firepower\n";
    ss << "alert tcp $HOME_NET any -> " << (obs.ip.empty() ? "$EXTERNAL_NET" : obs.ip)
       << " " << (obs.port > 0 ? std::to_string(obs.port) : "any")
       << " (msg:\"ACTIP DETECT [Talos Cross-Ref] Outbound Beacon to " << obs.malwareFamily
       << " C2 node (" << obs.actor << ")\"; "
       << "flow:to_server,established; ";

    if (!obs.domain.empty()) {
        ss << "tls.sni; content:\"" << obs.domain << "\"; ";
    }

    ss << "classtype:trojan-activity; "
       << "sid:" << sid << "; rev:1; "
       << "metadata:impact_flag red, policy balanced-ips drop, created_at "
       << "2026-09-25, source ACTIP_AI_ENGINE;)\n";

    return ss.str();
}

std::string SnortRuleGenerator::generateCiscoAcl(const ThreatObservable& obs) {
    std::stringstream ss;
    ss << "! Cisco ASA / Secure Firewall Extended Access List Rule\n";
    if (!obs.ip.empty()) {
        ss << "access-list ACTIP_ISOLATION_ACL extended deny ip any host " << obs.ip << " log\n";
    }
    if (obs.port > 0) {
        ss << "access-list ACTIP_ISOLATION_ACL extended deny tcp any host " << obs.ip
           << " eq " << obs.port << " log\n";
    }
    return ss.str();
}

} // namespace actip
