import React, { useState } from 'react';
import RecoveryDashboard from './RecoveryDashboard';
import HealthcareDashboard from './HealthcareDashboard';
import WellnessAnalytics from './WellnessAnalytics';
import PTSessionPlan from './PTSessionPlan';
import { Activity, Users, BarChart2, ClipboardList, Menu, X } from 'lucide-react';
import './App.css';

function App() {
  const [activeView, setActiveView] = useState('recovery');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation Bar */}
      <div className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            <button
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-slate-600" />
              ) : (
                <Menu className="w-6 h-6 text-slate-600" />
              )}
            </button>
            <h1 className="text-xl font-semibold text-slate-900">
              Recovery Command Center
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex space-x-2">
            <button
              onClick={() => setActiveView('recovery')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeView === 'recovery'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Activity className="inline w-4 h-4 mr-2" />
              Rib Recovery
            </button>
            <button
              onClick={() => setActiveView('healthcare')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeView === 'healthcare'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Users className="inline w-4 h-4 mr-2" />
              All Providers
            </button>
            <button
              onClick={() => setActiveView('analytics')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeView === 'analytics'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <BarChart2 className="inline w-4 h-4 mr-2" />
              Wellness Analytics
            </button>
            <button
              onClick={() => setActiveView('pt-session')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeView === 'pt-session'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ClipboardList className="inline w-4 h-4 mr-2" />
              PT Session
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2">
            <button
              onClick={() => {
                setActiveView('recovery');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2 rounded-lg font-medium ${
                activeView === 'recovery'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-slate-600'
              }`}
            >
              <Activity className="inline w-4 h-4 mr-2" />
              Rib Recovery
            </button>
            <button
              onClick={() => {
                setActiveView('healthcare');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2 rounded-lg font-medium ${
                activeView === 'healthcare'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-slate-600'
              }`}
            >
              <Users className="inline w-4 h-4 mr-2" />
              All Providers
            </button>
            <button
              onClick={() => {
                setActiveView('analytics');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2 rounded-lg font-medium ${
                activeView === 'analytics'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-slate-600'
              }`}
            >
              <BarChart2 className="inline w-4 h-4 mr-2" />
              Wellness Analytics
            </button>
            <button
              onClick={() => {
                setActiveView('pt-session');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2 rounded-lg font-medium ${
                activeView === 'pt-session'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-slate-600'
              }`}
            >
              <ClipboardList className="inline w-4 h-4 mr-2" />
              PT Session
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="App">
        {activeView === 'recovery' && <RecoveryDashboard onNavigate={setActiveView} />}
        {activeView === 'healthcare' && <HealthcareDashboard />}
        {activeView === 'analytics' && <WellnessAnalytics />}
        {activeView === 'pt-session' && <PTSessionPlan />}
      </div>
    </div>
  );
}

export default App;