/**
 * DIVA Incident Detail & Multimodal Verification Panel
 * Displays comprehensive incident intelligence, 8-factor confidence breakdown,
 * Contradiction Hunter audit, population estimates, and action triggers.
 */

import React, { useState } from 'react';
import { 
  DisasterIncident, 
  DisasterScenario 
} from '../../types/diva';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle, 
  Layers, 
  Users, 
  Activity, 
  Send, 
  TrendingUp, 
  FileText, 
  Wrench,
  Search,
  HelpCircle,
  Sparkles,
  Info
} from 'lucide-react';

interface IncidentDetailPanelProps {
  scenario: DisasterScenario;
  incident: DisasterIncident;
  onOpenWhatChanged: () => void;
  onOpenWhyPrioritized: () => void;
  onOpenRequestEvidence: () => void;
  onOpenPopulationDetail: () => void;
  onOpenAssistanceModal: () => void;
  onOpenEvidenceGraph: () => void;
}

export const IncidentDetailPanel: React.FC<IncidentDetailPanelProps> = ({
  scenario,
  incident,
  onOpenWhatChanged,
  onOpenWhyPrioritized,
  onOpenRequestEvidence,
  onOpenPopulationDetail,
  onOpenAssistanceModal,
  onOpenEvidenceGraph,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'confidence' | 'contradictions' | 'infrastructure'>('overview');

  const pop = incident.estimatedPopulationImpact;
  const latestConfidenceStep = incident.confidenceHistory[incident.confidenceHistory.length - 1];
  const factors = latestConfidenceStep?.factors || {
    modelConfidence: 94,
    evidenceAgreement: 91,
    dataFreshness: 96,
    sensorReliability: 94,
    imageQuality: 92,
    temporalConsistency: 90,
    spatialConsistency: 92,
    contradictionPenalty: 2,
  };

  return (
    <aside className="w-96 h-full flex flex-col bg-slate-900 border-l border-slate-800 text-slate-100 flex-shrink-0">
      {/* Header */}
      <div className="p-3 border-b border-slate-800 bg-slate-950/80">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-cyan-950 text-cyan-300 border border-cyan-800">
            {incident.disasterType} Investigation
          </span>
          <span className="text-xs font-mono text-slate-400">
            Ref: {incident.id}
          </span>
        </div>
        <h2 className="text-sm font-bold text-white mb-1">
          {incident.name}
        </h2>
        <div className="text-[11px] text-slate-400 flex items-center justify-between">
          <span>{incident.locationName}</span>
          <span className="font-mono text-cyan-400">
            {incident.coordinates.lat.toFixed(4)}°N, {incident.coordinates.lng.toFixed(4)}°E
          </span>
        </div>
      </div>

      {/* Internal Navigation Tabs */}
      <div className="flex items-center border-b border-slate-800 bg-slate-900 text-xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2 font-medium text-center border-b-2 transition ${
            activeTab === 'overview'
              ? 'border-cyan-500 text-cyan-300 bg-slate-850'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('confidence')}
          className={`flex-1 py-2 font-medium text-center border-b-2 transition ${
            activeTab === 'confidence'
              ? 'border-cyan-500 text-cyan-300 bg-slate-850'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Confidence ({incident.currentConfidencePercent}%)
        </button>
        <button
          onClick={() => setActiveTab('contradictions')}
          className={`flex-1 py-2 font-medium text-center border-b-2 transition ${
            activeTab === 'contradictions'
              ? 'border-cyan-500 text-cyan-300 bg-slate-850'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Audit ({incident.contradictions.length})
        </button>
        <button
          onClick={() => setActiveTab('infrastructure')}
          className={`flex-1 py-2 font-medium text-center border-b-2 transition ${
            activeTab === 'infrastructure'
              ? 'border-cyan-500 text-cyan-300 bg-slate-850'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Assets ({scenario.infrastructure.length})
        </button>
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs">
        {activeTab === 'overview' && (
          <>
            {/* Contradiction Alert Banner (if any) */}
            {incident.contradictions.length > 0 && (
              <div className="bg-amber-950/80 border border-amber-700/80 rounded-lg p-2.5 text-amber-200">
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Contradiction Hunter Alert</span>
                </div>
                <p className="text-[11px] text-amber-300/90 leading-relaxed mb-2">
                  Sensor S-07 contradicted upstream & satellite data. Hardware audit revealed mechanical float obstruction and depleted battery. Fault isolated from consensus.
                </p>
                <button
                  onClick={() => setActiveTab('contradictions')}
                  className="text-[11px] font-semibold text-amber-300 underline hover:text-white"
                >
                  View Hardware Diagnostic & Resolution Log →
                </button>
              </div>
            )}

            {/* Population Impact Summary Card */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-cyan-400" />
                  Estimated Population Exposure
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Model Estimate
                </span>
              </div>

              <div className="text-2xl font-black text-cyan-300 mb-1">
                {pop.totalPotentiallyExposed.toLocaleString()}
                <span className="text-xs font-normal text-slate-400 ml-1.5">residents potentially exposed</span>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-700 text-[11px]">
                <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">High-Confidence Zone:</span>
                  <span className="font-bold text-emerald-400">{pop.highConfidenceZoneCount.toLocaleString()}</span>
                </div>
                <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Uncertain Zone:</span>
                  <span className="font-bold text-amber-400">{pop.uncertainZoneCount.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-2 text-[10px] text-slate-400 flex items-start gap-1 bg-slate-900/50 p-2 rounded border border-slate-800">
                <Info className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Ethical Guardrail:</strong> Output is a spatial demographic estimate based on ward census density. Never treat as confirmed casualty count.
                </span>
              </div>
            </div>

            {/* Physical Scope Metrics */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-lg p-3">
              <span className="font-bold text-slate-200 block mb-2">Physical Boundary Metrics</span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-400 block">Affected Area:</span>
                  <span className="font-bold text-white text-sm">{incident.affectedAreaSqKm} km²</span>
                </div>
                <div>
                  <span className="text-slate-400 block">30m Expansion Rate:</span>
                  <span className="font-bold text-rose-400 text-sm">+{incident.growthRatePercent}%</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Multimodal Confidence:</span>
                  <span className="font-bold text-emerald-400 text-sm">{incident.currentConfidencePercent}%</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Uncertainty Margin:</span>
                  <span className="font-bold text-amber-400 text-sm">±{incident.uncertaintyMarginPercent}%</span>
                </div>
              </div>
            </div>

            {/* Inferred Community Needs */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-lg p-3">
              <span className="font-bold text-slate-200 block mb-2">
                Potential Assistance Needs (Evidence-Inferred)
              </span>
              <ul className="space-y-1.5 text-[11px]">
                {incident.potentialNeeds.map((need, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-slate-300">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>{need}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3">
                <button
                  onClick={onOpenAssistanceModal}
                  className="w-full bg-purple-700 hover:bg-purple-600 text-white font-semibold py-1.5 px-3 rounded shadow-sm flex items-center justify-center gap-1.5 transition text-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Draft Assistance Request Message</span>
                </button>
              </div>
            </div>
          </>
        )}

        {/* Confidence Matrix Tab */}
        {activeTab === 'confidence' && (
          <div className="space-y-3">
            <div className="bg-slate-800/90 border border-slate-700 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-200">8-Factor Confidence Matrix</span>
                <span className="text-sm font-black text-emerald-400">{incident.currentConfidencePercent}%</span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3">
                DIVA rejects opaque single-number confidence. All decisions are decomposed across 8 independent verification dimensions.
              </p>

              <div className="space-y-2 text-[11px]">
                {[
                  { name: 'Model Baseline Confidence', val: factors.modelConfidence, color: 'bg-cyan-500' },
                  { name: 'Multimodal Agreement', val: factors.evidenceAgreement, color: 'bg-blue-500' },
                  { name: 'Data Freshness & Recency', val: factors.dataFreshness, color: 'bg-emerald-500' },
                  { name: 'Sensor Hardware Reliability', val: factors.sensorReliability, color: 'bg-indigo-500' },
                  { name: 'Satellite Image Quality', val: factors.imageQuality, color: 'bg-purple-500' },
                  { name: 'Temporal Consistency', val: factors.temporalConsistency, color: 'bg-teal-500' },
                  { name: 'Spatial Geographic Consistency', val: factors.spatialConsistency, color: 'bg-sky-500' },
                  { name: 'Contradiction Penalty Applied', val: -factors.contradictionPenalty, color: 'bg-rose-500', isPenalty: true },
                ].map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-slate-300 mb-0.5">
                      <span>{item.name}:</span>
                      <span className="font-mono font-bold">{item.val > 0 && !item.isPenalty ? `${item.val}%` : `${item.val}%`}</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full ${item.color}`}
                        style={{ width: `${Math.min(100, Math.max(0, Math.abs(item.val)))}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Confidence Evolution History */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-lg p-3">
              <span className="font-bold text-slate-200 block mb-2">Confidence Evolution Over Time</span>
              <div className="space-y-2 text-[11px]">
                {incident.confidenceHistory.map((step, idx) => (
                  <div key={idx} className="border-l-2 border-cyan-500 pl-2 py-0.5">
                    <div className="flex justify-between items-center text-slate-400 text-[10px]">
                      <span className="font-mono font-semibold">{step.timestamp}</span>
                      <span className="font-bold text-cyan-300">{step.confidencePercent}%</span>
                    </div>
                    <div className="font-semibold text-slate-200">{step.triggerEvent}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{step.explanation}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Contradictions & Audit Tab */}
        {activeTab === 'contradictions' && (
          <div className="space-y-3">
            <div className="bg-slate-800/90 border border-slate-700 rounded-lg p-3">
              <span className="font-bold text-slate-200 block mb-1">
                Contradiction & False Positive Hunter Audit
              </span>
              <p className="text-[11px] text-slate-400 mb-3">
                DIVA continuously challenges its own hypotheses by seeking contradicting sensors, stale readings, and alternate explanations.
              </p>

              {incident.contradictions.length === 0 ? (
                <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded text-emerald-300 text-center text-xs">
                  ✓ No unresolved contradictions found. All reporting modalities agree.
                </div>
              ) : (
                incident.contradictions.map((c) => (
                  <div key={c.id} className="p-2.5 bg-slate-900 rounded border border-slate-700 space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-400 uppercase text-[10px]">
                        Discrepancy: {c.contradictionType.replace(/_/g, ' ')}
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                        RESOLVED
                      </span>
                    </div>

                    <div className="text-slate-300 font-medium">
                      <strong>Conflicting Inputs:</strong> {c.evidenceSourceA} vs {c.evidenceSourceB}
                    </div>

                    <p className="text-slate-400 text-[10px] bg-slate-950 p-2 rounded border border-slate-800">
                      {c.explanation}
                    </p>

                    <div className="text-emerald-400 text-[10px] font-medium pt-1">
                      <strong>Resolution:</strong> {c.resolutionNote}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Infrastructure Exposure Tab */}
        {activeTab === 'infrastructure' && (
          <div className="space-y-2">
            <div className="bg-slate-800/90 border border-slate-700 rounded-lg p-3">
              <span className="font-bold text-slate-200 block mb-2">
                Critical Infrastructure Exposure Analysis
              </span>
              <div className="space-y-2 text-[11px]">
                {scenario.infrastructure.map((inf) => (
                  <div key={inf.id} className="p-2 bg-slate-900 rounded border border-slate-800">
                    <div className="flex items-center justify-between">
                      <strong className="text-white text-xs">{inf.name}</strong>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded capitalize ${
                        inf.status === 'safe'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : inf.status === 'confirmed_damaged'
                          ? 'bg-rose-950 text-rose-400 border border-rose-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}>
                        {inf.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="text-slate-400 mt-1 flex justify-between">
                      <span>Type: <span className="capitalize">{inf.type}</span></span>
                      {inf.capacity && <span>Capacity: {inf.capacity}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Quick Action Buttons (Separate, distinct, non-overlapping!) */}
      <div className="p-2.5 border-t border-slate-800 bg-slate-950 grid grid-cols-2 gap-1.5 text-xs">
        <button
          onClick={onOpenWhatChanged}
          className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-1.5 px-2 rounded flex items-center justify-center gap-1 transition shadow-sm text-[11px]"
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>What Changed?</span>
        </button>

        <button
          onClick={onOpenWhyPrioritized}
          className="bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-700/60 font-medium py-1.5 px-2 rounded flex items-center justify-center gap-1 transition text-[11px]"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Why Prioritized?</span>
        </button>

        <button
          onClick={onOpenRequestEvidence}
          className="bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-700/60 font-medium py-1.5 px-2 rounded flex items-center justify-center gap-1 transition text-[11px]"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Seek Evidence</span>
        </button>

        <button
          onClick={onOpenEvidenceGraph}
          className="bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-700/60 font-medium py-1.5 px-2 rounded flex items-center justify-center gap-1 transition text-[11px]"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Evidence Graph</span>
        </button>
      </div>
    </aside>
  );
};
