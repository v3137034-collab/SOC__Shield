// src/components/LogSearch.jsx - SIEM Log Query & Investigation Console
import React, { useState } from 'react';
import { Search, Download, Filter, Terminal, Code, Eye, RefreshCw, Layers } from 'lucide-react';

export default function LogSearch({ logs, onSearchQuery }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [selectedRawLog, setSelectedRawLog] = useState(null);

  const filteredLogs = logs.filter(log => {
    if (severityFilter !== 'ALL' && log.severity !== severityFilter) return false;
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (log.message && log.message.toLowerCase().includes(term)) ||
      (log.srcIp && log.srcIp.includes(term)) ||
      (log.host && log.host.toLowerCase().includes(term)) ||
      (log.action && log.action.toLowerCase().includes(term)) ||
      (log.raw && log.raw.toLowerCase().includes(term))
    );
  });

  const handleExportCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Timestamp,Host,SrcIP,DestIP,Severity,Action,Message"].join(",") + "\n"
      + filteredLogs.map(l => `"${l.timestamp}","${l.host}","${l.srcIp}","${l.destIp}","${l.severity}","${l.action}","${(l.message||'').replace(/"/g, '""')}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `soc_shield_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="glass-card" style={{ padding: '20px' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Terminal size={20} color="var(--accent-cyan)" />
            SIEM Log Search & Investigation Query Console
          </h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            High-speed search across semi-structured security logs, firewall events, and audit traces
          </p>
        </div>

        <button onClick={handleExportCsv} className="btn-cyber" style={{ fontSize: '0.8rem' }}>
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Query Search Bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, position: 'relative', minWidth: '280px' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by Lucene syntax e.g. '185.220.101.5', 'AUTH_FAIL', 'LockBit'..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid var(--border-cyan)',
              borderRadius: '8px',
              padding: '12px 14px 12px 42px',
              color: '#ffffff',
              fontFamily: 'JetBrains Mono',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          />
        </div>

        {/* Severity Filter */}
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            color: '#ffffff',
            border: '1px solid var(--border-glass)',
            borderRadius: '8px',
            padding: '10px 14px',
            fontSize: '0.82rem',
            outline: 'none'
          }}
        >
          <option value="ALL">All Severities</option>
          <option value="CRITICAL">CRITICAL</option>
          <option value="HIGH">HIGH</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="LOW">LOW</option>
          <option value="INFO">INFO</option>
        </select>
      </div>

      {/* Log Results Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.68rem', letterSpacing: '0.05em' }}>
              <th style={{ padding: '10px' }}>Timestamp</th>
              <th style={{ padding: '10px' }}>Target Host</th>
              <th style={{ padding: '10px' }}>Src IP</th>
              <th style={{ padding: '10px' }}>Dest IP</th>
              <th style={{ padding: '10px' }}>Proto/Port</th>
              <th style={{ padding: '10px' }}>Severity</th>
              <th style={{ padding: '10px' }}>Action</th>
              <th style={{ padding: '10px' }}>Log Message Payload</th>
              <th style={{ padding: '10px', textAlign: 'center' }}>Raw</th>
            </tr>
          </thead>
          <tbody className="font-mono">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  No log entries matched query '{searchTerm}'.
                </td>
              </tr>
            ) : (
              filteredLogs.slice(0, 50).map((log) => (
                <tr 
                  key={log.id} 
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.15s ease' }}
                >
                  <td style={{ padding: '10px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </td>
                  <td style={{ padding: '10px', color: '#ffffff', fontWeight: '600' }}>{log.host}</td>
                  <td style={{ padding: '10px', color: 'var(--accent-cyan)' }}>{log.srcIp}</td>
                  <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>{log.destIp}</td>
                  <td style={{ padding: '10px', color: 'var(--accent-amber)' }}>{log.proto}:{log.destPort}</td>
                  <td style={{ padding: '10px' }}>
                    <span className={`badge ${log.severity === 'CRITICAL' ? 'badge-critical' : log.severity === 'HIGH' ? 'badge-high' : log.severity === 'MEDIUM' ? 'badge-medium' : 'badge-info'}`}>
                      {log.severity}
                    </span>
                  </td>
                  <td style={{ padding: '10px', color: '#ffffff' }}>{log.action}</td>
                  <td style={{ padding: '10px', color: 'var(--text-secondary)', maxWidth: '350px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {log.message}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>
                    <button
                      onClick={() => setSelectedRawLog(log)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer' }}
                      title="Inspect Raw JSON"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* RAW LOG INSPECTOR MODAL */}
      {selectedRawLog && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div className="glass-card-neon" style={{ width: '100%', maxWidth: '650px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ fontWeight: '700', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Code size={18} color="var(--accent-cyan)" /> Raw JSON Security Event Log Inspection
              </div>
              <button onClick={() => setSelectedRawLog(null)} style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer' }}>✕</button>
            </div>
            <pre className="font-mono" style={{ background: '#070a12', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-glass)', color: 'var(--accent-cyan)', fontSize: '0.8rem', overflowX: 'auto', maxHeight: '350px' }}>
              {JSON.stringify(selectedRawLog, null, 2)}
            </pre>
          </div>
        </div>
      )}

    </div>
  );
}
