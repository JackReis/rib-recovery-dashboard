import React, { useState } from 'react';
import { Wind, Plus, TrendingUp, Calendar as CalendarIcon } from 'lucide-react';

// TODO: Fetch from wellness API endpoints
const SAMPLE_SESSIONS = [
  { id: 1, date: '2024-01-15', region: 'left-lower', duration: 8, engagement: 7 },
  { id: 2, date: '2024-01-15', region: 'posterior', duration: 10, engagement: 8 },
  { id: 3, date: '2024-01-16', region: 'left-lower', duration: 12, engagement: 9 },
  { id: 4, date: '2024-01-17', region: 'anterior', duration: 6, engagement: 5 },
  { id: 5, date: '2024-01-18', region: 'left-lower', duration: 10, engagement: 8 },
  { id: 6, date: '2024-01-18', region: 'posterior', duration: 8, engagement: 7 },
  { id: 7, date: '2024-01-19', region: 'left-lower', duration: 15, engagement: 9 },
  { id: 8, date: '2024-01-20', region: 'posterior', duration: 10, engagement: 8 },
  { id: 9, date: '2024-01-21', region: 'left-lower', duration: 12, engagement: 9 }
];

const REGIONS = [
  { value: 'left-lower', label: 'Left Lower Ribs (T6-T8)' },
  { value: 'posterior', label: 'Posterior/Back Ribs' },
  { value: 'anterior', label: 'Anterior/Front Ribs' },
  { value: 'bilateral', label: 'Bilateral' }
];

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-200 ${className}`}>
    {children}
  </div>
);

export default function BreathingTracker() {
  const [sessions, setSessions] = useState(SAMPLE_SESSIONS);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    region: 'left-lower',
    duration: 10,
    engagement: 7
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newSession = {
      id: sessions.length + 1,
      date: new Date().toISOString().split('T')[0],
      ...formData
    };
    setSessions([...sessions, newSession]);
    setShowForm(false);
    setFormData({ region: 'left-lower', duration: 10, engagement: 7 });
  };

  const getWeekDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dates.push(date);
    }
    return dates;
  };

  const getSessionsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return sessions.filter(s => s.date === dateStr);
  };

  const getDayIntensity = (date) => {
    const daySessions = getSessionsForDate(date);
    if (daySessions.length === 0) return 0;
    const totalEngagement = daySessions.reduce((sum, s) => sum + s.engagement, 0);
    return Math.round(totalEngagement / daySessions.length);
  };

  const getIntensityColor = (intensity) => {
    if (intensity === 0) return 'bg-slate-100';
    if (intensity <= 3) return 'bg-blue-200';
    if (intensity <= 6) return 'bg-blue-400';
    if (intensity <= 8) return 'bg-blue-600';
    return 'bg-blue-800';
  };

  const weekDates = getWeekDates();

  const getLast7DaysStats = () => {
    const last7Days = sessions.filter(s => {
      const sessionDate = new Date(s.date);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return sessionDate >= sevenDaysAgo;
    });

    return {
      totalSessions: last7Days.length,
      avgDuration: last7Days.length > 0 
        ? Math.round(last7Days.reduce((sum, s) => sum + s.duration, 0) / last7Days.length)
        : 0,
      avgEngagement: last7Days.length > 0
        ? (last7Days.reduce((sum, s) => sum + s.engagement, 0) / last7Days.length).toFixed(1)
        : 0
    };
  };

  const getDailyTrends = () => {
    const trends = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const daySessions = sessions.filter(s => s.date === dateStr);
      const count = daySessions.length;
      const avgEngagement = count > 0
        ? daySessions.reduce((sum, s) => sum + s.engagement, 0) / count
        : 0;
      trends.push({
        date: dateStr,
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        count,
        avgEngagement
      });
    }
    return trends;
  };

  const stats = getLast7DaysStats();
  const trends = getDailyTrends();
  const maxCount = Math.max(...trends.map(t => t.count), 1);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-600 text-white rounded-lg">
              <Wind size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Breathing Session Tracker</h2>
              <p className="text-slate-600 text-sm mt-1">Monitor diaphragmatic breathing practice for rib stability</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus size={18} />
            <span>Log Session</span>
          </button>
        </div>
      </div>

      {/* Session Logger Form */}
      {showForm && (
        <Card className="p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">New Breathing Session</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Target Region
              </label>
              <select
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {REGIONS.map(region => (
                  <option key={region.value} value={region.value}>
                    {region.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Duration (minutes): {formData.duration}
              </label>
              <input
                type="range"
                min="3"
                max="30"
                step="1"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>3 min</span>
                <span>30 min</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Engagement Score (0-10): {formData.engagement}
              </label>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={formData.engagement}
                onChange={(e) => setFormData({ ...formData, engagement: parseInt(e.target.value) })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>Poor</span>
                <span>Excellent</span>
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="submit"
                className="flex-1 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Session
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">
            Sessions (7 days)
          </div>
          <div className="text-3xl font-bold text-slate-900">{stats.totalSessions}</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">
            Avg Duration
          </div>
          <div className="text-3xl font-bold text-slate-900">{stats.avgDuration} <span className="text-lg text-slate-500">min</span></div>
        </Card>
        <Card className="p-6">
          <div className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">
            Avg Engagement
          </div>
          <div className="text-3xl font-bold text-slate-900">{stats.avgEngagement} <span className="text-lg text-slate-500">/ 10</span></div>
        </Card>
      </div>

      {/* Weekly Calendar Heatmap */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-6">
          <CalendarIcon size={20} className="text-slate-600" />
          <h3 className="text-lg font-bold text-slate-900">Weekly Activity</h3>
        </div>
        <div className="grid grid-cols-7 gap-3">
          {weekDates.map((date, idx) => {
            const daySessions = getSessionsForDate(date);
            const intensity = getDayIntensity(date);
            const isToday = date.toDateString() === new Date().toDateString();
            
            return (
              <div key={idx} className="flex flex-col items-center">
                <div className="text-xs font-medium text-slate-500 mb-2">
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div
                  className={`w-full aspect-square rounded-lg ${getIntensityColor(intensity)} ${
                    isToday ? 'ring-2 ring-blue-600 ring-offset-2' : ''
                  } flex items-center justify-center transition-all hover:scale-105 cursor-pointer relative group`}
                  title={`${date.toLocaleDateString()}: ${daySessions.length} session(s)`}
                >
                  <span className="text-xs font-bold text-slate-700">
                    {daySessions.length > 0 ? daySessions.length : ''}
                  </span>
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    {daySessions.length} session{daySessions.length !== 1 ? 's' : ''}
                  </div>
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  {date.getDate()}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-end space-x-2 mt-6 text-xs text-slate-500">
          <span>Less</span>
          <div className="flex space-x-1">
            {[0, 3, 6, 8, 10].map(level => (
              <div
                key={level}
                className={`w-4 h-4 rounded ${getIntensityColor(level)}`}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </Card>

      {/* Trends Chart */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-6">
          <TrendingUp size={20} className="text-slate-600" />
          <h3 className="text-lg font-bold text-slate-900">7-Day Trends</h3>
        </div>

        {/* Session Count Chart */}
        <div className="mb-8">
          <h4 className="text-sm font-medium text-slate-600 mb-4">Session Count per Day</h4>
          <div className="flex items-end space-x-2 h-40">
            {trends.map((trend, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col justify-end h-32 relative group">
                  <div
                    className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600 cursor-pointer"
                    style={{ height: `${(trend.count / maxCount) * 100}%` }}
                  >
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {trend.count} session{trend.count !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-slate-500 mt-2 font-medium">{trend.day}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement Score Line Chart */}
        <div>
          <h4 className="text-sm font-medium text-slate-600 mb-4">Average Engagement Score</h4>
          <div className="relative h-32">
            <svg className="w-full h-full" viewBox="0 0 700 128" preserveAspectRatio="none">
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              
              {/* Grid lines */}
              {[0, 2.5, 5, 7.5, 10].map((val, idx) => (
                <line
                  key={idx}
                  x1="0"
                  y1={128 - (val / 10) * 128}
                  x2="700"
                  y2={128 - (val / 10) * 128}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                />
              ))}

              {/* Area under line */}
              <path
                d={`M 0 128 ${trends.map((t, i) => {
                  const x = (i / (trends.length - 1)) * 700;
                  const y = 128 - (t.avgEngagement / 10) * 128;
                  return `L ${x} ${y}`;
                }).join(' ')} L 700 128 Z`}
                fill="url(#gradient)"
              />

              {/* Line */}
              <polyline
                points={trends.map((t, i) => {
                  const x = (i / (trends.length - 1)) * 700;
                  const y = 128 - (t.avgEngagement / 10) * 128;
                  return `${x},${y}`;
                }).join(' ')}
                fill="none"
                stroke="rgb(59, 130, 246)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {trends.map((t, i) => {
                const x = (i / (trends.length - 1)) * 700;
                const y = 128 - (t.avgEngagement / 10) * 128;
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="white"
                    stroke="rgb(59, 130, 246)"
                    strokeWidth="2"
                  />
                );
              })}
            </svg>
            
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-slate-400 -ml-6">
              <span>10</span>
              <span>5</span>
              <span>0</span>
            </div>
          </div>
          
          {/* X-axis labels */}
          <div className="flex justify-between mt-2">
            {trends.map((trend, idx) => (
              <div key={idx} className="text-xs text-slate-500 font-medium">
                {trend.day}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Practice Tips */}
      <Card className="p-6 bg-blue-50 border-blue-100">
        <h3 className="text-sm font-bold text-blue-900 mb-3 uppercase tracking-wider">
          Breathing Practice Tips
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Focus on posterior rib expansion to reduce anterior instability</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Practice 3-5 minute sessions multiple times daily for best results</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Track engagement score honestly - it guides progression timing</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Stop if sharp pain occurs; dull muscle fatigue is normal adaptation</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}
