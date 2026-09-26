/**
 * DIVA Header & Command Navigation Bar
 * Simplified, spacious, and responsive layout.
 * Ensures zero button overlap with clean spacing and clear visual hierarchy.
 */

import React from 'react';
import { 
  ShieldAlert, 
  Users, 
  Layers, 
  Sliders, 
  GitFork, 
  Send, 
  BarChart3, 
  Database,
  HelpCircle,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { DisasterScenario } from '../../types/diva';

interface DivaHeaderProps {
  currentScenario: DisasterScenario;
  onSelectScenario: (scenarioId: string) => void;
  activeTab: 'command' | 'whatif' | 'evidence_story' | 'assistance' | 'evaluation' | 'datasets';
  onSelectTab: (tab: 'command' | 'whatif' | 'evidence_story' | 'assistance' | 'evaluation' | 'datasets') => void;
  currentTimeStep: string;
  onSelectTimeStep: (step: string) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onResetTime: () => void;
  onOpenAssistant: () => void;
  pendingReviewsCount: number;
}

export const DivaHeader: React.FC<DivaHeaderProps> = ({
  currentScenario,
  onSelectScenario,
  activeTab,
  onSelectTab,
  currentTimeStep,
  onSelectTimeStep,
  isPlaying,
  onTogglePlay,
  onResetTime,
  onOpenAssistant,
  pendingReviewsCount,
}) => {
  const exposedPop = currentScenario.initialIncident.estimatedPopulationImpact.totalPotentiallyExposed;

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 flex-shrink-0 z-30 shadow-md">
      {/* 1. Main Navigation Row */}
      <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 bg-slate-950">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-base text-white">DIVA</span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                Disaster Intelligence & Verification Agent
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-950 text-emerald-400 border border-emerald-800/70">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                LIVE SIMULATION
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              “AI that investigates disasters, not just detects them.”
            </p>
          </div>
        </div>

        {/* Center: Scenario Switcher */}
        <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
          <label className="text-xs text-slate-400 font-semibold whitespace-nowrap">Disaster Scenario:</label>
          <select
            value={currentScenario.id}
            onChange={(e) => onSelectScenario(e.target.value)}
            className="bg-slate-800 hover:bg-slate-750 text-slate-100 text-xs font-semibold rounded px-2.5 py-1 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            <option value="hyderabad_flood">🇮🇳 Hyderabad Flood (Musi River & S-07 Contradiction)</option>
            <option value="nilgiris_wildfire">🇮🇳 Nilgiris Wildfire (Thermal IR & Tea Workers Risk)</option>
            <option value="cyclone_vizag">🇮🇳 Vizag Coastal Cyclone (118 km/h Gale & Surge)</option>
          </select>
        </div>

        {/* Right: Key Stats & Assistant */}
        <div className="flex items-center gap-2.5">
          <div className="hidden md:flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Potentially Exposed:</span>
            <span className="font-bold text-cyan-300">{exposedPop.toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs">
            <span className="text-slate-400">Human Action:</span>
            <span className="font-bold text-rose-400 px-1.5 py-0.5 rounded bg-rose-950 border border-rose-800 text-[10px]">
              {pendingReviewsCount} Review Pending
            </span>
          </div>

          <button
            onClick={onOpenAssistant}
            className="bg-cyan-700 hover:bg-cyan-600 text-white font-semibold text-xs rounded-lg px-3 py-1.5 flex items-center gap-1.5 transition shadow-sm"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Ask DIVA</span>
          </button>
        </div>
      </div>

      {/* 2. Navigation Tabs & Replay Bar */}
      <div className="px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 bg-slate-900 text-xs">
        {/* Navigation Tabs with generous spacing */}
        <nav className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <button
            onClick={() => onSelectTab('command')}
            className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'command'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>1. Command Center & Live Map</span>
          </button>

          <button
            onClick={() => onSelectTab('whatif')}
            className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'whatif'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>2. What-If Simulation Lab</span>
          </button>

          <button
            onClick={() => onSelectTab('evidence_story')}
            className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'evidence_story'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>3. Evidence Graph & Story</span>
          </button>

          <button
            onClick={() => onSelectTab('assistance')}
            className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'assistance'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>4. Assistance Coordination</span>
          </button>

          <button
            onClick={() => onSelectTab('evaluation')}
            className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'evaluation'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>5. Evaluation Benchmark</span>
          </button>

          <button
            onClick={() => onSelectTab('datasets')}
            className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'datasets'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>6. Dataset Explorer & Docs</span>
          </button>
        </nav>

        {/* Time Slider & Replay Bar */}
        <div className="flex items-center gap-2 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
          <span className="text-slate-400 font-medium">Replay:</span>
          <button
            onClick={onTogglePlay}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 transition"
            title={isPlaying ? 'Pause replay' : 'Play replay'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onResetTime}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            title="Reset to beginning"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-1">
            {currentScenario.timeSteps.map((step) => {
              const isSelected = currentTimeStep === step;
              return (
                <button
                  key={step}
                  onClick={() => onSelectTimeStep(step)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {step}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Workflow Progression Stepper Ribbon */}
      <div className="bg-slate-950/90 px-4 py-1 border-t border-slate-800/60 hidden xl:flex items-center justify-between text-[10px] text-slate-400 overflow-x-auto">
        <span className="font-bold text-cyan-400 mr-2 uppercase tracking-wider flex-shrink-0">
          Central Workflow:
        </span>
        <div className="flex items-center gap-1.5 flex-nowrap font-medium text-slate-300">
          <span className="text-slate-400">1. OBSERVE</span>
          <span className="text-slate-600">➔</span>
          <span className="text-slate-400">2. DETECT</span>
          <span className="text-slate-600">➔</span>
          <span className="text-slate-400">3. INVESTIGATE</span>
          <span className="text-slate-600">➔</span>
          <span className="text-slate-400">4. SEEK EVIDENCE</span>
          <span className="text-slate-600">➔</span>
          <span className="text-amber-400 font-bold bg-amber-950/60 px-1 rounded">5. CHECK CONTRADICTIONS</span>
          <span className="text-slate-600">➔</span>
          <span className="text-cyan-300 font-bold bg-cyan-950/60 px-1 rounded">6. VERIFY</span>
          <span className="text-slate-600">➔</span>
          <span className="text-emerald-300 font-bold bg-emerald-950/60 px-1 rounded">7. ESTIMATE IMPACT</span>
          <span className="text-slate-600">➔</span>
          <span className="text-slate-300">8. EXPLAIN</span>
          <span className="text-slate-600">➔</span>
          <span className="text-slate-300">9. PRIORITIZE</span>
          <span className="text-slate-600">➔</span>
          <span className="text-rose-400 font-bold bg-rose-950/60 px-1 rounded">10. HUMAN REVIEW</span>
          <span className="text-slate-600">➔</span>
          <span className="text-purple-300 font-bold bg-purple-950/60 px-1 rounded">11. COORDINATE</span>
          <span className="text-slate-600">➔</span>
          <span className="text-emerald-400 font-bold bg-emerald-950 px-1.5 rounded">12. HUMAN APPROVAL</span>
        </div>
      </div>
    </header>
  );
};
