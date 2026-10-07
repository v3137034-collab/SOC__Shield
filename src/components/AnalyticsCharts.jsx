// src/components/AnalyticsCharts.jsx - Chart.js SOC Analytics & Visualizations
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AnalyticsCharts() {
  // 1. Line Chart: Event Ingestion & Threat Spikes over 24h
  const lineData = {
    labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00', 'NOW'],
    datasets: [
      {
        label: 'Total Logs Ingested (x100)',
        data: [120, 95, 110, 240, 310, 280, 190, 230, 290],
        borderColor: '#00f0ff',
        backgroundColor: 'rgba(0, 240, 255, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Correlated Threats',
        data: [4, 2, 3, 18, 25, 12, 8, 15, 22],
        borderColor: '#ff0055',
        backgroundColor: 'rgba(255, 0, 85, 0.2)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#94a3b8', font: { family: 'Inter', size: 11 } } },
      tooltip: { backgroundColor: '#0f172a', borderColor: '#00f0ff', borderWidth: 1 }
    },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b' } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b' } }
    }
  };

  // 2. Doughnut Chart: Attack Vector Breakdown
  const doughnutData = {
    labels: ['Brute Force / SSH', 'SQL Injection', 'Ransomware C2', 'Port Scan / Recon', 'Data Exfiltration'],
    datasets: [
      {
        data: [35, 22, 18, 15, 10],
        backgroundColor: [
          '#ff0055',
          '#f59e0b',
          '#a855f7',
          '#3b82f6',
          '#00f0ff'
        ],
        borderWidth: 2,
        borderColor: '#070a12'
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right', labels: { color: '#94a3b8', font: { family: 'Inter', size: 11 } } }
    }
  };

  // 3. Bar Chart: Severity Distribution
  const barData = {
    labels: ['Critical', 'High', 'Medium', 'Low', 'Info'],
    datasets: [
      {
        label: 'Alert Count',
        data: [12, 28, 45, 89, 210],
        backgroundColor: [
          '#ff0055',
          '#f59e0b',
          '#3b82f6',
          '#10b981',
          '#64748b'
        ],
        borderRadius: 6
      }
    ]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b' } }
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '24px' }}>
      
      {/* Event Stream Volume Line Chart */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '14px', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-cyan)' }}></span>
          Real-Time Log Ingestion & Threat Volume (24h Trend)
        </h3>
        <div style={{ height: '230px' }}>
          <Line data={lineData} options={lineOptions} />
        </div>
      </div>

      {/* Attack Vectors Doughnut */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '14px', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-red)' }}></span>
          Correlated Attack Vector Distribution
        </h3>
        <div style={{ height: '230px' }}>
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
      </div>

      {/* Severity Bar Chart */}
      <div className="glass-card" style={{ padding: '20px', gridColumn: 'span 1' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '14px', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-amber)' }}></span>
          Alert Volume by Severity Rating
        </h3>
        <div style={{ height: '230px' }}>
          <Bar data={barData} options={barOptions} />
        </div>
      </div>

    </div>
  );
}
