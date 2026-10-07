// src/utils/rbac.js - Role-Based Access Control Configuration

export const ROLES = {
  TIER1: {
    id: 'TIER1',
    name: 'Tier 1 Analyst (Triage)',
    level: 1,
    badge: 'Triage Analyst',
    color: '#00f0ff',
    permissions: ['VIEW_DASHBOARD', 'VIEW_ALERTS', 'CREATE_INCIDENT', 'VIEW_LOGS', 'VIEW_MAP']
  },
  TIER2: {
    id: 'TIER2',
    name: 'Tier 2 Analyst (Investigator)',
    level: 2,
    badge: 'Senior Investigator',
    color: '#3b82f6',
    permissions: ['VIEW_DASHBOARD', 'VIEW_ALERTS', 'MANAGE_INCIDENTS', 'THREAT_INTEL', 'VIEW_LOGS', 'VIEW_MAP', 'CONTAINMENT_EXECUTE']
  },
  TIER3: {
    id: 'TIER3',
    name: 'Tier 3 Analyst (Threat Hunter)',
    level: 3,
    badge: 'Threat Hunter',
    color: '#a855f7',
    permissions: ['VIEW_DASHBOARD', 'VIEW_ALERTS', 'MANAGE_INCIDENTS', 'THREAT_INTEL', 'SIMULATION', 'VIEW_LOGS', 'VIEW_MAP', 'CONTAINMENT_EXECUTE']
  },
  IR_MANAGER: {
    id: 'IR_MANAGER',
    name: 'Incident Response Manager',
    level: 4,
    badge: 'IR Lead',
    color: '#eab308',
    permissions: ['VIEW_DASHBOARD', 'VIEW_ALERTS', 'MANAGE_INCIDENTS', 'ASSIGN_TICKETS', 'CONTAINMENT_EXECUTE', 'REPORTS_VIEW', 'VIEW_LOGS', 'VIEW_MAP']
  },
  CISO: {
    id: 'CISO',
    name: 'SOC Manager / CISO',
    level: 5,
    badge: 'Executive CISO',
    color: '#ff0055',
    permissions: ['VIEW_DASHBOARD', 'VIEW_KPI', 'REPORTS_GENERATE', 'REPORTS_VIEW', 'MANAGE_INCIDENTS', 'VIEW_ALERTS', 'VIEW_LOGS', 'VIEW_MAP']
  },
  AUDITOR: {
    id: 'AUDITOR',
    name: 'Compliance & Audit Officer',
    level: 2,
    badge: 'Auditor (Read-Only)',
    color: '#10b981',
    permissions: ['VIEW_DASHBOARD', 'REPORTS_GENERATE', 'REPORTS_VIEW', 'VIEW_INCIDENTS_READONLY', 'VIEW_LOGS']
  },
  SYSADMIN: {
    id: 'SYSADMIN',
    name: 'System Administrator',
    level: 6,
    badge: 'Super Admin',
    color: '#f97316',
    permissions: ['ALL']
  }
};

export function hasPermission(roleId, permission) {
  const role = ROLES[roleId] || ROLES.TIER1;
  if (role.permissions.includes('ALL')) return true;
  return role.permissions.includes(permission);
}
