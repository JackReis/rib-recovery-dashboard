import React, { useState, useEffect } from 'react';
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  Stethoscope,
  Target,
  MessageCircle,
  Users,
  Activity,
  Save,
  Clock,
  CheckCircle
} from 'lucide-react';
import sessionsData from './data/pt-sessions.json';

const SeverityBadge = ({ severity }) => {
  const colors = {
    critical: "bg-red-100 text-red-700 border-red-200",
    high: "bg-orange-100 text-orange-700 border-orange-200",
    moderate: "bg-yellow-100 text-yellow-700 border-yellow-200"
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase border ${colors[severity]}`}>
      {severity}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    upcoming: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-slate-100 text-slate-500"
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${styles[status] || styles.upcoming}`}>
      {status}
    </span>
  );
};

const Section = ({ title, icon: Icon, children, defaultOpen = false, color = "blue" }) => {
  const [open, setOpen] = useState(defaultOpen);
  const colorMap = {
    blue: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-900", icon: "text-blue-600" },
    red: { bg: "bg-red-50", border: "border-red-200", text: "text-red-900", icon: "text-red-600" },
    green: { bg: "bg-green-50", border: "border-green-200", text: "text-green-900", icon: "text-green-600" },
    purple: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-900", icon: "text-purple-600" },
    amber: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-900", icon: "text-amber-600" },
    slate: { bg: "bg-slate-50", border: "border-slate-200", text: "text-slate-900", icon: "text-slate-600" }
  };
  const c = colorMap[color];

  return (
    <div className={`rounded-xl border ${c.border} overflow-hidden`}>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between p-4 ${c.bg} hover:brightness-95 transition-all`}
      >
        <div className="flex items-center space-x-3">
          <Icon className={c.icon} size={20} />
          <h3 className={`font-bold ${c.text}`}>{title}</h3>
        </div>
        {open ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronRight size={18} className="text-slate-400" />}
      </button>
      {open && <div className="p-5 bg-white">{children}</div>}
    </div>
  );
};

export default function PTSessionPlan() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [sessionNotes, setSessionNotes] = useState({});
  const [noteText, setNoteText] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);

  // Load saved notes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('pt-session-notes');
    if (saved) {
      setSessionNotes(JSON.parse(saved));
    }
  }, []);

  // Set initial note text when session changes
  useEffect(() => {
    const session = sessionsData[selectedIndex];
    if (session) {
      setNoteText(sessionNotes[session.id] || session.notes || '');
      setNoteSaved(false);
    }
  }, [selectedIndex, sessionNotes]);

  const saveNotes = () => {
    const session = sessionsData[selectedIndex];
    const updated = { ...sessionNotes, [session.id]: noteText };
    setSessionNotes(updated);
    localStorage.setItem('pt-session-notes', JSON.stringify(updated));
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  const s = sessionsData[selectedIndex];
  if (!s) return <div className="p-8 text-slate-500">No sessions found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-8 space-y-6">
      {/* Session Selector (only show if multiple sessions) */}
      {sessionsData.length > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200 p-3">
          <button
            onClick={() => setSelectedIndex(Math.max(0, selectedIndex - 1))}
            disabled={selectedIndex === 0}
            className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            {sessionsData.map((session, i) => (
              <button
                key={session.id}
                onClick={() => setSelectedIndex(i)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  i === selectedIndex
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                {session.date}
              </button>
            ))}
          </div>
          <button
            onClick={() => setSelectedIndex(Math.min(sessionsData.length - 1, selectedIndex + 1))}
            disabled={selectedIndex === sessionsData.length - 1}
            className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <p className="text-blue-200 text-sm font-medium uppercase tracking-wider">PT Session Plan</p>
              <StatusBadge status={s.status} />
            </div>
            <h1 className="text-3xl font-black mt-1">{s.provider.name}, {s.provider.credentials}</h1>
            <p className="text-blue-100 mt-2">{s.provider.organization}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{s.time}</p>
            <p className="text-blue-200">{s.date}</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-blue-500/30 flex flex-wrap gap-4 text-sm text-blue-100">
          <span>{s.provider.address}</span>
          <span>{s.provider.phone}</span>
        </div>
      </div>

      {/* Quick Context */}
      <Section title="Quick Context for Ryan" icon={Stethoscope} defaultOpen={true} color="blue">
        <ul className="space-y-2">
          {s.context.map((item, i) => (
            <li key={i} className="flex items-start text-sm text-slate-700">
              <ChevronRight size={14} className="mt-1 mr-2 text-blue-400 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Primary Concerns */}
      <Section title="Primary Concerns (Priority Order)" icon={Target} defaultOpen={true} color="red">
        <div className="space-y-4">
          {s.concerns.map((c) => (
            <div key={c.priority} className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
                {c.priority}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-slate-900">{c.title}</span>
                  <SeverityBadge severity={c.severity} />
                </div>
                <p className="text-sm text-slate-600 mt-1">{c.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Current Protocol */}
      <Section title="Current Daily Protocol" icon={Activity} color="green">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-800 mb-2">Morning (Critical Window)</h4>
            <ul className="space-y-1">
              {s.protocol.morning.map((item, i) => (
                <li key={i} className="flex items-start text-sm text-slate-700">
                  <span className="text-green-500 mr-2 mt-0.5">-</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-green-50 p-3 rounded-lg text-sm">
            <p><strong>Supplements:</strong> {s.protocol.supplements}</p>
            <p className="mt-1"><strong>Restrictions:</strong> {s.protocol.restrictions}</p>
          </div>
        </div>
      </Section>

      {/* Phase 1 Exercises */}
      <Section title="Phase 1 Exercises (Current)" icon={Activity} color="purple">
        <div className="space-y-3">
          {s.exercises.map((ex, i) => (
            <div key={i} className="p-3 rounded-lg border border-slate-100 hover:border-purple-200 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <span className="text-purple-600 font-bold mr-3 mt-0.5">{i + 1}.</span>
                  <div>
                    <span className="font-semibold text-slate-900">{ex.name}</span>
                    <p className="text-sm text-slate-500 mt-0.5">{ex.detail}</p>
                  </div>
                </div>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded font-medium whitespace-nowrap ml-2">{ex.sets}</span>
              </div>
            </div>
          ))}
          <div className="bg-purple-50 p-3 rounded-lg text-sm text-purple-800">
            <strong>Phase 1 rules:</strong> NO spinal rotation. Isolate hip from rib movement. Stability over mobility.
          </div>
        </div>
      </Section>

      {/* Questions for Ryan */}
      <Section title="Questions for Ryan" icon={MessageCircle} defaultOpen={true} color="amber">
        <ol className="space-y-3">
          {s.questions.map((q, i) => (
            <li key={i} className="flex items-start text-sm">
              <span className="bg-amber-100 text-amber-700 font-bold w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 mr-3 mt-0.5">
                {i + 1}
              </span>
              <span className="text-slate-700">{q}</span>
            </li>
          ))}
        </ol>
      </Section>

      {/* Red Flags */}
      <Section title="Red Flags (Stop Activity If)" icon={AlertTriangle} color="red">
        <div className="space-y-2">
          {s.redFlags.map((rf, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-red-50 border border-red-100">
              <span className="text-sm text-slate-700">{rf.symptom}</span>
              <span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-1 rounded">{rf.action}</span>
            </div>
          ))}
          <div className="mt-4 p-4 bg-slate-900 text-white rounded-lg">
            <h4 className="font-bold text-amber-400 mb-1">Decompression Reset</h4>
            <p className="text-sm text-slate-300">{s.decompressionReset}</p>
          </div>
        </div>
      </Section>

      {/* Session Notes (persistent) */}
      <Section title="Session Notes" icon={Clock} defaultOpen={s.status === 'upcoming'} color="slate">
        <div className="space-y-3">
          <textarea
            value={noteText}
            onChange={(e) => { setNoteText(e.target.value); setNoteSaved(false); }}
            placeholder="Add notes during or after the session... Ryan's recommendations, new exercises prescribed, follow-up items, etc."
            className="w-full h-32 p-3 rounded-lg border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-y"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {sessionNotes[s.id] ? 'Last saved to browser storage' : 'Not yet saved'}
            </span>
            <button
              onClick={saveNotes}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                noteSaved
                  ? 'bg-green-100 text-green-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {noteSaved ? <CheckCircle size={16} /> : <Save size={16} />}
              {noteSaved ? 'Saved' : 'Save Notes'}
            </button>
          </div>
        </div>
      </Section>

      {/* Care Team */}
      <Section title="Care Team" icon={Users} color="slate">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {s.careTeam.map((member, i) => (
            <div key={i} className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{member.role}</p>
              <p className="font-semibold text-slate-900 mt-1">{member.name}</p>
              {member.org && <p className="text-sm text-slate-600">{member.org}</p>}
              {member.phone && <p className="text-sm text-blue-600">{member.phone}</p>}
              {member.note && <p className="text-sm text-slate-500 italic">{member.note}</p>}
            </div>
          ))}
        </div>
      </Section>

      {/* Print footer */}
      <div className="text-center text-xs text-slate-400 pt-4 border-t border-slate-100 print:block">
        Prepared {s.date} | Month 16/24 (67% through recovery window) | Critical Remodeling Phase
      </div>
    </div>
  );
}
