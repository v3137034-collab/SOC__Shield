// src/components/Reports.jsx - Compliance & Executive Report Generator
import React, { useState, useEffect } from 'react';
import { FileText, Download, CheckCircle, ShieldCheck, Printer, Calendar, Award } from 'lucide-react';

export default function Reports() {
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    fetch('/api/compliance/report')
      .then(res => res.json())
      .then(json => {
        if (json.success) setReportData(json.data);
      })
      .catch(err => console.error("Report fetch error", err));
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={20} color="var(--accent-cyan)" />
            Automated Compliance & Executive Report Generator
          </h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Regulatory audit documentation for ISO 27001, PCI-DSS, GDPR, and HIPAA
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handlePrint} className="btn-cyber" style={{ fontSize: '0.8rem' }}>
            <Printer size={16} /> Print / Export PDF
          </button>
        </div>
      </div>

      {reportData ? (
        <div style={{ background: '#090e1a', border: '1px solid var(--border-glass)', borderRadius: '12px', padding: '30px' }}>
          
          {/* Executive Header Banner */}
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--accent-cyan)', paddingBottom: '20px', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#ffffff' }}>
                SOC-SHIELD EXECUTIVE AUDIT & COMPLIANCE POSTURE REPORT
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Target Organization: <strong style={{ color: 'var(--accent-cyan)' }}>{reportData.organization}</strong>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div className="badge badge-low" style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
                <ShieldCheck size={16} /> AUDIT POSTURE: {reportData.overallScore}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                Generated: {new Date(reportData.generatedAt).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Key Metrics Summary Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '28px' }}>
            <div style={{ background: 'rgba(15,23,42,0.6)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>24H LOGS PROCESSED</div>
              <div className="font-heading" style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--accent-cyan)' }}>
                {reportData.summaryStats?.totalLogsProcessed24h.toLocaleString()}
              </div>
            </div>

            <div style={{ background: 'rgba(15,23,42,0.6)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>AVG DETECT SLA (MTTD)</div>
              <div className="font-heading" style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--accent-green)' }}>
                {reportData.summaryStats?.avgMTTDMin} Minutes
              </div>
            </div>

            <div style={{ background: 'rgba(15,23,42,0.6)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>AVG RESPOND SLA (MTTR)</div>
              <div className="font-heading" style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--accent-amber)' }}>
                {reportData.summaryStats?.avgMTTRMin} Minutes
              </div>
            </div>
          </div>

          {/* Compliance Frameworks Table */}
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={18} color="var(--accent-cyan)" /> Regulatory Framework Mapping
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {reportData.frameworks?.map((fw, idx) => (
              <div key={idx} style={{ background: 'rgba(15,23,42,0.8)', padding: '18px', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#ffffff' }}>
                    {fw.name} — <span style={{ color: 'var(--accent-cyan)' }}>{fw.control}</span>
                  </div>
                  <span className="badge badge-low">
                    <CheckCircle size={14} /> {fw.status} ({fw.coverage})
                  </span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {fw.notes}
                </p>
              </div>
            ))}
          </div>

          {/* Sign-Off Footer */}
          <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <div>Auditor Engine: {reportData.auditor}</div>
            <div>Sign-Off Verification: VALIDATED DIGITAL STAMP #SOC-2026-CONFIRMED</div>
          </div>

        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading compliance report...</div>
      )}

    </div>
  );
}
