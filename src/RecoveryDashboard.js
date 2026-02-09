import React, { useState, useEffect } from 'react';
import ClinicalProtocols from './components/ClinicalProtocols';
import {
  BookOpen,
  Activity,
  Calendar,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  Info,
  Shield,
  Coffee,
  Moon,
  Footprints,
  Baby,
  Dog,
  Menu,
  X,
  Save,
  BarChart2,
  Stethoscope
} from 'lucide-react';

// --- DATA: EXTRACTED FROM UPLOADED REPORTS ---

const KNOWLEDGE_INDEX = [
  {
    category: "Pathology",
    title: "Bioabsorbable Plate Failure (PLLA/PLGA - NOT Titanium)",
    content: "The Hansen Repair plates are PLLA/PLGA polymer (Poly-L-Lactic Acid or Poly(Lactic-co-Glycolic Acid)) - NOT titanium. They degrade via hydrolysis over 18-24 months. This creates 'gravel-like' debris and instability before biological fusion completes. Hydration (80oz/day) controls degradation rate."
  },
  {
    category: "Pathology",
    title: "The 'Instability Gap'",
    content: "The dangerous interval where hardware has failed but biological fibrosis (scar tissue) isn't strong enough yet. The goal of rehab is to bridge this gap with 'Active Muscular Stabilization'."
  },
  {
    category: "Anatomy",
    title: "Spiral Line Dysfunction",
    content: "A fascial chain connecting the Skull -> Left Scapula -> Right Hip -> Right Foot. Your 'Rigid Right Foot' (5th metatarsal screw) blocks rotation, forcing the Left Ribs to take the shear force, worsening instability."
  },
  {
    category: "Anatomy",
    title: "SICK Scapula & Rib 10",
    content: "The scapula has lost its stable platform due to the Rib 10 fracture/instability. It tilts forward (Pec Minor dominance), causing shoulder pain. Treat the ribs to fix the shoulder."
  },
  {
    category: "Protocol",
    title: "The Decompression Reset",
    content: "The safe way to fix a slip. DO NOT push the rib back. 1. Lie on Right side. 2. Reach Left arm over head (open the bucket handle). 3. Deep breath into Left flank. 4. Gravity + Breath pops it back in."
  },
  {
    category: "Ergonomics",
    title: "Baby Biomechanics",
    content: "Lifting the baby creates massive torque. USE THE STEP-UP STRATEGY: Place a step stool by the crib. Step up before lifting to reduce the lever arm. Engage Lats before lifting."
  },
  {
    category: "Ergonomics",
    title: "Canine Kinetics",
    content: "Dog walking is a risk. USE A WAIST BELT LEASH. This moves force from the unstable shoulder/ribs to the stable pelvis (center of gravity)."
  },
  {
    category: "Science",
    title: "Collagen Synthesis Requirements",
    content: "Vitamin C is the rate-limiting cofactor for collagen cross-linking. Morning dosing optimizes synthesis when collagen production peaks. Buffered Vitamin C (sodium ascorbate, pH ~7.0) preferred over ascorbic acid (pH ~2.5) to avoid adding to acidic microenvironment from PLLA degradation."
  },
  {
    category: "Science",
    title: "Bucket-Handle Mechanics (Altered)",
    content: "Normal: Lower ribs (7-10) elevate laterally ~30% during inspiration. Post-Hansen: Motion restricted 10-20% by sutures. Result: Increased upper rib (pump-handle) mechanics causing accessory muscle overuse. Timeline: 50-70% range at months 12-18, 80-90% by month 24."
  },
  {
    category: "Timeline",
    title: "Recovery Phases (24-Month Window)",
    content: "Months 0-6: Protection (0-30% range). Months 6-12: Early Mobilization (30-50% range). Months 12-18: CURRENT Remodeling Phase (50-70% range). Months 18-24: Integration (80-90% range). Post-24: Full biological fusion expected."
  },
  {
    category: "Metrics",
    title: "Pectoral Engagement Score",
    content: "THE KEY recovery indicator. 0 = Cannot engage at all. 5 = Some engagement with compensation. 10 = Normal engagement without guarding. Track daily. Goal: Score >6 for 7 consecutive days before progression."
  }
];

const MORNING_ROUTINE = [
  {
    id: "m1",
    title: "The Collagen Window",
    desc: "Take 15g Collagen + 500mg Vit C + 20oz Water immediately upon waking.",
    why: "Loads blood with repair nutrients before movement."
  },
  {
    id: "m2",
    title: "Diaphragmatic Reset",
    desc: "Lie back down for 10 mins. Breathe into back ribs.",
    why: "Hydrates discs and allows collagen absorption."
  },
  {
    id: "m3",
    title: "The Log Roll",
    desc: "Knees bent, roll as a unit to side. Use pillow splint to push up.",
    why: "Prevents torsional shear on the failing plates."
  },
  {
    id: "m4",
    title: "Kitchen Counter: Peroneal Release",
    desc: "Sit. Gua Sha/Rub outer calf (Right leg).",
    why: "Releases the 'anchor' of the Spiral Line."
  },
  {
    id: "m5",
    title: "Kitchen Counter: Hip Extension",
    desc: "Standing at counter, extend leg back, tuck tailbone.",
    why: "Releases Psoas to stop anterior rib flare."
  }
];

const REHAB_PHASE_1 = [
  {
    id: "e1",
    name: "Transverse Abdominis Activation",
    sets: "3 sets x 10 reps (5s hold)",
    cue: "Draw belly button to spine without breath-holding. Keep ribs heavy - no flare."
  },
  {
    id: "e2",
    name: "Modified Crocodile Breathing",
    sets: "3-5 minutes daily",
    cue: "Prone with towel under RIGHT foot. Inhale into posterior ribs, exhale with right foot dorsiflexion."
  },
  {
    id: "e3",
    name: "Heel Slides with Breathing",
    sets: "10 reps per leg",
    cue: "Inhale: slide heel away. Exhale: slide back. Keep low back neutral."
  },
  {
    id: "e4",
    name: "Quadratus Lumborum Release",
    sets: "2 minutes per side",
    cue: "Side-lying foam roll from left hip to ribs. Stop at 3-4/10 stretch. AVOID L1-L2 pressure."
  },
  {
    id: "e5",
    name: "Standing Weight Shift",
    sets: "5 seconds each side x 10",
    cue: "Shift 70/30 initially. Progress to 90/10 when stable. Isolate hip from rib movement."
  },
  {
    id: "e6",
    name: "Wall Angels (Modified)",
    sets: "2 sets x 8-10 reps",
    cue: "Arms at 90° goal. Slide up/down maintaining contact. Stop before compensation."
  },
  {
    id: "e7",
    name: "Wall Sits",
    sets: "3-5 reps x 10-30 seconds",
    cue: "Back flat against wall. 45° knee bend max. No spinal loading."
  },
  {
    id: "e8",
    name: "Clamshells",
    sets: "2 sets x 15 reps each side",
    cue: "Side-lying, knees bent 90°. Lift top knee without rotating pelvis."
  },
  {
    id: "e9",
    name: "Mini Glute Bridges",
    sets: "2 sets x 10 reps",
    cue: "Minimal range (2-3 inches). No back arch. Hold 3 seconds."
  },
  {
    id: "e10",
    name: "Wood Chops (ADVANCED - Only if cleared)",
    sets: "2 sets x 10 each direction",
    cue: "3-5 lb band only. Limit rotation to 45°. REQUIRES pectoral engagement >7."
  }
];

const ABSOLUTE_CONTRAINDICATIONS = [
  "Spinal rotation/twisting",
  "Overhead pressing movements",
  "Back extensions",
  "Sit-ups or crunches",
  "High-impact activities (running, jumping)",
  "Breath-holding during exertion"
];

const RED_FLAGS = [
  { symptom: "Sharp, electrical, or shooting pain", action: "STOP IMMEDIATELY" },
  { symptom: "Feeling of rib 'slipping out'", action: "STOP & Use Decompression Reset" },
  { symptom: "Breathlessness beyond normal exertion", action: "STOP & Rest" },
  { symptom: "Numbness/tingling in chest/back", action: "STOP & Seek Medical Attention" },
  { symptom: "Clicking/popping sensations in ribs", action: "STOP & Document Location" }
];

const SUPPLEMENT_PROTOCOL = {
  morning: [
    "15g Collagen powder (FORTIGEL® or FORTIBONE® preferred)",
    "500mg Vitamin C (buffered/sodium ascorbate preferred)",
    "20oz water minimum"
  ],
  evening: [
    "500mg Vitamin C (second dose)",
    "400mg Magnesium (glycinate preferred)",
    "Optional: 10g additional collagen if tolerated"
  ],
  daily: "Minimum 80oz water throughout day (controls PLLA/PLGA degradation rate)"
};

// --- COMPONENTS ---

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-200 ${className}`}>
    {children}
  </div>
);

const ProgressBar = ({ value, max, color = "bg-blue-600" }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${percentage}%` }} />
    </div>
  );
};

const TabButton = ({ active, label, icon: Icon, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all ${
      active
        ? "bg-slate-900 text-white shadow-md"
        : "text-slate-600 hover:bg-slate-100"
    }`}
  >
    <Icon size={18} />
    <span className="font-medium">{label}</span>
  </button>
);

// --- MAIN APP COMPONENT ---

export default function RecoveryDashboard({ onNavigate }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Tracker State
  const [painLevel, setPainLevel] = useState(4);
  const [instabilityEvents, setInstabilityEvents] = useState(0);
  const [morningChecks, setMorningChecks] = useState({});
  const [rehabChecks, setRehabChecks] = useState({});
  const [history, setHistory] = useState([]);

  // Calculate Progress
  const morningProgress = (Object.keys(morningChecks).filter(k => morningChecks[k]).length / MORNING_ROUTINE.length) * 100;
  const rehabProgress = (Object.keys(rehabChecks).filter(k => rehabChecks[k]).length / REHAB_PHASE_1.length) * 100;

  const handleSaveDay = () => {
    const newEntry = {
      date: new Date().toLocaleDateString(),
      pain: painLevel,
      instability: instabilityEvents,
      adherence: (morningProgress + rehabProgress) / 2
    };
    setHistory([newEntry, ...history]);
    // Reset for next day (simulated)
    alert("Daily Log Saved! Progress tracked.");
    setMorningChecks({});
    setRehabChecks({});
    setInstabilityEvents(0);
  };

  const renderContent = () => {
    switch(activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Status Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-white border-blue-100">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-semibold text-blue-900 uppercase tracking-wider">Current Phase</h3>
                    <p className="text-2xl font-bold text-slate-900 mt-1">Phase 1: Isolation</p>
                    <p className="text-sm text-slate-500 mt-2">Week 1-4 • Neuromuscular Corset</p>
                  </div>
                  <Shield className="text-blue-500 h-8 w-8" />
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Daily Adherence</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">Morning Protocol</span>
                      <span>{Math.round(morningProgress)}%</span>
                    </div>
                    <ProgressBar value={morningProgress} max={100} color="bg-emerald-500" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">Rehab Exercises</span>
                      <span>{Math.round(rehabProgress)}%</span>
                    </div>
                    <ProgressBar value={rehabProgress} max={100} color="bg-indigo-500" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-blue-100 bg-blue-50/50">
                <div className="flex items-center space-x-2 text-blue-700 mb-2">
                  <Info size={18} />
                  <span className="font-bold">Month 16 / 24 — Remodeling Phase</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Critical <strong>collagen remodeling window</strong> (months 12-18). Plates degrading as expected — biological fusion forming. Focus: <strong>release guarding patterns</strong> before they become permanent.
                </p>
              </Card>
            </div>

            {/* PT Session Banner */}
            <button
              onClick={() => onNavigate && onNavigate('pt-session')}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl p-5 shadow-lg hover:shadow-xl transition-all text-left group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Stethoscope size={24} />
                  </div>
                  <div>
                    <p className="text-blue-200 text-xs font-medium uppercase tracking-wider">Today's Appointment</p>
                    <p className="text-xl font-bold mt-0.5">PT with Ryan, DPT — 5:00 PM</p>
                    <p className="text-blue-200 text-sm mt-1">Physical Therapy Central • Pectoral engagement, SICK scapula, guarding patterns</p>
                  </div>
                </div>
                <ChevronRight size={24} className="text-blue-300 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 text-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <Activity className="mr-2" /> Daily Tracker
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="text-sm text-slate-300 block mb-2">Pain Level (0-10)</label>
                    <input
                      type="range"
                      min="0" max="10"
                      value={painLevel}
                      onChange={(e) => setPainLevel(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                      <span>No Pain</span>
                      <span className="text-white font-bold text-lg">{painLevel}</span>
                      <span>Severe</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-slate-300 block mb-2">Instability Events (Slips/Clicks)</label>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setInstabilityEvents(Math.max(0, instabilityEvents - 1))}
                        className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700"
                      >-</button>
                      <span className="text-2xl font-bold">{instabilityEvents}</span>
                      <button
                        onClick={() => setInstabilityEvents(instabilityEvents + 1)}
                        className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-500"
                      >+</button>
                    </div>
                  </div>

                  <button
                    onClick={handleSaveDay}
                    className="w-full py-3 bg-white text-slate-900 font-bold rounded-lg hover:bg-slate-200 transition-colors flex justify-center items-center"
                  >
                    <Save size={18} className="mr-2" /> Log Day
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-slate-800">Quick Access Guides</h3>
                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={() => setActiveTab("index")}
                    className="p-4 bg-white border border-slate-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all text-left flex items-center"
                  >
                    <div className="p-2 bg-rose-100 text-rose-600 rounded-md mr-3"><AlertTriangle size={20} /></div>
                    <div>
                      <span className="font-bold block text-slate-800">Emergency Reset</span>
                      <span className="text-xs text-slate-500">Decompression Protocol for Rib Slips</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab("morning")}
                    className="p-4 bg-white border border-slate-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all text-left flex items-center"
                  >
                    <div className="p-2 bg-orange-100 text-orange-600 rounded-md mr-3"><Coffee size={20} /></div>
                    <div>
                      <span className="font-bold block text-slate-800">Morning Protocol</span>
                      <span className="text-xs text-slate-500">Safe wake-up routine</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab("index")}
                    className="p-4 bg-white border border-slate-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all text-left flex items-center"
                  >
                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-md mr-3"><Baby size={20} /></div>
                    <div>
                      <span className="font-bold block text-slate-800">Parenting Ergonomics</span>
                      <span className="text-xs text-slate-500">Crib & Baby lifting mechanics</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case "morning":
        return (
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-lg">
              <h2 className="text-2xl font-bold text-orange-900 mb-2">Morning Protocol</h2>
              <p className="text-orange-800">
                The most dangerous time for your rib repair is immediately upon waking due to spinal disc hydration and stiffness.
                Follow this strictly to protect the Hansen plates.
              </p>
            </div>

            <div className="space-y-4">
              {MORNING_ROUTINE.map((item) => (
                <div
                  key={item.id}
                  className={`relative p-5 rounded-xl border-2 transition-all ${
                    morningChecks[item.id]
                      ? "bg-emerald-50 border-emerald-200"
                      : "bg-white border-slate-100 hover:border-blue-200"
                  }`}
                >
                  <div className="flex items-start">
                    <button
                      onClick={() => setMorningChecks({...morningChecks, [item.id]: !morningChecks[item.id]})}
                      className={`mt-1 min-w-[24px] h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        morningChecks[item.id]
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "border-slate-300 text-transparent hover:border-emerald-400"
                      }`}
                    >
                      <CheckCircle size={14} fill="currentColor" />
                    </button>
                    <div className="ml-4">
                      <h3 className={`text-lg font-bold ${morningChecks[item.id] ? "text-emerald-900 line-through" : "text-slate-900"}`}>
                        {item.title}
                      </h3>
                      <p className="text-slate-600 mt-1">{item.desc}</p>
                      <div className="mt-3 flex items-center text-xs font-medium text-blue-600 bg-blue-50 inline-block px-2 py-1 rounded">
                        <Info size={12} className="mr-1" />
                        Rationale: {item.why}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "plan":
        return (
          <div className="space-y-6">
             <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-r-lg">
              <h2 className="text-2xl font-bold text-indigo-900 mb-2">Phase 1: Neuromuscular Isolation</h2>
              <p className="text-indigo-800">
                Weeks 1-4. The goal is to create a "Corset" using the Transverse Abdominis.
                <strong> DO NOT rotate the spine.</strong> Isolate the hip movement from the rib movement.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {REHAB_PHASE_1.map((ex) => (
                <Card key={ex.id} className="p-6 relative overflow-hidden group hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">
                      Core / Rib Stability
                    </div>
                    <button
                      onClick={() => setRehabChecks({...rehabChecks, [ex.id]: !rehabChecks[ex.id]})}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        rehabChecks[ex.id] ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-300"
                      }`}
                    >
                      <CheckCircle size={18} />
                    </button>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{ex.name}</h3>
                  <div className="flex items-center text-slate-500 text-sm mb-4">
                    <Activity size={14} className="mr-1" />
                    {ex.sets}
                  </div>
                  <div className="bg-yellow-50 text-yellow-800 text-sm p-3 rounded-lg border border-yellow-100 italic">
                    "Cue: {ex.cue}"
                  </div>
                </Card>
              ))}
            </div>

            <div className="mt-8 bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-4">Rehab Principles</h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start">
                  <ChevronRight size={16} className="mt-1 mr-2 text-blue-500 shrink-0" />
                  <span><strong>Good Pain:</strong> Dull, aching soreness in muscles (adaptation). Keep going.</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight size={16} className="mt-1 mr-2 text-blue-500 shrink-0" />
                  <span><strong>Bad Pain:</strong> Sharp, electrical, or shooting pain. STOP immediately.</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight size={16} className="mt-1 mr-2 text-blue-500 shrink-0" />
                  <span><strong>The 10th Rib Rule:</strong> Always keep the rib cage "stacked" over the pelvis. No side bending.</span>
                </li>
              </ul>
            </div>
          </div>
        );

      case "index":
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Knowledge Index</h2>
              <p className="text-slate-500">Interactive glossary of your specific pathology and protocols.</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {KNOWLEDGE_INDEX.map((item, idx) => (
                <details key={idx} className="group bg-white rounded-xl shadow-sm border border-slate-200 open:ring-2 open:ring-blue-100">
                  <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide ${
                        item.category === 'Pathology' ? 'bg-red-100 text-red-700' :
                        item.category === 'Anatomy' ? 'bg-purple-100 text-purple-700' :
                        item.category === 'Protocol' ? 'bg-green-100 text-green-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {item.category}
                      </span>
                      <span className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </span>
                    </div>
                    <ChevronDown className="text-slate-400 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="px-5 pb-5 pt-0 text-slate-600 leading-relaxed border-t border-slate-100 mt-2 pt-4">
                    {item.content}
                  </div>
                </details>
              ))}
            </div>
          </div>
        );

      case "clinical":
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ClinicalProtocols />
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 h-screen fixed">
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center">
            <Activity className="mr-2 text-blue-600" />
            RIB RECOVERY
          </h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wide">Protocol T6-T8 / Hansen</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <TabButton active={activeTab === "dashboard"} label="Dashboard" icon={BarChart2} onClick={() => setActiveTab("dashboard")} />
          <TabButton active={activeTab === "morning"} label="Morning Protocol" icon={Coffee} onClick={() => setActiveTab("morning")} />
          <TabButton active={activeTab === "plan"} label="Rehab Plan" icon={Calendar} onClick={() => setActiveTab("plan")} />
          <TabButton active={activeTab === "clinical"} label="Clinical Protocols" icon={Stethoscope} onClick={() => setActiveTab("clinical")} />
          <TabButton active={activeTab === "index"} label="The Index" icon={BookOpen} onClick={() => setActiveTab("index")} />
        </nav>
        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-500">
            <p className="font-bold text-slate-700 mb-1">Status Check</p>
            Month 16 / 24 Post-Op<br/>
            Phase 1: Remodeling
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 w-full bg-white z-50 border-b border-slate-200 px-4 py-3 flex justify-between items-center shadow-sm">
        <h1 className="font-bold text-lg flex items-center"><Activity className="mr-2 text-blue-600" /> Rib Recovery</h1>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 bg-slate-100 rounded-md">
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-white z-40 pt-20 px-6 space-y-4">
          <TabButton active={activeTab === "dashboard"} label="Dashboard" icon={BarChart2} onClick={() => { setActiveTab("dashboard"); setMobileMenuOpen(false); }} />
          <TabButton active={activeTab === "morning"} label="Morning Protocol" icon={Coffee} onClick={() => { setActiveTab("morning"); setMobileMenuOpen(false); }} />
          <TabButton active={activeTab === "plan"} label="Rehab Plan" icon={Calendar} onClick={() => { setActiveTab("plan"); setMobileMenuOpen(false); }} />
          <TabButton active={activeTab === "clinical"} label="Clinical Protocols" icon={Stethoscope} onClick={() => { setActiveTab("clinical"); setMobileMenuOpen(false); }} />
          <TabButton active={activeTab === "index"} label="The Index" icon={BookOpen} onClick={() => { setActiveTab("index"); setMobileMenuOpen(false); }} />
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8 max-w-5xl mx-auto">
        {renderContent()}
      </main>
    </div>
  );
}