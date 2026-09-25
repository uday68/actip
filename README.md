# ACTIP: Evidence-Grounded Agentic Cyber Threat Intelligence Platform

An enterprise-grade, autonomous Cyber Threat Intelligence (CTI) investigation platform designed for Security Operations Centers (SOCs), threat hunting teams, and incident responders. 

Built with **Next.js 14 App Router**, **TypeScript**, **Tailwind CSS**, and backed by real-world threat feeds, live DNS/RDAP resolution, and an autonomous 9-stage investigation agent.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Production Build
```bash
npm run build
npm run start
```
The application will be live at `http://localhost:3000`.

---

## 📚 Core Documentation

* **[Comprehensive Architecture, AI/NLP Engineering & FAQs](./PROJECT_DEEP_DIVE_AND_FAQS.md)**: In-depth technical compendium detailing the AI/NLP pipeline (SecBERT, Vector RAG, ReAct), multi-model database rationale, zero-day/unknown IP triage, end-to-end workflows, and DFD Level 0/1 diagrams.
* **[AI Architecture, Datasets & Models Guide](./AI_AND_DATASETS_EXPLAINED.md)**: Deep dive into all 6 real-world datasets, the tri-layer AI model stack, why AI is needed over scripts, and the 2-minute interview defense script.

---

## 🛡️ Screen & Tab Breakdown

| Screen / Tab | URL | Purpose & Core Capabilities |
|---|---|---|
| **Dashboard** | `/dashboard` | Executive SOC overview with 8 live KPI cards, recent investigations, threat activity stream, and cross-entity correlation matrix. |
| **Investigate** | `/investigate` | The AI workbench: Multi-observable launcher, executive findings & playbook, 4 strategic intelligence pillars, verifiable claim matrix with contradiction resolution, and 9-stage execution logs. |
| **IOCs** | `/iocs` | Indicator of compromise explorer with 11 deep-dive analysis tabs (Passive DNS history, WHOIS/RDAP, reputation score, malware families, and sighting timeline). |
| **Threat Actors** | `/actors` | Adversary attribution dossiers with Diamond Threat Models, aliases, target sectors, and geopolitical context. |
| **Malware** | `/malware` | Malware family forensics, in-memory evasion analysis (NTDLL unhooking, direct syscalls), and ready-to-deploy YARA rules. |
| **Campaigns** | `/campaigns` | Multi-phase Cyber Kill Chain tracking across coordinated adversary campaigns. |
| **CVEs** | `/cves` | Real-time synchronization with the official **US CISA Known Exploited Vulnerabilities (KEV)** catalog and emergency directive tracking. |
| **MITRE ATT&CK** | `/attack` | Interactive Enterprise Matrix v15 mapping observed telemetry to techniques, hunting queries, and SIEM detection rules. |
| **Knowledge Graph** | `/graph` | Fullscreen interactive SVG network graph connecting IPs, domains, CVEs, malware, actors, and campaigns with BFS path finding. |
| **Threat Timeline** | `/timeline` | Multi-year chronological forensic timeline with category filters. |
| **Reports** | `/reports` | Military/enterprise threat intelligence briefing dossier with export options: **Export PDF**, **Export JSON**, and interactive **STIX 2.1 JSON Bundle** preview. |
| **Data Sources** | `/sources` | Real-time health, synchronization triggers, and reliability statistics for external threat feeds. |
| **Pipeline Health** | `/pipeline` | Data engineering ingestion telemetry monitoring throughput (events/sec), latency, and error rates. |
| **Settings** | `/settings` | Analyst clearance, confidence scoring thresholds, and automated resolution policies. |

---

## 🧠 What Makes ACTIP Different? (Evidence Grounding)

1. **Zero Synthetic / Fake Telemetry**:
   - Live Node.js asynchronous DNS resolution (`dns/promises`) resolving `A`, `AAAA`, `MX`, `TXT`, and `PTR` reverse queries.
   - Live RDAP / BGP Autonomous System Number lookups against ARIN and RIPE NCC.
   - Live synchronization with official US CISA KEV JSON catalog.
   - ThreatFox / Abuse.ch malware observables.

2. **Autonomous 9-Stage Investigation Agent**:
   - Executes entity disambiguation, IOC enrichment, feed correlation, ATT&CK mapping, graph expansion, malware signature evaluation, Diamond Model attribution, contradiction reconciliation, and STIX 2.1 synthesis in **under 2 seconds**.

3. **Anti-Hallucination Contradiction Resolution**:
   - When different intelligence feeds disagree (e.g., whether an IP is an actor C2 or a commercial proxy), ACTIP evaluates source reliability weights, checks adversary infrastructure leasing patterns, and generates an auditable, reconciled determination.

4. **High-Visibility Dual Theme System**:
   - Includes an instant **Light Theme / Dark Theme** switcher in the top navigation bar with high-contrast typography, clear borders, and zero eye strain.

---

## 🛠️ Tech Stack

* **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS, Lucide Icons, Zustand (State Management)
* **Backend**: Next.js App Router API Routes (`/api/*`), Node.js native `dns/promises`, HTTPS RDAP client, Atomic File Database (`data/actip-store.json`)
* **Standards**: STIX 2.1, MITRE ATT&CK Enterprise Matrix v15, CISA KEV, RFC 7483 (RDAP)

---

## 📄 License
Internal Security Operations & Educational Research.
