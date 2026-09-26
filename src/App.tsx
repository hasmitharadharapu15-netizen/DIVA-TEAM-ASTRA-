/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { DISASTER_SCENARIOS } from './data/datasets';
import { 
  DisasterIncident, 
  DisasterScenario, 
  ReviewStatus, 
  AssistanceRequestDraft 
} from './types/diva';
import { DivaHeader } from './components/Header/DivaHeader';
import { DisasterMap } from './components/Map/DisasterMap';
import { UnifiedIncidentConsole } from './components/CommandCenter/UnifiedIncidentConsole';
import { BottomActivityBar } from './components/CommandCenter/BottomActivityBar';
import { WhatIfLab } from './components/WhatIf/WhatIfLab';
import { EvidenceGraphView } from './components/Evidence/EvidenceGraphView';
import { AssistanceCoordinationView } from './components/Assistance/AssistanceCoordinationView';
import { EvaluationDashboard } from './components/Evaluation/EvaluationDashboard';
import { DatasetExplorer } from './components/Datasets/DatasetExplorer';
import { 
  WhatChangedModal, 
  WhyPrioritizedModal, 
  RequestEvidenceModal 
} from './components/Modals/DivaModals';
import { OperatorAssistantDrawer } from './components/Assistant/OperatorAssistantDrawer';
import { executeDivaTool, calculatePopulationImpact } from './agents/divaEngine';

export default function App() {
  const [currentScenarioId, setCurrentScenarioId] = useState<string>('hyderabad_flood');
  const [scenario, setScenario] = useState<DisasterScenario>(DISASTER_SCENARIOS.hyderabad_flood);
  const [incident, setIncident] = useState<DisasterIncident>(DISASTER_SCENARIOS.hyderabad_flood.initialIncident);
  
  // Navigation & Time
  const [activeTab, setActiveTab] = useState<'command' | 'whatif' | 'evidence_story' | 'assistance' | 'evaluation' | 'datasets'>('command');
  const [currentTimeStep, setCurrentTimeStep] = useState<string>('12:45');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Modals
  const [isWhatChangedOpen, setIsWhatChangedOpen] = useState(false);
  const [isWhyPrioritizedOpen, setIsWhyPrioritizedOpen] = useState(false);
  const [isRequestEvidenceOpen, setIsRequestEvidenceOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // Switch Scenario
  const handleSelectScenario = (scenarioId: string) => {
    const selected = DISASTER_SCENARIOS[scenarioId] || DISASTER_SCENARIOS.hyderabad_flood;
    setCurrentScenarioId(scenarioId);
    setScenario(selected);
    setIncident(selected.initialIncident);
    setCurrentTimeStep(selected.timeSteps[selected.timeSteps.length - 2] || selected.timeSteps[0]);
    setIsPlaying(false);
  };

  // Time Step Advance & Dynamic Simulation Update
  const handleSelectTimeStep = (step: string) => {
    setCurrentTimeStep(step);
    const stepIndex = scenario.timeSteps.indexOf(step);
    if (stepIndex === -1) return;

    // Dynamically adjust incident metrics based on step
    const progressRatio = (stepIndex + 1) / scenario.timeSteps.length;
    const baseArea = scenario.initialIncident.affectedAreaSqKm;
    const currentArea = parseFloat((baseArea * (0.4 + progressRatio * 0.6)).toFixed(2));
    const currentConfidence = Math.min(94, Math.max(45, Math.round(42 + progressRatio * 46)));

    // Recalculate population impact
    const popImpact = calculatePopulationImpact(
      incident.activeDisasterPolygon,
      scenario.populationZones,
      currentConfidence
    );

    setIncident((prev) => ({
      ...prev,
      currentTimeStepIndex: stepIndex,
      affectedAreaSqKm: currentArea,
      currentConfidencePercent: currentConfidence,
      uncertaintyMarginPercent: 100 - currentConfidence > 30 ? 25 : 12,
      estimatedPopulationImpact: popImpact,
    }));
  };

  // Autoplay simulation timer
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      const currentIndex = scenario.timeSteps.indexOf(currentTimeStep);
      const nextIndex = (currentIndex + 1) % scenario.timeSteps.length;
      handleSelectTimeStep(scenario.timeSteps[nextIndex]);
    }, 4500);

    return () => clearInterval(timer);
  }, [isPlaying, currentTimeStep, scenario]);

  // Review Queue actions
  const handleUpdateStatus = (incidentId: string, status: ReviewStatus, notes?: string) => {
    setIncident((prev) => ({
      ...prev,
      status,
    }));

    // Add audit log
    const ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setIncident((prev) => ({
      ...prev,
      agentLogs: [
        {
          id: `log-${Date.now()}`,
          timestamp: ts,
          agentName: 'DIVA Investigator',
          action: 'Human Operator Decision',
          resultSummary: `Operator updated review status to "${status.toUpperCase()}". Audit logged.`,
          outcomeType: status === 'confirmed' ? 'success' : status === 'false_positive' ? 'alert' : 'info',
        },
        ...prev.agentLogs,
      ],
    }));
  };

  // Trigger automated multi-tool investigation
  const handleTriggerInvestigation = (incidentId: string) => {
    const ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Simulate executing the tool chain
    const satResult = executeDivaTool('get_latest_satellite', {}, scenario);
    const healthResult = executeDivaTool('check_sensor_health', { sensorId: 'HYD-MUSI-03-FAULT' }, scenario);
    const missingResult = executeDivaTool('find_missing_evidence', {}, scenario);

    setIncident((prev) => ({
      ...prev,
      status: 'under_investigation',
      agentLogs: [
        missingResult.actionLog,
        healthResult.actionLog,
        satResult.actionLog,
        {
          id: `log-${Date.now()}`,
          timestamp: ts,
          agentName: 'DIVA Investigator',
          action: 'Autonomous Evidence-Seeking Loop Initiated',
          resultSummary: 'Auditing 8 sensors, satellite radar mask, and citizen call clusters. Contradictions investigated.',
          outcomeType: 'info',
        },
        ...prev.agentLogs,
      ],
    }));
  };

  // Evidence retrieved callback
  const handleEvidenceRetrieved = (note: string) => {
    const ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setIncident((prev) => ({
      ...prev,
      currentConfidencePercent: Math.min(95, prev.currentConfidencePercent + 4),
      uncertaintyMarginPercent: Math.max(5, prev.uncertaintyMarginPercent - 4),
      agentLogs: [
        {
          id: `log-${Date.now()}`,
          timestamp: ts,
          agentName: 'DIVA Investigator',
          action: 'Evidence Ingestion',
          resultSummary: note,
          outcomeType: 'success',
        },
        ...prev.agentLogs,
      ],
    }));
  };

  // Assistance Drafts update
  const handleUpdateDrafts = (drafts: AssistanceRequestDraft[]) => {
    setIncident((prev) => ({
      ...prev,
      assistanceDrafts: drafts,
    }));
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* 1. TOP BANNER & NAVIGATION BAR */}
      <DivaHeader
        currentScenario={scenario}
        onSelectScenario={handleSelectScenario}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        currentTimeStep={currentTimeStep}
        onSelectTimeStep={handleSelectTimeStep}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onResetTime={() => handleSelectTimeStep(scenario.timeSteps[0])}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        pendingReviewsCount={incident.status === 'pending' ? 1 : 0}
      />

      {/* 2. MAIN WORKSPACE CONTENT */}
      <main className="flex-1 flex overflow-hidden relative">
        {activeTab === 'command' && (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Clean 2-Section Layout: Spacious Map (Left) + Unified Decision Console (Right) */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
              {/* Left / Hero: Interactive Real-Time Disaster Map */}
              <div className="flex-1 h-full overflow-hidden relative min-h-[400px]">
                <DisasterMap
                  scenario={scenario}
                  incident={incident}
                  onOpenWhatChanged={() => setIsWhatChangedOpen(true)}
                  onOpenWhyPrioritized={() => setIsWhyPrioritizedOpen(true)}
                  onOpenRequestEvidence={() => setIsRequestEvidenceOpen(true)}
                  onOpenPopulationDetail={() => setActiveTab('whatif')}
                  onOpenAssistanceModal={() => setActiveTab('assistance')}
                />
              </div>

              {/* Right: Unified Incident & Human Review Console (Large non-overlapping buttons) */}
              <UnifiedIncidentConsole
                scenario={scenario}
                incident={incident}
                onUpdateStatus={handleUpdateStatus}
                onTriggerInvestigation={handleTriggerInvestigation}
                onOpenWhatChanged={() => setIsWhatChangedOpen(true)}
                onOpenWhyPrioritized={() => setIsWhyPrioritizedOpen(true)}
                onOpenRequestEvidence={() => setIsRequestEvidenceOpen(true)}
                onOpenAssistance={() => setActiveTab('assistance')}
                onOpenEvidenceGraph={() => setActiveTab('evidence_story')}
              />
            </div>

            {/* Bottom Activity Bar: Collapsible Agent Stream, Story Timeline, and Data Health Monitor */}
            <BottomActivityBar
              scenario={scenario}
              incident={incident}
              onOpenAssistant={() => setIsAssistantOpen(true)}
            />
          </div>
        )}

        {/* Tab 2: What-If Simulation Lab & Digital Twin */}
        {activeTab === 'whatif' && (
          <WhatIfLab
            scenario={scenario}
            incident={incident}
          />
        )}

        {/* Tab 3: Evidence Graph & Incident Story */}
        {activeTab === 'evidence_story' && (
          <EvidenceGraphView
            scenario={scenario}
            incident={incident}
          />
        )}

        {/* Tab 4: Assistance Coordination & Human Dispatch */}
        {activeTab === 'assistance' && (
          <AssistanceCoordinationView
            scenario={scenario}
            incident={incident}
            onUpdateDrafts={handleUpdateDrafts}
          />
        )}

        {/* Tab 5: Evaluation Benchmark */}
        {activeTab === 'evaluation' && (
          <EvaluationDashboard />
        )}

        {/* Tab 6: Dataset Explorer & Documentation */}
        {activeTab === 'datasets' && (
          <DatasetExplorer />
        )}
      </main>

      {/* 3. MODALS & DRAWERS */}
      <WhatChangedModal
        isOpen={isWhatChangedOpen}
        onClose={() => setIsWhatChangedOpen(false)}
        incident={incident}
      />

      <WhyPrioritizedModal
        isOpen={isWhyPrioritizedOpen}
        onClose={() => setIsWhyPrioritizedOpen(false)}
        incident={incident}
      />

      <RequestEvidenceModal
        isOpen={isRequestEvidenceOpen}
        onClose={() => setIsRequestEvidenceOpen(false)}
        scenario={scenario}
        incident={incident}
        onEvidenceRetrieved={handleEvidenceRetrieved}
      />

      <OperatorAssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        scenario={scenario}
        incident={incident}
        onOpenWhatChanged={() => setIsWhatChangedOpen(true)}
        onOpenWhyPrioritized={() => setIsWhyPrioritizedOpen(true)}
        onOpenAssistance={() => setActiveTab('assistance')}
      />
    </div>
  );
}
