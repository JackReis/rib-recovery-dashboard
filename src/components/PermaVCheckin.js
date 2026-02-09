import React, { useState, useEffect } from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { Smile, Zap, Heart, Compass, Trophy, Activity, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import permaVConfig from '../data/perma-v-questions.json';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const STORAGE_KEY = 'permaVHistory';

const iconMap = { Smile, Zap, Heart, Compass, Trophy, Activity };

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch { return []; }
}

function saveHistory(history) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

function getLatestScores(history) {
  if (!history.length) return null;
  return history[history.length - 1];
}

export default function PermaVCheckin({ onScoresUpdate }) {
  const [history, setHistory] = useState(loadHistory);
  const [isCheckinOpen, setIsCheckinOpen] = useState(false);
  const [currentDimension, setCurrentDimension] = useState(0);
  const [responses, setResponses] = useState({});

  const latest = getLatestScores(history);
  const dimensions = permaVConfig.dimensions;

  useEffect(() => {
    if (onScoresUpdate && latest) {
      onScoresUpdate(latest);
    }
  }, [latest, onScoresUpdate]);

  const handleSliderChange = (dimKey, qIndex, value) => {
    setResponses(prev => ({
      ...prev,
      [`${dimKey}_${qIndex}`]: parseInt(value)
    }));
  };

  const getDimensionScore = (dimKey) => {
    const dim = dimensions.find(d => d.key === dimKey);
    const scores = dim.questions.map((_, qi) => responses[`${dimKey}_${qi}`] || 0);
    const filled = scores.filter(s => s > 0);
    return filled.length ? Math.round((filled.reduce((a, b) => a + b, 0) / filled.length) * 10) / 10 : 0;
  };

  const submitCheckin = () => {
    const entry = {
      date: new Date().toISOString(),
      scores: {}
    };
    let total = 0;
    dimensions.forEach(dim => {
      const score = getDimensionScore(dim.key);
      entry.scores[dim.key] = score;
      total += score;
    });
    entry.overall = Math.round((total / dimensions.length) * 10) / 10;

    const updated = [...history, entry];
    setHistory(updated);
    saveHistory(updated);
    setIsCheckinOpen(false);
    setCurrentDimension(0);
    setResponses({});
  };

  const allAnswered = dimensions.every(dim =>
    dim.questions.every((_, qi) => responses[`${dim.key}_${qi}`] > 0)
  );

  const radarData = latest ? {
    labels: dimensions.map(d => d.label),
    datasets: [
      {
        label: 'Current',
        data: dimensions.map(d => latest.scores[d.key] || 0),
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        pointBackgroundColor: dimensions.map(d => d.color)
      },
      ...(history.length > 1 ? [{
        label: 'Previous',
        data: dimensions.map(d => history[history.length - 2].scores[d.key] || 0),
        backgroundColor: 'rgba(148, 163, 184, 0.1)',
        borderColor: 'rgba(148, 163, 184, 0.5)',
        borderWidth: 1,
        borderDash: [4, 4],
        pointRadius: 0
      }] : [])
    ]
  } : null;

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        min: 0,
        max: 10,
        ticks: { stepSize: 2, display: false },
        grid: { color: 'rgba(148, 163, 184, 0.2)' },
        pointLabels: { font: { size: 11 }, color: '#64748b' }
      }
    },
    plugins: { legend: { display: history.length > 1, position: 'bottom' } }
  };

  if (isCheckinOpen) {
    const dim = dimensions[currentDimension];
    const Icon = iconMap[dim.icon] || Activity;

    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900">PERMA-V Check-in</h3>
          <span className="text-sm text-slate-500">{currentDimension + 1} / {dimensions.length}</span>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: dim.color + '20' }}>
            <Icon className="w-5 h-5" style={{ color: dim.color }} />
          </div>
          <div>
            <p className="font-medium text-slate-900">{dim.label}</p>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1">
              <div className="h-1.5 rounded-full" style={{ width: `${((currentDimension + 1) / dimensions.length) * 100}%`, backgroundColor: dim.color }} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {dim.questions.map((q, qi) => {
            const val = responses[`${dim.key}_${qi}`] || 5;
            return (
              <div key={qi}>
                <p className="text-sm text-slate-700 mb-3">{q}</p>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 w-4">1</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={val}
                    onChange={e => handleSliderChange(dim.key, qi, e.target.value)}
                    className="flex-1 h-2 accent-blue-600"
                    style={{ accentColor: dim.color }}
                  />
                  <span className="text-xs text-slate-400 w-4">10</span>
                  <span className="text-sm font-semibold w-8 text-center" style={{ color: dim.color }}>{val}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={() => currentDimension > 0 ? setCurrentDimension(currentDimension - 1) : setIsCheckinOpen(false)}
            className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            {currentDimension > 0 ? 'Back' : 'Cancel'}
          </button>
          {currentDimension < dimensions.length - 1 ? (
            <button
              onClick={() => setCurrentDimension(currentDimension + 1)}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={submitCheckin}
              disabled={!allAnswered}
              className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-1"
            >
              <Check className="w-4 h-4" /> Submit
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">PERMA-V Wellness</h3>
        <button
          onClick={() => setIsCheckinOpen(true)}
          className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          New Check-in
        </button>
      </div>

      {latest ? (
        <>
          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-blue-600">{latest.overall}</div>
            <div className="text-sm text-slate-500">
              Flourishing Score
              {latest.date && (
                <span className="ml-2 text-xs">
                  ({new Date(latest.date).toLocaleDateString()})
                </span>
              )}
            </div>
          </div>

          <div className="h-64">
            <Radar data={radarData} options={radarOptions} />
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            {dimensions.map(dim => {
              const Icon = iconMap[dim.icon] || Activity;
              return (
                <div key={dim.key} className="text-center p-2 rounded-lg" style={{ backgroundColor: dim.color + '10' }}>
                  <Icon className="w-4 h-4 mx-auto mb-1" style={{ color: dim.color }} />
                  <div className="text-sm font-semibold" style={{ color: dim.color }}>
                    {latest.scores[dim.key] || '-'}
                  </div>
                  <div className="text-xs text-slate-500 truncate">{dim.label}</div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-slate-400">
          <Smile className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No check-ins yet</p>
          <p className="text-xs mt-1">Start your first PERMA-V wellness check-in</p>
        </div>
      )}
    </div>
  );
}
