// server/threatIntel.js - Threat Intelligence Enrichment Engine

const KnownDatabase = {
  '185.220.101.5': {
    type: 'IPv4',
    query: '185.220.101.5',
    reputationScore: 98, // 0 to 100 Risk Score
    status: 'MALICIOUS',
    category: 'Tor Exit Node / Brute Force Scanner',
    abuseConfidenceScore: 100,
    isp: 'M234 Networks Ltd',
    country: 'Germany (DE)',
    city: 'Frankfurt',
    domain: 'tor-exit-node-05.org',
    threatActors: ['APT28 (Fancy Bear)', 'UNC1151'],
    malwareFamilies: ['Mirai Botnet', 'Hydra SSH Scanner'],
    abuseReportsCount: 1420,
    lastReportedAt: '12 minutes ago',
    tags: ['TOR', 'SSH_SCANNER', 'HIGH_ABUSE_IP', 'VPN_PROXY'],
    virusTotal: { malicious: 64, harmless: 2, suspicious: 4, undetected: 15 }
  },
  '194.26.29.112': {
    type: 'IPv4',
    query: '194.26.29.112',
    reputationScore: 99,
    status: 'CRITICAL_C2',
    category: 'Ransomware Command & Control',
    abuseConfidenceScore: 100,
    isp: 'Shinjiru Hosting LLC',
    country: 'Russia (RU)',
    city: 'Moscow',
    domain: 'c2-sync-gate.ru',
    threatActors: ['LockBit Gang', 'BlackCat / ALPHV'],
    malwareFamilies: ['LockBit 3.0', 'CobaltStrike Beacon'],
    abuseReportsCount: 2890,
    lastReportedAt: '3 minutes ago',
    tags: ['LOCKBIT_C2', 'EXFILTRATION_HOST', 'COBALT_STRIKE', 'OFFSHORE_HOSTING'],
    virusTotal: { malicious: 72, harmless: 0, suspicious: 1, undetected: 5 }
  },
  '45.154.255.82': {
    type: 'IPv4',
    query: '45.154.255.82',
    reputationScore: 84,
    status: 'SUSPICIOUS',
    category: 'Web Exploit / SQLi Automated Scanner',
    abuseConfidenceScore: 88,
    isp: 'Chocoping Enterprise',
    country: 'Netherlands (NL)',
    city: 'Amsterdam',
    domain: 'scan-node-amsterdam.nl',
    threatActors: ['LulzSec Revival', 'ScriptKiddie Suite'],
    malwareFamilies: ['SQLMap 1.7', 'Nikto Web Scanner'],
    abuseReportsCount: 450,
    lastReportedAt: '45 minutes ago',
    tags: ['SQLI_SCANNER', 'WAF_EVASION', 'WEB_ATTACK'],
    virusTotal: { malicious: 48, harmless: 10, suspicious: 8, undetected: 12 }
  },
  '91.240.118.17': {
    type: 'IPv4',
    query: '91.240.118.17',
    reputationScore: 78,
    status: 'SUSPICIOUS',
    category: 'Mass Reconnaissance Scanner',
    abuseConfidenceScore: 82,
    isp: 'Cdn77 Network Services',
    country: 'Czech Republic (CZ)',
    city: 'Prague',
    domain: 'probe-sensor-cz.cz',
    threatActors: ['Unknown Scanner'],
    malwareFamilies: ['Masscan 1.3', 'ZMap Probe'],
    abuseReportsCount: 310,
    lastReportedAt: '1 hour ago',
    tags: ['RECON', 'PORT_SCANNER'],
    virusTotal: { malicious: 35, harmless: 20, suspicious: 5, undetected: 18 }
  }
};

export function lookupThreatIntel(query) {
  const cleanQuery = (query || '').trim();
  if (KnownDatabase[cleanQuery]) {
    return KnownDatabase[cleanQuery];
  }

  // Dynamic fallback generator for any custom user input
  const isHash = cleanQuery.length >= 32;
  const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(cleanQuery);
  const hashScore = Math.floor(20 + Math.random() * 75);

  return {
    type: isHash ? 'SHA-256 Hash' : isIp ? 'IPv4 Address' : 'Domain / FQDN',
    query: cleanQuery || '8.8.8.8',
    reputationScore: isIp ? 65 : 42,
    status: hashScore > 70 ? 'SUSPICIOUS' : 'BENIGN',
    category: isHash ? 'Trojan Dropper Payload' : 'Public Infrastructure / Dynamic IP',
    abuseConfidenceScore: Math.floor(30 + Math.random() * 40),
    isp: 'Global Internet Backbone Provider',
    country: 'United States (US)',
    city: 'Ashburn, VA',
    domain: isIp ? `host-${cleanQuery.replace(/\./g, '-')}.net` : cleanQuery,
    threatActors: ['Generic Cybercrime Group'],
    malwareFamilies: ['Generic Trojan.Win32'],
    abuseReportsCount: Math.floor(Math.random() * 150),
    lastReportedAt: '2 hours ago',
    tags: ['DYNAMIC_IP', 'COMMUNITY_REPORTED', 'OPEN_PORT'],
    virusTotal: { malicious: Math.floor(Math.random() * 25), harmless: 40, suspicious: 5, undetected: 10 }
  };
}
