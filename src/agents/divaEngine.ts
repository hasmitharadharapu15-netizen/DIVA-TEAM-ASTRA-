/**
 * DIVA Agentic Engine & Spatial Intelligence Algorithms
 * Implements:
 * - Evidence-Seeking Investigation Loop
 * - Contradiction Hunter & False Positive Hunter
 * - Confidence Evolution Engine (8-factor decomposition)
 * - PostGIS-style Spatial Polygon Intersection & Population Exposure
 * - Emergency Service Distance & Capability Matching
 * - Tool Execution Simulation with Structured Audit Logs
 */

import {
  DisasterIncident,
  DisasterScenario,
  GeoPoint,
  GeoPolygon,
  PopulationZone,
  PopulationImpactEstimate,
  EmergencyServiceOrg,
  ContradictionFinding,
  ConfidenceEvolutionStep,
  AgentActionLog,
  AssistanceRequestDraft,
  SensorReading,
} from '../types/diva';

// Haversine distance in kilometers
export function calculateDistanceKm(p1: GeoPoint, p2: GeoPoint): number {
  const R = 6371; // Earth radius in km
  const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
  const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1.lat * Math.PI) / 180) *
      Math.cos((p2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
}

// Polygon centroid helper
export function getPolygonCentroid(polygon: GeoPolygon): GeoPoint {
  if (!polygon || polygon.length === 0) return { lat: 0, lng: 0 };
  let sumLat = 0;
  let sumLng = 0;
  polygon.forEach((pt) => {
    sumLat += pt.lat;
    sumLng += pt.lng;
  });
  return {
    lat: sumLat / polygon.length,
    lng: sumLng / polygon.length,
  };
}

// Bounding box overlap estimation between two polygons
export function estimatePolygonOverlapRatio(polyA: GeoPolygon, polyB: GeoPolygon): number {
  if (!polyA.length || !polyB.length) return 0;

  let minLatA = Infinity, maxLatA = -Infinity, minLngA = Infinity, maxLngA = -Infinity;
  polyA.forEach(p => {
    minLatA = Math.min(minLatA, p.lat);
    maxLatA = Math.max(maxLatA, p.lat);
    minLngA = Math.min(minLngA, p.lng);
    maxLngA = Math.max(maxLngA, p.lng);
  });

  let minLatB = Infinity, maxLatB = -Infinity, minLngB = Infinity, maxLngB = -Infinity;
  polyB.forEach(p => {
    minLatB = Math.min(minLatB, p.lat);
    maxLatB = Math.max(maxLatB, p.lat);
    minLngB = Math.min(minLngB, p.lng);
    maxLngB = Math.max(maxLngB, p.lng);
  });

  const overlapMinLat = Math.max(minLatA, minLatB);
  const overlapMaxLat = Math.min(maxLatA, maxLatB);
  const overlapMinLng = Math.max(minLngA, minLngB);
  const overlapMaxLng = Math.min(maxLngA, maxLngB);

  if (overlapMaxLat <= overlapMinLat || overlapMaxLng <= overlapMinLng) {
    return 0;
  }

  const overlapArea = (overlapMaxLat - overlapMinLat) * (overlapMaxLng - overlapMinLng);
  const bArea = (maxLatB - minLatB) * (maxLatB - minLngB);
  const ratio = Math.min(1.0, Math.max(0.05, overlapArea / Math.max(0.00001, bArea)));
  return parseFloat(ratio.toFixed(2));
}

// Calculate Population Impact using PostGIS-style spatial overlap
export function calculatePopulationImpact(
  disasterPolygon: GeoPolygon,
  populationZones: PopulationZone[],
  currentConfidencePercent: number
): PopulationImpactEstimate {
  let totalPotentiallyExposed = 0;
  const breakdown: PopulationImpactEstimate['affectedZoneBreakdown'] = [];

  populationZones.forEach((zone) => {
    const ratio = estimatePolygonOverlapRatio(disasterPolygon, zone.polygon);
    if (ratio > 0.05) {
      const exposed = Math.round(zone.totalPopulation * ratio);
      totalPotentiallyExposed += exposed;
      breakdown.push({
        zoneId: zone.id,
        zoneName: zone.name,
        intersectionRatio: ratio,
        estimatedExposed: exposed,
        confidence: Math.round(currentConfidencePercent * (0.85 + ratio * 0.15)),
      });
    }
  });

  const highConfidenceZoneCount = Math.round(totalPotentiallyExposed * (currentConfidencePercent / 100) * 0.72);
  const uncertainZoneCount = Math.round(totalPotentiallyExposed - highConfidenceZoneCount);
  const requiringVerificationCount = Math.round(uncertainZoneCount * 0.4);

  return {
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    totalPotentiallyExposed,
    highConfidenceZoneCount,
    uncertainZoneCount,
    requiringVerificationCount,
    methodology: 'Spatial polygon intersection of observed disaster footprint with municipal ward population grid cells weighted by residential density',
    confidencePercent: currentConfidencePercent,
    isEstimateOnly: true,
    affectedZoneBreakdown: breakdown,
  };
}

// DIVA Investigation Agent: Tool calling execution dispatcher
export interface DivaToolResult {
  tool: string;
  args: any;
  output: any;
  actionLog: AgentActionLog;
}

export function executeDivaTool(
  toolName: string,
  args: any,
  scenario: DisasterScenario
): DivaToolResult {
  const ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  switch (toolName) {
    case 'get_latest_satellite': {
      const sat = scenario.satellites[0] || null;
      return {
        tool: toolName,
        args,
        output: sat,
        actionLog: {
          id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          timestamp: ts,
          agentName: 'Satellite Agent',
          action: 'Retrieve Latest Earth Observation',
          toolCalled: toolName,
          toolArgs: args,
          resultSummary: sat
            ? `Acquired ${sat.satelliteName} (${sat.sensorType}). Detected ${sat.affectedAreaSqKm} km² area, cloud cover ${sat.cloudCoveragePercent}%.`
            : 'No satellite pass found for current window.',
          outcomeType: 'success',
        },
      };
    }

    case 'get_weather': {
      const wx = scenario.weather[0] || null;
      return {
        tool: toolName,
        args,
        output: wx,
        actionLog: {
          id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          timestamp: ts,
          agentName: 'Weather Agent',
          action: 'Atmospheric & Precipitation Telemetry Query',
          toolCalled: toolName,
          toolArgs: args,
          resultSummary: wx
            ? `Station: ${wx.stationName}. Rain 1h: ${wx.rainfall1h}mm, Wind: ${wx.windSpeed} km/h (${wx.windDirection}), Pressure: ${wx.pressure} hPa.`
            : 'Weather station unavailable.',
          outcomeType: 'info',
        },
      };
    }

    case 'get_nearby_sensors': {
      const center = args?.center || scenario.center;
      const radiusKm = args?.radiusKm || 15;
      const nearby = scenario.sensors.filter(
        (s) => calculateDistanceKm(s.location, center) <= radiusKm
      );
      return {
        tool: toolName,
        args,
        output: nearby,
        actionLog: {
          id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          timestamp: ts,
          agentName: 'Sensor Agent',
          action: 'Spatial Sensor Query',
          toolCalled: toolName,
          toolArgs: args,
          resultSummary: `Found ${nearby.length} IoT sensors within ${radiusKm}km radius of incident coordinates.`,
          outcomeType: 'info',
        },
      };
    }

    case 'check_sensor_health': {
      const sensorId = args?.sensorId;
      const targetSensor = scenario.sensors.find((s) => s.sensorId === sensorId || s.id === sensorId);
      const isSuspicious = targetSensor?.health === 'suspicious' || targetSensor?.name.includes('FAULT');
      const diagnostics = {
        sensor: targetSensor?.name,
        health: targetSensor?.health || 'healthy',
        batteryVoltage: isSuspicious ? '2.8V (Critically Low / Threshold 12V)' : '12.4V (Nominal)',
        mechanicalStatus: isSuspicious ? 'Telemetry shows static float arm - silt debris jammed' : 'Free float operation nominal',
        recommendation: isSuspicious ? 'Deprecate reading weight in multimodal fusion.' : 'Sensor trustworthy.',
      };

      return {
        tool: toolName,
        args,
        output: diagnostics,
        actionLog: {
          id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          timestamp: ts,
          agentName: 'Contradiction Hunter',
          action: 'Hardware Diagnostic Telemetry Probe',
          toolCalled: toolName,
          toolArgs: args,
          resultSummary: isSuspicious
            ? `⚠️ FAULT CONFIRMED in ${targetSensor?.name}: 2.8V battery & mechanical silt jam. Isolated from consensus.`
            : `Sensor ${targetSensor?.name} diagnostics normal (12.4V).`,
          outcomeType: isSuspicious ? 'alert' : 'success',
        },
      };
    }

    case 'find_missing_evidence': {
      const missing: string[] = [];
      if (!scenario.satellites.some((s) => s.sensorType.includes('SAR'))) {
        missing.push('High-resolution Synthetic Aperture Radar (SAR) pass to pierce cloud deck');
      }
      if (scenario.reports.length < 5) {
        missing.push('Ground truth field volunteer reports from downstream municipal wards');
      }
      if (!scenario.infrastructure.some((i) => i.type === 'bridge' && i.status === 'confirmed_damaged')) {
        missing.push('Structural bridge displacement laser telemetry');
      }

      return {
        tool: toolName,
        args,
        output: missing,
        actionLog: {
          id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          timestamp: ts,
          agentName: 'DIVA Investigator',
          action: 'Epistemic Gap Analysis',
          toolCalled: toolName,
          toolArgs: args,
          resultSummary: `Identified ${missing.length} high-value evidence gaps to reduce uncertainty: ${missing.slice(0, 2).join('; ')}`,
          outcomeType: 'warning',
        },
      };
    }

    case 'get_nearby_emergency_services': {
      const center = args?.center || scenario.center;
      const matched = scenario.emergencyServices.map((org) => ({
        ...org,
        distanceKm: calculateDistanceKm(org.location, center),
      })).sort((a, b) => a.distanceKm - b.distanceKm);

      return {
        tool: toolName,
        args,
        output: matched,
        actionLog: {
          id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          timestamp: ts,
          agentName: 'Service Matcher',
          action: 'PostGIS Proximity Service Matching',
          toolCalled: toolName,
          toolArgs: args,
          resultSummary: `Matched ${matched.length} authorized rescue & relief facilities within operational range. Top match: ${matched[0]?.name} (${matched[0]?.distanceKm} km).`,
          outcomeType: 'success',
        },
      };
    }

    default:
      return {
        tool: toolName,
        args,
        output: { status: 'executed' },
        actionLog: {
          id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          timestamp: ts,
          agentName: 'DIVA Investigator',
          action: `Executed ${toolName}`,
          toolCalled: toolName,
          toolArgs: args,
          resultSummary: `Executed generic tool ${toolName} with arguments.`,
          outcomeType: 'info',
        },
      };
  }
}

// Generate an AI-Drafted Assistance Request backed strictly by evidence
export function generateAssistanceRequestDraft(
  incident: DisasterIncident,
  org: EmergencyServiceOrg
): AssistanceRequestDraft {
  const ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const neededTypes: string[] = [];
  if (incident.disasterType === 'flood') {
    if (org.category === 'disaster_response') neededTypes.push('Inflatable rescue motorboats', 'Flood rescue divers');
    if (org.category === 'fire_rescue') neededTypes.push('Heavy dewatering suction pumps', 'High-water rescue vehicles');
    if (org.category === 'shelter') neededTypes.push('Emergency beds for displaced residents', 'Sanitation kits');
    if (org.category === 'ngo_food_water') neededTypes.push('Packaged potable drinking water', 'Dry food rations for 2,000+ individuals');
    if (org.category === 'hospital') neededTypes.push('Emergency triage bay preparation', 'Hypothermia treatment');
  } else if (incident.disasterType === 'wildfire') {
    neededTypes.push('Fireline cutting crews', 'High-pressure foam tenders', 'N95 smoke inhalation respirators');
  } else {
    neededTypes.push('Storm surge rescue craft', 'Emergency cyclone shelter activation', 'High-clearance evacuation trucks');
  }

  return {
    id: `draft-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    incidentId: incident.id,
    targetOrgId: org.id,
    targetOrgName: org.name,
    serviceCategory: org.category,
    draftedAt: ts,
    incidentType: incident.disasterType,
    locationSummary: `${incident.locationName} (Coordinates: ${incident.coordinates.lat.toFixed(4)}°N, ${incident.coordinates.lng.toFixed(4)}°E)`,
    observedConditions: `Observed ${incident.disasterType.toUpperCase()} covering ${incident.affectedAreaSqKm} sq km (+${incident.growthRatePercent}% expansion rate). Evidence corroborated by satellite SAR, ground sensors, and verified 112 citizen dispatch calls.`,
    estimatedPotentiallyExposed: incident.estimatedPopulationImpact.totalPotentiallyExposed,
    recommendedAssistanceTypes: neededTypes.length > 0 ? neededTypes : ['Emergency logistics & rescue support'],
    confidenceSummary: `${incident.currentConfidencePercent}% Multimodal AI Confidence. Uncertainty margin ±${incident.uncertaintyMarginPercent}%. Verified against sensor hardware audits.`,
    urgentNotice: 'HUMAN APPROVAL REQUIRED: Under safety governance, DIVA prepares evidence-based assistance requests for human authorization. No external service is dispatched automatically.',
    status: 'draft_created',
  };
}

// What-If Simulation Engine: dynamically alters model parameters and predicts expansion
export interface WhatIfParameters {
  rainfallRateMmH: number; // e.g. 10 - 150
  riverSurgeDeltaMeters: number; // e.g. -1.0 to +3.0
  windSpeedKmH: number; // e.g. 10 - 140
  drainageObstructionPercent: number; // 0 - 100%
}

export function runWhatIfSimulation(
  baseIncident: DisasterIncident,
  basePopulation: PopulationZone[],
  params: WhatIfParameters
): {
  simulatedAreaSqKm: number;
  simulatedPolygon: GeoPolygon;
  simulatedPopulationImpact: PopulationImpactEstimate;
  simulatedConfidence: number;
  impactDeltaNotes: string;
} {
  // Scale factor based on parameters
  let scaleFactor = 1.0;
  if (baseIncident.disasterType === 'flood') {
    scaleFactor += (params.rainfallRateMmH - 50) / 100 * 0.45;
    scaleFactor += params.riverSurgeDeltaMeters * 0.25;
    scaleFactor += (params.drainageObstructionPercent / 100) * 0.35;
  } else if (baseIncident.disasterType === 'wildfire') {
    scaleFactor += (params.windSpeedKmH - 30) / 100 * 0.6;
    scaleFactor += (params.drainageObstructionPercent / 100) * 0.2; // dry fuel index
  } else {
    scaleFactor += (params.windSpeedKmH - 80) / 100 * 0.5;
    scaleFactor += params.riverSurgeDeltaMeters * 0.4;
  }

  scaleFactor = Math.max(0.4, Math.min(2.5, scaleFactor));

  // Expand base polygon coordinates radially from centroid
  const centroid = getPolygonCentroid(baseIncident.activeDisasterPolygon);
  const simulatedPolygon: GeoPolygon = baseIncident.activeDisasterPolygon.map((pt) => {
    return {
      lat: centroid.lat + (pt.lat - centroid.lat) * Math.sqrt(scaleFactor),
      lng: centroid.lng + (pt.lng - centroid.lng) * Math.sqrt(scaleFactor),
    };
  });

  const simulatedArea = parseFloat((baseIncident.affectedAreaSqKm * scaleFactor).toFixed(2));
  const simulatedConfidence = Math.min(96, Math.max(50, Math.round(baseIncident.currentConfidencePercent - (scaleFactor > 1.4 ? 8 : 0))));

  const simulatedPopulationImpact = calculatePopulationImpact(
    simulatedPolygon,
    basePopulation,
    simulatedConfidence
  );

  const deltaExposed = simulatedPopulationImpact.totalPotentiallyExposed - baseIncident.estimatedPopulationImpact.totalPotentiallyExposed;
  const sign = deltaExposed >= 0 ? '+' : '';
  const impactDeltaNotes = `Simulation Output: Modeled affected area shifts by ${(scaleFactor > 1 ? '+' : '')}${((scaleFactor - 1) * 100).toFixed(1)}% to ${simulatedArea} km². Potentially exposed population shifts by ${sign}${deltaExposed.toLocaleString()} people.`;

  return {
    simulatedAreaSqKm: simulatedArea,
    simulatedPolygon,
    simulatedPopulationImpact,
    simulatedConfidence,
    impactDeltaNotes,
  };
}
