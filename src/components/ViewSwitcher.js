import React from 'react';
import { Grid, List, Users } from 'lucide-react';

const ViewSwitcher = ({ activeView, onViewChange }) => {
  const views = [
    { id: 'system', label: 'By System', icon: Grid },
    { id: 'frequency', label: 'By Frequency', icon: List },
    { id: 'overview', label: 'All Providers', icon: Users }
  ];

  return (
    <div className="flex flex-wrap gap-2 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
      {views.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onViewChange(id)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
            activeView === id
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Icon size={18} />
          <span className="font-medium text-sm">{label}</span>
        </button>
      ))}
    </div>
  );
};

export default ViewSwitcher;
