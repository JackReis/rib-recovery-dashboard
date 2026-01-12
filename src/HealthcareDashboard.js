import React, { useState } from 'react';
import { Activity, Menu, X, Heart } from 'lucide-react';
import ViewSwitcher from './components/ViewSwitcher';
import SystemView from './components/SystemView';
import FrequencyView from './components/FrequencyView';
import OverviewView from './components/OverviewView';
import providersData from './data/providers.json';

const HealthcareDashboard = () => {
  const [activeView, setActiveView] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { providers, systems, frequencies } = providersData;

  const renderView = () => {
    switch (activeView) {
      case 'system':
        return <SystemView providers={providers} systems={systems} />;
      case 'frequency':
        return <FrequencyView providers={providers} frequencies={frequencies} />;
      case 'overview':
        return <OverviewView providers={providers} />;
      default:
        return <OverviewView providers={providers} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Heart className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight">
                  Healthcare Dashboard
                </h1>
                <p className="text-xs text-slate-500">Provider Management & Appointments</p>
              </div>
            </div>

            {/* Desktop View Switcher */}
            <div className="hidden lg:block">
              <ViewSwitcher activeView={activeView} onViewChange={setActiveView} />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile View Switcher */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-2">
              <ViewSwitcher
                activeView={activeView}
                onViewChange={(view) => {
                  setActiveView(view);
                  setMobileMenuOpen(false);
                }}
              />
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {renderView()}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="text-sm text-slate-500">
              <p>Healthcare Provider Management System</p>
            </div>
            <div className="flex items-center space-x-4 text-xs text-slate-400">
              <span>{providers.length} Total Providers</span>
              <span>•</span>
              <span>{systems.length} Care Systems</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HealthcareDashboard;
