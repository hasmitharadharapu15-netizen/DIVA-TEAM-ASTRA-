/**
 * DIVA What-If Simulation Lab & Disaster Digital Twin
 * Allows operators to dynamically modify environmental parameters
 * (rainfall rate, river level surge, wind speed, drainage obstruction)
 * and immediately see how modeled flood/fire extent and population exposure change.
 */

import React, { useState } from 'react';
import { DisasterIncident, DisasterScenario } from '../../types/diva';
import { runWhatIfSimulation, WhatIfParameters } from '../../agents/divaEngine';
import { 
  Sliders, 
  RotateCcw, 
  Users, 
  TrendingUp, 
  ShieldAlert, 
  Info,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface WhatIfLabProps {
  scenario: DisasterScenario;
  incident: DisasterIncident;
}

export const WhatIfLab: React.FC<WhatIfLabProps> = ({
  scenario,
  incident,
}) => {
  const isFlood = incident.disasterType === 'flood';
  const isWildfire = incident.disasterType === 'wildfire';

  const defaultParams: WhatIfParameters = {
    rainfallRateMmH: isFlood ? 68.5 : isWildfire ? 0 : 94,
    riverSurgeDeltaMeters: isFlood ? 1.2 : isWildfire ? 0 : 2.5,
    windSpeedKmH: isWildfire ? 42 : isFlood ? 38 : 118,
    drainageObstructionPercent: isFlood ? 45 : 15,
  };

  const [params, setParams] = useState<WhatIfParameters>(defaultParams);

  // Compute what-if simulation
  const simResult = runWhatIfSimulation(incident, scenario.populationZones, params);

  const deltaArea = simResult.simulatedAreaSqKm - incident.affectedAreaSqKm;
  const deltaPop = simResult.simulatedPopulationImpact.totalPotentiallyExposed - incident.estimatedPopulationImpact.totalPotentiallyExposed;

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 overflow-y-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
              <Sliders className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-lg font-bold text-white flex items-center gap-2">
                What-If Simulation Lab & Disaster Digital Twin
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                  Exploratory Modeling
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Stress-test municipal resilience by perturbing meteorological, hydrological, and drainage constraints.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setParams(defaultParams)}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold px-3 py-1.5 rounded-md flex items-center gap-1.5 transition text-xs"
        >
          <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
          <span>Reset to Baseline Telemetry</span>
        </button>
      </div>

      {/* Safety Notice */}
      <div className="bg-amber-950/40 border border-amber-800/80 rounded-lg p-3 text-xs text-amber-300 flex items-start gap-2">
        <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong>Exploratory Decision-Support Notice:</strong> Parameter perturbations generate counterfactual forward projections to assist evacuation planning and resource prepositioning. They are analytical simulations and must never be represented as guaranteed deterministic forecasts.
        </div>
      </div>

      {/* Main Grid: Sliders on left, Model Outcomes on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Sliders Panel */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
          <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-2">
            <span>Environmental & Infrastructure Perturbations</span>
          </h2>

          {/* Slider 1: Rainfall Rate */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300">
                {isFlood ? 'Convective Rainfall Rate:' : isWildfire ? 'Ambient Precipitation (Dryness Index):' : 'Cyclonic Deluge Rate:'}
              </span>
              <span className="font-mono font-bold text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                {params.rainfallRateMmH} mm/h
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={150}
              step={5}
              value={params.rainfallRateMmH}
              onChange={(e) => setParams({ ...params, rainfallRateMmH: parseFloat(e.target.value) })}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0 mm/h (Dry)</span>
              <span>65 mm/h (Severe)</span>
              <span>150 mm/h (Cloudburst)</span>
            </div>
          </div>

          {/* Slider 2: River / Storm Surge Delta */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300">
                {isFlood ? 'River Crest / Weir Overtopping Surge:' : isWildfire ? 'Fuel Dryness / Heat Radiance Factor:' : 'Oceanic Storm Surge Height:'}
              </span>
              <span className="font-mono font-bold text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                {params.riverSurgeDeltaMeters > 0 ? '+' : ''}{params.riverSurgeDeltaMeters} meters
              </span>
            </div>
            <input
              type="range"
              min={-1.0}
              max={3.0}
              step={0.1}
              value={params.riverSurgeDeltaMeters}
              onChange={(e) => setParams({ ...params, riverSurgeDeltaMeters: parseFloat(e.target.value) })}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>-1.0m (Recession)</span>
              <span>0.0m (Current)</span>
              <span>+3.0m (Catastrophic)</span>
            </div>
          </div>

          {/* Slider 3: Wind Velocity */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300">Sustained Wind Velocity & Gusts:</span>
              <span className="font-mono font-bold text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                {params.windSpeedKmH} km/h
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={150}
              step={5}
              value={params.windSpeedKmH}
              onChange={(e) => setParams({ ...params, windSpeedKmH: parseFloat(e.target.value) })}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>5 km/h (Calm)</span>
              <span>50 km/h (Moderate)</span>
              <span>150 km/h (Cyclone)</span>
            </div>
          </div>

          {/* Slider 4: Urban Drainage Obstruction */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300">
                {isFlood ? 'Storm Nala / Silt & Debris Blockage:' : 'Slope Steepness / Canopy Density:'}
              </span>
              <span className="font-mono font-bold text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                {params.drainageObstructionPercent}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={params.drainageObstructionPercent}
              onChange={(e) => setParams({ ...params, drainageObstructionPercent: parseFloat(e.target.value) })}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0% (Clean Canals)</span>
              <span>50% (Partial Clog)</span>
              <span>100% (Complete Choke)</span>
            </div>
          </div>

          {/* Digital Twin Insights */}
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-300 space-y-1">
            <span className="font-bold text-cyan-300 block">Hydraulic Digital Twin Rationale:</span>
            <p className="leading-relaxed">
              When urban silt blockage rises past 40%, Musi tributary culverts fail to discharge at designed 2,200 m³/sec capacity, inducing violent lateral backflow into low-lying settlements (Moosarambagh and Chaderghat).
            </p>
          </div>
        </div>

        {/* Model Projection Outcomes */}
        <div className="lg:col-span-7 space-y-4">
          {/* Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Baseline Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Current Baseline Telemetry
              </span>
              <div className="text-xl font-bold text-white mb-2">
                {incident.affectedAreaSqKm} km² Area
              </div>
              <div className="text-xs text-slate-300 space-y-1">
                <div>Potentially Exposed: <strong className="text-cyan-400">{incident.estimatedPopulationImpact.totalPotentiallyExposed.toLocaleString()}</strong></div>
                <div>High-Confidence: <strong>{incident.estimatedPopulationImpact.highConfidenceZoneCount.toLocaleString()}</strong></div>
                <div>Uncertain Zone: <strong>{incident.estimatedPopulationImpact.uncertainZoneCount.toLocaleString()}</strong></div>
                <div>Model Confidence: <strong>{incident.currentConfidencePercent}%</strong></div>
              </div>
            </div>

            {/* Modeled What-If Outcome Card */}
            <div className="bg-slate-900 border border-cyan-500/60 shadow-lg shadow-cyan-950/40 rounded-xl p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block mb-1">
                Simulated Counterfactual Projection
              </span>
              <div className="text-xl font-bold text-white mb-2 flex items-center justify-between">
                <span>{simResult.simulatedAreaSqKm} km²</span>
                <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                  deltaArea >= 0 ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}>
                  {deltaArea >= 0 ? '+' : ''}{deltaArea.toFixed(2)} km²
                </span>
              </div>
              <div className="text-xs text-slate-300 space-y-1">
                <div>Potentially Exposed: <strong className="text-cyan-300">{simResult.simulatedPopulationImpact.totalPotentiallyExposed.toLocaleString()}</strong> ({deltaPop >= 0 ? '+' : ''}{deltaPop.toLocaleString()})</div>
                <div>High-Confidence: <strong>{simResult.simulatedPopulationImpact.highConfidenceZoneCount.toLocaleString()}</strong></div>
                <div>Uncertain Zone: <strong>{simResult.simulatedPopulationImpact.uncertainZoneCount.toLocaleString()}</strong></div>
                <div>Simulated Confidence: <strong>{simResult.simulatedConfidence}%</strong></div>
              </div>
            </div>
          </div>

          {/* Ward Exposure Breakdown Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center justify-between">
              <span>Municipal Ward Exposure Shift Under Simulation</span>
              <span className="text-[10px] text-slate-400 font-normal">PostGIS Intersection Recalculated</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase font-bold">
                    <th className="pb-2">Ward Name</th>
                    <th className="pb-2">Total Ward Pop</th>
                    <th className="pb-2">Modeled Ratio</th>
                    <th className="pb-2 text-right">Simulated Exposure</th>
                    <th className="pb-2 text-right">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {simResult.simulatedPopulationImpact.affectedZoneBreakdown.map((row) => (
                    <tr key={row.zoneId} className="hover:bg-slate-850">
                      <td className="py-2 font-medium text-white">{row.zoneName}</td>
                      <td className="py-2 text-slate-400">
                        {scenario.populationZones.find((z) => z.id === row.zoneId)?.totalPopulation.toLocaleString()}
                      </td>
                      <td className="py-2 font-mono text-cyan-300">{(row.intersectionRatio * 100).toFixed(0)}%</td>
                      <td className="py-2 text-right font-bold text-white">{row.estimatedExposed.toLocaleString()}</td>
                      <td className="py-2 text-right text-emerald-400">{row.confidence}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-3 text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded border border-slate-800 flex items-center justify-between">
              <span>{simResult.impactDeltaNotes}</span>
              <span className="text-[10px] text-emerald-400 font-semibold">✓ 0ms Real-Time Calculation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
