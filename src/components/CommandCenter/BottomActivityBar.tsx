/**
 * DIVA Bottom Activity Bar
 * Contains:
 * - Live Agent Tool Calling Stream
 * - End-to-End Incident Story Engine
 * - Data Source Health Monitor (fresh, healthy, stale, suspicious, offline)
 */

import React, { useState } from 'react';
import { 
  AgentActionLog, 
  DisasterIncident, 
  DisasterScenario 
} from '../../types/diva';
import { 
  Terminal, 
  BookOpen, 
  Radio, 
  ChevronUp, 
  ChevronDown, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  Clock
} from 'lucide-react';

interface BottomActivityBarProps {
  scenario: DisasterScenario;
  incident: DisasterIncident;
  onOpenAssistant: () => void;
}

export const BottomActivityBar: React.FC<BottomActivityBarProps> = ({
  scenario,
  incident,
  onOpenAssistant,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [tab, setTab] = useState<'agent_logs' | 'story' | 'data_health'>('agent_logs');

  return (
    <div className="bg-slate-900 border-t border-slate-800 text-slate-100 flex flex-col z-20 shadow-xl transition-all duration-200">
      {/* Bar Header */}
      <div className="px-4 py-1.5 bg-slate-950 flex items-center justify-between border-b border-slate-800/80 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTab('agent_logs')}
            className={`px-3 py-1 rounded font-semibold flex items-center gap-1.5 transition ${
              tab === 'agent_logs'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/80'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Agent Activity & Tool Execution Stream ({incident.agentLogs.length})
          </button>

          <button
            onClick={() => setTab('story')}
            className={`px-3 py-1 rounded font-semibold flex items-center gap-1.5 transition ${
              tab === 'story'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/80'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Incident Story Engine (Chronological Evidence)
          </button>

          <button
            onClick={() => setTab('data_health')}
            className={`px-3 py-1 rounded font-semibold flex items-center gap-1.5 transition ${
              tab === 'data_health'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/80'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            Data Source Health Monitor
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400">
            DIVA Autonomous Loop Active
          </span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition"
            title={isExpanded ? 'Collapse activity bar' : 'Expand activity bar'}
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Content Area */}
      {isExpanded && (
        <div className="h-44 overflow-y-auto p-3 text-xs bg-slate-900/90 font-mono">
          {tab === 'agent_logs' && (
            <div className="space-y-1.5">
              {incident.agentLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-2.5 p-1.5 rounded hover:bg-slate-800/60 border border-transparent hover:border-slate-800"
                >
                  <span className="text-slate-500 text-[10px] w-14 flex-shrink-0 pt-0.5">
                    {log.timestamp}
                  </span>

                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ${
                    log.agentName.includes('Contradiction')
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : log.agentName.includes('Satellite')
                      ? 'bg-purple-950 text-purple-300 border border-purple-800'
                      : log.agentName.includes('Population')
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                  }`}>
                    {log.agentName}
                  </span>

                  <div className="flex-1 font-sans text-slate-300">
                    <span className="font-semibold text-white">{log.action}: </span>
                    {log.toolCalled && (
                      <code className="text-cyan-400 font-mono text-[11px] bg-slate-950 px-1 py-0.5 rounded border border-slate-800 mr-1.5">
                        {log.toolCalled}()
                      </code>
                    )}
                    <span>{log.resultSummary}</span>
                  </div>

                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                    log.outcomeType === 'success'
                      ? 'text-emerald-400'
                      : log.outcomeType === 'alert'
                      ? 'text-rose-400 animate-pulse'
                      : log.outcomeType === 'warning'
                      ? 'text-amber-400'
                      : 'text-slate-400'
                  }`}>
                    {log.outcomeType}
                  </span>
                </div>
              ))}
            </div>
          )}

          {tab === 'story' && (
            <div className="space-y-2 font-sans">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-2 font-semibold">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Workflow Progression: OBSERVE → DETECT → INVESTIGATE → SEEK EVIDENCE → CHECK CONTRADICTIONS → VERIFY → ESTIMATE IMPACT → EXPLAIN → PRIORITIZE</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                {incident.storyNarrative.map((item, idx) => (
                  <div key={idx} className="p-2 bg-slate-950/80 rounded border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                          {item.phase}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">{item.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-snug">
                        {item.narrative}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'data_health' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 font-sans">
              {scenario.sensors.map((s) => {
                const isSuspicious = s.health === 'suspicious' || s.name.includes('FAULT');
                return (
                  <div
                    key={s.id}
                    className={`p-2 rounded border ${
                      isSuspicious
                        ? 'bg-amber-950/40 border-amber-700/80 text-amber-200'
                        : 'bg-slate-950 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs truncate">{s.name}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                        isSuspicious ? 'bg-amber-900 text-amber-300' : 'bg-emerald-950 text-emerald-400'
                      }`}>
                        {s.health}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex justify-between">
                      <span>Value: <strong className="text-white">{s.value} {s.unit}</strong></span>
                      <span>Z: {s.zScore > 0 ? '+' : ''}{s.zScore}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
