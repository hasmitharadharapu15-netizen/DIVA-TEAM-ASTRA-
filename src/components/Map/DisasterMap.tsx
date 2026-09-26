/**
 * DIVA Interactive Disaster Map
 * Built with Leaflet & OpenStreetMap.
 * Features clean, spacious, non-overlapping controls.
 */

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  DisasterScenario, 
  DisasterIncident, 
  GeoPoint, 
  GeoPolygon 
} from '../../types/diva';
import { 
  Layers, 
  Crosshair, 
  Search, 
  Plus, 
  Minus,
  Info,
  ChevronDown
} from 'lucide-react';

interface DisasterMapProps {
  scenario: DisasterScenario;
  incident: DisasterIncident;
  onOpenWhatChanged: () => void;
  onOpenWhyPrioritized: () => void;
  onOpenRequestEvidence: () => void;
  onOpenPopulationDetail: () => void;
  onOpenAssistanceModal: () => void;
}

export const DisasterMap: React.FC<DisasterMapProps> = ({
  scenario,
  incident,
  onOpenWhatChanged,
  onOpenWhyPrioritized,
  onOpenRequestEvidence,
  onOpenPopulationDetail,
  onOpenAssistanceModal,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupsRef = useRef<{
    satellites: L.LayerGroup;
    weather: L.LayerGroup;
    sensors: L.LayerGroup;
    reports: L.LayerGroup;
    disasterZone: L.LayerGroup;
    uncertainty: L.LayerGroup;
    population: L.LayerGroup;
    infrastructure: L.LayerGroup;
    emergencyServices: L.LayerGroup;
  }>({
    satellites: L.layerGroup(),
    weather: L.layerGroup(),
    sensors: L.layerGroup(),
    reports: L.layerGroup(),
    disasterZone: L.layerGroup(),
    uncertainty: L.layerGroup(),
    population: L.layerGroup(),
    infrastructure: L.layerGroup(),
    emergencyServices: L.layerGroup(),
  });

  // Layer Visibility States
  const [layers, setLayers] = useState({
    satellite: true,
    weather: true,
    sensors: true,
    reports: true,
    disasterZone: true,
    uncertainty: true,
    population: true,
    infrastructure: true,
    emergencyServices: true,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [showLegend, setShowLegend] = useState(false);
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [basemapStyle, setBasemapStyle] = useState<'street' | 'satellite' | 'topo'>('street');
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [scenario.center.lat, scenario.center.lng],
        zoom: scenario.zoom,
        zoomControl: false, // We use cleanly separated zoom buttons
      });

      // Crystal-clear Esri World Street Map (100% public, high resolution, ZERO "API required" watermarks)
      const baseTile = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; Esri World Street Map',
        maxZoom: 19,
      }).addTo(map);
      tileLayerRef.current = baseTile;

      // Add all layer groups to map
      Object.values(layerGroupsRef.current).forEach((lg) => lg.addTo(map));
      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([scenario.center.lat, scenario.center.lng], scenario.zoom);
    }
  }, [scenario.id]);

  // Handle Basemap Switcher (Clean Street Map vs Satellite Aerial vs Topo)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';
    let attr = '&copy; Esri World Street Map';

    if (basemapStyle === 'satellite') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attr = '&copy; Esri World Imagery (Satellite)';
    } else if (basemapStyle === 'topo') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}';
      attr = '&copy; Esri Topo Map';
    }

    const newTile = L.tileLayer(url, {
      attribution: attr,
      maxZoom: 19,
    }).addTo(map);

    // Ensure tile layer sits at the bottom behind disaster polygons and markers
    newTile.bringToBack();
    tileLayerRef.current = newTile;
  }, [basemapStyle]);

  // Sync Layer Toggles
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const lg = layerGroupsRef.current;
    layers.satellite ? map.addLayer(lg.satellites) : map.removeLayer(lg.satellites);
    layers.weather ? map.addLayer(lg.weather) : map.removeLayer(lg.weather);
    layers.sensors ? map.addLayer(lg.sensors) : map.removeLayer(lg.sensors);
    layers.reports ? map.addLayer(lg.reports) : map.removeLayer(lg.reports);
    layers.disasterZone ? map.addLayer(lg.disasterZone) : map.removeLayer(lg.disasterZone);
    layers.uncertainty ? map.addLayer(lg.uncertainty) : map.removeLayer(lg.uncertainty);
    layers.population ? map.addLayer(lg.population) : map.removeLayer(lg.population);
    layers.infrastructure ? map.addLayer(lg.infrastructure) : map.removeLayer(lg.infrastructure);
    layers.emergencyServices ? map.addLayer(lg.emergencyServices) : map.removeLayer(lg.emergencyServices);
  }, [layers]);

  // Re-draw Map Entities
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const lg = layerGroupsRef.current;
    Object.values(lg).forEach((group) => group.clearLayers());

    // 1. Disaster Zone Polygon
    if (incident.activeDisasterPolygon && incident.activeDisasterPolygon.length > 0) {
      const latLngs = incident.activeDisasterPolygon.map((p) => [p.lat, p.lng] as [number, number]);
      const isFlood = incident.disasterType === 'flood';
      const isWildfire = incident.disasterType === 'wildfire';

      const polyColor = isFlood ? '#0284c7' : isWildfire ? '#ea580c' : '#4f46e5';
      const polyFill = isFlood ? '#38bdf8' : isWildfire ? '#f97316' : '#818cf8';

      const disasterPoly = L.polygon(latLngs, {
        color: polyColor,
        weight: 3,
        fillColor: polyFill,
        fillOpacity: 0.45,
      });

      disasterPoly.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; color: #0f172a; min-width: 200px;">
          <div style="font-weight: 700; font-size: 13px; color: ${polyColor}; margin-bottom: 4px;">
            ${incident.name}
          </div>
          <div><strong>Area:</strong> ${incident.affectedAreaSqKm} km²</div>
          <div><strong>Confidence:</strong> ${incident.currentConfidencePercent}% (Uncertainty ±${incident.uncertaintyMarginPercent}%)</div>
          <div><strong>Potentially Exposed:</strong> ${incident.estimatedPopulationImpact.totalPotentiallyExposed.toLocaleString()} people</div>
        </div>
      `);
      lg.disasterZone.addLayer(disasterPoly);
    }

    // 2. Uncertainty Buffer Polygon
    if (incident.uncertaintyPolygon && incident.uncertaintyPolygon.length > 0) {
      const uLatLngs = incident.uncertaintyPolygon.map((p) => [p.lat, p.lng] as [number, number]);
      const uncertaintyPoly = L.polygon(uLatLngs, {
        color: '#f59e0b',
        weight: 2,
        dashArray: '5, 5',
        fillColor: '#fbbf24',
        fillOpacity: 0.12,
      });
      uncertaintyPoly.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; color: #0f172a;">
          <strong style="color: #b45309;">Model Uncertainty Zone (±${incident.uncertaintyMarginPercent}%)</strong>
          <p style="margin: 4px 0;">Buffer area where confidence drops below standard threshold.</p>
        </div>
      `);
      lg.uncertainty.addLayer(uncertaintyPoly);
    }

    // 3. Satellite Observation Footprint
    scenario.satellites.forEach((sat) => {
      if (sat.footprint && sat.footprint.length > 0) {
        const fpLatLngs = sat.footprint.map((p) => [p.lat, p.lng] as [number, number]);
        const satPoly = L.polygon(fpLatLngs, {
          color: '#8b5cf6',
          weight: 1.5,
          dashArray: '4, 4',
          fillColor: '#a78bfa',
          fillOpacity: 0.08,
        });
        satPoly.bindPopup(`
          <div style="font-family: sans-serif; font-size: 12px; color: #0f172a;">
            <strong style="color: #7c3aed;">🛰️ ${sat.satelliteName}</strong>
            <div><strong>Sensor:</strong> ${sat.sensorType}</div>
            <div><strong>Quality:</strong> ${sat.imageQualityPercent}% | Cloud Cover: ${sat.cloudCoveragePercent}%</div>
          </div>
        `);
        lg.satellites.addLayer(satPoly);
      }
    });

    // 4. Population Zones
    scenario.populationZones.forEach((pz) => {
      const pzLatLngs = pz.polygon.map((p) => [p.lat, p.lng] as [number, number]);
      const pzPoly = L.polygon(pzLatLngs, {
        color: '#059669',
        weight: 1.5,
        fillColor: '#10b981',
        fillOpacity: 0.15,
      });

      const exposedInThisZone = incident.estimatedPopulationImpact.affectedZoneBreakdown.find(
        (b) => b.zoneId === pz.id
      );

      pzPoly.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; color: #0f172a; min-width: 200px;">
          <strong style="color: #047857; font-size: 13px;">👥 ${pz.name}</strong>
          <div><strong>Ward Population:</strong> ${pz.totalPopulation.toLocaleString()}</div>
          <div style="margin-top: 4px; padding-top: 4px; border-top: 1px solid #e2e8f0;">
            <strong style="color: #b91c1c;">Potentially Exposed: ${exposedInThisZone ? exposedInThisZone.estimatedExposed.toLocaleString() : 0}</strong>
          </div>
        </div>
      `);
      lg.population.addLayer(pzPoly);
    });

    // 5. IoT Sensors
    scenario.sensors.forEach((s) => {
      const isSuspicious = s.health === 'suspicious' || s.name.includes('FAULT');
      const isAnomaly = s.isAnomaly;

      let pinColor = '#0284c7';
      let iconSymbol = '📊';

      if (isSuspicious) {
        pinColor = '#f59e0b';
        iconSymbol = '⚠️';
      } else if (isAnomaly) {
        pinColor = '#ef4444';
        iconSymbol = '🚨';
      }

      const sensorIcon = L.divIcon({
        className: 'custom-sensor-icon',
        html: `
          <div style="
            background: ${pinColor};
            color: white;
            border: 2px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            border-radius: 50%;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            font-weight: bold;
            cursor: pointer;
          ">${iconSymbol}</div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([s.location.lat, s.location.lng], { icon: sensorIcon });
      marker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; color: #0f172a; min-width: 220px;">
          <div style="font-weight: 700; color: ${pinColor}; font-size: 13px;">${s.name}</div>
          <div><strong>Reading:</strong> <span style="font-size: 13px; font-weight: 700;">${s.value} ${s.unit}</span></div>
          <div><strong>Status:</strong> <span style="font-weight: 700; text-transform: uppercase;">${s.health}</span></div>
          <div style="font-size: 11px; color: #475569; margin-top: 4px; background: #f8fafc; padding: 4px; border-radius: 4px;">
            ${s.notes || 'Operating nominal.'}
          </div>
        </div>
      `);
      lg.sensors.addLayer(marker);
    });

    // 6. Weather Stations
    scenario.weather.forEach((wx) => {
      const wxIcon = L.divIcon({
        className: 'custom-weather-icon',
        html: `
          <div style="
            background: #3b82f6;
            color: white;
            border: 2px solid white;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            border-radius: 6px;
            padding: 3px 6px;
            font-size: 11px;
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 2px;
          ">
            🌧️ ${wx.rainfall1h}mm
          </div>
        `,
        iconSize: [60, 24],
        iconAnchor: [30, 12],
      });

      const marker = L.marker([wx.location.lat, wx.location.lng], { icon: wxIcon });
      marker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; color: #0f172a; min-width: 200px;">
          <strong style="color: #2563eb;">${wx.stationName}</strong>
          <div><strong>Rain (1h / 6h):</strong> ${wx.rainfall1h}mm / ${wx.rainfall6h}mm</div>
          <div><strong>Wind:</strong> ${wx.windSpeed} km/h (${wx.windDirection})</div>
        </div>
      `);
      lg.weather.addLayer(marker);
    });

    // 7. Incident Reports
    scenario.reports.forEach((rep) => {
      const repIcon = L.divIcon({
        className: 'custom-report-icon',
        html: `
          <div style="
            background: #d97706;
            color: white;
            border: 2px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            border-radius: 50%;
            width: 26px;
            height: 26px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
          ">📢</div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      });

      const marker = L.marker([rep.coordinates.lat, rep.coordinates.lng], { icon: repIcon });
      marker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; color: #0f172a; min-width: 220px;">
          <div style="font-weight: 700; color: #b45309;">${rep.reporterSource} (${rep.timestamp})</div>
          <div style="margin: 4px 0; font-style: italic;">"${rep.rawText}"</div>
          <div><strong>Needs:</strong> ${rep.extractedNeeds.join(', ')}</div>
        </div>
      `);
      lg.reports.addLayer(marker);
    });

    // 8. Infrastructure
    scenario.infrastructure.forEach((inf) => {
      let icon = '🏥';
      let bg = '#dc2626';

      if (inf.type === 'bridge') { icon = '🌉'; bg = '#475569'; }
      if (inf.type === 'shelter') { icon = '⛺'; bg = '#16a34a'; }
      if (inf.type === 'power_substation') { icon = '⚡'; bg = '#ea580c'; }

      const infIcon = L.divIcon({
        className: 'custom-inf-icon',
        html: `
          <div style="
            background: ${bg};
            color: white;
            border: 2px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            border-radius: 4px;
            width: 26px;
            height: 26px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
          ">${icon}</div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      });

      const marker = L.marker([inf.location.lat, inf.location.lng], { icon: infIcon });
      marker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; color: #0f172a; min-width: 200px;">
          <strong>${inf.name}</strong>
          <div><strong>Type:</strong> <span style="text-transform: capitalize;">${inf.type}</span></div>
          <div><strong>Status:</strong> ${inf.status.replace(/_/g, ' ')}</div>
        </div>
      `);
      lg.infrastructure.addLayer(marker);
    });

    // 9. Emergency Services
    scenario.emergencyServices.forEach((org) => {
      const srvIcon = L.divIcon({
        className: 'custom-srv-icon',
        html: `
          <div style="
            background: #0284c7;
            color: white;
            border: 2px solid #38bdf8;
            box-shadow: 0 2px 6px rgba(0,0,0,0.4);
            border-radius: 6px;
            padding: 2px 5px;
            font-size: 11px;
            font-weight: bold;
          ">
            🛡️ ${org.category === 'disaster_response' ? 'NDRF' : 'RESP'}
          </div>
        `,
        iconSize: [52, 24],
        iconAnchor: [26, 12],
      });

      const marker = L.marker([org.location.lat, org.location.lng], { icon: srvIcon });
      marker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; color: #0f172a; min-width: 220px;">
          <strong style="color: #0369a1;">🛡️ ${org.name}</strong>
          <div><strong>Status:</strong> ${org.availability} (Capacity: ${org.capacityScore}%)</div>
          <div><strong>Offerings:</strong> ${org.serviceOfferings.slice(0, 3).join(', ')}</div>
        </div>
      `);
      lg.emergencyServices.addLayer(marker);
    });

  }, [scenario, incident]);

  const handleCenterIncident = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([scenario.center.lat, scenario.center.lng], scenario.zoom);
    }
  };

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !mapInstanceRef.current) return;
    const term = searchQuery.toLowerCase();

    const foundInf = scenario.infrastructure.find((i) => i.name.toLowerCase().includes(term));
    if (foundInf) {
      mapInstanceRef.current.setView([foundInf.location.lat, foundInf.location.lng], 15);
      return;
    }
    const foundSensor = scenario.sensors.find((s) => s.name.toLowerCase().includes(term) || s.sensorId.toLowerCase().includes(term));
    if (foundSensor) {
      mapInstanceRef.current.setView([foundSensor.location.lat, foundSensor.location.lng], 15);
      return;
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-950 overflow-hidden">
      {/* 1. CLEAN, SINGLE MAP TOOLBAR (No crowded double stacked bars, zero overlapping buttons) */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex flex-wrap items-center justify-between gap-3 z-10 text-xs shadow-sm">
        {/* Layer Filters Menu */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowLayerMenu(!showLayerMenu)}
              className="bg-slate-800 hover:bg-slate-750 text-slate-100 font-semibold px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1.5 transition"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Map Layers</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {showLayerMenu && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-slate-900 border border-slate-700 rounded-lg shadow-xl p-2 z-50 space-y-1">
                {[
                  { key: 'disasterZone', label: '🌊 Disaster Inundation Zone' },
                  { key: 'uncertainty', label: `⚠️ Uncertainty (±${incident.uncertaintyMarginPercent}%)` },
                  { key: 'sensors', label: '📊 IoT Gauges & Sensors' },
                  { key: 'satellite', label: '🛰️ Satellite SAR Radar' },
                  { key: 'weather', label: '🌧️ Weather Stations' },
                  { key: 'reports', label: '📢 112 Citizen Reports' },
                  { key: 'population', label: '👥 Municipal Ward Grid' },
                  { key: 'infrastructure', label: '🏥 Hospitals & Bridges' },
                  { key: 'emergencyServices', label: '🛡️ NDRF & Rescue Bases' },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex items-center justify-between px-2 py-1.5 hover:bg-slate-800 rounded cursor-pointer text-xs"
                  >
                    <span>{item.label}</span>
                    <input
                      type="checkbox"
                      checked={(layers as any)[item.key]}
                      onChange={(e) => setLayers({ ...layers, [item.key]: e.target.checked })}
                      className="accent-cyan-500 rounded"
                    />
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Quick Primary Layer Pills (Clean, spaced, no overlap) */}
          <div className="hidden lg:flex items-center gap-1.5">
            <button
              onClick={() => setLayers((prev) => ({ ...prev, disasterZone: !prev.disasterZone }))}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                layers.disasterZone ? 'bg-cyan-950 text-cyan-300 border border-cyan-700' : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              🌊 Flood Zone
            </button>

            <button
              onClick={() => setLayers((prev) => ({ ...prev, sensors: !prev.sensors }))}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                layers.sensors ? 'bg-blue-950 text-blue-300 border border-blue-700' : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              📊 IoT Sensors
            </button>

            <button
              onClick={() => setLayers((prev) => ({ ...prev, population: !prev.population }))}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                layers.population ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              👥 Population Grid
            </button>

            {/* Clean Basemap Style Switcher (Zero watermark, crystal-clear) */}
            <div className="flex items-center bg-slate-800 rounded-md border border-slate-700 p-0.5 ml-1">
              <button
                onClick={() => setBasemapStyle('street')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                  basemapStyle === 'street'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Crystal-Clear Street Map (No watermark)"
              >
                🗺️ Street
              </button>
              <button
                onClick={() => setBasemapStyle('satellite')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                  basemapStyle === 'satellite'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="High-Resolution Satellite Aerial View"
              >
                🛰️ Aerial
              </button>
            </div>
          </div>
        </div>

        {/* Search, Center, and Legend Controls */}
        <div className="flex items-center gap-2">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <input
              type="text"
              placeholder="Search ward, hospital, sensor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-800 text-slate-200 text-xs px-2.5 py-1 pl-7 rounded-lg border border-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500 w-48 sm:w-56"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 pointer-events-none" />
          </form>

          <button
            onClick={handleCenterIncident}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 transition"
            title="Center Map on Incident"
          >
            <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
            <span>Center</span>
          </button>

          <button
            onClick={() => setShowLegend(!showLegend)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 transition"
            title="Toggle Map Symbology Legend"
          >
            <Info className="w-3.5 h-3.5 text-amber-400" />
            <span>Legend</span>
          </button>

          {/* Clean Zoom Controls */}
          <div className="flex items-center gap-1 bg-slate-800 rounded-lg border border-slate-700 p-0.5">
            <button
              onClick={handleZoomIn}
              className="w-6 h-6 flex items-center justify-center text-slate-300 hover:text-white rounded font-bold"
              title="Zoom In"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              className="w-6 h-6 flex items-center justify-center text-slate-300 hover:text-white rounded font-bold"
              title="Zoom Out"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAP CANVAS CONTAINER */}
      <div className="relative flex-1 w-full h-full">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* 3. OPTIONAL POP-OVER MAP LEGEND (Never covers map markers or buttons!) */}
        {showLegend && (
          <div className="absolute top-3 right-3 z-20 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl p-3 shadow-2xl text-xs text-slate-300 max-w-xs space-y-2">
            <div className="font-bold text-white flex items-center justify-between border-b border-slate-800 pb-1.5">
              <span>Map Symbology Legend</span>
              <button
                onClick={() => setShowLegend(false)}
                className="text-slate-400 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-sky-500/60 border border-sky-400"></span>
                <span>Disaster Zone</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-500/20 border border-amber-400 border-dashed"></span>
                <span>Uncertainty Margin</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Healthy Sensor</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-amber-600"></span>
                <span>Contradictory S-07</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>🏥</span>
                <span>Hospital / Shelter</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>🛡️</span>
                <span>Rescue Unit (NDRF)</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 italic pt-1 border-t border-slate-800">
              * Symbology represents analytical model outputs, not confirmed real-world severity.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
