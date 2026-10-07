<div align="center">

# 🛡️ SOC-Shield
### Unified Security Operations Center & Incident Response Dashboard

An enterprise-grade Security Operations Center (SOC) web application built for real-time threat monitoring, automated event correlation, incident response ticketing, SIEM log querying, threat intelligence enrichment, and regulatory compliance reporting.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

[Overview](#-overview) • [Key Features](#-key-features) • [Tech Stack](#%EF%B8%8F-technology-stack) • [Architecture](#-architecture--workflow) • [Quick Start](#-quick-start)

</div>

---

## 📖 Overview

**SOC-Shield** is an enterprise-grade Security Operations Center (SOC) and incident response platform engineered to elevate threat visibility, streamline security workflows, and accelerate incident mitigation across complex enterprise environments[cite: 1]. Developed with a modern, dark-themed frontend utilizing React and Vite, and powered by a high-performance Node.js and Express backend, the application leverages Server-Sent Events (SSE) to deliver real-time log streaming and instantaneous telemetry processing[cite: 1].

---

## 🌟 Key Features

* **📊 Executive KPI Dashboard**
  Real-time tracking of operational metrics including Mean Time to Detect (**MTTD**), Mean Time to Respond (**MTTR**), Events Per Second (**EPS**), and DEFCON readiness levels[cite: 1].

* **⚡ Real-Time Threat Correlation Engine**
  Rule-based correlation capable of detecting SSH Brute Force attacks, LockBit Ransomware C2 beaconing, SQL Injection attempts, and Reconnaissance Port Scans[cite: 1].

* **🎯 Live Attack Simulator**
  A one-click attack scenario trigger panel designed specifically for live demonstrations, stress testing, and analyst training[cite: 1].

* **🗺️ Interactive Geo & Network Topology Map**
  Spatial attack origin tracking displayed on an interactive World Map alongside a node topology status graph[cite: 1].

* **📋 Incident Response Ticketing Board**
  Full lifecycle ticket management (`OPEN` → `IN_PROGRESS` → `CONTAINED` → `RESOLVED`) featuring detailed audit trails, analyst notes, and SOAR containment execution[cite: 1].

* **🔍 SIEM Log Search & Query Console**
  Powerful Lucene-style search query interface, raw JSON payload inspector, and instant CSV log exporter[cite: 1].

* **🌐 Threat Intelligence Enrichment**
  Instant reputation scorecards featuring AbuseIPDB confidence scores, VirusTotal multi-AV consensus, and detailed threat actor profiling[cite: 1].

* **📜 Compliance & Executive Reports**
  Auditor-ready report generation mapped directly to major standards including **ISO 27001**, **PCI-DSS v4.0**, **GDPR**, and **HIPAA**[cite: 1].

* **🔐 Role-Based Access Control (RBAC)**
  Tailored view modes for Tier 1, Tier 2, and Tier 3 Analysts, IR Managers, CISOs, and External Auditors[cite: 1].

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React.js, Vite, Chart.js, Lucide Icons, Custom Vanilla CSS (Dark Cybersecurity Theme)[cite: 1] |
| **Backend / API** | Node.js, Express.js (REST API & Server-Sent Events SSE live log streaming)[cite: 1] |
| **Engine** | Rule-based correlation engine & high-performance log generator[cite: 1] |

---

## ⚙️ Architecture & Workflow

```text
┌─────────────────┐       SSE / REST API       ┌──────────────────┐
│  Live Simulator │ ─────────────────────────> │   Express API    │
└─────────────────┘                            └────────┬─────────┘
                                                        │
                                                        ▼
┌─────────────────┐    Real-time Updates       ┌──────────────────┐
│ React Dashboard │ <───────────────────────── │ Threat Engine    │
└─────────────────┘                            └──────────────────┘
```
##

🚀 Quick Start

### 1. Clone & Install Dependencies
bash--

git clone https://github.com/v3137034-collab/SOC__Shield

cd soc-shield

npm install


### 2. Run Application
bash--

npm start

Open your browser and navigate to:
**`http://localhost:5173`**
