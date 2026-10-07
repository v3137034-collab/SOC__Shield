// server/correlationEngine.js - SOC Correlation & Rule Matching Engine
import { store } from './store.js';

// In-memory sliding windows for threshold rules
const ipFailedLoginWindow = new Map();
const ipPortScanWindow = new Map();

export function processLogCorrelation(log) {
  store.metrics.totalLogsIngested += 1;
  const now = Date.now();

  // Rule 1: Brute Force Attack Detection (5+ failed logins within 30s)
  if (log.action === 'AUTH_FAIL' || log.message?.toLowerCase().includes('failed password') || log.eventCode === 4625) {
    const tracker = ipFailedLoginWindow.get(log.srcIp) || [];
    const recent = tracker.filter(t => now - t < 30000);
    recent.push(now);
    ipFailedLoginWindow.set(log.srcIp, recent);

    if (recent.length >= 5) {
      triggerAlert({
        ruleId: 'RULE-BRUTE-FORCE-01',
        title: `Brute Force Login Campaign Detected from ${log.srcIp}`,
        severity: 'CRITICAL',
        vector: 'Brute Force / Authentication',
        srcIp: log.srcIp,
        destIp: log.destIp || '10.0.2.10',
        host: log.host || 'DC-01.corp.internal',
        description: `Source IP ${log.srcIp} generated ${recent.length} failed authentication attempts within 30 seconds. Potential password spraying or brute force attack against ${log.host}.`,
        logRef: log,
      });
      // Clear window to avoid spam
      ipFailedLoginWindow.set(log.srcIp, []);
    }
  }

  // Rule 2: SQL Injection Pattern Match
  const messageLower = (log.message || '' ).toLowerCase();
  if (messageLower.includes('select') && (messageLower.includes('union') || messageLower.includes('or 1=1') || messageLower.includes('drop table') || messageLower.includes('--'))) {
    triggerAlert({
      ruleId: 'RULE-SQLI-02',
      title: `SQL Injection Exploit Payload Intercepted`,
      severity: 'HIGH',
      vector: 'Web Application / SQLi',
      srcIp: log.srcIp,
      destIp: log.destIp || '10.0.1.50',
      host: log.host || 'WEB-PROD-01',
      description: `Malicious SQL syntax pattern ('OR 1=1' / UNION SELECT) detected in HTTP request payload targeting ${log.host} from IP ${log.srcIp}.`,
      logRef: log,
    });
  }

  // Rule 3: Port Scan / Host Discovery (10+ distinct ports targeted)
  if (log.action === 'PORT_SCAN' || log.action === 'SYN_SENT') {
    const ports = ipPortScanWindow.get(log.srcIp) || new Set();
    ports.add(log.destPort || Math.floor(Math.random() * 1000));
    ipPortScanWindow.set(log.srcIp, ports);

    if (ports.size >= 8) {
      triggerAlert({
        ruleId: 'RULE-RECON-03',
        title: `Network Reconnaissance / Port Scan Active`,
        severity: 'MEDIUM',
        vector: 'Reconnaissance / Port Scan',
        srcIp: log.srcIp,
        destIp: log.destIp || '10.0.0.0/24',
        host: log.host || 'Perimeter Firewall',
        description: `Source IP ${log.srcIp} probed ${ports.size} distinct ports across internal subnet. High probability of automated Nmap / Masscan reconnaissance sweep.`,
        logRef: log,
      });
      ipPortScanWindow.set(log.srcIp, new Set());
    }
  }

  // Rule 4: Ransomware C2 Beaconing / High Entropy Data Exfiltration
  if (log.action === 'C2_BEACON' || log.action === 'LARGE_TRANSFER' || messageLower.includes('lockbit') || messageLower.includes('cobaltstrike') || messageLower.includes('.exe payload')) {
    triggerAlert({
      ruleId: 'RULE-C2-RANSOM-04',
      title: `Ransomware C2 / High Risk Malware Beaconing`,
      severity: 'CRITICAL',
      vector: 'Malware / Ransomware C2',
      srcIp: log.srcIp,
      destIp: log.destIp || '194.26.29.112',
      host: log.host || 'FINANCE-PC-14',
      description: `Host ${log.host} established persistent encrypted outbound C2 beacon to known malicious adversary infrastructure (${log.destIp}).`,
      logRef: log,
    });

    // Mark system node as compromised
    const node = store.systemNodes.find(n => n.name.includes('Finance') || n.name.includes('DC-01'));
    if (node) node.status = 'compromised';
  }
}

function triggerAlert(alertData) {
  const alertId = `ALT-${Date.now().toString().slice(-6)}`;
  const fullAlert = {
    id: alertId,
    timestamp: new Date().toISOString(),
    status: 'NEW',
    ...alertData
  };

  // Add to store
  store.alerts.unshift(fullAlert);
  if (store.alerts.length > 100) store.alerts.pop();

  // Update DEFCON level if Critical
  if (alertData.severity === 'CRITICAL') {
    store.metrics.defconLevel = Math.max(1, store.metrics.defconLevel - 1);
    store.metrics.activeThreatsCount += 1;
  }

  // Auto-generate Incident Ticket for High / Critical Alerts if not already open
  if (alertData.severity === 'CRITICAL' || alertData.severity === 'HIGH') {
    const existingInc = store.incidents.find(i => i.sourceIp === alertData.srcIp && i.status !== 'CLOSED' && i.status !== 'RESOLVED');
    if (!existingInc) {
      const incId = `INC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const newIncident = {
        id: incId,
        title: alertData.title,
        severity: alertData.severity,
        status: 'OPEN',
        assignedTo: 'Unassigned',
        sourceIp: alertData.srcIp,
        targetHost: alertData.host,
        vector: alertData.vector,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        description: alertData.description,
        auditLog: [
          { timestamp: new Date().toISOString(), action: 'Alert Correlated & Ticket Auto-Created', actor: `SOC Correlation Engine (${alertData.ruleId})` }
        ],
        containmentActions: [
          { action: `Block Source IP ${alertData.srcIp} on Perimeter Firewall`, status: 'PENDING', timestamp: null },
          { action: `Isolate Host ${alertData.host} from Local VNET`, status: 'PENDING', timestamp: null }
        ]
      };
      store.incidents.unshift(newIncident);
      store.metrics.openIncidentsCount += 1;
    }
  }

  return fullAlert;
}
