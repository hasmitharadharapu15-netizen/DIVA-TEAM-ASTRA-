/**
 * DIVA Evidence Graph & Incident Story Engine
 * Visual node-link evidence graph and chronological investigation story.
 */

import React, { useState } from 'react';
import { 
  DisasterIncident, 
  DisasterScenario, 
  EvidenceNode, 
  EvidenceEdge, 
  EvidenceRelation 
} from '../../types/diva';
import { 
  GitFork, 
  BookOpen, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Info,
  Radio,
  FileText
} from 'lucide-react';

interface EvidenceGraphViewProps {
  scenario: DisasterScenario;
  incident: DisasterIncident;
}

export const EvidenceGraphView: React.FC<EvidenceGraphViewProps> = ({
  scenario,
  incident,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>(incident.evidenceNodes[0]?.id || '');
  const [activeSubTab, setActiveSubTab] = useState<'graph' | 'story'>('graph');

  const selectedNode = incident.evidenceNodes.find((n) => n.id === selectedNodeId) || incident.evidenceNodes[0];

  // Helper for relationship badge color
  const getRelationBadge = (rel: EvidenceRelation) => {
    switch (rel) {
      case 'CONTRADICTS':
        return 'bg-rose-950 text-rose-300 border-rose-800';
      case 'SUPPORTS':
        return 'bg-emerald-950 text-emerald-300 border-emerald-800';
      case 'CORROBORATES':
        return 'bg-cyan-950 text-cyan-300 border-cyan-800';
      case 'PRECEDES':
        return 'bg-blue-950 text-blue-300 border-blue-800';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 overflow-y-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
            <GitFork className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              DIVA Evidence Graph & Epistemic Traceability
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                Auditable Reasoning
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Interactive relationship network connecting multi-modal observations, contradictions, and deductive chains.
            </p>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveSubTab('graph')}
            className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition ${
              activeSubTab === 'graph' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Interactive Node-Link Graph
          </button>
          <button
            onClick={() => setActiveSubTab('story')}
            className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition ${
              activeSubTab === 'story' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Chronological Story Engine
          </button>
        </div>
      </div>

      {activeSubTab === 'graph' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
          {/* Visual Graph Canvas / Card Layout */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Evidence Nodes ({incident.evidenceNodes.length}) & Directed Relationships ({incident.evidenceEdges.length})
              </span>
              <span className="text-[11px] text-cyan-400 font-mono">
                Click any node to inspect raw underlying telemetry
              </span>
            </div>

            {/* Nodes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              {incident.evidenceNodes.map((node) => {
                const isSelected = node.id === selectedNodeId;
                const isContradictory = node.isContradictory;

                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`p-3 rounded-lg border transition cursor-pointer relative ${
                      isSelected
                        ? 'bg-slate-850 border-cyan-500 shadow-md ring-1 ring-cyan-500/50'
                        : isContradictory
                        ? 'bg-amber-950/30 border-amber-700/80 hover:bg-amber-950/50'
                        : 'bg-slate-800/80 border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        node.type === 'satellite'
                          ? 'bg-purple-950 text-purple-300 border border-purple-800'
                          : node.type === 'weather'
                          ? 'bg-blue-950 text-blue-300 border border-blue-800'
                          : node.type === 'citizen_report'
                          ? 'bg-orange-950 text-orange-300 border border-orange-800'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}>
                        {node.type.replace('_', ' ')}
                      </span>

                      <span className="text-[10px] font-mono text-slate-400">{node.timestamp}</span>
                    </div>

                    <h3 className="font-bold text-xs text-white mb-1 flex items-center gap-1.5">
                      {isContradictory && <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />}
                      <span>{node.title}</span>
                    </h3>

                    <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                      {node.summary}
                    </p>

                    <div className="mt-2 pt-1.5 border-t border-slate-700/80 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">Confidence Weight:</span>
                      <span className="font-bold font-mono text-cyan-300">{(node.confidenceWeight * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Edge Relationships List */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-xs font-bold text-slate-300 block mb-2">
                Directed Edge Relationships:
              </span>
              <div className="space-y-1.5 text-[11px]">
                {incident.evidenceEdges.map((edge) => {
                  const fromNode = incident.evidenceNodes.find((n) => n.id === edge.fromNodeId);
                  const toNode = incident.evidenceNodes.find((n) => n.id === edge.toNodeId);

                  return (
                    <div key={edge.id} className="p-2 rounded bg-slate-900 border border-slate-800/80 flex items-start gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider flex-shrink-0 ${getRelationBadge(edge.relation)}`}>
                        {edge.relation}
                      </span>
                      <div className="flex-1">
                        <span className="text-slate-200 font-semibold">{fromNode?.title || edge.fromNodeId}</span>
                        <span className="text-slate-400 mx-1.5">➔</span>
                        <span className="text-slate-200 font-semibold">{toNode?.title || edge.toNodeId}</span>
                        <p className="text-slate-400 text-[10px] mt-0.5">{edge.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Node Inspector Detail Panel */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block border-b border-slate-800 pb-2">
              Node Inspector
            </span>

            {selectedNode ? (
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400">ID: {selectedNode.id}</span>
                  <h2 className="text-sm font-bold text-white mt-0.5">{selectedNode.title}</h2>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Observation Timestamp:</span>
                    <strong className="text-white font-mono">{selectedNode.timestamp}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Evidence Modality:</span>
                    <strong className="text-white capitalize">{selectedNode.type.replace('_', ' ')}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Weight in Consensus:</span>
                    <strong className="text-cyan-400 font-mono">{(selectedNode.confidenceWeight * 100).toFixed(0)}%</strong>
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-slate-300 block mb-1">Synthesized Finding:</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed bg-slate-800 p-2.5 rounded border border-slate-700">
                    {selectedNode.summary}
                  </p>
                </div>

                {selectedNode.isContradictory && (
                  <div className="bg-amber-950/80 border border-amber-700 rounded-lg p-3 text-amber-200 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span>Contradiction Hunter Finding</span>
                    </div>
                    <p className="text-[11px] text-amber-300 leading-snug">
                      {selectedNode.contradictionReason}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-slate-500 text-center py-8">Select a node to inspect details.</div>
            )}
          </div>
        </div>
      ) : (
        /* Chronological Incident Story Timeline */
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white mb-1">
              End-to-End Chronological Narrative
            </h2>
            <p className="text-xs text-slate-400">
              Converts raw disparate sensor pings, satellite passes, and emergency calls into an evidence-linked story of disaster evolution.
            </p>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-cyan-500/40">
            {incident.storyNarrative.map((item, idx) => (
              <div key={idx} className="relative">
                <span className="absolute -left-[19px] top-1 w-3 h-3 rounded-full bg-cyan-400 ring-4 ring-slate-900"></span>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {item.time}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
                    {item.phase}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                  {item.narrative}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
