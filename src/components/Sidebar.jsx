// src/components/Sidebar.jsx - Navigation Sidebar with Module Badges
import React from 'react';
import { LayoutDashboard, AlertTriangle, Map, Ticket, Search, ShieldAlert, FileText, Zap } from 'lucide-react';
import { hasPermission } from '../utils/rbac';

export default function Sidebar({ activeTab, setActiveTab, currentRole, alertsCount, openIncidentsCount }) {
  const menuItems = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard, perm: 'VIEW_DASHBOARD' },
    { id: 'alerts', label: 'Live Threat Feed', icon: AlertTriangle, perm: 'VIEW_ALERTS', badge: alertsCount },
    { id: 'map', label: 'Threat & Network Map', icon: Map, perm: 'VIEW_MAP' },
    { id: 'incidents', label: 'Incident Ticketing', icon: Ticket, perm: 'MANAGE_INCIDENTS', badge: openIncidentsCount, badgeColor: '#ff0055' },
    { id: 'search', label: 'SIEM Log Query', icon: Search, perm: 'VIEW_LOGS' },
    { id: 'intel', label: 'Threat Intelligence', icon: ShieldAlert, perm: 'THREAT_INTEL' },
    { id: 'reports', label: 'Compliance Reports', icon: FileText, perm: 'REPORTS_VIEW' },
    { id: 'simulator', label: 'Attack Simulator', icon: Zap, perm: 'SIMULATION', highlight: true }
  ];

  return (
    <aside style={{ width: '250px', background: 'rgba(15, 23, 42, 0.7)', borderRight: '1px solid var(--border-glass)', padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ fontSize: '0.68rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 12px 10px 12px' }}>
        Core SOC Operations
      </div>

      {menuItems.map((item) => {
        const Icon = item.icon;
        const isAllowed = hasPermission(currentRole, item.perm);
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => isAllowed && setActiveTab(item.id)}
            disabled={!isAllowed}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '11px 14px',
              borderRadius: '10px',
              border: isActive ? '1px solid var(--accent-cyan)' : '1px solid transparent',
              background: isActive 
                ? 'linear-gradient(90deg, rgba(0, 240, 255, 0.15), rgba(59, 130, 246, 0.05))' 
                : item.highlight ? 'rgba(255, 0, 85, 0.08)' : 'transparent',
              color: !isAllowed 
                ? 'var(--text-muted)' 
                : isActive ? '#ffffff' : item.highlight ? 'var(--accent-red)' : 'var(--text-secondary)',
              cursor: isAllowed ? 'pointer' : 'not-allowed',
              opacity: isAllowed ? 1 : 0.4,
              transition: 'all 0.2s ease',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Icon size={18} color={isActive ? 'var(--accent-cyan)' : item.highlight ? 'var(--accent-red)' : 'currentColor'} />
              <span style={{ fontSize: '0.86rem', fontWeight: isActive ? '700' : '500' }}>
                {item.label}
              </span>
            </div>

            {item.badge !== undefined && item.badge > 0 && (
              <span style={{
                background: item.badgeColor || 'rgba(0, 240, 255, 0.2)',
                color: item.badgeColor ? '#ffffff' : 'var(--accent-cyan)',
                border: `1px solid ${item.badgeColor || 'var(--accent-cyan)'}`,
                fontSize: '0.7rem',
                fontWeight: '700',
                padding: '2px 7px',
                borderRadius: '9999px'
              }}>
                {item.badge}
              </span>
            )}
          </button>
        );
      })}

      {/* Role Notice Card */}
      <div style={{ marginTop: 'auto', padding: '14px', borderRadius: '10px', background: 'rgba(0, 240, 255, 0.04)', border: '1px solid var(--border-cyan)' }}>
        <div style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>
          Role Simulation Active
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Switch roles in header to test Tier 1, Tier 2, Tier 3, CISO, or Auditor permissions.
        </p>
      </div>
    </aside>
  );
}
