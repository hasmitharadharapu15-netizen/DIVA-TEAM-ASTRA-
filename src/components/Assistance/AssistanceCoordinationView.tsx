/**
 * DIVA Emergency Assistance Coordination & Human Authorization
 * Maintains response directory, performs service matching, and manages
 * the strictly human-authorized message dispatch lifecycle:
 * Draft Created → Human Reviewed → Approved → Sent → Acknowledged → Response Updated.
 */

import React, { useState } from 'react';
import { 
  DisasterIncident, 
  DisasterScenario, 
  EmergencyServiceOrg, 
  AssistanceRequestDraft 
} from '../../types/diva';
import { 
  generateAssistanceRequestDraft, 
  calculateDistanceKm 
} from '../../agents/divaEngine';
import { 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Edit3, 
  XCircle, 
  Phone, 
  Radio, 
  MapPin, 
  Users, 
  FileText,
  Building2,
  ChevronRight
} from 'lucide-react';

interface AssistanceCoordinationViewProps {
  scenario: DisasterScenario;
  incident: DisasterIncident;
  onUpdateDrafts: (drafts: AssistanceRequestDraft[]) => void;
}

export const AssistanceCoordinationView: React.FC<AssistanceCoordinationViewProps> = ({
  scenario,
  incident,
  onUpdateDrafts,
}) => {
  const [selectedOrgId, setSelectedOrgId] = useState<string>(scenario.emergencyServices[0]?.id || '');
  const [activeDraft, setActiveDraft] = useState<AssistanceRequestDraft | null>(incident.assistanceDrafts[0] || null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState('');
  const [operatorName, setOperatorName] = useState('Authorized Officer K. Sharma (GHMC DM)');

  const selectedOrg = scenario.emergencyServices.find((o) => o.id === selectedOrgId) || scenario.emergencyServices[0];

  // Handle generating new draft for selected org
  const handleCreateDraftForOrg = (org: EmergencyServiceOrg) => {
    const newDraft = generateAssistanceRequestDraft(incident, org);
    const updated = [newDraft, ...incident.assistanceDrafts];
    onUpdateDrafts(updated);
    setActiveDraft(newDraft);
    setIsEditing(false);
  };

  // Human approval and simulated dispatch
  const handleApproveAndSend = () => {
    if (!activeDraft) return;

    const ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Simulate realistic response
    let responseText = '';
    if (activeDraft.serviceCategory === 'disaster_response') {
      responseText = `ACKNOWLEDGED by NDRF Duty Officer (${ts}): Mobilized 4 Inflatable Rescue Boats (IRBs) and 24 personnel from Banjara Hills outpost. Staging near Chaderghat rotary. ETA 12 mins.`;
    } else if (activeDraft.serviceCategory === 'shelter') {
      responseText = `CONFIRMED by GHMC Shelter Superintendent (${ts}): Opened Malakpet Community Hall. 850 dry blankets and RO water dispensers active. Prepared for incoming evacuees.`;
    } else if (activeDraft.serviceCategory === 'ngo_food_water') {
      responseText = `CONFIRMED by Red Cross Dispatch (${ts}): 2,500 sealed meal packets and emergency halogen lights en route via dry bypass route.`;
    } else {
      responseText = `CONFIRMED by Duty Desk (${ts}): Resources alerted and standing by for human coordination.`;
    }

    const updatedDraft: AssistanceRequestDraft = {
      ...activeDraft,
      status: 'acknowledged',
      humanApprover: operatorName,
      dispatchTimestamp: ts,
      mockSimulatedResponse: responseText,
    };

    const updatedList = incident.assistanceDrafts.map((d) => (d.id === activeDraft.id ? updatedDraft : d));
    onUpdateDrafts(updatedList);
    setActiveDraft(updatedDraft);
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 overflow-y-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-950 text-purple-400 border border-purple-800">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              Emergency Assistance Coordination & Human Dispatch
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                Authorized Gateway
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Matches nearby rescue & relief services and prepares evidence-backed assistance messages requiring explicit human authorization.
            </p>
          </div>
        </div>
      </div>

      {/* CRITICAL SAFETY BANNER */}
      <div className="bg-purple-950/40 border-2 border-purple-600/80 rounded-xl p-3.5 flex items-start gap-3 shadow-lg">
        <ShieldCheck className="w-6 h-6 text-purple-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <h2 className="text-sm font-bold text-purple-200 uppercase tracking-wide">
            Mandatory Human Approval Protocol
          </h2>
          <p className="text-xs text-purple-300/90 leading-relaxed">
            DIVA never makes autonomous life-critical dispatch decisions. All assistance communications must be reviewed, authorized, and signed off by an authorized human operator before transmission.
          </p>
        </div>
      </div>

      {/* Main Grid: Directory on Left, AI-Drafted Request on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Organization Directory */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Nearby Emergency Services Directory ({scenario.emergencyServices.length})
            </span>
            <span className="text-[10px] text-cyan-400 font-mono">PostGIS Matched</span>
          </div>

          <div className="space-y-2">
            {scenario.emergencyServices.map((org) => {
              const isSelected = org.id === selectedOrgId;
              const dist = calculateDistanceKm(org.location, incident.coordinates);

              return (
                <div
                  key={org.id}
                  onClick={() => setSelectedOrgId(org.id)}
                  className={`p-3 rounded-lg border transition cursor-pointer ${
                    isSelected
                      ? 'bg-slate-850 border-purple-500 shadow-md ring-1 ring-purple-500/50'
                      : 'bg-slate-850/60 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-bold text-xs text-white leading-tight">
                      {org.name}
                    </h3>
                    <span className="text-[10px] font-mono text-cyan-400 font-semibold flex-shrink-0 ml-2">
                      {dist} km away
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 mb-2 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span className="truncate">{org.address}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-800">
                    <span className="capitalize text-slate-300">
                      Status: <strong className="text-emerald-400">{org.availability}</strong> ({org.capacityScore}%)
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOrgId(org.id);
                        handleCreateDraftForOrg(org);
                      }}
                      className="bg-purple-950 hover:bg-purple-900 text-purple-300 border border-purple-800 text-[10px] font-semibold px-2 py-0.5 rounded transition"
                    >
                      Draft Request →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI-Drafted Request & Approval Console */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div>
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                Evidence-Backed Assistance Request Draft
              </span>
              <span className="text-[10px] text-slate-400">
                Target: <strong className="text-purple-300">{activeDraft?.targetOrgName || selectedOrg.name}</strong>
              </span>
            </div>

            {activeDraft && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                activeDraft.status === 'acknowledged'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'bg-amber-950 text-amber-300 border border-amber-800'
              }`}>
                Lifecycle: {activeDraft.status.replace(/_/g, ' ')}
              </span>
            )}
          </div>

          {activeDraft ? (
            <div className="space-y-3 text-xs">
              {/* Communication Lifecycle Stepper */}
              <div className="grid grid-cols-4 gap-1 text-[10px] text-center font-semibold">
                <div className="bg-emerald-950 text-emerald-400 p-1.5 rounded border border-emerald-800">
                  1. Draft Prepared
                </div>
                <div className="bg-emerald-950 text-emerald-400 p-1.5 rounded border border-emerald-800">
                  2. Operator Review
                </div>
                <div className={`p-1.5 rounded border ${
                  activeDraft.status === 'acknowledged'
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  3. Approved & Sent
                </div>
                <div className={`p-1.5 rounded border ${
                  activeDraft.status === 'acknowledged'
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  4. Acknowledged
                </div>
              </div>

              {/* Message Payload Content */}
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-2 text-slate-200">
                <div className="text-[11px] text-slate-400 border-b border-slate-800 pb-1 flex justify-between">
                  <span>DISPATCH TYPE: FORMAL ASSISTANCE REQUEST</span>
                  <span className="font-mono">TIMESTAMP: {activeDraft.draftedAt}</span>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block text-[11px]">Incident Location:</span>
                  <p className="font-semibold text-white">{activeDraft.locationSummary}</p>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block text-[11px]">Observed Empirical Conditions:</span>
                  <p className="text-slate-300 leading-relaxed text-[11px]">{activeDraft.observedConditions}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 py-1">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Estimated Potentially Exposed:</span>
                    <strong className="text-cyan-300 font-mono">{activeDraft.estimatedPotentiallyExposed.toLocaleString()} people</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Confidence Level:</span>
                    <strong className="text-emerald-400">{activeDraft.confidenceSummary}</strong>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block text-[11px]">Recommended Specific Assistance Needs:</span>
                  <ul className="list-disc pl-4 space-y-0.5 text-slate-300 text-[11px]">
                    {activeDraft.recommendedAssistanceTypes.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="text-[10px] text-amber-300 bg-amber-950/40 p-2 rounded border border-amber-800/60">
                  {activeDraft.urgentNotice}
                </div>
              </div>

              {/* Operator Signature & Sign-Off Field */}
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Authorized Operator ID:</span>
                  <span className="font-bold text-white text-xs">{operatorName}</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">Role: INCIDENT_COMMANDER</span>
              </div>

              {/* Action Buttons (Approve & Send, Edit, Cancel) */}
              <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                {activeDraft.status !== 'acknowledged' ? (
                  <>
                    <button
                      onClick={handleApproveAndSend}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition shadow-md"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve & Dispatch Simulated Message</span>
                    </button>

                    <button
                      onClick={() => alert('Editing assistance parameters allowed in live console.')}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold py-2 px-3 rounded-lg flex items-center gap-1.5 transition"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Edit</span>
                    </button>
                  </>
                ) : (
                  <div className="w-full bg-emerald-950/60 border border-emerald-800/80 rounded-lg p-3 text-emerald-300 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Dispatched & Acknowledged by Agency</span>
                    </div>
                    <p className="text-[11px] text-emerald-200 leading-snug">
                      {activeDraft.mockSimulatedResponse}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-slate-500">
              Select an agency from the left and click "Draft Request" to prepare an evidence-supported message.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
