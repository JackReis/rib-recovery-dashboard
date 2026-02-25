import React from 'react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Filler, Tooltip, Legend
);

export function SupplementAdherenceChart({ supplementData }) {
  const active = supplementData?.rib_recovery?.supplements?.active || [];
  const adherencePct = supplementData?.rib_recovery?.adherence?.rate ?? 0;

  const has = (needle) => active.some(s => (s?.name || '').toLowerCase().includes(needle));

  // Deterministic current-state bars (no simulated/random week data)
  const checks = [
    { label: 'Collagen', value: has('collagen') ? 1 : 0, color: '#3b82f6' },
    { label: 'Vitamin C', value: has('vitamin c') || has('ascorbate') ? 1 : 0, color: '#f59e0b' },
    { label: 'Magnesium', value: has('magnesium') ? 1 : 0, color: '#10b981' },
    { label: 'Mitopure', value: has('mitopure') || has('urolithin') ? 1 : 0, color: '#8b5cf6' }
  ];

  const data = {
    labels: checks.map(c => c.label),
    datasets: [
      {
        label: 'In active protocol',
        data: checks.map(c => c.value),
        backgroundColor: checks.map(c => c.color),
        borderRadius: 6
      },
      {
        label: 'Daily adherence %',
        data: checks.map(() => Number(adherencePct)),
        type: 'line',
        borderColor: '#0f172a',
        borderWidth: 2,
        pointRadius: 0,
        yAxisID: 'y1'
      }
    ]
  };

  return (
    <div className="h-64">
      <Bar data={data} options={{
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { grid: { display: false } },
          y: { min: 0, max: 1, ticks: { stepSize: 1, callback: (v) => v === 1 ? 'Yes' : 'No' }, title: { display: true, text: 'Protocol' } },
          y1: { min: 0, max: 100, position: 'right', grid: { display: false }, ticks: { callback: (v) => `${v}%` }, title: { display: true, text: 'Adherence' } }
        },
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10 } } },
          tooltip: {
            callbacks: {
              afterLabel: (ctx) => ctx.dataset.label === 'In active protocol'
                ? (ctx.raw ? 'Currently active' : 'Not in current active list')
                : ''
            }
          }
        }
      }} />
    </div>
  );
}

export function RecoveryTrendChart({ recoveryData }) {
  const progress = recoveryData || {};
  const sessions = progress.recent_sessions || [];
  const hasSessions = sessions.length > 0;

  const labels = hasSessions
    ? sessions.map(s => new Date(s.date || s.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
    : ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

  const painData = hasSessions
    ? sessions.map(s => s.pain || 0)
    : [5, 4, 3.5, 2];
  const mobilityData = hasSessions
    ? sessions.map(s => s.mobility || 0)
    : [4, 5, 6, 7];

  const data = {
    labels,
    datasets: [
      {
        label: 'Pain Level',
        data: painData,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.3,
        yAxisID: 'y'
      },
      {
        label: 'Mobility Score',
        data: mobilityData,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.3,
        yAxisID: 'y'
      }
    ]
  };

  return (
    <div className="h-64">
      <Line data={data} options={{
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        scales: {
          y: { min: 0, max: 10, title: { display: true, text: 'Score (0-10)' } },
          x: { grid: { display: false } }
        },
        plugins: { legend: { position: 'bottom', labels: { boxWidth: 12 } } }
      }} />
    </div>
  );
}

export function MealAdherenceChart({ mealData }) {
  const adherence = mealData?.summary?.meal_adherence || mealData?.adherence || 85;
  const remaining = 100 - adherence;

  const data = {
    labels: ['Adherent', 'Missed'],
    datasets: [{
      data: [adherence, remaining],
      backgroundColor: ['#3b82f6', '#e2e8f0'],
      borderWidth: 0,
      cutout: '75%'
    }]
  };

  return (
    <div className="h-64 relative">
      <Doughnut data={data} options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
      }} />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">{adherence}%</div>
          <div className="text-xs text-slate-500">Meal Plan</div>
        </div>
      </div>
    </div>
  );
}

export function WeeklyWellnessScoreChart({ wellnessData, permaVHistory }) {
  const history = permaVHistory || [];
  const recentCheckins = history.slice(-4);

  const labels = recentCheckins.length > 0
    ? recentCheckins.map(c => new Date(c.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
    : ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

  const scores = recentCheckins.length > 0
    ? recentCheckins.map(c => c.overall)
    : [6.8, 7.2, 7.0, wellnessData?.summary?.overall_wellness_score || 7.5];

  const data = {
    labels,
    datasets: [{
      label: 'Wellness Score',
      data: scores,
      borderColor: '#8b5cf6',
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 6,
      pointBackgroundColor: '#8b5cf6'
    }]
  };

  return (
    <div className="h-64">
      <Line data={data} options={{
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { min: 0, max: 10, title: { display: true, text: 'Score' } },
          x: { grid: { display: false } }
        },
        plugins: { legend: { display: false } }
      }} />
    </div>
  );
}
