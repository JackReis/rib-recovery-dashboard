import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  Globe,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';

const ProviderCard = ({ provider }) => {
  const [notesExpanded, setNotesExpanded] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'remote': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'research': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'Active';
      case 'pending': return 'To Schedule';
      case 'remote': return 'Remote Care';
      case 'research': return 'Researching';
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatAppointmentDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            {provider.name}
          </h3>
          <p className="text-sm text-slate-600">{provider.credentials}</p>
          <p className="text-xs text-slate-500 mt-1">{provider.specialty}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(provider.status)}`}>
          {getStatusLabel(provider.status)}
        </span>
      </div>

      {/* Organization Info */}
      <div className="mb-4 pb-4 border-b border-slate-100">
        <p className="text-sm font-medium text-slate-700 mb-2">
          {provider.contact.organization}
        </p>

        {/* Contact Details */}
        <div className="space-y-2">
          {provider.contact.phone && (
            <a
              href={`tel:${provider.contact.phone}`}
              className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              <Phone size={14} className="mr-2" />
              <span className="font-medium">{provider.contact.phone}</span>
            </a>
          )}

          {provider.contact.email && (
            <a
              href={`mailto:${provider.contact.email}`}
              className="flex items-center text-sm text-slate-600 hover:text-blue-600 transition-colors"
            >
              <Mail size={14} className="mr-2" />
              <span>{provider.contact.email}</span>
            </a>
          )}

          {provider.contact.address && (
            <div className="flex items-start text-sm text-slate-600">
              <MapPin size={14} className="mr-2 mt-0.5 flex-shrink-0" />
              <span>{provider.contact.address}</span>
            </div>
          )}

          {provider.contact.website && (
            <a
              href={`https://${provider.contact.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm text-slate-600 hover:text-blue-600 transition-colors"
            >
              <Globe size={14} className="mr-2" />
              <span>{provider.contact.website}</span>
            </a>
          )}
        </div>
      </div>

      {/* Appointment Info */}
      {(provider.lastVisit || provider.nextAppointment) && (
        <div className="mb-4 space-y-2">
          {provider.lastVisit && (
            <div className="flex items-center text-sm">
              <Calendar size={14} className="mr-2 text-slate-400" />
              <span className="text-slate-600">
                Last visit: <span className="font-medium text-slate-900">{formatDate(provider.lastVisit)}</span>
              </span>
            </div>
          )}

          {provider.nextAppointment && (
            <div className="flex items-center text-sm bg-blue-50 p-2 rounded border border-blue-100">
              <Calendar size={14} className="mr-2 text-blue-600" />
              <span className="text-slate-700">
                Next: <span className="font-semibold text-blue-700">{formatAppointmentDate(provider.nextAppointment)}</span>
              </span>
            </div>
          )}
        </div>
      )}

      {/* Visit Frequency */}
      {provider.frequency && (
        <div className="mb-4">
          <span className="inline-flex items-center px-2 py-1 rounded bg-slate-50 text-xs font-medium text-slate-700">
            {provider.frequency === 'twice-weekly' ? 'Twice Weekly' :
             provider.frequency === 'weekly' ? 'Weekly' :
             provider.frequency === 'monthly' ? 'Monthly' :
             provider.frequency === 'quarterly' ? 'Quarterly' :
             provider.frequency === 'biannual' ? 'Every 6 Months' :
             provider.frequency === 'annual' ? 'Annual' :
             provider.frequency}
          </span>
        </div>
      )}

      {/* Notes Section */}
      {provider.notes && (
        <div className="mt-4">
          <button
            onClick={() => setNotesExpanded(!notesExpanded)}
            className="flex items-center justify-between w-full text-left text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
          >
            <span className="flex items-center">
              <Info size={14} className="mr-2 text-slate-400" />
              Notes
            </span>
            {notesExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {notesExpanded && (
            <div className="mt-2 p-3 bg-slate-50 rounded text-sm text-slate-700 leading-relaxed">
              {provider.notes}
            </div>
          )}
        </div>
      )}

      {/* Insurance Info */}
      {provider.insurance && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Insurance: <span className="text-slate-700 font-medium">{provider.insurance}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default ProviderCard;
