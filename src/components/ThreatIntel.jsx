// src/components/ThreatIntel.jsx - Threat Intelligence Enrichment Console
import React, { useState, useEffect } from 'react';
import { ShieldAlert, Search, Globe, AlertOctagon, Database, Cpu, Tag, ExternalLink, CheckCircle, XCircle } from 'lucide-react';

export default function ThreatIntel({ initialQuery }) {
  const [query, setQuery] = useState(initialQuery || '185.220.101.5');
  const [intelData, setIntelData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchIntel = async (searchQuery) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/threat-intel/${encodeURIComponent(searchQuery)}`);
      const json = await res.json();
      if (json.success) {
        setIntelData(json.data);
      }
    } catch (err) {
      console.error("Threat Intel fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntel(query);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) fetchIntel(query.trim());
  };

  return (
    <div className="glass-card" style={{ padding: '20px' }}>
      
      {/* Header Bar */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldAlert size={20} color="var(--accent-cyan)" />
          Threat Intelligence Enrichment & IOC Reputation Lookup
        </h2>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          Contextual enrichment via AbuseIPDB, VirusTotal, and MISP threat feeds
        </p>
      </div>

      {/* Lookup Bar */}
      <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Enter IPv4 Address, FQDN Domain, or SHA-256 Hash..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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
        <button type="submit" className="btn-cyber" disabled={loading}>
          {loading ? 'Querying Feeds...' : 'Lookup Threat IOC'}
        </button>
      </form>

      {/* Preset Quick Buttons */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Preset IOC Scenarios:</span>
        {[
          { label: 'TOR Exit Node (185.220.101.5)', ip: '185.220.101.5' },
          { label: 'LockBit C2 (194.26.29.112)', ip: '194.26.29.112' },
          { label: 'SQLi Scanner (45.154.255.82)', ip: '45.154.255.82' },
          { label: 'Masscan Recon (91.240.118.17)', ip: '91.240.118.17' }
        ].map((item, idx) => (
          <button
            key={idx}
            onClick={() => { setQuery(item.ip); fetchIntel(item.ip); }}
            style={{ background: 'rgba(0, 240, 255, 0.1)', border: '1px solid var(--border-glass)', color: 'var(--accent-cyan)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.72rem', cursor: 'pointer' }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* INTEL CARD DISPLAY */}
      {intelData && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          
          {/* Main Reputation Score Card */}
          <div className="glass-card-neon" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
              Threat Risk Scorecard
            </div>
            
            <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <div className="font-heading" style={{ fontSize: '2.5rem', fontWeight: '800', color: intelData.reputationScore > 80 ? 'var(--accent-red)' : 'var(--accent-amber)' }}>
                {intelData.reputationScore}
              </div>
            </div>

            <div className={`badge ${intelData.reputationScore > 80 ? 'badge-critical' : 'badge-high'}`} style={{ fontSize: '0.9rem', padding: '6px 16px', marginBottom: '12px' }}>
              {intelData.status}
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Category: <strong style={{ color: '#ffffff' }}>{intelData.category}</strong>
            </p>
          </div>

          {/* Infrastructure & Geoloc */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe size={18} color="var(--accent-cyan)" /> Host Infrastructure & Geolocation
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem' }}>
              <div><strong style={{ color: 'var(--text-muted)' }}>Target IOC: </strong> <span className="font-mono" style={{ color: 'var(--accent-cyan)' }}>{intelData.query}</span></div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Host ISP: </strong> {intelData.isp}</div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Geographic Origin: </strong> {intelData.country} ({intelData.city})</div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Reverse DNS / FQDN: </strong> <span className="font-mono">{intelData.domain}</span></div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Abuse Reports Count: </strong> <span style={{ color: 'var(--accent-red)', fontWeight: '700' }}>{intelData.abuseReportsCount} reports</span></div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Last Abuse Activity: </strong> {intelData.lastReportedAt}</div>
            </div>
          </div>

          {/* VirusTotal Vendor Detections */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={18} color="var(--accent-purple)" /> VirusTotal Multi-AV Engine Consensus
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div style={{ background: 'rgba(255,0,85,0.1)', border: '1px solid var(--accent-red)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent-red)' }}>{intelData.virusTotal?.malicious}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Flagged Malicious</div>
              </div>

              <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid var(--accent-green)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent-green)' }}>{intelData.virusTotal?.harmless}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Clean / Harmless</div>
              </div>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Associated Threat Actors:</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
              {intelData.threatActors?.map((actor, i) => (
                <span key={i} className="badge badge-high" style={{ textTransform: 'none' }}>{actor}</span>
              ))}
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Malware Family Signatures:</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {intelData.malwareFamilies?.map((mal, i) => (
                <span key={i} className="badge badge-critical" style={{ textTransform: 'none' }}>{mal}</span>
              ))}
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
