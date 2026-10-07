# SOC-Shield: Unified Security Operations Center & Incident Response Dashboard

**SOC-Shield** is a modern, enterprise-grade Security Operations Center (SOC) web application built for real-time threat monitoring, automated event correlation, incident response ticketing, SIEM log querying, threat intelligence enrichment, and regulatory compliance reporting.

---

## 🌟 Key Features

- **Executive KPI Dashboard**: Real-time tracking of Mean Time to Detect (MTTD), Mean Time to Respond (MTTR), Events Per Second (EPS), and DEFCON readiness levels.
- **Real-Time Threat Correlation Engine**: Rule-based correlation detecting SSH Brute Force, LockBit Ransomware C2 beaconing, SQL Injection, and Reconnaissance Port Scans.
- **Live Attack Simulator**: One-click attack scenario trigger panel designed for live demonstration and testing.
- **Interactive Geo & Network Topology Map**: Spatial attack origin tracking on a World Map & interactive node topology status graph.
- **Incident Response Ticketing Board**: Complete ticket workflow (`OPEN` → `IN_PROGRESS` → `CONTAINED` → `RESOLVED`) with audit trails, analyst notes, and SOAR containment execution.
- **SIEM Log Search & Query Console**: Lucene-style search query bar, raw JSON payload inspector, and CSV log exporter.
- **Threat Intelligence Enrichment**: Instant reputation scorecards, AbuseIPDB confidence scores, VirusTotal multi-AV consensus, and threat actor profiling.
- **Compliance & Executive Reports**: Auditor-ready report generation for **ISO 27001**, **PCI-DSS v4.0**, **GDPR**, and **HIPAA**.
- **Role-Based Access Control (RBAC)**: Switchable user views for Tier 1, Tier 2, Tier 3 Analysts, IR Managers, CISOs, and Auditors.

---

## 🛠️ Technology Stack

- **Frontend**: React.js, Vite, Chart.js, Lucide Icons, Custom Vanilla CSS (Dark Cybersecurity Theme)
- **Backend / API**: Node.js, Express.js (REST API & Server-Sent Events SSE live log streaming)
- **Engine**: Rule-based correlation engine & high-performance log generator

---

## 🚀 Quick Start

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/YOUR-USERNAME/soc-shield.git
cd soc-shield
npm install
```

### 2. Run Application
```bash
npm start
```

Open your browser and navigate to:
**`http://localhost:5173`**
