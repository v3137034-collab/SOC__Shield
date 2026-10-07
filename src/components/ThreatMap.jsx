// src/components/ThreatMap.jsx - Geographic Threat Map & Interactive Network Topology
import React, { useState } from 'react';
import { Globe, Server, Shield, AlertTriangle, Radio, Lock, RefreshCw, Cpu, Layers } from 'lucide-react';

export default function ThreatMap({ systemNodes, alerts }) {
  const [activeView, setActiveView] = useState('GEOGRAPHIC'); // GEOGRAPHIC or TOPOLOGY

  // Simulated Global Threat Origins
  const threatOrigins = [
    { country: 'Russia (RU)', ip: '194.26.29.112', x: 700, y: 140, severity: 'CRITICAL', vector: 'LockBit C2' },
    { country: 'Germany (DE)', ip: '185.220.101.5', x: 500, y: 160, severity: 'HIGH', vector: 'TOR SSH Brute Force' },
    { country: 'Netherlands (NL)', ip: '45.154.255.82', x: 480, y: 175, severity: 'HIGH', vector: 'SQL Injection' },
    { country: 'Czech Rep (CZ)', ip: '91.240.118.17', x: 520, y: 170, severity: 'MEDIUM', vector: 'Masscan Recon' },
    { country: 'China (CN)', ip: '104.28.14.92', x: 800, y: 220, severity: 'HIGH', vector: 'APT29 Spearphishing' },
    { country: 'Brazil (BR)', ip: '203.0.113.88', x: 300, y: 350, severity: 'LOW', vector: 'DDoS Amplification' },
  ];

  const socLocation = { name: 'SOC Headquarters (US-East)', x: 260, y: 190 };

  return (
    <div className="glass-card" style={{ padding: '20px' }}>
      
      {/* Header & Toggle Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Globe size={20} color="var(--accent-cyan)" />
            Real-Time Threat Visualizer & Network Topology
          </h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Spatial origin tracking & infrastructure compromise vector analysis
          </p>
        </div>

        {/* View Selector Tabs */}
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(15,23,42,0.6)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
          <button
            onClick={() => setActiveView('GEOGRAPHIC')}
            style={{
              background: activeView === 'GEOGRAPHIC' ? 'var(--accent-cyan)' : 'transparent',
              color: activeView === 'GEOGRAPHIC' ? '#070a12' : 'var(--text-secondary)',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Globe size={16} />
            Geo Threat Map
          </button>

          <button
            onClick={() => setActiveView('TOPOLOGY')}
            style={{
              background: activeView === 'TOPOLOGY' ? 'var(--accent-cyan)' : 'transparent',
              color: activeView === 'TOPOLOGY' ? '#070a12' : 'var(--text-secondary)',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Layers size={16} />
            Network Topology Graph
          </button>
        </div>
      </div>

      {/* VIEW 1: GEOGRAPHIC THREAT MAP */}
      {activeView === 'GEOGRAPHIC' && (
        <div>
          <div style={{ position: 'relative', width: '100%', height: '420px', background: '#090e1a', borderRadius: '12px', border: '1px solid var(--border-glass)', overflow: 'hidden' }}>
            
            <svg width="100%" height="100%" viewBox="0 0 1000 500" style={{ background: '#080d1a' }}>
              {/* Grid Background */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0, 240, 255, 0.05)" strokeWidth="1" />
                </pattern>
                <linearGradient id="attackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff0055" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              <rect width="1000" height="500" fill="url(#grid)" />

              {/* Simplified World Continent Shapes */}
              {/* North America */}
              <path d="M 150 120 Q 250 100 320 180 Q 280 260 200 240 Q 120 200 150 120 Z" fill="rgba(30, 41, 59, 0.5)" stroke="rgba(0,240,255,0.2)" strokeWidth="1.5" />
              {/* South America */}
              <path d="M 280 270 Q 350 300 320 420 Q 260 400 250 320 Z" fill="rgba(30, 41, 59, 0.5)" stroke="rgba(0,240,255,0.2)" strokeWidth="1.5" />
              {/* Europe & Asia */}
              <path d="M 450 120 Q 650 80 880 150 Q 850 300 650 280 Q 500 220 450 120 Z" fill="rgba(30, 41, 59, 0.5)" stroke="rgba(0,240,255,0.2)" strokeWidth="1.5" />
              {/* Africa */}
              <path d="M 470 200 Q 580 220 550 370 Q 460 340 470 200 Z" fill="rgba(30, 41, 59, 0.5)" stroke="rgba(0,240,255,0.2)" strokeWidth="1.5" />
              {/* Australia */}
              <path d="M 800 320 Q 900 330 870 410 Q 780 400 800 320 Z" fill="rgba(30, 41, 59, 0.5)" stroke="rgba(0,240,255,0.2)" strokeWidth="1.5" />

              {/* Attack Vector Curves from Threat Origins to SOC HQ */}
              {threatOrigins.map((origin, i) => (
                <g key={i}>
                  {/* Curving Attack Arc */}
                  <path
                    d={`M ${origin.x} ${origin.y} Q ${(origin.x + socLocation.x) / 2} ${(origin.y + socLocation.y) / 2 - 60} ${socLocation.x} ${socLocation.y}`}
                    fill="none"
                    stroke={origin.severity === 'CRITICAL' ? '#ff0055' : origin.severity === 'HIGH' ? '#f59e0b' : '#3b82f6'}
                    strokeWidth={origin.severity === 'CRITICAL' ? '2.5' : '1.5'}
                    strokeDasharray="6 4"
                    opacity="0.85"
                  />

                  {/* Pulsing Origin Node */}
                  <circle cx={origin.x} cy={origin.y} r="8" fill={origin.severity === 'CRITICAL' ? '#ff0055' : '#f59e0b'} opacity="0.8">
                    <animate attributeName="r" values="6;12;6" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx={origin.x} cy={origin.y} r="3" fill="#ffffff" />

                  {/* Text Label */}
                  <text x={origin.x + 12} y={origin.y + 4} fill="#f8fafc" fontSize="11" fontWeight="600" fontFamily="JetBrains Mono">
                    {origin.country} [{origin.ip}]
                  </text>
                </g>
              ))}

              {/* Target SOC Node (Blue Shield) */}
              <g>
                <circle cx={socLocation.x} cy={socLocation.y} r="14" fill="rgba(0, 240, 255, 0.2)" stroke="#00f0ff" strokeWidth="2">
                  <animate attributeName="r" values="12;20;12" dur="3s" repeatCount="indefinite" />
                </circle>
                <circle cx={socLocation.x} cy={socLocation.y} r="6" fill="#00f0ff" />
                <text x={socLocation.x - 60} y={socLocation.y + 30} fill="#00f0ff" fontSize="12" fontWeight="700" fontFamily="Outfit">
                  {socLocation.name}
                </text>
              </g>

            </svg>

            {/* Map Legend Overlay */}
            <div style={{ position: 'absolute', bottom: '16px', right: '16px', background: 'rgba(15,23,42,0.85)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-glass)', fontSize: '0.75rem' }}>
              <div style={{ fontWeight: '700', color: '#ffffff', marginBottom: '6px' }}>Threat Severity Legend</div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ color: '#ff0055', display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff0055' }}></span> Critical</span>
                <span style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }}></span> High</span>
                <span style={{ color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }}></span> Medium</span>
              </div>
            </div>

          </div>

          {/* Active Threat Country Table */}
          <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
            {threatOrigins.map((t, idx) => (
              <div key={idx} style={{ background: 'rgba(15,23,42,0.6)', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: '700', color: '#ffffff', fontSize: '0.85rem' }}>{t.country}</div>
                  <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>{t.ip}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className={`badge ${t.severity === 'CRITICAL' ? 'badge-critical' : 'badge-high'}`}>
                    {t.vector}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: NETWORK TOPOLOGY GRAPH */}
      {activeView === 'TOPOLOGY' && (
        <div style={{ background: '#090e1a', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Server size={18} color="var(--accent-cyan)" />
            Internal Enterprise Infrastructure Node Status
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {systemNodes.map((node) => {
              const isCompromised = node.status === 'compromised';
              const isWarning = node.status === 'warning';
              const isIsolated = node.status === 'isolated';

              const statusColor = isCompromised ? '#ff0055' : isWarning ? '#f59e0b' : isIsolated ? '#a855f7' : '#10b981';

              return (
                <div 
                  key={node.id}
                  style={{
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: `1px solid ${statusColor}`,
                    boxShadow: isCompromised ? '0 0 15px rgba(255, 0, 85, 0.3)' : 'none',
                    borderRadius: '10px',
                    padding: '16px',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Server size={20} color={statusColor} />
                      <span style={{ fontWeight: '700', color: '#ffffff', fontSize: '0.9rem' }}>
                        {node.name}
                      </span>
                    </div>
                    <span 
                      className="badge" 
                      style={{ 
                        background: `${statusColor}22`, 
                        color: statusColor, 
                        border: `1px solid ${statusColor}` 
                      }}
                    >
                      {node.status}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '10px' }}>
                    <div><strong style={{ color: 'var(--text-muted)' }}>IPv4 Address: </strong> <span className="font-mono" style={{ color: 'var(--accent-cyan)' }}>{node.ip}</span></div>
                    <div><strong style={{ color: 'var(--text-muted)' }}>Network Zone: </strong> {node.zone}</div>
                  </div>

                  {isCompromised && (
                    <div style={{ marginTop: '12px', background: 'rgba(255,0,85,0.15)', color: '#ff0055', padding: '6px 10px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <AlertTriangle size={14} />
                      Ransomware C2 Activity Detected on Node!
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
