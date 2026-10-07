// src/components/LiveAlertFeed.jsx - Real-Time Correlated Alert Stream
import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, ArrowRight, ExternalLink, Ticket, Check, Shield, Filter } from 'lucide-react';

export default function LiveAlertFeed({ alerts, onCreateIncident, onNavigateIntel }) {
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [blockedIps, setBlockedIps] = useState(new Set());

  const filteredAlerts = alerts.filter(alert => {
    if (filterSeverity === 'ALL') return true;
    return alert.severity === filterSeverity;
  });

  const handleBlockIp = (ip) => {
    const updated = new Set(blockedIps);
    updated.add(ip);
    setBlockedIps(updated);
  };

  const getSeverityBadgeClass = (severity) => {
    switch (severity) {
      case 'CRITICAL': return 'badge-critical';
      case 'HIGH': return 'badge-high';
      case 'MEDIUM': return 'badge-medium';
      case 'LOW': return 'badge-low';
      default: return 'badge-info';
    }
  };

  return (
    <div className="glass-card" style={{ padding: '20px' }}>
      
      {/* Header & Filter Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={20} color="var(--accent-red)" className="pulse-red-glow" />
            Real-Time Correlated Threat Stream
          </h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Events correlated in real-time by SOC-Shield rule engine
          </p>
        </div>

        {/* Severity Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(15,23,42,0.6)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
          <Filter size={14} color="var(--text-muted)" style={{ marginLeft: '6px' }} />
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              style={{
                background: filterSeverity === sev ? 'var(--accent-cyan)' : 'transparent',
                color: filterSeverity === sev ? '#070a12' : 'var(--text-secondary)',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Alert Feed List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '550px', overflowY: 'auto', paddingRight: '4px' }}>
        {filteredAlerts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            No alerts matching severity filter '{filterSeverity}'. Stream is monitoring...
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isBlocked = blockedIps.has(alert.srcIp);
            return (
              <div 
                key={alert.id}
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: alert.severity === 'CRITICAL' ? '1px solid rgba(255, 0, 85, 0.4)' : '1px solid var(--border-glass)',
                  borderRadius: '10px',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Left Info Column */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
                  <div className={getSeverityBadgeClass(alert.severity)} style={{ marginTop: '2px' }}>
                    {alert.severity}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: '700', fontSize: '0.92rem', color: '#ffffff' }}>
                        {alert.title}
                      </span>
                      <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        [{alert.ruleId || 'RULE-AUTO'}]
                      </span>
                    </div>

                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.4' }}>
                      {alert.description}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px', fontSize: '0.75rem', flexWrap: 'wrap' }}>
                      <span>
                        <strong style={{ color: 'var(--text-muted)' }}>Source IP: </strong>
                        <span className="font-mono" style={{ color: 'var(--accent-cyan)' }}>{alert.srcIp}</span>
                      </span>
                      <span>
                        <strong style={{ color: 'var(--text-muted)' }}>Target: </strong>
                        <span className="font-mono" style={{ color: '#ffffff' }}>{alert.host || alert.destIp}</span>
                      </span>
                      <span>
                        <strong style={{ color: 'var(--text-muted)' }}>Vector: </strong>
                        <span style={{ color: 'var(--accent-amber)' }}>{alert.vector}</span>
                      </span>
                      <span className="font-mono" style={{ color: 'var(--text-muted)' }}>
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  
                  {/* Create Ticket */}
                  <button
                    onClick={() => onCreateIncident(alert)}
                    className="btn-cyber"
                    style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                    title="Escalate Alert to Incident Ticket"
                  >
                    <Ticket size={14} />
                    Ticket
                  </button>

                  {/* Threat Intel Lookup */}
                  <button
                    onClick={() => onNavigateIntel(alert.srcIp)}
                    style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid var(--accent-blue)', color: 'var(--accent-blue)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                    title="Enrich IP reputation via Threat Intel"
                  >
                    <ShieldAlert size={14} />
                    Intel
                  </button>

                  {/* Block IP */}
                  <button
                    onClick={() => handleBlockIp(alert.srcIp)}
                    disabled={isBlocked}
                    className={isBlocked ? 'badge-info' : 'btn-danger'}
                    style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                    title="Block IP on Edge Firewall"
                  >
                    <Shield size={14} />
                    {isBlocked ? 'Blocked' : 'Block IP'}
                  </button>

                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
