// server/index.js - SOC-Shield Backend Server
import express from 'express';
import cors from 'cors';
import { store } from './store.js';
import { startLogStream, triggerScenario } from './logGenerator.js';
import { lookupThreatIntel } from './threatIntel.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// Start continuous log generator stream
startLogStream();

// SSE Clients List for real-time live push
let sseClients = [];

// Broadcast new events to connected SSE clients
setInterval(() => {
  if (sseClients.length === 0) return;
  const payload = JSON.stringify({
    type: 'TICK',
    metrics: store.metrics,
    recentLog: store.logs[0] || null,
    recentAlert: store.alerts[0] || null,
    incidentsCount: store.incidents.filter(i => i.status === 'OPEN' || i.status === 'IN_PROGRESS').length,
    systemNodes: store.systemNodes
  });

  sseClients.forEach(client => client.res.write(`data: ${payload}\n\n`));
}, 1000);

// SSE Endpoint
app.get('/api/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const clientId = Date.now();
  const newClient = { id: clientId, res };
  sseClients.push(newClient);

  req.on('close', () => {
    sseClients = sseClients.filter(c => c.id !== clientId);
  });
});

// API Routes

// 1. GET Logs (with query search support)
app.get('/api/logs', (req, res) => {
  const { q, severity, limit = 100 } = req.query;
  let result = [...store.logs];

  if (severity && severity !== 'ALL') {
    result = result.filter(l => l.severity === severity);
  }

  if (q) {
    const searchTerm = q.toLowerCase();
    result = result.filter(l =>
      (l.message && l.message.toLowerCase().includes(searchTerm)) ||
      (l.srcIp && l.srcIp.includes(searchTerm)) ||
      (l.destIp && l.destIp.includes(searchTerm)) ||
      (l.host && l.host.toLowerCase().includes(searchTerm)) ||
      (l.action && l.action.toLowerCase().includes(searchTerm))
    );
  }

  res.json({ success: true, count: result.length, data: result.slice(0, Number(limit)) });
});

// 2. GET Alerts
app.get('/api/alerts', (req, res) => {
  res.json({ success: true, count: store.alerts.length, data: store.alerts });
});

// 3. GET Incidents
app.get('/api/incidents', (req, res) => {
  res.json({ success: true, count: store.incidents.length, data: store.incidents });
});

// 4. POST Create Incident Ticket
app.post('/api/incidents', (req, res) => {
  const { title, severity, vector, sourceIp, targetHost, description, assignedTo } = req.body;
  const incId = `INC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const newInc = {
    id: incId,
    title: title || 'Manual Incident Ticket',
    severity: severity || 'HIGH',
    status: 'OPEN',
    assignedTo: assignedTo || 'Tier 1 Analyst',
    sourceIp: sourceIp || '10.0.0.1',
    targetHost: targetHost || 'DC-01',
    vector: vector || 'Manual Escalation',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    description: description || 'Created manually from SOC Dashboard.',
    auditLog: [
      { timestamp: new Date().toISOString(), action: 'Incident Created Manually', actor: assignedTo || 'Analyst Console' }
    ],
    containmentActions: [
      { action: `Isolate Host ${targetHost}`, status: 'PENDING', timestamp: null },
      { action: `Block IP ${sourceIp}`, status: 'PENDING', timestamp: null }
    ]
  };

  store.incidents.unshift(newInc);
  store.metrics.openIncidentsCount += 1;
  res.json({ success: true, data: newInc });
});

// 5. PATCH Update Incident Ticket
app.patch('/api/incidents/:id', (req, res) => {
  const { id } = req.params;
  const { status, assignedTo, note, severity } = req.body;
  const inc = store.incidents.find(i => i.id === id);

  if (!inc) {
    return res.status(404).json({ success: false, message: 'Incident not found' });
  }

  if (status) {
    const oldStatus = inc.status;
    inc.status = status;
    inc.auditLog.push({
      timestamp: new Date().toISOString(),
      action: `Status changed from ${oldStatus} to ${status}`,
      actor: assignedTo || 'SOC Analyst'
    });

    if (status === 'RESOLVED' || status === 'CLOSED') {
      store.metrics.openIncidentsCount = Math.max(0, store.metrics.openIncidentsCount - 1);
      store.metrics.resolvedIncidentsToday += 1;
    }
  }

  if (assignedTo) {
    inc.assignedTo = assignedTo;
    inc.auditLog.push({
      timestamp: new Date().toISOString(),
      action: `Assigned ticket to ${assignedTo}`,
      actor: 'SOC Manager'
    });
  }

  if (severity) {
    inc.severity = severity;
  }

  if (note) {
    inc.auditLog.push({
      timestamp: new Date().toISOString(),
      action: `Investigation Note: "${note}"`,
      actor: assignedTo || 'SOC Investigator'
    });
  }

  inc.updatedAt = new Date().toISOString();
  res.json({ success: true, data: inc });
});

// 6. POST Execute Containment Action
app.post('/api/incidents/:id/containment', (req, res) => {
  const { id } = req.params;
  const { actionIndex } = req.body;
  const inc = store.incidents.find(i => i.id === id);

  if (!inc || !inc.containmentActions[actionIndex]) {
    return res.status(404).json({ success: false, message: 'Containment action not found' });
  }

  const targetAction = inc.containmentActions[actionIndex];
  targetAction.status = 'COMPLETED';
  targetAction.timestamp = new Date().toISOString();

  inc.auditLog.push({
    timestamp: new Date().toISOString(),
    action: `CONTAINMENT APPLIED: ${targetAction.action}`,
    actor: 'SOAR Automation Subsystem'
  });

  // If host isolation, mark node as isolated in system topology
  if (targetAction.action.toLowerCase().includes('isolate')) {
    const node = store.systemNodes.find(n => n.name.includes('Finance') || n.name.includes('DC-01'));
    if (node) node.status = 'isolated';
  }

  res.json({ success: true, data: inc });
});

// 7. GET Metrics KPI
app.get('/api/metrics', (req, res) => {
  res.json({
    success: true,
    data: {
      ...store.metrics,
      openIncidents: store.incidents.filter(i => i.status === 'OPEN' || i.status === 'IN_PROGRESS').length,
      systemNodes: store.systemNodes
    }
  });
});

// 8. GET Threat Intelligence Lookup
app.get('/api/threat-intel/:query', (req, res) => {
  const intel = lookupThreatIntel(req.params.query);
  res.json({ success: true, data: intel });
});

// 9. POST Trigger Attack Scenario Simulation
app.post('/api/simulate', (req, res) => {
  const { scenario } = req.body;
  triggerScenario(scenario);
  res.json({ success: true, message: `Scenario '${scenario}' triggered successfully!` });
});

// 10. GET Compliance Report Data
app.get('/api/compliance/report', (req, res) => {
  const report = {
    generatedAt: new Date().toISOString(),
    organization: 'Enterprise Infrastructure Core',
    auditor: 'SOC-Shield Automated Audit Engine v2.4',
    overallScore: '94 / 100 (PASSED)',
    frameworks: [
      {
        name: 'ISO / IEC 27001:2022',
        control: 'A.12.4 Logging and Monitoring',
        status: 'COMPLIANT',
        coverage: '98.5%',
        notes: 'Centralized log aggregation active across perimeter, servers, and endpoint devices. Audit logs tamper-sealed.'
      },
      {
        name: 'PCI-DSS v4.0',
        control: 'Requirement 10: Log and Monitor All Access',
        status: 'COMPLIANT',
        coverage: '100%',
        notes: 'Real-time automated correlation rules active. Daily review automated via SOC KPI reporting.'
      },
      {
        name: 'GDPR Article 32 & 33',
        control: 'Security of Processing & 72h Breach Notification',
        status: 'COMPLIANT',
        coverage: '96.0%',
        notes: 'Automated breach detection MTTD is 3.8 minutes (well under 72 hour requirement). Incident ticket timeline active.'
      },
      {
        name: 'HIPAA Security Rule',
        control: '§ 164.312(b) Audit Controls',
        status: 'COMPLIANT',
        coverage: '94.2%',
        notes: 'Role-based access control (RBAC) enforced. Access logs recorded with microsecond timestamps.'
      }
    ],
    summaryStats: {
      totalLogsProcessed24h: 148250,
      correlatedThreatsDetected: store.alerts.length,
      incidentsResolved24h: store.metrics.resolvedIncidentsToday,
      avgMTTDMin: store.metrics.mttdMinutes,
      avgMTTRMin: store.metrics.mttrMinutes
    }
  };

  res.json({ success: true, data: report });
});

app.listen(PORT, () => {
  console.log(`[SOC-Shield Backend] Running on http://localhost:${PORT}`);
});
