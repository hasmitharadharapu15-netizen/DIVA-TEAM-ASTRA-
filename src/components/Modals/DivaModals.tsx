/**
 * DIVA Analytical Popups & Explainability Modals
 * - WhatChangedModal
 * - WhyPrioritizedModal
 * - RequestEvidenceModal
 */

import React from 'react';
import { DisasterIncident, DisasterScenario } from '../../types/diva';
import { 
  TrendingUp, 
  HelpCircle, 
  Search, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Users, 
  Layers,
  Sparkles
} from 'lucide-react';

interface WhatChangedModalProps {
  isOpen: boolean;
  onClose: () => void;
  incident: DisasterIncident;
}

export const WhatChangedModal: React.FC<WhatChangedModalProps> = ({
  isOpen,
  onClose,
  incident,
}) => {
  if (!isOpen) return null;
  const wc = incident.whatChangedSummary;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-5 text-slate-100 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">
              WHAT CHANGED? ({wc.previousTime} ➔ {wc.currentTime})
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
            <div>
              <span className="text-slate-400 block text-[11px]">Affected Surface Area:</span>
              <strong className="text-white text-sm">{wc.areaChange}</strong>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
              <div>
                <span className="text-slate-400 block text-[10px]">Population Exposure Shift:</span>
                <strong className="text-cyan-300 font-mono text-xs">+{wc.populationExposureDelta.toLocaleString()} people</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Multimodal AI Confidence:</span>
                <strong className="text-emerald-400 font-mono text-xs">+{wc.confidenceDelta}% increase</strong>
              </div>
            </div>
          </div>

          <div>
            <span className="font-semibold text-slate-300 block mb-1.5">Sensor & Environmental Telemetry Shifts:</span>
            <ul className="space-y-1 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              {wc.sensorChanges.map((change, idx) => (
                <li key={idx} className="flex items-start gap-1.5 text-slate-300">
                  <span className="text-cyan-400">•</span>
                  <span>{change}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-[11px] text-slate-400 bg-slate-850 p-2.5 rounded border border-slate-700">
            <strong>Deductive Summary:</strong> Heavy monsoonal influx has caused river gauge S-01 to breach warning levels. Inundation has widened eastward, threatening commercial thoroughfares in Amberpet and low-lying settlements in Moosarambagh.
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold px-4 py-1.5 rounded-lg text-xs"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};

interface WhyPrioritizedModalProps {
  isOpen: boolean;
  onClose: () => void;
  incident: DisasterIncident;
}

export const WhyPrioritizedModal: React.FC<WhyPrioritizedModalProps> = ({
  isOpen,
  onClose,
  incident,
}) => {
  if (!isOpen) return null;
  const p = incident.priorityReasoning;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-5 text-slate-100 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base font-bold text-white">
                WHY PRIORITIZED? (Score: {p.priorityScore}/100)
              </h2>
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                {p.priorityLevel} REVIEW PRIORITY
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-300">
          DIVA ranks incidents using transparent, factor-weighted criteria to optimize operator triage time. No black-box decisions.
        </p>

        <div className="space-y-2.5 text-xs max-h-80 overflow-y-auto pr-1">
          {p.factors.map((f, idx) => (
            <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-200">{f.factor}</span>
                <span className="font-mono text-cyan-300 font-bold">
                  Weight: {(f.weight * 100).toFixed(0)}% (Subscore: {f.score}/100)
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {f.rationale}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold px-4 py-1.5 rounded-lg text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

interface RequestEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenario: DisasterScenario;
  incident: DisasterIncident;
  onEvidenceRetrieved: (note: string) => void;
}

export const RequestEvidenceModal: React.FC<RequestEvidenceModalProps> = ({
  isOpen,
  onClose,
  scenario,
  incident,
  onEvidenceRetrieved,
}) => {
  if (!isOpen) return null;

  const handleTriggerRetrieval = (sourceName: string) => {
    onEvidenceRetrieved(`DIVA dispatched agent task: Retrieved ${sourceName}. Consensus uncertainty reduced by 4%.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-5 text-slate-100 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">
              REQUEST MORE EVIDENCE
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-300">
          Select an available evidentiary modality to reduce uncertainty margin (±{incident.uncertaintyMarginPercent}%):
        </p>

        <div className="space-y-2 text-xs">
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-white block">Sentinel-1C Synthetic Aperture Radar (SAR) Pass</span>
              <span className="text-[11px] text-slate-400">Pierces 100% cloud deck to map standing water specular reflection.</span>
            </div>
            <button
              onClick={() => handleTriggerRetrieval('Sentinel-1C InSAR Radar Tasking')}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold px-3 py-1 rounded text-xs ml-3"
            >
              Retrieve
            </button>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-white block">Ground Hydrological Gauge Calibration Diagnostics</span>
              <span className="text-[11px] text-slate-400">Queries internal battery & mechanical float arm resistance logs.</span>
            </div>
            <button
              onClick={() => handleTriggerRetrieval('Gauge S-07 Diagnostics Telemetry')}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold px-3 py-1 rounded text-xs ml-3"
            >
              Retrieve
            </button>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-white block">112 Emergency Dispatch Audio Logs</span>
              <span className="text-[11px] text-slate-400">Extracts geolocation and verified human distress calls.</span>
            </div>
            <button
              onClick={() => handleTriggerRetrieval('Emergency 112 Dispatch Call Transcripts')}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold px-3 py-1 rounded text-xs ml-3"
            >
              Retrieve
            </button>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-1.5 rounded-lg text-xs"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
