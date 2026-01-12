import React from 'react';
import { Activity, Brain, Eye, Smile, Moon, Heart } from 'lucide-react';
import ProviderCard from './ProviderCard';

const SystemView = ({ providers, systems }) => {
  const getSystemIcon = (iconName) => {
    const icons = {
      Activity,
      Brain,
      Eye,
      Smile,
      Moon,
      Heart
    };
    return icons[iconName] || Activity;
  };

  const getSystemColorClasses = (color) => {
    const colorMap = {
      purple: 'bg-purple-50 border-purple-200 text-purple-700',
      teal: 'bg-teal-50 border-teal-200 text-teal-700',
      orange: 'bg-orange-50 border-orange-200 text-orange-700',
      blue: 'bg-blue-50 border-blue-200 text-blue-700',
      indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
      green: 'bg-emerald-50 border-emerald-200 text-emerald-700'
    };
    return colorMap[color] || 'bg-slate-50 border-slate-200 text-slate-700';
  };

  // Group providers by system
  const providersBySystem = systems.reduce((acc, system) => {
    acc[system.id] = providers.filter(p => p.system === system.id);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {systems.map(system => {
        const systemProviders = providersBySystem[system.id] || [];
        if (systemProviders.length === 0) return null;

        const Icon = getSystemIcon(system.icon);

        return (
          <div key={system.id}>
            {/* System Header */}
            <div className={`flex items-center space-x-3 p-4 rounded-lg border mb-4 ${getSystemColorClasses(system.color)}`}>
              <Icon size={24} />
              <div>
                <h2 className="text-xl font-bold">{system.name}</h2>
                <p className="text-sm opacity-80">{systemProviders.length} provider{systemProviders.length !== 1 ? 's' : ''}</p>
              </div>
            </div>

            {/* Provider Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {systemProviders.map(provider => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SystemView;
