import React from 'react';
import ProviderCard from './ProviderCard';
import { Users } from 'lucide-react';

const OverviewView = ({ providers }) => {
  // Sort providers: active first, then by name
  const sortedProviders = [...providers].sort((a, b) => {
    const statusOrder = { active: 0, research: 1, remote: 2, pending: 3 };
    const statusDiff = (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99);
    if (statusDiff !== 0) return statusDiff;
    return a.name.localeCompare(b.name);
  });

  // Count providers by status
  const statusCounts = providers.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg border border-blue-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Users size={28} className="text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Healthcare Team Overview</h2>
            <p className="text-sm text-slate-600">All providers across all specialties</p>
          </div>
        </div>

        {/* Status Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          {statusCounts.active && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
              <p className="text-2xl font-bold text-emerald-700">{statusCounts.active}</p>
              <p className="text-xs text-emerald-600 font-medium uppercase">Active</p>
            </div>
          )}
          {statusCounts.research && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <p className="text-2xl font-bold text-slate-700">{statusCounts.research}</p>
              <p className="text-xs text-slate-600 font-medium uppercase">Researching</p>
            </div>
          )}
          {statusCounts.remote && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-2xl font-bold text-blue-700">{statusCounts.remote}</p>
              <p className="text-xs text-blue-600 font-medium uppercase">Remote</p>
            </div>
          )}
          {statusCounts.pending && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-2xl font-bold text-amber-700">{statusCounts.pending}</p>
              <p className="text-xs text-amber-600 font-medium uppercase">To Schedule</p>
            </div>
          )}
        </div>
      </div>

      {/* All Provider Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {sortedProviders.map(provider => (
          <ProviderCard key={provider.id} provider={provider} />
        ))}
      </div>
    </div>
  );
};

export default OverviewView;
