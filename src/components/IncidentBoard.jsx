// src/components/IncidentBoard.jsx - Incident Ticketing Board & Full Workflow Lifecycle
import React, { useState } from 'react';
import { Ticket, ShieldAlert, CheckCircle2, User, Clock, AlertTriangle, Plus, X, MessageSquare, Shield, ArrowUpRight } from 'lucide-react';
import { hasPermission } from '../utils/rbac';

export default function IncidentBoard({ incidents, onUpdateIncident, onCreateNewIncident, onExecuteContainment, currentRole }) {
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [investigationNote, setInvestigationNote] = useState('');

  // Form State for manual ticket
  const [newTitle, setNewTitle] = useState('');
  const [newSeverity, setNewSeverity] = useState('HIGH');
  const [newVector, setNewVector] = useState('Brute Force / Credential Access');
  const [newSourceIp, setNewSourceIp] = useState('185.220.101.5');
  const [newTargetHost, setNewTargetHost] = useState('DC-01.corp.internal');
  const [newDescription, setNewDescription] = useState('');

  const canManage = hasPermission(currentRole, 'MANAGE_INCIDENTS');
  const canContain = hasPermission(currentRole, 'CONTAINMENT_EXECUTE');

  const filteredIncidents = incidents.filter(i => {
    if (filterStatus === 'ALL') return true;
    return i.status === filterStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPEN': return { label: 'OPEN', color: '#ff0055', bg: 'rgba(255,0,85,0.15)' };
      case 'IN_PROGRESS': return { label: 'IN PROGRESS', color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' };
      case 'ESCALATED': return { label: 'ESCALATED', color: '#a855f7', bg: 'rgba(168,85,247,0.15)' };
      case 'CONTAINED': return { label: 'CONTAINED', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' };
      case 'RESOLVED': return { label: 'RESOLVED', color: '#10b981', bg: 'rgba(16,185,129,0.15)' };
      default: return { label: 'CLOSED', color: '#64748b', bg: 'rgba(100,116,139,0.15)' };
    }
  };

  const handleAddNoteSubmit = (e) => {
    e.preventDefault();
    if (!investigationNote.trim() || !selectedIncident) return;
    onUpdateIncident(selectedIncident.id, { note: investigationNote.trim() });
    setInvestigationNote('');
  };

  const handleFormCreateSubmit = (e) => {
    e.preventDefault();
    onCreateNewIncident({
      title: newTitle,
      severity: newSeverity,
      vector: newVector,
      sourceIp: newSourceIp,
      targetHost: newTargetHost,
      description: newDescription
    });
    setShowCreateModal(false);
    setNewTitle('');
    setNewDescription('');
  };

  return (
    <div className="glass-card" style={{ padding: '20px' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Ticket size={20} color="var(--accent-cyan)" />
            Incident Management & Response Ticketing Board
          </h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Complete lifecycle tracking: Detection → Triage → Containment → Resolution
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Status Filter */}
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              background: 'rgba(15,23,42,0.8)',
              color: '#ffffff',
              border: '1px solid var(--border-glass)',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              outline: 'none',
              fontWeight: '600'
            }}
          >
            <option value="ALL">All Ticket Statuses</option>
            <option value="OPEN">OPEN</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="ESCALATED">ESCALATED</option>
            <option value="CONTAINED">CONTAINED</option>
            <option value="RESOLVED">RESOLVED</option>
          </select>

          {/* New Incident Button */}
          {canManage && (
            <button 
              onClick={() => setShowCreateModal(true)} 
              className="btn-cyber"
              style={{ fontSize: '0.8rem' }}
            >
              <Plus size={16} />
              New Incident Ticket
            </button>
          )}
        </div>
      </div>

      {/* Incidents Table View */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.05em' }}>
              <th style={{ padding: '12px' }}>Incident ID</th>
              <th style={{ padding: '12px' }}>Title & Description</th>
              <th style={{ padding: '12px' }}>Severity</th>
              <th style={{ padding: '12px' }}>Status</th>
              <th style={{ padding: '12px' }}>Assigned Investigator</th>
              <th style={{ padding: '12px' }}>Created</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredIncidents.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  No incident tickets found matching filter '{filterStatus}'.
                </td>
              </tr>
            ) : (
              filteredIncidents.map((inc) => {
                const statusInfo = getStatusBadge(inc.status);
                return (
                  <tr 
                    key={inc.id}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s ease' }}
                  >
                    <td className="font-mono" style={{ padding: '14px 12px', fontWeight: '700', color: 'var(--accent-cyan)' }}>
                      {inc.id}
                    </td>
                    <td style={{ padding: '14px 12px', maxWidth: '320px' }}>
                      <div style={{ fontWeight: '700', color: '#ffffff', marginBottom: '2px' }}>{inc.title}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        Vector: <span style={{ color: 'var(--accent-amber)' }}>{inc.vector}</span> | Host: {inc.targetHost}
                      </div>
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      <span className={`badge ${inc.severity === 'CRITICAL' ? 'badge-critical' : inc.severity === 'HIGH' ? 'badge-high' : 'badge-medium'}`}>
                        {inc.severity}
                      </span>
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      <span className="badge" style={{ background: statusInfo.bg, color: statusInfo.color, border: `1px solid ${statusInfo.color}` }}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td style={{ padding: '14px 12px', color: 'var(--text-secondary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <User size={14} color="var(--accent-cyan)" />
                        {inc.assignedTo}
                      </div>
                    </td>
                    <td className="font-mono" style={{ padding: '14px 12px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                      {new Date(inc.createdAt).toLocaleTimeString()}
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                      <button
                        onClick={() => setSelectedIncident(inc)}
                        style={{ background: 'rgba(0, 240, 255, 0.12)', border: '1px solid var(--accent-cyan)', color: '#ffffff', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer' }}
                      >
                        Inspect Workflow & Audit
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* INCIDENT DETAILS & AUDIT MODAL */}
      {selectedIncident && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div className="glass-card-neon" style={{ width: '100%', maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto', padding: '28px', position: 'relative' }}>
            
            <button 
              onClick={() => setSelectedIncident(null)} 
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={22} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span className="font-mono" style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--accent-cyan)' }}>
                [{selectedIncident.id}]
              </span>
              <span className={`badge ${selectedIncident.severity === 'CRITICAL' ? 'badge-critical' : 'badge-high'}`}>
                {selectedIncident.severity}
              </span>
            </div>

            <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#ffffff', marginBottom: '8px' }}>
              {selectedIncident.title}
            </h2>

            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.5' }}>
              {selectedIncident.description}
            </p>

            {/* Quick Status Workflow Controls */}
            {canManage && (
              <div style={{ background: 'rgba(15,23,42,0.8)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-glass)', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                  Update Workflow Status:
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['OPEN', 'IN_PROGRESS', 'CONTAINED', 'RESOLVED', 'CLOSED'].map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        onUpdateIncident(selectedIncident.id, { status: st });
                        setSelectedIncident({ ...selectedIncident, status: st });
                      }}
                      style={{
                        background: selectedIncident.status === st ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.05)',
                        color: selectedIncident.status === st ? '#070a12' : '#ffffff',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Containment Execution Panel */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={16} color="var(--accent-amber)" />
                SOAR Automated Containment Actions
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedIncident.containmentActions?.map((act, index) => (
                  <div key={index} style={{ background: 'rgba(15,23,42,0.6)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '0.82rem', color: '#ffffff', fontWeight: '600' }}>
                      {act.action}
                    </div>
                    {act.status === 'COMPLETED' ? (
                      <span className="badge badge-low">
                        <CheckCircle2 size={12} /> Executed ({new Date(act.timestamp).toLocaleTimeString()})
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          onExecuteContainment(selectedIncident.id, index);
                          setSelectedIncident({
                            ...selectedIncident,
                            containmentActions: selectedIncident.containmentActions.map((a, i) => i === index ? { ...a, status: 'COMPLETED', timestamp: new Date().toISOString() } : a)
                          });
                        }}
                        disabled={!canContain}
                        className="btn-danger"
                        style={{ padding: '4px 10px', fontSize: '0.72rem' }}
                      >
                        Trigger Containment Now
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Audit Trail Timeline */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} color="var(--accent-cyan)" />
                Chronological Audit Trail & Forensic Notes
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '200px', overflowY: 'auto' }}>
                {selectedIncident.auditLog?.map((entry, i) => (
                  <div key={i} style={{ background: 'rgba(15,23,42,0.4)', borderLeft: '3px solid var(--accent-cyan)', padding: '10px 14px', borderRadius: '0 8px 8px 0', fontSize: '0.8rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.72rem', marginBottom: '4px' }}>
                      <span>{entry.actor}</span>
                      <span className="font-mono">{new Date(entry.timestamp).toLocaleString()}</span>
                    </div>
                    <div style={{ color: '#ffffff', fontWeight: '500' }}>{entry.action}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Note Form */}
            {canManage && (
              <form onSubmit={handleAddNoteSubmit} style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="Add analyst investigation note or forensic artifact..."
                  value={investigationNote}
                  onChange={(e) => setInvestigationNote(e.target.value)}
                  style={{ flex: 1, background: 'rgba(15,23,42,0.8)', border: '1px solid var(--border-glass)', borderRadius: '8px', padding: '10px 14px', color: '#ffffff', outline: 'none', fontSize: '0.82rem' }}
                />
                <button type="submit" className="btn-cyber" style={{ fontSize: '0.8rem' }}>
                  <MessageSquare size={16} /> Add Note
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      {/* CREATE NEW INCIDENT MODAL */}
      {showCreateModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div className="glass-card-neon" style={{ width: '100%', maxWidth: '600px', padding: '28px', position: 'relative' }}>
            <button onClick={() => setShowCreateModal(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={22} />
            </button>

            <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff', marginBottom: '16px' }}>
              Create New Incident Ticket
            </h2>

            <form onSubmit={handleFormCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Incident Title</label>
                <input required type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="e.g., Unauthorized Admin Credential Reset on DC-01" style={{ width: '100%', background: 'rgba(15,23,42,0.8)', border: '1px solid var(--border-glass)', padding: '10px', borderRadius: '8px', color: '#ffffff', outline: 'none' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Severity</label>
                  <select value={newSeverity} onChange={e => setNewSeverity(e.target.value)} style={{ width: '100%', background: 'rgba(15,23,42,0.8)', border: '1px solid var(--border-glass)', padding: '10px', borderRadius: '8px', color: '#ffffff' }}>
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Target Host</label>
                  <input type="text" value={newTargetHost} onChange={e => setNewTargetHost(e.target.value)} style={{ width: '100%', background: 'rgba(15,23,42,0.8)', border: '1px solid var(--border-glass)', padding: '10px', borderRadius: '8px', color: '#ffffff' }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Incident Description</label>
                <textarea required rows="3" value={newDescription} onChange={e => setNewDescription(e.target.value)} placeholder="Describe the anomaly, affected systems, and initial observations..." style={{ width: '100%', background: 'rgba(15,23,42,0.8)', border: '1px solid var(--border-glass)', padding: '10px', borderRadius: '8px', color: '#ffffff', outline: 'none' }}></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowCreateModal(false)} style={{ background: 'transparent', border: '1px solid var(--border-glass)', color: '#ffffff', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" className="btn-cyber">Create Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
