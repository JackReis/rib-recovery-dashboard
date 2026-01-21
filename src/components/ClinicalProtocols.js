import React, { useState } from 'react';
import {
  Layers,
  Grid,
  Workflow,
  ChevronRight,
  ChevronDown,
  Target,
  Hand,
  Zap,
  AlertCircle,
  Clock,
  Users,
  MapPin,
  Phone,
  Award,
  BookOpen,
  Activity
} from 'lucide-react';

// --- CLINICAL DATA STRUCTURES ---

const SICK_SCAPULA_PROTOCOL = {
  pathoanatomy: {
    title: "Anterior Tethers & Posterior Blocks",
    components: [
      {
        name: "Pectoralis Minor & Clavipectoral Fascia",
        description: "Primary depressor and anterior tilter of scapula. In SICK scapula, this complex becomes functionally shortened, gluing the coracoid to the rib cage.",
        clinical_relevance: "Must be addressed before posterior work"
      },
      {
        name: "Conjoint Tendon (Coracoid Origin)",
        description: "Short Head Biceps + Coracobrachialis form a nexus of tension at coracoid tip.",
        clinical_relevance: "Source of 'C' in SICK - coracoid pain"
      },
      {
        name: "Posterior Capsule (GIRD)",
        description: "Thickened posterior capsule pushes humeral head forward, obligating scapular protraction.",
        clinical_relevance: "The 'block' that maintains dysfunction"
      }
    ]
  },
  iastm_techniques: [
    {
      id: "frame_coracoid",
      name: "Framing the Coracoid",
      target: "Pec Minor Insertion & Conjoint Tendon Origin",
      tool: "Small multi-curved instrument ('handlebar' or 'hook')",
      strokes: [
        {
          facet: "Medial (Pec Minor)",
          vector: "From rib cage superiorly toward coracoid tip",
          distance: "1-2 cm short strokes",
          goal: "Lift fascia off bone"
        },
        {
          facet: "Lateral/Inferior (Conjoint)",
          vector: "Trace contour of coracoid in deltopectoral interval",
          distance: "Following bone edge",
          goal: "Separate fascia between deltoid and pec major"
        }
      ],
      provider_rec: "Excel Therapy - Amy Thompson (ASTYM Certified)",
      caution: "Avoid neurovascular bundle - use precision tool"
    },
    {
      id: "fan_pec_minor",
      name: "Fanning the Pectoralis Minor",
      target: "Pec Minor Belly & Clavipectoral Fascia",
      tool: "Large single-beveled with convex edge ('scanner')",
      position: "Supine, arm at 90° abduction + external rotation",
      strokes: [
        {
          phase: "Sink",
          description: "Apply compression at ribs 3-5 to reach deep layer",
          pressure: "Firm, through pec major"
        },
        {
          phase: "Sweep",
          description: "Longitudinal stroke upward/lateral toward coracoid",
          integration: "Patient actively flexes/abducts during stroke"
        }
      ],
      provider_rec: "Physical Therapy Central - Ryan Fraley, DPT",
      benefit: "Restores posterior tilt capacity"
    },
    {
      id: "posterior_capsule",
      name: "Cross-Fiber Friction for GIRD",
      target: "Posterior Capsule & Infraspinatus",
      tool: "Heavier instrument for dense tissue",
      position: "Prone or side-lying",
      strokes: [
        {
          direction: "Perpendicular to tendon fibers",
          location: "Posterior joint line",
          intensity: "Aggressive - more tolerable than manual thumb"
        }
      ],
      provider_rec: "Excel Therapy or PT Central",
      goal: "Resolve Glenohumeral Internal Rotation Deficit"
    }
  ],
  art_protocols: [
    {
      name: "Conjoint Tendon Differentiation",
      target: "Separate SHB from Coracobrachialis",
      steps: [
        "Shorten: Arm flexed and adducted across chest",
        "Contact: Palpate seam between muscles in axilla",
        "Lengthen: Patient actively abducts/extends (throwing position)",
        "Differentiate: Elbow flexion = biceps pop, Adduction = coracobrachialis"
      ],
      provider_rec: "PT Central - Manual therapy expertise"
    },
    {
      name: "Subscapularis Release",
      target: "Separate subscap from serratus anterior",
      technique: "Access axilla, apply tension to lateral border while patient externally rotates",
      benefit: "Un-sticks scapula from rib cage"
    }
  ],
  clinical_sequence: [
    { phase: 1, name: "Preparation", technique: "Heat/Vibration", target: "Upper Trap/Pec Major" },
    { phase: 2, name: "Down-Regulation", technique: "IASTM Brushing", target: "Upper Trapezius" },
    { phase: 3, name: "Fibrolysis", technique: "IASTM Framing", target: "Coracoid Process" },
    { phase: 4, name: "Lengthening", technique: "IASTM Sweeping", target: "Pectoralis Minor" },
    { phase: 5, name: "Differentiation", technique: "ART Pin & Stretch", target: "Conjoint Tendon" },
    { phase: 6, name: "Joint Mob", technique: "IASTM Cross-Fiber", target: "Posterior Capsule" },
    { phase: 7, name: "Activation", technique: "Exercise", target: "Serratus Punch/Wall Slides" }
  ]
};

const THUMB_MCP_PROTOCOL = {
  biomechanics: {
    injury: "Ulnar Collateral Ligament (UCL) Instability",
    deformity: "Z-Deformity Pattern",
    components: [
      "Metacarpal adduction",
      "MCP hyperextension",
      "IP flexion collapse"
    ],
    paradigm: "Protected Mobilization vs Traditional Immobilization"
  },
  brace_protocol: {
    device: "Push Sports Thumb Brace",
    mechanism: "Non-elastic figure-8 strap acts as external ligament",
    function: "Blocks valgus/varus while allowing flexion/extension",
    advantage: "Permits strengthening during healing"
  },
  phases: [
    {
      id: "phase1",
      name: "In-Brace Activation",
      weeks: "0-3",
      reliance: "Stage 1 - Continuous brace wear",
      goal: "Prevent cortical smudging and tendon adhesion",
      exercises: [
        {
          name: "Isolated IP Flexion ('The Hook')",
          rationale: "FPL glides without MCP stress",
          execution: "Flex only thumb tip with MCP locked by brace",
          sets: "10 reps x 5 times daily"
        },
        {
          name: "'O' Cone Isometric",
          rationale: "Maintain thenar muscle tone",
          execution: "Touch fingertips to thumb tip, gentle press",
          sets: "5 second holds x 10 reps"
        }
      ]
    },
    {
      id: "phase2",
      name: "Controlled Mobilization",
      weeks: "3-6",
      reliance: "Stage 2 - Remove brace for exercises only",
      goal: "Correct Z-deformity and restore AROM",
      exercises: [
        {
          name: "Tabletop MCP Flexion",
          critical: "IP joint MUST remain perfectly straight",
          rationale: "Isolates FPB (intrinsic) from FPL (extrinsic)",
          execution: "Hand on table, stabilize metacarpal, flex MCP only",
          sets: "15 reps x 3 sets"
        },
        {
          name: "'C' Shape Hold",
          cue: "Make a circle, not a slit",
          rationale: "Trains APB to counter adductor dominance",
          execution: "Hold soda can shape without MCP collapse",
          duration: "30 second holds x 5"
        }
      ]
    },
    {
      id: "phase3",
      name: "Dynamic Stability",
      weeks: "6+",
      reliance: "Stage 3 - Wean brace for light tasks",
      goal: "Proprioceptive integration",
      exercises: [
        {
          name: "Ball Roll",
          setup: "Hand over tennis ball maintaining 'C' arch",
          execution: "Roll ball in circles using thenar eminence",
          benefit: "Closed-chain proprioception training",
          duration: "2-3 minutes x 3 daily"
        }
      ]
    }
  ],
  provider_recommendations: {
    primary: {
      clinic: "Odyssey Health Care",
      address: "1 South Washington St, Ardmore",
      provider: "Ted Phalen, OT",
      experience: "30+ years, orthopedic specialization",
      capability: "Splint management, intrinsic isolation expertise"
    },
    secondary: {
      clinic: "Select Physical Therapy",
      address: "1202 Merrick Drive, Ardmore",
      provider: "Jeff (PT, ATC)",
      limitation: "CHT specialist in OKC, may need referral for complex cases"
    }
  }
};

const ARDMORE_PROVIDERS = [
  {
    name: "Excel Therapy",
    address: "2002 12th Street NW, Ardmore",
    phone: "(580) 319-2630",
    specialties: ["ASTYM Certified", "Coracoid work", "Fascial release"],
    providers: ["Amy Thompson, PT"],
    best_for: "IASTM techniques, insertional tendinopathy"
  },
  {
    name: "Physical Therapy Central",
    address: "2015 W Broadway St, Unit 3A",
    phone: "(580) 453-4455",
    specialties: ["Sports orthopedics", "Manual therapy", "Active integration"],
    providers: ["Ryan Fraley, PT, DPT"],
    best_for: "Pec minor fanning, ART protocols"
  },
  {
    name: "Odyssey Health Care",
    address: "1 South Washington St",
    phone: "(580) 223-7201",
    specialties: ["Hand therapy", "OT expertise", "Splint management"],
    providers: ["Ted Phalen, OT"],
    best_for: "Thumb MCP protocol, intrinsic muscle work"
  }
];

// --- COMPONENT ---

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-200 ${className}`}>
    {children}
  </div>
);

const TabButton = ({ active, label, icon: Icon, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-all text-sm ${
      active
        ? "bg-slate-900 text-white shadow-md"
        : "text-slate-600 hover:bg-slate-100"
    }`}
  >
    <Icon size={16} />
    <span className="font-medium">{label}</span>
  </button>
);

export default function ClinicalProtocols() {
  const [viewMode, setViewMode] = useState('interactive'); // interactive | quick | workflow
  const [activeTab, setActiveTab] = useState('sick_scapula');
  const [expandedSections, setExpandedSections] = useState({});
  const [currentPhase, setCurrentPhase] = useState('phase1');

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // INTERACTIVE VIEW
  const InteractiveView = () => (
    <div className="space-y-6">
      {/* Condition Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-3">
        <TabButton
          active={activeTab === 'sick_scapula'}
          label="SICK Scapula"
          icon={Target}
          onClick={() => setActiveTab('sick_scapula')}
        />
        <TabButton
          active={activeTab === 'thumb_mcp'}
          label="Thumb MCP"
          icon={Hand}
          onClick={() => setActiveTab('thumb_mcp')}
        />
        <TabButton
          active={activeTab === 'providers'}
          label="Providers"
          icon={Users}
          onClick={() => setActiveTab('providers')}
        />
      </div>

      {/* SICK Scapula Content */}
      {activeTab === 'sick_scapula' && (
        <div className="space-y-4">
          {/* Pathoanatomy Section */}
          <Card className="p-4">
            <button
              onClick={() => toggleSection('pathoanatomy')}
              className="w-full flex items-center justify-between text-left"
            >
              <h3 className="text-lg font-bold text-slate-900 flex items-center">
                <BookOpen className="mr-2 text-blue-600" size={20} />
                Pathoanatomy
              </h3>
              {expandedSections.pathoanatomy ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </button>

            {expandedSections.pathoanatomy && (
              <div className="mt-4 space-y-3">
                {SICK_SCAPULA_PROTOCOL.pathoanatomy.components.map((comp, idx) => (
                  <div key={idx} className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold text-slate-900">{comp.name}</h4>
                    <p className="text-sm text-slate-600 mt-1">{comp.description}</p>
                    <p className="text-xs text-blue-600 mt-2 font-medium">
                      Clinical: {comp.clinical_relevance}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* IASTM Techniques */}
          <Card className="p-4">
            <button
              onClick={() => toggleSection('iastm')}
              className="w-full flex items-center justify-between text-left"
            >
              <h3 className="text-lg font-bold text-slate-900 flex items-center">
                <Activity className="mr-2 text-green-600" size={20} />
                IASTM Techniques
              </h3>
              {expandedSections.iastm ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </button>

            {expandedSections.iastm && (
              <div className="mt-4 space-y-4">
                {SICK_SCAPULA_PROTOCOL.iastm_techniques.map((tech, idx) => (
                  <div key={idx} className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-bold text-slate-900">{tech.name}</h4>
                    <p className="text-sm text-slate-600 mt-1">Target: {tech.target}</p>
                    <p className="text-sm text-slate-700 mt-2">
                      <span className="font-medium">Tool:</span> {tech.tool}
                    </p>

                    <div className="mt-3 space-y-2">
                      <h5 className="text-sm font-semibold">Stroke Details:</h5>
                      {tech.strokes.map((stroke, sIdx) => (
                        <div key={sIdx} className="bg-white rounded p-2 text-sm">
                          <span className="font-medium">{stroke.facet || stroke.phase}:</span>
                          <span className="ml-2 text-slate-600">
                            {stroke.vector || stroke.description}
                          </span>
                        </div>
                      ))}
                    </div>

                    {tech.caution && (
                      <div className="mt-3 flex items-start space-x-2 text-amber-700 bg-amber-50 rounded p-2">
                        <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{tech.caution}</span>
                      </div>
                    )}

                    <div className="mt-3 text-sm">
                      <span className="font-medium text-blue-600">Provider: </span>
                      <span>{tech.provider_rec}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Clinical Sequence */}
          <Card className="p-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center mb-4">
              <Workflow className="mr-2 text-purple-600" size={20} />
              Clinical Sequence
            </h3>
            <div className="space-y-2">
              {SICK_SCAPULA_PROTOCOL.clinical_sequence.map((step) => (
                <div key={step.phase} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold text-sm">
                    {step.phase}
                  </div>
                  <div className="flex-1">
                    <span className="font-medium">{step.name}:</span>
                    <span className="ml-2 text-slate-600">{step.technique}</span>
                    <span className="ml-2 text-sm text-slate-500">({step.target})</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Thumb MCP Content */}
      {activeTab === 'thumb_mcp' && (
        <div className="space-y-4">
          {/* Biomechanics */}
          <Card className="p-4">
            <h3 className="text-lg font-bold text-slate-900 mb-3">Biomechanical Context</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Injury:</span> {THUMB_MCP_PROTOCOL.biomechanics.injury}</p>
              <p><span className="font-medium">Deformity:</span> {THUMB_MCP_PROTOCOL.biomechanics.deformity}</p>
              <div className="bg-red-50 rounded p-3 mt-2">
                <p className="font-medium text-red-700 mb-1">Z-Deformity Components:</p>
                <ul className="list-disc list-inside text-red-600">
                  {THUMB_MCP_PROTOCOL.biomechanics.components.map((comp, idx) => (
                    <li key={idx}>{comp}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          {/* Brace Protocol */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center">
              <Award className="mr-2" size={20} />
              Push Sports Thumb Brace Protocol
            </h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Device:</span> {THUMB_MCP_PROTOCOL.brace_protocol.device}</p>
              <p><span className="font-medium">Mechanism:</span> {THUMB_MCP_PROTOCOL.brace_protocol.mechanism}</p>
              <p className="text-blue-700 font-medium mt-2">{THUMB_MCP_PROTOCOL.brace_protocol.advantage}</p>
            </div>
          </Card>

          {/* Phases */}
          <div className="space-y-4">
            {THUMB_MCP_PROTOCOL.phases.map((phase) => (
              <Card key={phase.id} className="p-4">
                <button
                  onClick={() => toggleSection(phase.id)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <div>
                    <h3 className="font-bold text-slate-900">
                      {phase.name} (Weeks {phase.weeks})
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">{phase.goal}</p>
                  </div>
                  {expandedSections[phase.id] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </button>

                {expandedSections[phase.id] && (
                  <div className="mt-4 space-y-3">
                    <div className="bg-slate-100 rounded px-3 py-2 text-sm">
                      <span className="font-medium">Brace Reliance:</span> {phase.reliance}
                    </div>
                    {phase.exercises.map((ex, idx) => (
                      <div key={idx} className="border-l-4 border-green-500 pl-4">
                        <h4 className="font-semibold text-slate-900">{ex.name}</h4>
                        {ex.critical && (
                          <p className="text-red-600 text-sm font-bold mt-1">⚠️ {ex.critical}</p>
                        )}
                        <p className="text-sm text-slate-600 mt-1">{ex.rationale}</p>
                        <p className="text-sm text-slate-700 mt-2">
                          <span className="font-medium">Execution:</span> {ex.execution}
                        </p>
                        <p className="text-sm text-blue-600 mt-1">
                          {ex.sets || ex.duration}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Providers Tab */}
      {activeTab === 'providers' && (
        <div className="space-y-4">
          {ARDMORE_PROVIDERS.map((provider, idx) => (
            <Card key={idx} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 text-lg">{provider.name}</h3>
                  <div className="mt-2 space-y-1 text-sm">
                    <p className="flex items-center text-slate-600">
                      <MapPin size={14} className="mr-2 flex-shrink-0" />
                      {provider.address}
                    </p>
                    <p className="flex items-center text-slate-600">
                      <Phone size={14} className="mr-2 flex-shrink-0" />
                      {provider.phone}
                    </p>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm font-medium text-slate-700">Providers:</p>
                    <p className="text-sm text-slate-600">{provider.providers.join(", ")}</p>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm font-medium text-slate-700">Specialties:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {provider.specialties.map((spec, sIdx) => (
                        <span key={sIdx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-3 p-2 bg-green-50 rounded">
                    <p className="text-sm font-medium text-green-800">Best for:</p>
                    <p className="text-sm text-green-700">{provider.best_for}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  // QUICK REFERENCE VIEW
  const QuickReferenceView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* IASTM Quick Cards */}
      {SICK_SCAPULA_PROTOCOL.iastm_techniques.map((tech, idx) => (
        <Card key={idx} className="p-4">
          <h4 className="font-bold text-slate-900 mb-2">{tech.name}</h4>
          <div className="space-y-2 text-sm">
            <p className="text-slate-600">{tech.target}</p>
            <div className="border-t pt-2">
              <p className="font-medium text-xs text-slate-500">Tool:</p>
              <p className="text-xs">{tech.tool}</p>
            </div>
            <div className="border-t pt-2">
              <p className="font-medium text-xs text-slate-500">Provider:</p>
              <p className="text-xs text-blue-600">{tech.provider_rec}</p>
            </div>
          </div>
        </Card>
      ))}

      {/* Thumb Exercises Quick Cards */}
      {THUMB_MCP_PROTOCOL.phases.map((phase) => (
        phase.exercises.map((ex, idx) => (
          <Card key={`${phase.id}_${idx}`} className="p-4 border-2 border-purple-200">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-bold text-slate-900">{ex.name}</h4>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                Wk {phase.weeks}
              </span>
            </div>
            <p className="text-sm text-slate-600 mb-2">{ex.rationale}</p>
            <p className="text-xs font-medium text-blue-600">
              {ex.sets || ex.duration}
            </p>
          </Card>
        ))
      ))}
    </div>
  );

  // WORKFLOW VIEW
  const WorkflowView = () => (
    <div className="space-y-6">
      {/* Phase Selector */}
      <Card className="p-4">
        <h3 className="text-lg font-bold mb-3">Current Phase Selection</h3>
        <div className="flex space-x-2">
          {THUMB_MCP_PROTOCOL.phases.map((phase) => (
            <button
              key={phase.id}
              onClick={() => setCurrentPhase(phase.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                currentPhase === phase.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Weeks {phase.weeks}
            </button>
          ))}
        </div>
      </Card>

      {/* Current Phase Details */}
      {THUMB_MCP_PROTOCOL.phases
        .filter(p => p.id === currentPhase)
        .map(phase => (
          <Card key={phase.id} className="p-6">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-slate-900">{phase.name}</h2>
              <p className="text-slate-600 mt-1">{phase.goal}</p>
              <div className="mt-3 px-3 py-2 bg-blue-50 rounded-lg inline-block">
                <p className="text-sm font-medium text-blue-700">{phase.reliance}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-lg text-slate-900">Exercise Checklist</h3>
              {phase.exercises.map((ex, idx) => (
                <div key={idx} className="border rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      className="mt-1 h-5 w-5 text-blue-600 rounded border-gray-300"
                      id={`ex_${phase.id}_${idx}`}
                    />
                    <div className="flex-1">
                      <label htmlFor={`ex_${phase.id}_${idx}`} className="font-semibold text-slate-900 cursor-pointer">
                        {ex.name}
                      </label>
                      {ex.critical && (
                        <div className="mt-2 p-2 bg-red-50 rounded border border-red-200">
                          <p className="text-sm text-red-700 font-medium">⚠️ {ex.critical}</p>
                        </div>
                      )}
                      <div className="mt-3 space-y-2 text-sm">
                        <p className="text-slate-600">
                          <span className="font-medium">Why:</span> {ex.rationale}
                        </p>
                        <p className="text-slate-700">
                          <span className="font-medium">How:</span> {ex.execution}
                        </p>
                        <p className="text-blue-600 font-medium">
                          {ex.sets || ex.duration}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* SICK Scapula Integration for Current Week */}
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <h3 className="font-bold text-green-900 mb-3">SICK Scapula Protocol This Week</h3>
              <div className="space-y-2">
                {SICK_SCAPULA_PROTOCOL.clinical_sequence
                  .filter((_, idx) => {
                    if (currentPhase === 'phase1') return idx < 3;
                    if (currentPhase === 'phase2') return idx >= 3 && idx < 6;
                    return idx >= 6;
                  })
                  .map((step) => (
                    <div key={step.phase} className="flex items-center space-x-3">
                      <input type="checkbox" className="h-4 w-4" />
                      <span className="text-sm">
                        <span className="font-medium">{step.technique}:</span>
                        <span className="ml-2 text-slate-600">{step.target}</span>
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </Card>
        ))}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* View Mode Selector */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Clinical Protocols</h1>
        <div className="flex space-x-2 bg-slate-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('interactive')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              viewMode === 'interactive'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="inline-block w-4 h-4 mr-1" />
            Interactive
          </button>
          <button
            onClick={() => setViewMode('quick')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              viewMode === 'quick'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Grid className="inline-block w-4 h-4 mr-1" />
            Quick Ref
          </button>
          <button
            onClick={() => setViewMode('workflow')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              viewMode === 'workflow'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Workflow className="inline-block w-4 h-4 mr-1" />
            Workflow
          </button>
        </div>
      </div>

      {/* Render Selected View */}
      {viewMode === 'interactive' && <InteractiveView />}
      {viewMode === 'quick' && <QuickReferenceView />}
      {viewMode === 'workflow' && <WorkflowView />}
    </div>
  );
}