import React from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import ProviderCard from './ProviderCard';

const FrequencyView = ({ providers, frequencies }) => {
  // Group providers by frequency
  const providersByFrequency = frequencies.reduce((acc, freq) => {
    acc[freq.id] = providers.filter(p => p.frequency === freq.id);
    return acc;
  }, {});

  const getFrequencyUrgencyColor = (frequencyId) => {
    switch (frequencyId) {
      case 'twice-weekly':
      case 'weekly':
        return 'bg-red-50 border-red-200 text-red-700';
      case 'monthly':
        return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'quarterly':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'biannual':
      case 'annual':
        return 'bg-slate-50 border-slate-200 text-slate-700';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-700';
    }
  };

  const getUrgencyLevel = (frequencyId) => {
    if (['twice-weekly', 'weekly'].includes(frequencyId)) return 'High Priority';
    if (frequencyId === 'monthly') return 'Regular Monitoring';
    if (frequencyId === 'quarterly') return 'Periodic Checkup';
    return 'Routine Care';
  };

  return (
    <div className="space-y-8">
      {frequencies.map(frequency => {
        const freqProviders = providersByFrequency[frequency.id] || [];
        if (freqProviders.length === 0) return null;

        return (
          <div key={frequency.id}>
            {/* Frequency Header */}
            <div className={`flex items-center justify-between p-4 rounded-lg border mb-4 ${getFrequencyUrgencyColor(frequency.id)}`}>
              <div className="flex items-center space-x-3">
                <Clock size={24} />
                <div>
                  <h2 className="text-xl font-bold">{frequency.name}</h2>
                  <p className="text-sm opacity-80">{freqProviders.length} provider{freqProviders.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
              {['twice-weekly', 'weekly'].includes(frequency.id) && (
                <div className="flex items-center space-x-2 bg-white bg-opacity-60 px-3 py-1 rounded-full">
                  <AlertCircle size={16} />
                  <span className="text-xs font-semibold">{getUrgencyLevel(frequency.id)}</span>
                </div>
              )}
            </div>

            {/* Provider Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {freqProviders.map(provider => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FrequencyView;
