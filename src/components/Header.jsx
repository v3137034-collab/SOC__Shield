// src/components/Header.jsx - Main Dashboard Header & Status Bar
import React, { useState } from 'react';
import { Shield, Activity, Bell, UserCheck, Search, Radio, Volume2, VolumeX, AlertOctagon } from 'lucide-react';
import { ROLES } from '../utils/rbac';

export default function Header({ metrics, currentRole, onRoleChange, onSearch, openIncidentsCount }) {
  const [muted, setMuted] = useState(false);

  const getDefconInfo = (level) => {
    switch (level) {
      case 1: return { text: 'DEFCON 1: MAXIMUM READINESS', color: '#ff0055', bg: 'rgba(255,0,85,0.2)' };
      case 2: return { text: 'DEFCON 2: SEVERE THREAT', color: '#f59e0b', bg: 'rgba(245,158,11,0.2)' };
      case 3: return { text: 'DEFCON 3: ELEVATED RISK', color: '#eab308', bg: 'rgba(234,179,8,0.2)' };
      case 4: return { text: 'DEFCON 4: GUARDED POSTURE', color: '#3b82f6', bg: 'rgba(59,130,246,0.2)' };
      default: return { text: 'DEFCON 5: NORMAL OPS', color: '#10b981', bg: 'rgba(16,185,129,0.2)' };
    }
  };

  const defcon = getDefconInfo(metrics?.defconLevel || 3);

  return (
    <header className="glass-card-neon" style={{ borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none', padding: '12px 24px', zIndex: 50 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Brand & Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ position: 'relative' }}>
            <div className="pulse-cyan-glow" style={{ padding: '8px', background: 'rgba(0, 240, 255, 0.15)', borderRadius: '10px', border: '1px solid var(--accent-cyan)', display: 'flex' }}>
              <Shield size={26} color="var(--accent-cyan)" />
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: '800', letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #ffffff, var(--accent-cyan))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                SOC-SHIELD
              </span>
              <span style={{ fontSize: '0.65rem', background: 'rgba(0, 240, 255, 0.15)', color: 'var(--accent-cyan)', border: '1px solid var(--accent-cyan)', padding: '1px 6px', borderRadius: '4px', fontWeight: '700' }}>
                v2.4 enterprise
              </span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Unified Security Monitoring & Incident Response Dashboard
            </p>
          </div>
        </div>

        {/* Live Status Indicators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          
          {/* DEFCON Level Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '8px', background: defcon.bg, border: `1px solid ${defcon.color}` }}>
            <AlertOctagon size={18} color={defcon.color} className="pulse-red-glow" />
            <span style={{ color: defcon.color, fontWeight: '700', fontSize: '0.8rem', letterSpacing: '0.05em' }}>
              {defcon.text}
            </span>
          </div>

          {/* EPS Live Counter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(15, 23, 42, 0.6)', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
            <Radio size={16} color="var(--accent-green)" style={{ animation: 'spin 4s linear infinite' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Ingestion Rate</span>
              <span className="font-mono" style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--accent-green)' }}>
                {metrics?.currentEPS || 42} EPS
              </span>
            </div>
          </div>

          {/* MTTD & MTTR Quick Metrics */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(15, 23, 42, 0.6)', padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
            <div>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>MTTD: </span>
              <span className="font-mono" style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--accent-cyan)' }}>
                {metrics?.mttdMinutes || 3.8} min
              </span>
            </div>
            <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.1)' }}></div>
            <div>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>MTTR: </span>
              <span className="font-mono" style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--accent-amber)' }}>
                {metrics?.mttrMinutes || 14.2} min
              </span>
            </div>
          </div>
        </div>

        {/* User Role & Settings Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          
          {/* RBAC Role Selector Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(15, 23, 42, 0.8)', padding: '4px 10px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
            <UserCheck size={18} color={ROLES[currentRole]?.color || 'var(--accent-cyan)'} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>Active User Role</span>
              <select 
                value={currentRole} 
                onChange={(e) => onRoleChange(e.target.value)}
                style={{
                  background: 'transparent',
                  color: ROLES[currentRole]?.color || 'var(--accent-cyan)',
                  border: 'none',
                  outline: 'none',
                  fontWeight: '700',
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                {Object.keys(ROLES).map(key => (
                  <option key={key} value={key} style={{ background: '#0f172a', color: '#ffffff' }}>
                    {ROLES[key].name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Audio Alert Toggle */}
          <button 
            onClick={() => setMuted(!muted)}
            title={muted ? "Unmute Alert Chimes" : "Mute Alert Chimes"}
            style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid var(--border-glass)', padding: '8px', borderRadius: '8px', cursor: 'pointer', color: muted ? 'var(--text-muted)' : 'var(--accent-cyan)', display: 'flex' }}
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          {/* Notification Bell */}
          <div style={{ position: 'relative' }}>
            <button style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid var(--border-glass)', padding: '8px', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex' }}>
              <Bell size={18} />
            </button>
            {openIncidentsCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: 'var(--accent-red)',
                color: '#ffffff',
                fontSize: '0.65rem',
                fontWeight: '800',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid var(--bg-dark)'
              }}>
                {openIncidentsCount}
              </span>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}
