// src/App.jsx - Main Application Container & Real-Time SSE Stream Manager
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import KPICards from './components/KPICards';
import AnalyticsCharts from './components/AnalyticsCharts';
import LiveAlertFeed from './components/LiveAlertFeed';
import ThreatMap from './components/ThreatMap';
import IncidentBoard from './components/IncidentBoard';
import LogSearch from './components/LogSearch';
import ThreatIntel from './components/ThreatIntel';
import Reports from './components/Reports';
import LogSimulator from './components/LogSimulator';

export default function App() {
  const [currentRole, setCurrentRole] = useState('TIER1');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [intelQuery, setIntelQuery] = useState('185.220.101.5');

  const [metrics, setMetrics] = useState({
    totalLogsIngested: 148250,
    currentEPS: 42,
    mttdMinutes: 3.8,
    mttrMinutes: 14.2,
    defconLevel: 3,
    activeThreatsCount: 7,
    resolvedIncidentsToday: 18,
    openIncidentsCount: 5
  });

  const [logs, setLogs] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [systemNodes, setSystemNodes] = useState([]);

  // Fetch initial data
  const loadInitialData = async () => {
    try {
      const [logsRes, alertsRes, incRes, metricsRes] = await Promise.all([
        fetch('/api/logs?limit=100').then(r => r.json()),
        fetch('/api/alerts').then(r => r.json()),
        fetch('/api/incidents').then(r => r.json()),
        fetch('/api/metrics').then(r => r.json())
      ]);

      if (logsRes.success) setLogs(logsRes.data);
      if (alertsRes.success) setAlerts(alertsRes.data);
      if (incRes.success) setIncidents(incRes.data);
      if (metricsRes.success) {
        setMetrics(metricsRes.data);
        if (metricsRes.data.systemNodes) setSystemNodes(metricsRes.data.systemNodes);
      }
    } catch (err) {
      console.error("Initial data load error", err);
    }
  };

  useEffect(() => {
    loadInitialData();

    // Subscribe to SSE real-time stream
    const evtSource = new EventSource('/api/stream');
    evtSource.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === 'TICK') {
          if (data.metrics) setMetrics(data.metrics);
          if (data.systemNodes) setSystemNodes(data.systemNodes);
          
          if (data.recentLog) {
            setLogs(prev => {
              if (prev.some(l => l.id === data.recentLog.id)) return prev;
              return [data.recentLog, ...prev.slice(0, 100)];
            });
          }

          if (data.recentAlert) {
            setAlerts(prev => {
              if (prev.some(a => a.id === data.recentAlert.id)) return prev;
              return [data.recentAlert, ...prev.slice(0, 100)];
            });
          }
        }
      } catch (err) {
        console.error("SSE parse error", err);
      }
    };

    return () => {
      evtSource.close();
    };
  }, []);

  // Handlers
  const handleCreateIncidentFromAlert = async (alert) => {
    try {
      const res = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: alert.title,
          severity: alert.severity,
          vector: alert.vector,
          sourceIp: alert.srcIp,
          targetHost: alert.host,
          description: alert.description,
          assignedTo: 'Tier 1 Analyst'
        })
      });
      const json = await res.json();
      if (json.success) {
        setIncidents(prev => [json.data, ...prev]);
        setActiveTab('incidents');
      }
    } catch (err) {
      console.error("Create incident error", err);
    }
  };

  const handleCreateNewIncidentManual = async (incData) => {
    try {
      const res = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(incData)
      });
      const json = await res.json();
      if (json.success) {
        setIncidents(prev => [json.data, ...prev]);
      }
    } catch (err) {
      console.error("Create manual incident error", err);
    }
  };

  const handleUpdateIncident = async (id, updates) => {
    try {
      const res = await fetch(`/api/incidents/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const json = await res.json();
      if (json.success) {
        setIncidents(prev => prev.map(i => i.id === id ? json.data : i));
      }
    } catch (err) {
      console.error("Update incident error", err);
    }
  };

  const handleExecuteContainment = async (id, actionIndex) => {
    try {
      const res = await fetch(`/api/incidents/${id}/containment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionIndex })
      });
      const json = await res.json();
      if (json.success) {
        setIncidents(prev => prev.map(i => i.id === id ? json.data : i));
      }
    } catch (err) {
      console.error("Execute containment error", err);
    }
  };

  const handleSimulateScenario = async (scenario) => {
    try {
      await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario })
      });
      // Refresh logs & alerts
      setTimeout(loadInitialData, 800);
    } catch (err) {
      console.error("Simulate error", err);
    }
  };

  const handleNavigateIntel = (ip) => {
    setIntelQuery(ip);
    setActiveTab('intel');
  };

  const openIncidentsCount = incidents.filter(i => i.status === 'OPEN' || i.status === 'IN_PROGRESS').length;

  return (
    <div className="app-container">
      
      {/* Top Bar Header */}
      <Header
        metrics={metrics}
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        openIncidentsCount={openIncidentsCount}
      />

      {/* Main Layout Body */}
      <div className="main-layout">
        
        {/* Left Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentRole={currentRole}
          alertsCount={alerts.length}
          openIncidentsCount={openIncidentsCount}
        />

        {/* Dynamic Content View Area */}
        <main className="content-area">
          
          {/* TAB 1: EXECUTIVE DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div>
              <KPICards metrics={metrics} />
              <AnalyticsCharts />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '20px' }}>
                <LiveAlertFeed
                  alerts={alerts.slice(0, 5)}
                  onCreateIncident={handleCreateIncidentFromAlert}
                  onNavigateIntel={handleNavigateIntel}
                />
                <ThreatMap systemNodes={systemNodes} alerts={alerts} />
              </div>
            </div>
          )}

          {/* TAB 2: LIVE THREAT FEED */}
          {activeTab === 'alerts' && (
            <LiveAlertFeed
              alerts={alerts}
              onCreateIncident={handleCreateIncidentFromAlert}
              onNavigateIntel={handleNavigateIntel}
            />
          )}

          {/* TAB 3: THREAT & NETWORK MAP */}
          {activeTab === 'map' && (
            <ThreatMap systemNodes={systemNodes} alerts={alerts} />
          )}

          {/* TAB 4: INCIDENT TICKETING */}
          {activeTab === 'incidents' && (
            <IncidentBoard
              incidents={incidents}
              onUpdateIncident={handleUpdateIncident}
              onCreateNewIncident={handleCreateNewIncidentManual}
              onExecuteContainment={handleExecuteContainment}
              currentRole={currentRole}
            />
          )}

          {/* TAB 5: SIEM LOG QUERY */}
          {activeTab === 'search' && (
            <LogSearch logs={logs} />
          )}

          {/* TAB 6: THREAT INTELLIGENCE */}
          {activeTab === 'intel' && (
            <ThreatIntel initialQuery={intelQuery} />
          )}

          {/* TAB 7: COMPLIANCE REPORTS */}
          {activeTab === 'reports' && (
            <Reports />
          )}

          {/* TAB 8: ATTACK SIMULATOR (TEACHER DEMO) */}
          {activeTab === 'simulator' && (
            <LogSimulator onSimulateScenario={handleSimulateScenario} />
          )}

        </main>

      </div>

    </div>
  );
}
