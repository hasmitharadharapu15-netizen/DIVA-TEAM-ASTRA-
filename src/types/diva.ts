/**
 * DIVA — Disaster Intelligence & Verification Agent
 * Core Data Models & Type Definitions
 */

export type DisasterType = 'flood' | 'wildfire' | 'cyclone';

export type SensorType = 'water_level' | 'rainfall' | 'temperature' | 'smoke' | 'wind' | 'soil_moisture';

export type SensorHealth = 'fresh' | 'healthy' | 'stale' | 'suspicious' | 'offline';

export interface GeoPoint {
  lat: number;
  lng: number;
}

export type GeoPolygon = GeoPoint[];

export interface SensorReading {
  id: string;
  sensorId: string;
  name: string;
  type: SensorType;
  location: GeoPoint;
  timestamp: string;
  value: number;
  unit: string;
  baseline: number;
  threshold: number;
  zScore: number;
  percentageChange: number;
  health: SensorHealth;
  isAnomaly: boolean;
  notes?: string;
}

export interface WeatherObservation {
  id: string;
  timestamp: string;
  stationName: string;
  location: GeoPoint;
  rainfall1h: number; // mm
  rainfall6h: number; // mm
  temperature: number; // °C
  humidity: number; // %
  windSpeed: number; // km/h
  windGust: number; // km/h
  windDirection: string;
  pressure: number; // hPa
  anomalyFlag: boolean;
  source: 'Open-Meteo (Live/Verified)' | 'IMD Simulated Radar' | 'Local Met Station';
}

export interface SatelliteObservation {
  id: string;
  timestamp: string;
  satelliteName: string;
  sensorType: 'SAR (Synthetic Aperture Radar)' | 'Optical Multispectral' | 'Thermal IR';
  resolutionMeters: number;
  cloudCoveragePercent: number;
  imageQualityPercent: number;
  footprint: GeoPolygon;
  detectedPolygon: GeoPolygon;
  affectedAreaSqKm: number;
  previousAreaSqKm?: number;
  confidencePercent: number;
  detectionType: DisasterType;
  isModelSimulated: boolean;
  notes: string;
}

export interface IncidentReport {
  id: string;
  timestamp: string;
  reporterSource: 'Citizen App' | 'Traffic Police' | 'Emergency Call 112' | 'Field Ward Volunteer';
  locationName: string;
  coordinates: GeoPoint;
  rawText: string;
  extractedDisasterType: DisasterType;
  severityIndicator: 'low' | 'medium' | 'high' | 'critical';
  extractedNeeds: string[];
  credibilityScore: number; // 0 - 100
  verifiedByHuman: boolean;
}

export interface PopulationZone {
  id: string;
  name: string;
  wardNumber: string;
  polygon: GeoPolygon;
  totalPopulation: number;
  densityPerSqKm: number;
  vulnerableGroups: {
    childrenUnder5: number;
    elderlyAbove65: number;
    mobilityImpaired: number;
  };
  housingType: 'informal/slum' | 'mixed residential' | 'dense urban' | 'commercial';
}

export interface PopulationImpactEstimate {
  timestamp: string;
  totalPotentiallyExposed: number;
  highConfidenceZoneCount: number;
  uncertainZoneCount: number;
  requiringVerificationCount: number;
  methodology: string;
  confidencePercent: number;
  isEstimateOnly: true; // Explicit ethical guardrail
  affectedZoneBreakdown: {
    zoneId: string;
    zoneName: string;
    intersectionRatio: number;
    estimatedExposed: number;
    confidence: number;
  }[];
}

export interface InfrastructureItem {
  id: string;
  name: string;
  type: 'hospital' | 'school' | 'shelter' | 'bridge' | 'power_substation' | 'water_treatment' | 'major_road';
  location: GeoPoint;
  status: 'safe' | 'potentially_exposed' | 'critical_access_impaired' | 'confirmed_damaged';
  capacity?: number;
  elevationMeters?: number;
  contactNumber?: string;
}

export interface EmergencyServiceOrg {
  id: string;
  name: string;
  category: 'disaster_response' | 'fire_rescue' | 'hospital' | 'ngo_food_water' | 'police' | 'shelter' | 'utility';
  location: GeoPoint;
  address: string;
  coverageRadiusKm: number;
  contactChannel: string;
  phone: string;
  availability: 'ready' | 'deployed' | 'standby' | 'at_capacity';
  capacityScore: number; // 0 - 100
  serviceOfferings: string[];
  verifiedStatus: 'authorized_official' | 'registered_ngo' | 'unverified';
}

export type EvidenceRelation = 'SUPPORTS' | 'CONTRADICTS' | 'CORROBORATES' | 'PRECEDES' | 'DERIVED_FROM';

export interface EvidenceNode {
  id: string;
  type: 'satellite' | 'sensor' | 'weather' | 'citizen_report' | 'population_overlay' | 'historical_baseline';
  title: string;
  summary: string;
  timestamp: string;
  confidenceWeight: number; // 0 - 1
  sourceRecordId: string;
  isContradictory?: boolean;
  contradictionReason?: string;
  rawData?: any;
}

export interface EvidenceEdge {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  relation: EvidenceRelation;
  description: string;
}

export interface ContradictionFinding {
  id: string;
  sourceAId: string;
  sourceBId: string;
  evidenceSourceA: string;
  evidenceSourceB: string;
  contradictionType: 'sensor_disagreement' | 'satellite_vs_sensor' | 'timestamp_stale' | 'spurious_spike' | 'cloud_occlusion';
  severity: 'low' | 'medium' | 'high';
  explanation: string;
  confidenceImpact: number; // e.g. -12%
  resolved: boolean;
  resolutionNote?: string;
}

export interface ConfidenceEvolutionStep {
  timestamp: string;
  confidencePercent: number;
  triggerEvent: string;
  explanation: string;
  factors: {
    modelConfidence: number;
    evidenceAgreement: number;
    dataFreshness: number;
    sensorReliability: number;
    imageQuality: number;
    temporalConsistency: number;
    spatialConsistency: number;
    contradictionPenalty: number;
  };
}

export interface AgentActionLog {
  id: string;
  timestamp: string;
  agentName: 'Satellite Agent' | 'Sensor Agent' | 'Weather Agent' | 'DIVA Investigator' | 'Contradiction Hunter' | 'Population Impact Engine' | 'Service Matcher';
  action: string;
  toolCalled?: string;
  toolArgs?: any;
  resultSummary: string;
  outcomeType: 'info' | 'success' | 'warning' | 'alert';
}

export interface PriorityExplanation {
  priorityScore: number; // 1-100
  priorityLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'EVALUATE';
  factors: {
    factor: string;
    weight: number;
    score: number;
    rationale: string;
  }[];
}

export type ReviewStatus = 'pending' | 'confirmed' | 'false_positive' | 'insufficient_evidence' | 'under_investigation';

export interface AssistanceRequestDraft {
  id: string;
  incidentId: string;
  targetOrgId: string;
  targetOrgName: string;
  serviceCategory: string;
  draftedAt: string;
  incidentType: DisasterType;
  locationSummary: string;
  observedConditions: string;
  estimatedPotentiallyExposed: number;
  recommendedAssistanceTypes: string[];
  confidenceSummary: string;
  urgentNotice: string;
  status: 'draft_created' | 'human_reviewed' | 'approved' | 'sent' | 'acknowledged' | 'response_updated' | 'cancelled';
  humanApprover?: string;
  approvalNotes?: string;
  dispatchTimestamp?: string;
  mockSimulatedResponse?: string;
}

export interface DisasterIncident {
  id: string;
  name: string;
  disasterType: DisasterType;
  scenarioId: string;
  locationName: string;
  coordinates: GeoPoint;
  currentTimeStepIndex: number;
  timeSteps: string[];
  status: ReviewStatus;
  affectedAreaSqKm: number;
  growthRatePercent: number;
  currentConfidencePercent: number;
  uncertaintyMarginPercent: number;
  activeDisasterPolygon: GeoPolygon;
  uncertaintyPolygon?: GeoPolygon;
  estimatedPopulationImpact: PopulationImpactEstimate;
  potentialNeeds: string[];
  evidenceNodes: EvidenceNode[];
  evidenceEdges: EvidenceEdge[];
  contradictions: ContradictionFinding[];
  confidenceHistory: ConfidenceEvolutionStep[];
  agentLogs: AgentActionLog[];
  priorityReasoning: PriorityExplanation;
  assistanceDrafts: AssistanceRequestDraft[];
  storyNarrative: {
    time: string;
    phase: string;
    narrative: string;
  }[];
  whatChangedSummary: {
    previousTime: string;
    currentTime: string;
    areaChange: string;
    sensorChanges: string[];
    newReportsCount: number;
    populationExposureDelta: number;
    confidenceDelta: number;
  };
}

export interface DisasterScenario {
  id: string;
  title: string;
  subtitle: string;
  locationName: string;
  disasterType: DisasterType;
  center: GeoPoint;
  zoom: number;
  timeSteps: string[];
  description: string;
  isSimulated: boolean;
  dataSourceInfo: {
    geography: string;
    timeRange: string;
    sensorsCount: number;
    satellitesCount: number;
    weatherStationsCount: number;
    populationZonesCount: number;
    limitations: string;
  };
  initialIncident: DisasterIncident;
  sensors: SensorReading[];
  weather: WeatherObservation[];
  satellites: SatelliteObservation[];
  reports: IncidentReport[];
  populationZones: PopulationZone[];
  infrastructure: InfrastructureItem[];
  emergencyServices: EmergencyServiceOrg[];
}

export interface EvaluationBenchmarkModel {
  modelName: string;
  modelType: 'baseline_satellite' | 'baseline_sensors' | 'baseline_rules' | 'diva_multimodal_agent';
  precision: number;
  recall: number;
  f1Score: number;
  falsePositiveRate: number;
  iouScore: number; // Intersection over Union on flooded/burned area
  populationEstimationMape: number; // Mean Absolute Percentage Error
  meanDetectionLatencyMinutes: number;
  contradictionResolutionRate: number;
  humanReviewEfficiencyGain: number; // % reduction in human triage time
}
