// src/components/LogSimulator.jsx - Attack Scenario Launcher Panel for Demo/Testing
import React, { useState } from 'react';
import { Zap, AlertTriangle, ShieldAlert, Cpu, Lock, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function LogSimulator({ onSimulateScenario }) {
  const [lastScenario, setLastScenario] = useState(null);

  const scenarios = [
    {
      id: 'brute_force',
      name: 'Simulate SSH Brute Force Attack',
      vector: 'Credential Access',
      severity: 'CRITICAL',
      desc: 'Injects 7 rapid failed password attempts from IP 185.220.101.99 to test Rule #BRUTE-FORCE-01 and auto-ticket creation.',
      color: '#ff0055'
    },
    {
      id: 'ransomware',
      name: 'Simulate Ransomware LockBit C2 Beacon',
      vector: 'Malware C2',
      severity: 'CRITICAL',
      desc: 'Injects high-entropy TLS payload from Finance PC to Russia C2 IP 194.26.29.112. Tests node compromise alert.',
      color: '#a855f7'
    },
    {
      id: 'sqli',
      name: 'Simulate SQL Injection Exploit Payload',
      vector: 'Web App Attack',
      severity: 'HIGH',
      desc: 'Injects HTTP POST request containing stacked SQL UNION payload targeting WEB-PROD-01 database parameter.',
      color: '#f59e0b'
    },
    {
      id: 'port_scan',
      name: 'Simulate Reconnaissance Port Scan',
      vector: 'Reconnaissance',
      severity: 'MEDIUM',
      desc: 'Sweeps ports 21, 22, 80, 443, 1433, 3389 across perimeter firewall from scanner IP 91.240.118.17.',
      color: '#3b82f6'
    },
    {
      id: 'exfiltration',
      name: 'Simulate Data Exfiltration via DNS Tunnel',
      vector: 'Exfiltration',
      severity: 'CRITICAL',
      desc: 'Triggers 1.2 GB outbound data transfer alert via port 53 DNS TXT record tunneling.',
      color: '#00f0ff'
    }
  ];

  const handleLaunch = (scId, scName) => {
    onSimulateScenario(scId);
    setLastScenario(scName);
    setTimeout(() => setLastScenario(null), 4000);
  };

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Zap size={20} color="var(--accent-red)" className="pulse-red-glow" />
          Interactive Cyber Attack Scenario Simulator (Teacher Demo Mode)
        </h2>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          Launch live security attack vectors to observe real-time log ingestion, correlation rule triggering, and incident auto-creation.
        </p>
      </div>

      {/* Success Notification Banner */}
      {lastScenario && (
        <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid var(--accent-green)', color: 'var(--accent-green)', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.85rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle2 size={18} />
          Scenario Injected Live: "{lastScenario}". Check the Live Threat Feed tab to view the correlated alerts!
        </div>
      )}

      {/* Scenario Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        {scenarios.map((sc) => (
          <div key={sc.id} className="glass-card" style={{ padding: '18px', borderLeft: `4px solid ${sc.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#ffffff' }}>
                {sc.name}
              </div>
              <span className={`badge ${sc.severity === 'CRITICAL' ? 'badge-critical' : 'badge-high'}`}>
                {sc.severity}
              </span>
            </div>

            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: '1.4' }}>
              {sc.desc}
            </p>

            <button
              onClick={() => handleLaunch(sc.id, sc.name)}
              className="btn-cyber"
              style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem' }}
            >
              <Zap size={14} /> Launch Attack Scenario
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
