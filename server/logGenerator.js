// server/logGenerator.js - High Performance Log Generator & Attack Scenario Simulator
import { store } from './store.js';
import { processLogCorrelation } from './correlationEngine.js';

const sampleHosts = [
  { host: 'DC-01.corp.internal', ip: '10.0.2.10', service: 'ActiveDirectory' },
  { host: 'WEB-PROD-01', ip: '10.0.1.50', service: 'Nginx/1.24' },
  { host: 'DB-MASTER-01', ip: '10.0.3.100', service: 'PostgreSQL-15' },
  { host: 'PaloAlto-Edge-FW', ip: '10.0.0.1', service: 'PAN-OS' },
  { host: 'FINANCE-PC-14', ip: '10.0.4.88', service: 'Windows-11-Enterprise' },
  { host: 'DEV-WORKSTATION-02', ip: '10.0.4.102', service: 'Ubuntu-22.04' },
];

const externalIps = [
  '185.220.101.5', '45.154.255.82', '194.26.29.112', '91.240.118.17', '162.158.19.42',
  '8.8.8.8', '1.1.1.1', '104.28.14.92', '198.51.100.44', '203.0.113.88'
];

const normalActions = [
  { action: 'ALLOW_TCP', port: 443, proto: 'HTTPS', severity: 'INFO', msg: 'TLS 1.3 Session established successfully.' },
  { action: 'ALLOW_DNS', port: 53, proto: 'UDP', severity: 'INFO', msg: 'Standard A Record query for api.internal.corp resolved.' },
  { action: 'AUTH_SUCCESS', port: 22, proto: 'SSH', severity: 'INFO', msg: 'User admin authenticated successfully via public key.' },
  { action: 'HTTP_200', port: 80, proto: 'HTTP', severity: 'INFO', msg: 'GET /api/v1/health returned 200 OK (14ms).' },
  { action: 'DENY_PERIMETER', port: 3389, proto: 'RDP', severity: 'LOW', msg: 'Inbound RDP connection blocked by PaloAlto rule #PERIMETER-BLOCK.' },
  { action: 'SMB_SESSION', port: 445, proto: 'SMB', severity: 'INFO', msg: 'Shares IPC$ mounted by domain controller sync daemon.' }
];

let logCounter = 10000;

export function generateSingleLog(override = {}) {
  logCounter += 1;
  const target = sampleHosts[Math.floor(Math.random() * sampleHosts.length)];
  const srcIp = override.srcIp || externalIps[Math.floor(Math.random() * externalIps.length)];
  const template = override.action ? override : normalActions[Math.floor(Math.random() * normalActions.length)];

  const logEntry = {
    id: `LOG-${logCounter}`,
    timestamp: new Date().toISOString(),
    host: override.host || target.host,
    destIp: target.ip,
    srcIp: srcIp,
    proto: override.proto || template.proto,
    destPort: override.destPort || template.port,
    severity: override.severity || template.severity,
    action: override.action || template.action,
    message: override.message || template.msg,
    eventCode: override.eventCode || (template.severity === 'INFO' ? 4624 : 4625),
    raw: `[${new Date().toISOString()}] ${target.host} ${override.action || template.action} SRC=${srcIp} DST=${target.ip} PORT=${override.destPort || template.port} MSG="${override.message || template.msg}"`
  };

  store.logs.unshift(logEntry);
  if (store.logs.length > 500) store.logs.pop();

  // Run correlation engine
  processLogCorrelation(logEntry);

  return logEntry;
}

// Background simulation ticker
let intervalId = null;
export function startLogStream() {
  if (intervalId) return;
  intervalId = setInterval(() => {
    // Generate 1 to 3 logs per second
    const count = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < count; i++) {
      generateSingleLog();
    }
  }, 1000);
}

// On-demand attack scenario trigger for teacher demonstration
export function triggerScenario(type) {
  const scenarioIp = '185.220.101.99';

  switch (type) {
    case 'brute_force':
      for (let i = 0; i < 7; i++) {
        setTimeout(() => {
          generateSingleLog({
            srcIp: scenarioIp,
            host: 'DC-01.corp.internal',
            action: 'AUTH_FAIL',
            proto: 'SSH',
            destPort: 22,
            severity: 'HIGH',
            eventCode: 4625,
            message: `Failed password for root from ${scenarioIp} port ${50000 + i} ssh2`
          });
        }, i * 300);
      }
      break;

    case 'ransomware':
      generateSingleLog({
        srcIp: '10.0.4.88',
        destIp: '194.26.29.112',
        host: 'FINANCE-PC-14',
        action: 'C2_BEACON',
        proto: 'TLS',
        destPort: 8443,
        severity: 'CRITICAL',
        message: 'CRITICAL: High entropy beaconing payload (LockBit 3.0 IOC) detected to IP 194.26.29.112. File encryption activity suspected on disk C:\\'
      });
      break;

    case 'sqli':
      generateSingleLog({
        srcIp: '45.154.255.82',
        host: 'WEB-PROD-01',
        action: 'HTTP_POST_ATTACK',
        proto: 'HTTP',
        destPort: 443,
        severity: 'HIGH',
        message: "POST /api/v1/search?query=admin' UNION SELECT username, password_hash FROM users-- SQL Injection attack intercepted."
      });
      break;

    case 'port_scan':
      for (let port of [21, 22, 80, 443, 1433, 3306, 3389, 8080, 9200]) {
        generateSingleLog({
          srcIp: '91.240.118.17',
          host: 'PaloAlto-Edge-FW',
          action: 'PORT_SCAN',
          proto: 'TCP',
          destPort: port,
          severity: 'MEDIUM',
          message: `SYN probe packet dropped on port ${port} from scanner IP 91.240.118.17`
        });
      }
      break;

    case 'exfiltration':
      generateSingleLog({
        srcIp: '10.0.3.100',
        destIp: '162.158.19.42',
        host: 'DB-MASTER-01',
        action: 'LARGE_TRANSFER',
        proto: 'DNS-TUNNEL',
        destPort: 53,
        severity: 'CRITICAL',
        message: 'UNUSUAL_DATA_OUTBOUND: 1.2 GB compressed archive exported via port 53 DNS TXT queries to unauthorized cloud storage bucket.'
      });
      break;

    default:
      break;
  }
}
