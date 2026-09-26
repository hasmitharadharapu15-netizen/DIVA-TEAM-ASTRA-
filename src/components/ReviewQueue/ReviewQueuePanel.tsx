/**
 * DIVA Human Review Queue Panel
 * Displays incidents requiring operator authorization with transparent
 * priority score decomposition and distinct action buttons.
 */

import React from 'react';
import { 
  DisasterIncident, 
  ReviewStatus 
} from '../../types/diva';
import { 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Search, 
  ChevronRight, 
  Users, 
  ShieldCheck, 
  TrendingUp,
  MapPin
} from 'lucide-react';

interface ReviewQueuePanelProps {
  incidents: DisasterIncident[];
  selectedIncidentId: string;
  onSelectIncident: (id: string) => void;
  onUpdateStatus: (incidentId: string, status: ReviewStatus, notes?: string) => void;
  onTriggerInvestigation: (incidentId: string) => void;
  onOpenWhyPrioritized: () => void;
}

export const ReviewQueuePanel: React.FC<ReviewQueuePanelProps> = ({
  incidents,
  selectedIncidentId,
  onSelectIncident,
  onUpdateStatus,
  onTriggerInvestigation,
  onOpenWhyPrioritized,
}) => {
  return (
    <aside className="w-80 h-full flex flex-col bg-slate-900 border-r border-slate-800 text-slate-100 flex-shrink-0">
      {/* Panel Header */}
      <div className="p-3 border-b border-slate-800 bg-slate-950/80">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Human Review Queue
            </h2>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800">
            {incidents.filter((i) => i.status === 'pending').length} Action Required
          </span>
        </div>
        <p className="text-[11px] text-slate-400">
          Ranked by population exposure, growth velocity, and infrastructure risk.
        </p>
      </div>

      {/* Incidents List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {incidents.map((incident) => {
          const isSelected = incident.id === selectedIncidentId;
          const priority = incident.priorityReasoning;

          return (
            <div
              key={incident.id}
              onClick={() => onSelectIncident(incident.id)}
              className={`p-3 rounded-lg border transition cursor-pointer ${
                isSelected
                  ? 'bg-slate-850 border-cyan-500 shadow-md ring-1 ring-cyan-500/50'
                  : 'bg-slate-800/80 border-slate-700/80 hover:bg-slate-800'
              }`}
            >
              {/* Incident Header */}
              <div className="flex items-start justify-between gap-1 mb-1.5">
                <div>
                  <span className={`inline-block text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider mb-1 ${
                    priority.priorityLevel === 'CRITICAL'
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {priority.priorityLevel} PRIORITY ({priority.priorityScore}/100)
                  </span>
                  <h3 className="font-bold text-xs text-white leading-tight">
                    {incident.name}
                  </h3>
                </div>

                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
                  incident.status === 'pending'
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : incident.status === 'confirmed'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-slate-700 text-slate-300'
                }`}>
                  {incident.status.replace('_', ' ')}
                </span>
              </div>

              {/* Location & Time */}
              <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-2">
                <MapPin className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                <span className="truncate">{incident.locationName}</span>
              </div>

              {/* Key Indicators Bar */}
              <div className="grid grid-cols-2 gap-1.5 mb-2.5 bg-slate-900/90 p-2 rounded border border-slate-800 text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[10px]">Potentially Exposed:</span>
                  <span className="font-bold text-cyan-300">
                    {incident.estimatedPopulationImpact.totalPotentiallyExposed.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Confidence:</span>
                  <span className="font-bold text-emerald-400">
                    {incident.currentConfidencePercent}% <span className="text-[9px] text-slate-400 font-normal">(±{incident.uncertaintyMarginPercent}%)</span>
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Affected Area:</span>
                  <span className="font-semibold text-slate-200">
                    {incident.affectedAreaSqKm} km²
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">30m Growth:</span>
                  <span className="font-semibold text-rose-400 flex items-center gap-0.5">
                    <TrendingUp className="w-2.5 h-2.5" />
                    +{incident.growthRatePercent}%
                  </span>
                </div>
              </div>

              {/* Top Priority Reason Snippet */}
              <div className="mb-2 text-[10px] text-slate-300 bg-slate-950/60 p-1.5 rounded border border-slate-800">
                <span className="font-semibold text-amber-300">Why Ranked #{priority.priorityScore}: </span>
                {priority.factors[0]?.rationale || 'High residential density and rapid water surge.'}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenWhyPrioritized();
                  }}
                  className="block text-[10px] text-cyan-400 hover:underline mt-0.5 font-semibold"
                >
                  View full explainability score breakdown →
                </button>
              </div>

              {/* HUMAN ACTION BUTTONS (Separate, distinct, non-overlapping!) */}
              <div className="border-t border-slate-700/80 pt-2 grid grid-cols-2 gap-1.5 text-xs">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateStatus(incident.id, 'confirmed');
                  }}
                  className="bg-emerald-700 hover:bg-emerald-600 text-white font-medium py-1 px-2 rounded flex items-center justify-center gap-1 transition shadow-sm text-[11px]"
                  title="Confirm incident after reviewing evidence"
                >
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Confirm</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTriggerInvestigation(incident.id);
                  }}
                  className="bg-cyan-700 hover:bg-cyan-600 text-white font-medium py-1 px-2 rounded flex items-center justify-center gap-1 transition shadow-sm text-[11px]"
                  title="Run DIVA multi-tool deep investigation"
                >
                  <Search className="w-3 h-3" />
                  <span>Investigate</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateStatus(incident.id, 'insufficient_evidence');
                  }}
                  className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium py-1 px-2 rounded flex items-center justify-center gap-1 transition text-[11px]"
                  title="Mark as insufficient evidence"
                >
                  <HelpCircle className="w-3 h-3 text-amber-400" />
                  <span>Need Data</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateStatus(incident.id, 'false_positive');
                  }}
                  className="bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 font-medium py-1 px-2 rounded flex items-center justify-center gap-1 transition text-[11px]"
                  title="Dismiss as False Positive"
                >
                  <XCircle className="w-3 h-3" />
                  <span>False Pos</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Safety Notice Footer */}
      <div className="p-2.5 bg-slate-950 border-t border-slate-800 text-[10px] text-slate-400 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
        <span>
          <strong>Human-in-the-Loop:</strong> DIVA provides automated verification & impact analysis; authorized human review is mandatory for all coordination.
        </span>
      </div>
    </aside>
  );
};
