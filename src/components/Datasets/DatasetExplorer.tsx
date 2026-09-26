/**
 * DIVA Dataset Explorer & Documentation
 * Comprehensive data dictionary, metadata explorer, and transparent README
 * covering simulated vs real sources, sensor health, and algorithmic limitations.
 */

import React, { useState } from 'react';
import { DISASTER_SCENARIOS } from '../../data/datasets';
import { 
  Database, 
  FileText, 
  MapPin, 
  Clock, 
  Radio, 
  Layers, 
  AlertTriangle, 
  ShieldCheck, 
  Users,
  CheckCircle2
} from 'lucide-react';

export const DatasetExplorer: React.FC = () => {
  const [selectedScenarioKey, setSelectedScenarioKey] = useState<string>('hyderabad_flood');
  const scenario = DISASTER_SCENARIOS[selectedScenarioKey] || DISASTER_SCENARIOS.hyderabad_flood;

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 overflow-y-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-950 text-blue-400 border border-blue-800">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              Sample Disaster Dataset Explorer & Technical Documentation
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                Data Lineage & Ethics
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Audit data sources, simulated sensor telemetry, satellite resolutions, ground truth labels, and epistemic limitations.
            </p>
          </div>
        </div>

        {/* Dataset Switcher */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400">Select Dataset:</label>
          <select
            value={selectedScenarioKey}
            onChange={(e) => setSelectedScenarioKey(e.target.value)}
            className="bg-slate-900 text-slate-100 text-xs font-semibold rounded-md px-3 py-1.5 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            <option value="hyderabad_flood">Hyderabad Musi River Urban Flash Flood</option>
            <option value="nilgiris_wildfire">Nilgiris Biosphere Urban-Edge Wildfire</option>
            <option value="cyclone_vizag">Visakhapatnam Bay Cyclone & Storm Surge</option>
          </select>
        </div>
      </div>

      {/* Dataset Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Disaster Type</span>
          <span className="text-sm font-bold text-white capitalize">{scenario.disasterType}</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">IoT Sensors</span>
          <span className="text-sm font-bold text-cyan-300">{scenario.sensors.length} Stations</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Satellites</span>
          <span className="text-sm font-bold text-purple-300">{scenario.satellites.length} Passes</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Weather Stations</span>
          <span className="text-sm font-bold text-blue-300">{scenario.weather.length} Stations</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Citizen Reports</span>
          <span className="text-sm font-bold text-amber-300">{scenario.reports.length} Reports</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Ward Zones</span>
          <span className="text-sm font-bold text-emerald-300">{scenario.populationZones.length} Polygons</span>
        </div>
      </div>

      {/* Main README Documentation Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              README.md: {scenario.title}
            </h2>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
            SIMULATED BENCHMARK DATASET
          </span>
        </div>

        <div className="prose prose-invert max-w-none text-xs text-slate-300 space-y-3 leading-relaxed">
          <section>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider text-cyan-400 mb-1">
              1. Overview & Scenario Motivation
            </h3>
            <p>
              This scenario simulates extreme localized disaster conditions in <strong>{scenario.locationName}</strong>. It exercises DIVA's multimodal fusion pipeline across satellite earth observation, meteorological telemetry, ground IoT hydrological/pyrometric sensor arrays, and 112 citizen call dispatches.
            </p>
          </section>

          <section>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider text-cyan-400 mb-1">
              2. Data Sources & Realism Benchmark
            </h3>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
              <div>• <strong>Weather Data:</strong> Calibrated with Open-Meteo live historical monsoonal precipitation archives and IMD radar reflectivity curves.</div>
              <div>• <strong>Satellite Imagery:</strong> Simulated Sentinel-1C C-band Synthetic Aperture Radar (10m ground resolution) and Sentinel-2B optical imagery (cloud-occluded).</div>
              <div>• <strong>IoT Hydrology / Sensors:</strong> River gauges modeled after Central Water Commission (CWC) telemetry with one intentional mechanical silt-fault injection (Sensor S-07) to test contradiction hunting.</div>
              <div>• <strong>Demographics:</strong> GHMC municipal ward census boundaries with residential population density weighting.</div>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider text-cyan-400 mb-1">
              3. Known Limitations & Algorithmic Biases
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="bg-slate-950 p-3 rounded border border-slate-800">
                <strong className="text-amber-400 block mb-1">Demographic & Population Estimation:</strong>
                Spatial overlay estimates assume uniform residential distribution inside each census ward block. Actual micro-exposure will vary by building elevation and multistory floor height. Estimates must never be treated as confirmed casualties.
              </div>

              <div className="bg-slate-950 p-3 rounded border border-slate-800">
                <strong className="text-amber-400 block mb-1">Sensor Density & Hardware Faults:</strong>
                Sparse sensor distribution in developing urban regions can produce edge artifacts. DIVA accounts for this by computing dynamic uncertainty margins (±12%) around unverified boundaries.
              </div>

              <div className="bg-slate-950 p-3 rounded border border-slate-800">
                <strong className="text-amber-400 block mb-1">Satellite Temporal Revisit Latency:</strong>
                Sun-synchronous orbital constellations have revisit intervals of 1-3 days. DIVA bridges satellite gaps using real-time IoT sensors and weather forecasts.
              </div>

              <div className="bg-slate-950 p-3 rounded border border-slate-800">
                <strong className="text-amber-400 block mb-1">Human-in-the-Loop Decision Safety:</strong>
                Under DIVA governance protocols, all autonomous dispatch actions are restricted. AI drafts formal coordination notices, but transmission requires authenticated human confirmation.
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
