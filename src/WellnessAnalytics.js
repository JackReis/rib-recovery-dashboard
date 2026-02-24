import React, { useState, useEffect, useCallback } from 'react';
import {
  TrendingUp, TrendingDown, Minus, AlertCircle, CheckCircle,
  Utensils, Pill, Stethoscope, Activity, Calendar, BarChart2,
  Clock, Download
} from 'lucide-react';
import PermaVCheckin from './components/PermaVCheckin';
import {
  SupplementAdherenceChart,
  RecoveryTrendChart,
  MealAdherenceChart,
  WeeklyWellnessScoreChart
} from './components/WellnessCharts';

const REPORT_STORAGE_KEY = 'wellnessReportHistory';

function ScoreCard({ score, label, trend }) {
  const TrendIcon = trend === 'improving' ? TrendingUp : trend === 'declining' ? TrendingDown : Minus;
  const trendColor = trend === 'improving' ? 'text-green-500' : trend === 'declining' ? 'text-red-500' : 'text-slate-400';

  return (
    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white text-center shadow-lg">
      <p className="text-blue-200 text-sm mb-1">{label}</p>
      <p className={`text-5xl font-bold mb-2 ${score >= 7 ? 'text-white' : 'text-blue-200'}`}>
        {typeof score === 'number' ? score.toFixed(1) : score}
      </p>
      <div className="flex items-center justify-center gap-1">
        <TrendIcon className={`w-4 h-4 ${trendColor}`} />
        <span className="text-xs text-blue-200 capitalize">{trend || 'stable'}</span>
      </div>
    </div>
  );
}

function CategoryCard({ icon: Icon, title, score, max, color }) {
  const pct = max > 0 ? (score / max) * 100 : 0;
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <span className="font-medium text-slate-700 text-sm">{title}</span>
      </div>
      <div className="text-2xl font-bold text-slate-900 mb-2">{Math.round(score)}<span className="text-sm text-slate-400 font-normal">/{max}</span></div>
      <div className="w-full bg-slate-100 rounded-full h-2">
        <div
          className="h-2 rounded-full transition-all"
          style={{
            width: `${Math.min(pct, 100)}%`,
            backgroundColor: pct >= 80 ? '#10b981' : pct >= 60 ? '#f59e0b' : '#ef4444'
          }}
        />
      </div>
    </div>
  );
}

function AlertBanner({ type, items }) {
  if (!items || items.length === 0) return null;
  const isHighlight = type === 'highlight';
  return (
    <div className={`rounded-lg p-4 mb-4 ${isHighlight ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
      <div className="flex items-center gap-2 mb-2">
        {isHighlight ? <CheckCircle className="w-4 h-4 text-green-600" /> : <AlertCircle className="w-4 h-4 text-amber-600" />}
        <span className={`text-sm font-semibold ${isHighlight ? 'text-green-700' : 'text-amber-700'}`}>
          {isHighlight ? 'Highlights' : 'Areas for Attention'}
        </span>
      </div>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className={`text-sm ${isHighlight ? 'text-green-600' : 'text-amber-600'}`}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function AppointmentCard({ appointments }) {
  const upcoming = appointments?.appointments?.filter(a => a.status === 'urgent' || a.status === 'scheduled') || [];
  const toSchedule = appointments?.appointments?.filter(a => a.status === 'to_schedule') || [];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <Stethoscope className="w-5 h-5 text-blue-600" />
        Appointments
      </h3>
      {upcoming.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Upcoming</p>
          {upcoming.map((appt, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg mb-2">
              <div>
                <p className="text-sm font-medium text-slate-900">{appt.provider}</p>
                <p className="text-xs text-slate-500">{appt.specialty}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-600 font-medium">{appt.date}</p>
                {appt.time && <p className="text-xs text-slate-500">{appt.time}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
      {toSchedule.length > 0 && (
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Needs Scheduling ({toSchedule.length})</p>
          {toSchedule.map((appt, i) => (
            <div key={i} className="flex items-center justify-between p-2 border-l-2 border-amber-400 pl-3 mb-2">
              <div>
                <p className="text-sm text-slate-700">{appt.specialty}</p>
                <p className="text-xs text-slate-500">{appt.provider}</p>
              </div>
              {appt.phone && <span className="text-xs text-blue-600">{appt.phone}</span>}
            </div>
          ))}
        </div>
      )}
      {upcoming.length === 0 && toSchedule.length === 0 && (
        <p className="text-sm text-slate-400 text-center py-4">No appointment data available</p>
      )}
    </div>
  );
}

export default function WellnessAnalytics() {
  const [wellnessData, setWellnessData] = useState(null);
  const [supplementData, setSupplementData] = useState(null);
  const [mealData, setMealData] = useState(null);
  const [recoveryData, setRecoveryData] = useState(null);
  const [appointmentData, setAppointmentData] = useState(null);
  const [activeTab, setActiveTab] = useState('trends');
  const [permaVScores, setPermaVScores] = useState(null);
  const [loading, setLoading] = useState(true);

  const [permaVHistory, setPermaVHistory] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const files = [
          { url: '/api/wellness.json', setter: setWellnessData },
          { url: '/api/supplement-tracking.json', setter: setSupplementData },
          { url: '/api/meal-adherence.json', setter: setMealData },
          { url: '/api/recovery-progress.json', setter: setRecoveryData },
          { url: '/api/appointments.json', setter: setAppointmentData },
          { url: '/api/perma-v-history.json', setter: setPermaVHistory }
        ];
        await Promise.all(files.map(async ({ url, setter }) => {
          try {
            const res = await fetch(url);
            if (res.ok) setter(await res.json());
          } catch { /* data not available, use defaults */ }
        }));
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handlePermaVUpdate = useCallback((scores) => {
    setPermaVScores(scores);
  }, []);

  const generateReport = () => {
    const report = {
      date: new Date().toISOString(),
      wellness: wellnessData?.summary,
      supplements: supplementData,
      meals: mealData,
      recovery: recoveryData,
      appointments: appointmentData,
      permaV: permaVScores
    };
    const history = JSON.parse(localStorage.getItem(REPORT_STORAGE_KEY) || '[]');
    history.push(report);
    localStorage.setItem(REPORT_STORAGE_KEY, JSON.stringify(history));

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wellness-report-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const summary = wellnessData?.summary || {};
  const permaV = wellnessData?.perma_v_wellness || {};
  const overallScore = permaVScores?.overall || permaV.overall_score || summary.overall_wellness_score || 0;
  const overallTrend = permaV.trend || 'stable';

  const highlights = [];
  const concerns = [];

  if ((summary.supplement_adherence || 0) >= 80) highlights.push('Supplement adherence on target');
  else if ((summary.supplement_adherence || 0) < 60) concerns.push('Supplement adherence needs improvement');

  if ((summary.meal_adherence || 0) >= 80) highlights.push('Meal plan compliance strong');
  else if ((summary.meal_adherence || 0) < 60) concerns.push('Meal adherence below target');

  if ((summary.recovery_progress || 0) >= 60) highlights.push('Recovery progressing well');

  const nextAppt = wellnessData?.quick_stats?.appointments?.next_appointment;
  if (nextAppt && nextAppt.days_until <= 7) concerns.push(`${nextAppt.provider} appointment in ${nextAppt.days_until} days`);

  if (appointmentData?.to_schedule_count > 2) concerns.push(`${appointmentData.to_schedule_count} appointments need scheduling`);

  const tabs = [
    { key: 'trends', label: 'Trends', icon: BarChart2 },
    { key: 'permaV', label: 'PERMA-V', icon: Activity },
    { key: 'schedule', label: 'Schedule', icon: Calendar }
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Wellness Analytics</h2>
          <p className="text-sm text-slate-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Week of {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <button
          onClick={generateReport}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Weekly Report
        </button>
      </div>

      {/* Overall Score */}
      <ScoreCard score={overallScore} label="Overall Wellness Score" trend={overallTrend} />

      {/* Category Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <CategoryCard icon={Utensils} title="Nutrition" score={summary.meal_adherence || 85} max={100} color="bg-green-600" />
        <CategoryCard icon={Activity} title="Recovery" score={summary.recovery_progress || 66} max={100} color="bg-blue-600" />
        <CategoryCard icon={Stethoscope} title="Medical" score={100 - (appointmentData?.to_schedule_count || 0) * 20} max={100} color="bg-purple-600" />
        <CategoryCard icon={Pill} title="Supplements" score={summary.supplement_adherence || 92} max={100} color="bg-amber-600" />
      </div>

      {/* Highlights & Concerns */}
      <AlertBanner type="highlight" items={highlights} />
      <AlertBanner type="concern" items={concerns} />

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.key ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'trends' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Supplement Adherence (This Week)</h3>
              <SupplementAdherenceChart supplementData={supplementData} />
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Recovery Trend</h3>
              <RecoveryTrendChart recoveryData={recoveryData} />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Meal Plan Adherence</h3>
              <MealAdherenceChart mealData={wellnessData} />
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Wellness Score Trend</h3>
              <WeeklyWellnessScoreChart wellnessData={wellnessData} permaVHistory={permaVHistory} />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'permaV' && (
        <div className="space-y-6">
          {/* Latest Assessment from API */}
          {permaV.dimensions && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Current Assessment</h3>
                  <p className="text-xs text-slate-500">
                    {permaV.last_assessed || 'Feb 12, 2026'} &bull; {permaV.status || 'thriving'}
                    {permaV.assessment_context && (
                      <span className="ml-2 text-blue-500">{permaV.assessment_context}</span>
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">{permaV.overall_score}</div>
                  <div className="text-xs text-slate-500">
                    {permaV.vs_last_week !== undefined && (
                      <span className={permaV.vs_last_week >= 0 ? 'text-green-600' : 'text-red-500'}>
                        {permaV.vs_last_week >= 0 ? '+' : ''}{permaV.vs_last_week} vs last week
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {(() => {
                  const latestAssessment = permaVHistory?.assessments?.find(a => a.date === '2026-02-12');
                  const prevAssessment = permaVHistory?.assessments?.find(a => a.date === '2026-02-05');
                  const dimColors = {
                    positive_emotion: '#f59e0b',
                    engagement: '#8b5cf6',
                    relationships: '#ef4444',
                    meaning: '#3b82f6',
                    accomplishment: '#10b981',
                    vitality: '#06b6d4'
                  };
                  const dimLabels = {
                    positive_emotion: 'P',
                    engagement: 'E',
                    relationships: 'R',
                    meaning: 'M',
                    accomplishment: 'A',
                    vitality: 'V'
                  };
                  return Object.entries(permaV.dimensions).map(([key, val]) => {
                    const prev = prevAssessment?.scores?.[key];
                    const delta = prev !== undefined ? val - prev : null;
                    const annotation = latestAssessment?.annotations?.[key];
                    const color = dimColors[key] || '#6366f1';
                    return (
                      <div key={key} className="relative group p-4 rounded-xl border border-slate-100 hover:shadow-md transition-shadow" style={{ borderLeftWidth: 3, borderLeftColor: color }}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold" style={{ color }}>{dimLabels[key]}</span>
                            <span className="text-sm text-slate-600 capitalize">{key.replace(/_/g, ' ')}</span>
                          </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-slate-900">{val}</span>
                          <span className="text-sm text-slate-400">/10</span>
                          {delta !== null && delta !== 0 && (
                            <span className={`text-sm font-semibold ${delta > 0 ? 'text-green-600' : 'text-red-500'}`}>
                              {delta > 0 ? '+' : ''}{delta.toFixed(1)}
                            </span>
                          )}
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                          <div className="h-1.5 rounded-full transition-all" style={{ width: `${val * 10}%`, backgroundColor: color }} />
                        </div>
                        {annotation && (
                          <div className="hidden group-hover:block absolute z-50 bottom-full left-0 right-0 mb-2 p-3 bg-slate-900 text-white text-xs rounded-lg shadow-xl" style={{ minWidth: 220 }}>
                            {annotation}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900" />
                          </div>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          )}

          {/* Therapy Context */}
          {(() => {
            const latestAssessment = permaVHistory?.assessments?.find(a => a.therapy_notes);
            if (!latestAssessment?.therapy_notes) return null;
            const tn = latestAssessment.therapy_notes;
            return (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6">
                <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Therapy Session Insights ({latestAssessment.date})
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-blue-700 uppercase tracking-wide mb-2">Key Themes</p>
                    <div className="space-y-2">
                      {tn.key_themes.map((theme, i) => (
                        <div key={i} className="text-sm text-slate-700 pl-3 border-l-2 border-blue-300">{theme}</div>
                      ))}
                    </div>
                  </div>
                  {tn.homework && (
                    <div className="flex items-center justify-center">
                      <div className="text-center p-4 bg-white rounded-xl border border-blue-200 shadow-sm">
                        <p className="text-xs text-blue-600 uppercase tracking-wide mb-2">Counselor Homework</p>
                        <p className="text-lg font-semibold text-slate-900 italic">"{tn.homework}"</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Assessment History */}
          {permaVHistory?.assessments && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Assessment History</h3>
              <div className="space-y-3">
                {permaVHistory.assessments.slice().sort((a, b) => b.date.localeCompare(a.date)).map((assessment, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`text-2xl font-bold ${assessment.overall >= 7 ? 'text-green-600' : assessment.overall >= 5 ? 'text-amber-600' : 'text-red-500'}`}>
                        {assessment.overall}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-900">{assessment.date}</div>
                        <div className="text-xs text-slate-500 max-w-md truncate">{assessment.context}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        assessment.method === 'therapy-informed' ? 'bg-blue-100 text-blue-700' :
                        assessment.method === 'self-reported' ? 'bg-purple-100 text-purple-700' :
                        'bg-slate-200 text-slate-600'
                      }`}>
                        {assessment.method}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        assessment.status === 'flourishing' ? 'bg-green-100 text-green-700' :
                        assessment.status === 'thriving' ? 'bg-blue-100 text-blue-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {assessment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Check-in + Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PermaVCheckin onScoresUpdate={handlePermaVUpdate} />
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Wellness Score Trend</h3>
              <WeeklyWellnessScoreChart wellnessData={wellnessData} permaVHistory={permaVHistory} />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'schedule' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AppointmentCard appointments={appointmentData} />
          <div className="space-y-4">
            {wellnessData?.today && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Today's Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-600">Pain Level</span>
                    <span className="text-sm font-semibold">{wellnessData.today.wellness_checkin?.pain_level}/10</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-600">Mobility</span>
                    <span className="text-sm font-semibold">{wellnessData.today.wellness_checkin?.mobility_score}/10</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-600">Energy</span>
                    <span className="text-sm font-semibold">{wellnessData.today.wellness_checkin?.energy_level}/10</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-600">Mood</span>
                    <span className="text-sm font-semibold capitalize">{wellnessData.today.wellness_checkin?.mood}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-600">Hydration</span>
                    <span className="text-sm font-semibold">{wellnessData.today.supplements?.hydration_oz}oz / {wellnessData.today.supplements?.hydration_target}oz</span>
                  </div>
                </div>
              </div>
            )}
            {wellnessData?.recovery_milestones && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Recovery Timeline</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Surgery</span>
                    <span className="text-slate-900">{wellnessData.recovery_milestones.surgery_date}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Procedure</span>
                    <span className="text-slate-900 text-xs">{wellnessData.recovery_milestones.procedure}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 mt-3">
                    <div className="bg-blue-600 h-3 rounded-full" style={{ width: `${wellnessData.recovery_milestones.current_progress}%` }} />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Progress: {wellnessData.recovery_milestones.current_progress}%</span>
                    <span>Next: {wellnessData.recovery_milestones.next_milestone?.description}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
