// src/components/KPICards.jsx - Executive Metrics & KPI Cards
import React from 'react';
import { ShieldAlert, Clock, Activity, CheckCircle2, AlertOctagon, Cpu } from 'lucide-react';

export default function KPICards({ metrics }) {
  const cards = [
    {
      title: 'OPEN INCIDENTS',
      value: metrics?.openIncidentsCount ?? 5,
      subtext: 'Requires Immediate Action',
      icon: ShieldAlert,
      color: '#ff0055',
      glow: 'rgba(255, 0, 85, 0.15)'
    },
    {
      title: 'MEAN TIME TO DETECT (MTTD)',
      value: `${metrics?.mttdMinutes ?? 3.8} min`,
      subtext: 'Target Benchmark: < 10.0 min',
      icon: Clock,
      color: '#00f0ff',
      glow: 'rgba(0, 240, 255, 0.15)'
    },
    {
      title: 'MEAN TIME TO RESPOND (MTTR)',
      value: `${metrics?.mttrMinutes ?? 14.2} min`,
      subtext: 'Target Benchmark: < 30.0 min',
      icon: Activity,
      color: '#f59e0b',
      glow: 'rgba(245, 158, 11, 0.15)'
    },
    {
      title: 'TOTAL LOGS INGESTED',
      value: (metrics?.totalLogsIngested || 148250).toLocaleString(),
      subtext: `Streaming @ ${metrics?.currentEPS || 42} EPS`,
      icon: Cpu,
      color: '#3b82f6',
      glow: 'rgba(59, 130, 246, 0.15)'
    },
    {
      title: 'ACTIVE THREAT VECTORS',
      value: metrics?.activeThreatsCount ?? 7,
      subtext: 'Under Real-Time Rules Engine',
      icon: AlertOctagon,
      color: '#a855f7',
      glow: 'rgba(168, 85, 247, 0.15)'
    },
    {
      title: 'INCIDENTS RESOLVED TODAY',
      value: metrics?.resolvedIncidentsToday ?? 18,
      subtext: 'MTTR SLA Achieved: 100%',
      icon: CheckCircle2,
      color: '#10b981',
      glow: 'rgba(16, 185, 129, 0.15)'
    }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div key={idx} className="glass-card" style={{ padding: '18px 20px', borderLeft: `4px solid ${card.color}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.68rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {card.title}
              </span>
              <div style={{ padding: '6px', borderRadius: '8px', background: card.glow, display: 'flex' }}>
                <Icon size={18} color={card.color} />
              </div>
            </div>
            <div className="font-heading" style={{ fontSize: '1.75rem', fontWeight: '800', color: card.color, marginBottom: '4px' }}>
              {card.value}
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              {card.subtext}
            </p>
          </div>
        );
      })}
    </div>
  );
}
