/**
 * DIVA Unified Incident & Human Review Console
 * Combines review queue, evidence synthesis, and human action buttons
 * into a single, clean, spacious, non-overlapping panel.
 */

import React, { useState } from 'react';
import { 
  DisasterIncident, 
  DisasterScenario, 
  ReviewStatus 
} from '../../types/diva';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  HelpCircle, 
  XCircle, 
  Users, 
  TrendingUp, 
  Send, 
  Layers, 
  ShieldCheck, 
  MapPin, 
  Info,
  Clock,
  Sparkles
} from 'lucide-react';

interface UnifiedIncidentConsoleProps {
  scenario: DisasterScenario;
  incident: DisasterIncident;
  onUpdateStatus: (incidentId: string, status: ReviewStatus, notes?: string) => void;
  onTriggerInvestigation: (incidentId: string) => void;
  onOpenWhatChanged: () => void;
  onOpenWhyPrioritized: () => void;
  onOpenRequestEvidence: () => void;
  onOpenAssistance: () => void;
  onOpenEvidenceGraph: () => void;
}

export const UnifiedIncidentConsole: React.FC<UnifiedIncidentConsoleProps> = ({
  scenario,
  incident,
  onUpdateStatus,
  onTriggerInvestigation,
  onOpenWhatChanged,
  onOpenWhyPrioritized,
  onOpenRequestEvidence,
  onOpenAssistance,
  onOpenEvidenceGraph,
}) => {
  const [activeSection, setActiveSection] = useState<'decision' | 'details' | 'audit'>('decision');
  const pop = incident.estimatedPopulationImpact;
  const p = incident.priorityReasoning;

  return (
    <aside className="w-96 xl:w-[420px] h-full flex flex-col bg-slate-900 border-l border-slate-800 text-slate-100 flex-shrink-0 overflow-hidden shadow-xl">
      {/* 1. Incident Header Card */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 space-y-1.5 flex-shrink-0">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-rose-950 text-rose-300 border border-rose-800">
            {p.priorityLevel} PRIORITY ({p.priorityScore}/100)
          </span>

          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
            incident.status === 'confirmed'
              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
              : incident.status === 'false_positive'
              ? 'bg-rose-950 text-rose-300 border border-rose-800'
              : 'bg-amber-950 text-amber-300 border border-amber-800'
          }`}>
            STATUS: {incident.status.replace('_', ' ')}
          </span>
        </div>

        <h2 className="text-base font-bold text-white leading-tight">
          {incident.name}
        </h2>

        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
          <span className="truncate">{incident.locationName}</span>
        </div>
      </div>

      {/* 2. Mode Tabs */}
      <div className="flex items-center border-b border-slate-800 bg-slate-900/90 text-xs flex-shrink-0">
        <button
          onClick={() => setActiveSection('decision')}
          className={`flex-1 py-2 font-semibold text-center border-b-2 transition ${
            activeSection === 'decision'
              ? 'border-cyan-500 text-cyan-300 bg-slate-850'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Review & Action
        </button>
        <button
          onClick={() => setActiveSection('details')}
          className={`flex-1 py-2 font-semibold text-center border-b-2 transition ${
            activeSection === 'details'
              ? 'border-cyan-500 text-cyan-300 bg-slate-850'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Confidence & Needs
        </button>
        <button
          onClick={() => setActiveSection('audit')}
          className={`flex-1 py-2 font-semibold text-center border-b-2 transition ${
            activeSection === 'audit'
              ? 'border-cyan-500 text-cyan-300 bg-slate-850'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Audit & Assets
        </button>
      </div>

      {/* 3. Scrollable Main Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {activeSection === 'decision' && (
          <>
            {/* MANDATORY HUMAN REVIEW BUTTONS (Large, clear, zero overlap!) */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2.5">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                Human Authorization Protocol:
              </span>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onUpdateStatus(incident.id, 'confirmed')}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition shadow-sm text-xs"
                >
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Confirm</span>
                </button>

                <button
                  onClick={() => onTriggerInvestigation(incident.id)}
                  className="bg-cyan-700 hover:bg-cyan-600 text-white font-bold py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition shadow-sm text-xs"
                >
                  <Search className="w-4 h-4 text-cyan-200" />
                  <span>Investigate</span>
                </button>

                <button
                  onClick={onOpenRequestEvidence}
                  className="bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-700/60 font-bold py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition text-xs"
                >
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  <span>Need Data</span>
                </button>

                <button
                  onClick={() => onUpdateStatus(incident.id, 'false_positive')}
                  className="bg-slate-800 hover:bg-rose-950 text-rose-300 border border-rose-800/60 font-bold py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition text-xs"
                >
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span>False Pos</span>
                </button>
              </div>
            </div>

            {/* POPULATION IMPACT SUMMARY */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-cyan-400" />
                  Potentially Exposed Population
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Model Estimate
                </span>
              </div>

              <div className="text-2xl font-black text-cyan-300">
                {pop.totalPotentiallyExposed.toLocaleString()}
                <span className="text-xs font-normal text-slate-400 ml-1.5">residents in flood path</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px]">
                <div className="bg-slate-900 p-2 rounded border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">High-Confidence:</span>
                  <span className="font-bold text-emerald-400">{pop.highConfidenceZoneCount.toLocaleString()}</span>
                </div>
                <div className="bg-slate-900 p-2 rounded border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Uncertain Margin:</span>
                  <span className="font-bold text-amber-400">{pop.uncertainZoneCount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* CONTRADICTION HUNTER ALERT CARD */}
            {incident.contradictions.length > 0 && (
              <div className="bg-amber-950/40 border border-amber-700/80 rounded-xl p-3.5 space-y-1.5 text-amber-200">
                <div className="flex items-center gap-1.5 font-bold text-xs text-amber-300">
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Contradiction Hunter Finding</span>
                </div>
                <p className="text-[11px] text-amber-200/90 leading-relaxed">
                  Sensor S-07 read 1.15m (normal) while upstream gauges read &gt;4.8m. Diagnostics revealed a silt-jammed mechanical float and low battery. Fault isolated from consensus.
                </p>
              </div>
            )}

            {/* EXPLAINABILITY BUTTONS (Separate, full-width, clean spacing) */}
            <div className="space-y-2 pt-1">
              <button
                onClick={onOpenWhatChanged}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition shadow-sm text-xs"
              >
                <TrendingUp className="w-4 h-4" />
                <span>What Changed in Last 30 Minutes?</span>
              </button>

              <button
                onClick={onOpenWhyPrioritized}
                className="w-full bg-slate-800 hover:bg-slate-750 text-amber-300 border border-amber-700/60 font-bold py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition text-xs"
              >
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>Why is this Ranked #1 Priority?</span>
              </button>

              <button
                onClick={onOpenAssistance}
                className="w-full bg-purple-700 hover:bg-purple-600 text-white font-bold py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition shadow-md text-xs"
              >
                <Send className="w-4 h-4" />
                <span>Draft Assistance Request for NDRF</span>
              </button>
            </div>
          </>
        )}

        {activeSection === 'details' && (
          <div className="space-y-3">
            {/* Confidence Breakdown */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-200">Multimodal Confidence</span>
                <span className="text-sm font-black text-emerald-400">{incident.currentConfidencePercent}%</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Grounded across SAR satellite radar, 4 river gauges, tipping rain stations, and verified 112 emergency calls.
              </p>
              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={onOpenEvidenceGraph}
                  className="w-full bg-slate-800 hover:bg-slate-750 text-cyan-300 border border-cyan-800/60 font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 text-xs transition"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Inspect Full Evidence Graph →</span>
                </button>
              </div>
            </div>

            {/* Inferred Needs */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <span className="font-bold text-slate-200 block">Evidence-Inferred Community Needs</span>
              <ul className="space-y-1.5 text-[11px] text-slate-300">
                {incident.potentialNeeds.map((need, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>{need}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeSection === 'audit' && (
          <div className="space-y-3">
            {/* Nearby Infrastructure Exposure */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <span className="font-bold text-slate-200 block">Critical Infrastructure Exposure</span>
              <div className="space-y-2 text-[11px]">
                {scenario.infrastructure.map((inf) => (
                  <div key={inf.id} className="p-2 bg-slate-900 rounded border border-slate-800 flex justify-between items-center">
                    <div>
                      <strong className="text-white block">{inf.name}</strong>
                      <span className="text-slate-400 capitalize">{inf.type}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded capitalize ${
                      inf.status === 'safe'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}>
                      {inf.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Safety Guardrail Footer */}
      <div className="p-2.5 bg-slate-950 border-t border-slate-800 text-[10px] text-slate-400 flex items-center gap-2 flex-shrink-0">
        <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
        <span>
          <strong>Human-in-the-Loop:</strong> Under DIVA safety rules, all dispatch & evacuation decisions require explicit human authorization.
        </span>
      </div>
    </aside>
  );
};
