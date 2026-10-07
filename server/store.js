// server/store.js - Central Data Store for SOC-Shield

export const store = {
  logs: [],
  alerts: [],
  incidents: [],
  metrics: {
    totalLogsIngested: 148250,
    currentEPS: 42,
    mttdMinutes: 3.8, // Mean Time To Detect
    mttrMinutes: 14.2, // Mean Time To Respond
    defconLevel: 3, // 1 (Severe) to 5 (Normal)
    activeThreatsCount: 7,
    resolvedIncidentsToday: 18,
    openIncidentsCount: 5,
  },
  systemNodes: [
    { id: 'fw-01', name: 'PaloAlto Edge Firewall', type: 'firewall', status: 'normal', ip: '10.0.0.1', zone: 'Perimeter' },
    { id: 'dmz-web', name: 'Nginx Web Cluster (DMZ)', type: 'webserver', status: 'normal', ip: '10.0.1.50', zone: 'DMZ' },
    { id: 'dc-01', name: 'Primary Active Directory (DC-01)', type: 'ad', status: 'warning', ip: '10.0.2.10', zone: 'Internal Core' },
    { id: 'db-master', name: 'PostgreSQL DB Master', type: 'database', status: 'normal', ip: '10.0.3.100', zone: 'Data Tier' },
    { id: 'finance-pc', name: 'Finance Workstation #14', type: 'endpoint', status: 'compromised', ip: '10.0.4.88', zone: 'User Subnet' },
    { id: 'ids-01', name: 'Suricata NIDS Sensors', type: 'ids', status: 'normal', ip: '10.0.0.254', zone: 'Perimeter' },
  ]
};

// Seed initial incidents for realistic presentation
store.incidents = [
  {
    id: 'INC-2026-8801',
    title: 'Potential SSH Brute Force Campaign against DC-01',
    severity: 'HIGH',
    status: 'IN_PROGRESS',
    assignedTo: 'Alex Mercer (Tier 2 Investigator)',
    sourceIp: '185.220.101.5',
    targetHost: 'DC-01.corp.internal',
    vector: 'Brute Force / Credential Access',
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60000).toISOString(),
    description: 'Multiple failed SSH authentication attempts (over 450 attempts in 3 minutes) detected originating from external TOR exit node.',
    auditLog: [
      { timestamp: new Date(Date.now() - 45 * 60000).toISOString(), action: 'Alert Triggered', actor: 'Correlation Engine (Rule #BRUTE-01)' },
      { timestamp: new Date(Date.now() - 40 * 60000).toISOString(), action: 'Ticket Created', actor: 'System Auto-Triage' },
      { timestamp: new Date(Date.now() - 25 * 60000).toISOString(), action: 'Assigned to Tier 2', actor: 'Sarah Jenkins (Tier 1)' },
      { timestamp: new Date(Date.now() - 10 * 60000).toISOString(), action: 'Added Note: Verified malicious IP reputation score 98/100 on AbuseIPDB.', actor: 'Alex Mercer' },
    ],
    containmentActions: [
      { action: 'Block Source IP on Edge Firewall', status: 'COMPLETED', timestamp: new Date(Date.now() - 20 * 60000).toISOString() },
      { action: 'Enforce MFA Reset for Root Account', status: 'PENDING', timestamp: null },
    ]
  },
  {
    id: 'INC-2026-8802',
    title: 'Ransomware C2 Beaconing Activity Detected',
    severity: 'CRITICAL',
    status: 'OPEN',
    assignedTo: 'Unassigned',
    sourceIp: '10.0.4.88',
    targetHost: '194.26.29.112 (External C2)',
    vector: 'Malware / LockBit C2 Beacon',
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 60000).toISOString(),
    description: 'Endpoint Finance Workstation #14 initiated encrypted TLS traffic to known LockBit 3.0 Command & Control server with suspicious high entropy data payload.',
    auditLog: [
      { timestamp: new Date(Date.now() - 15 * 60000).toISOString(), action: 'Alert Triggered', actor: 'Correlation Engine (Rule #C2-RANSOM-99)' },
      { timestamp: new Date(Date.now() - 15 * 60000).toISOString(), action: 'Ticket Created', actor: 'System Auto-Triage' },
    ],
    containmentActions: [
      { action: 'Isolate Host from Local Network', status: 'PENDING', timestamp: null },
      { action: 'Terminate Malicious Process PID 4912', status: 'PENDING', timestamp: null },
    ]
  },
  {
    id: 'INC-2026-8803',
    title: 'SQL Injection Attempt on Public E-Commerce Gateway',
    severity: 'MEDIUM',
    status: 'RESOLVED',
    assignedTo: 'David Vance (Tier 1 Triage)',
    sourceIp: '45.154.255.82',
    targetHost: 'WEB-PROD-01',
    vector: 'Application Attack / SQLi',
    createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60000).toISOString(),
    description: 'WAF intercepted HTTP POST requests containing stacked SQL UNION queries targeting product search parameter.',
    auditLog: [
      { timestamp: new Date(Date.now() - 120 * 60000).toISOString(), action: 'Alert Triggered', actor: 'Cloudflare WAF' },
      { timestamp: new Date(Date.now() - 100 * 60000).toISOString(), action: 'Assigned to Tier 1', actor: 'Auto Assigner' },
      { timestamp: new Date(Date.now() - 30 * 60000).toISOString(), action: 'Closed Ticket: Confirmed blocked by WAF rule #100204. No database compromise.', actor: 'David Vance' },
    ],
    containmentActions: [
      { action: 'WAF Rule Applied', status: 'COMPLETED', timestamp: new Date(Date.now() - 110 * 60000).toISOString() }
    ]
  }
];
