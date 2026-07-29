import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Search, SlidersHorizontal, Plus, Calendar, MapPin, 
  Mountain, Flame, Users, X, ChevronDown, Check, Compass, Gauge,
  Navigation, CheckCircle2, RotateCcw, ArrowRight
} from 'lucide-react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import './Rides.css';

// Fix Leaflet Default Marker Assets
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Waypoint Marker Creator
const createCustomIcon = (label, color = '#ff9d00') => {
  const iconHtml = `
    <div className="custom-map-marker">
      <div className="marker-glow-dot" style="background: ${color}; box-shadow: 0 0 15px ${color}, 0 0 25px ${color}"></div>
      ${label ? `<div className="marker-label-pill">${label}</div>` : ''}
    </div>
  `;
  return L.divIcon({
    html: iconHtml,
    className: 'custom-leaflet-marker-wrapper',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

// Component to handle map view updates dynamically
const MapViewController = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, { duration: 1.5 });
    }
  }, [center, zoom, map]);
  return null;
};

// Component to listen for click events when creating route points
const MapClickEventsHandler = ({ isCreatingRoute, startPoint, setStartPoint, endPoint, setEndPoint, setRouteCreationStep }) => {
  useMapEvents({
    click(e) {
      if (!isCreatingRoute) return;

      const { lat, lng } = e.latlng;
      
      if (!startPoint) {
        setStartPoint({ lat, lng, name: 'Punto de Partida' });
        setRouteCreationStep('end');
      } else if (!endPoint) {
        setEndPoint({ lat, lng, name: 'Punto de Llegada' });
        setRouteCreationStep('complete');
      }
    }
  });
  return null;
};

const Rides = () => {
  const { t } = useLanguage();

  // Filter & Navigation States
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('Carretera');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Media');
  const [distanceMax, setDistanceMax] = useState(750);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedRideId, setSelectedRideId] = useState(1);

  // Interactive Route Creator Mode States
  const [isCreatingRoute, setIsCreatingRoute] = useState(false);
  const [routeCreationStep, setRouteCreationStep] = useState('start'); // 'start' | 'end' | 'complete'
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [calculatedDistance, setCalculatedDistance] = useState(0);
  const [calculatedElevation, setCalculatedElevation] = useState(0);
  const [suggestedDifficulty, setSuggestedDifficulty] = useState('Media');
  const [showSaveModal, setShowSaveModal] = useState(false);

  // Form State for saving new route
  const [saveForm, setSaveForm] = useState({
    title: '',
    date: '',
    type: 'Carretera'
  });

  // Sample Rides Data
  const [ridesList, setRidesList] = useState([
    {
      id: 1,
      title: 'Ruta del Volcán',
      subtitle: '(Fin de Semana)',
      date: '15 de Mayo, 2026',
      type: 'Carretera',
      difficulty: 'Difícil',
      elevationDelta: '213m',
      distance: '12 km',
      attendees: 193,
      center: [4.675, -74.065],
      zoom: 13,
      path: [
        [4.720, -74.080],
        [4.735, -74.050],
        [4.725, -74.015],
        [4.695, -74.005],
        [4.665, -74.020],
        [4.635, -74.055],
        [4.625, -74.085],
        [4.640, -74.115],
        [4.675, -74.125],
        [4.705, -74.110],
        [4.720, -74.080]
      ],
      waypoints: [
        { lat: 4.735, lng: -74.050, name: 'Restaurante Biker', type: 'food' },
        { lat: 4.725, lng: -74.015, name: 'Mirador Central', type: 'view' },
        { lat: 4.695, lng: -74.005, name: 'Mirador Site Central', type: 'view' },
        { lat: 4.635, lng: -74.055, name: 'Restaurante Biker', type: 'food' },
        { lat: 4.625, lng: -74.085, name: 'Mirador Central', type: 'view' },
        { lat: 4.640, lng: -74.115, name: 'Mirador Stenam', type: 'view' }
      ]
    },
    {
      id: 2,
      title: 'Ruta del Café',
      subtitle: '(Circuito Valles)',
      date: '15 de Junio, 2026',
      type: 'Mixta',
      difficulty: 'Media',
      elevationDelta: '450m',
      distance: '85 km',
      attendees: 133,
      center: [4.810, -74.120],
      zoom: 12,
      path: [
        [4.850, -74.180],
        [4.870, -74.140],
        [4.840, -74.080],
        [4.780, -74.090],
        [4.760, -74.150],
        [4.800, -74.190],
        [4.850, -74.180]
      ],
      waypoints: [
        { lat: 4.870, lng: -74.140, name: 'Finca El Cafetal', type: 'view' },
        { lat: 4.840, lng: -74.080, name: 'Estación de Gasolina', type: 'fuel' }
      ]
    },
    {
      id: 3,
      title: 'Vuelta a la Costa',
      subtitle: '(Travesía Marítima)',
      date: '01 - 03 de Julio, 2026',
      type: 'Off-road',
      difficulty: 'Fácil',
      elevationDelta: '120m',
      distance: '150 km',
      attendees: 248,
      center: [4.580, -74.150],
      zoom: 11,
      path: [
        [4.620, -74.220],
        [4.650, -74.150],
        [4.610, -74.080],
        [4.540, -74.110],
        [4.510, -74.190],
        [4.560, -74.240],
        [4.620, -74.220]
      ],
      waypoints: [
        { lat: 4.650, lng: -74.150, name: 'Mirador de la Costa', type: 'view' }
      ]
    }
  ]);

  const selectedRide = ridesList.find(r => r.id === selectedRideId) || ridesList[0];

  // Calculate distance, elevation, and difficulty when start and end points are set
  useEffect(() => {
    if (startPoint && endPoint) {
      const p1 = L.latLng(startPoint.lat, startPoint.lng);
      const p2 = L.latLng(endPoint.lat, endPoint.lng);
      const distMeters = p1.distanceTo(p2);
      const distKm = (distMeters / 1000).toFixed(1);
      
      const elevMeters = Math.round(distKm * 9.5 + 110);
      const diff = distKm < 25 ? 'Fácil' : distKm < 75 ? 'Media' : 'Difícil';

      setCalculatedDistance(distKm);
      setCalculatedElevation(elevMeters);
      setSuggestedDifficulty(diff);
    }
  }, [startPoint, endPoint]);

  const handleStartRouteCreation = () => {
    setIsCreatingRoute(true);
    setRouteCreationStep('start');
    setStartPoint(null);
    setEndPoint(null);
    setSelectedRideId(null);
  };

  const handleResetPoints = () => {
    setStartPoint(null);
    setEndPoint(null);
    setRouteCreationStep('start');
  };

  const handleCancelRouteCreation = () => {
    setIsCreatingRoute(false);
    setStartPoint(null);
    setEndPoint(null);
    setSelectedRideId(1);
  };

  const handleSaveRouteSubmit = (e) => {
    e.preventDefault();
    if (!saveForm.title || !startPoint || !endPoint) return;

    // Generate path points between start and end
    const midLat = (startPoint.lat + endPoint.lat) / 2;
    const midLng = (startPoint.lng + endPoint.lng) / 2;

    const createdRide = {
      id: Date.now(),
      title: saveForm.title,
      subtitle: `(${startPoint.name} → ${endPoint.name})`,
      date: saveForm.date || 'Próximamente',
      type: saveForm.type,
      difficulty: suggestedDifficulty,
      elevationDelta: `${calculatedElevation}m`,
      distance: `${calculatedDistance} km`,
      attendees: 1,
      center: [midLat, midLng],
      zoom: 12,
      path: [
        [startPoint.lat, startPoint.lng],
        [startPoint.lat + 0.015, startPoint.lng + 0.02],
        [midLat + 0.01, midLng - 0.015],
        [endPoint.lat - 0.01, endPoint.lng + 0.01],
        [endPoint.lat, endPoint.lng]
      ],
      waypoints: [
        { lat: startPoint.lat, lng: startPoint.lng, name: `🟢 ${startPoint.name}`, type: 'view' },
        { lat: endPoint.lat, lng: endPoint.lng, name: `🔴 ${endPoint.name}`, type: 'food' }
      ]
    };

    setRidesList([createdRide, ...ridesList]);
    setSelectedRideId(createdRide.id);
    setIsCreatingRoute(false);
    setShowSaveModal(false);
    setStartPoint(null);
    setEndPoint(null);
    setSaveForm({ title: '', date: '', type: 'Carretera' });
  };

  const filteredRides = ridesList.filter(ride => {
    const matchesSearch = ride.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ride.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? ride.type === selectedCategory : true;
    const matchesDifficulty = selectedDifficulty ? ride.difficulty === selectedDifficulty : true;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // Build live preview path when in creation mode
  const liveCreationPath = startPoint && endPoint ? [
    [startPoint.lat, startPoint.lng],
    [(startPoint.lat + endPoint.lat) / 2 + 0.01, (startPoint.lng + endPoint.lng) / 2 - 0.01],
    [endPoint.lat, endPoint.lng]
  ] : [];

  return (
    <div className="rides-page-wrapper">
      
      {/* TOP HEADER ACTION BAR */}
      <div className="rides-top-bar">
        <div className="top-bar-left">
          {!isCreatingRoute ? (
            <button 
              className="create-ride-cta-btn"
              onClick={handleStartRouteCreation}
            >
              <Plus size={18} />
              <span>Crear Nueva Rodada</span>
            </button>
          ) : (
            <button 
              className="cancel-route-btn"
              onClick={handleCancelRouteCreation}
            >
              <X size={16} />
              <span>Cancelar Creador de Ruta</span>
            </button>
          )}

          <button 
            className={`pill-tab-btn ${activeTab === 'my-rides' ? 'active' : ''}`}
            onClick={() => setActiveTab(activeTab === 'my-rides' ? 'all' : 'my-rides')}
          >
            Mis Rodadas Planeadas
          </button>

          <button 
            className={`pill-tab-btn ${activeTab === 'open' ? 'active' : ''}`}
            onClick={() => setActiveTab(activeTab === 'open' ? 'all' : 'open')}
          >
            Rodadas Abiertas
          </button>

          <button 
            className={`icon-toggle-btn ${sidebarOpen ? 'active' : ''}`}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title="Alternar panel de filtros"
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* FLOATING ROUTE CREATOR INSTRUCTION / CALCULATION BARS */}
      {isCreatingRoute && (
        <div className="route-creator-banner-overlay">
          {routeCreationStep === 'start' && (
            <div className="creator-step-banner step-start">
              <span className="step-badge">Paso 1</span>
              <span>🟢 Haz clic en cualquier lugar del mapa para fijar el <strong>PUNTO DE PARTIDA (Origen)</strong></span>
            </div>
          )}

          {routeCreationStep === 'end' && (
            <div className="creator-step-banner step-end">
              <span className="step-badge">Paso 2</span>
              <span>🔴 Haz clic en el mapa para fijar el <strong>PUNTO DE LLEGADA (Destino)</strong></span>
            </div>
          )}

          {routeCreationStep === 'complete' && startPoint && endPoint && (
            <div className="creator-summary-card">
              <div className="summary-left-info">
                <div className="summary-points">
                  <span className="p-start">🟢 Partida</span>
                  <ArrowRight size={14} />
                  <span className="p-end">🔴 Llegada</span>
                </div>
                <div className="summary-metrics">
                  <span>📏 Distancia: <strong>{calculatedDistance} km</strong></span>
                  <span>⛰️ Desnivel: <strong>{calculatedElevation} m</strong></span>
                  <span>🔥 Dificultad: <strong className="diff-tag">{suggestedDifficulty}</strong></span>
                </div>
              </div>
              <div className="summary-actions">
                <button className="btn-reset" onClick={handleResetPoints}>
                  <RotateCcw size={14} /> Reiniciar
                </button>
                <button className="btn-confirm-save" onClick={() => setShowSaveModal(true)}>
                  <CheckCircle2 size={16} /> Guardar y Publicar Rodada
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MAIN RIDES INTERFACE CANVAS */}
      <div className="rides-canvas">

        {/* LEFT DRAWER OVERLAY PANEL */}
        {sidebarOpen && (
          <aside className="rides-sidebar-panel">
            <div className="sidebar-top-header">
              <h2>Rodadas</h2>
              <button className="close-panel-btn" onClick={() => setSidebarOpen(false)}>
                <X size={18} />
              </button>
            </div>

            {/* DATE RANGE FILTER */}
            <div className="filter-group">
              <label className="filter-label">Fecha</label>
              <div className="date-range-box">
                <Calendar size={16} className="date-icon" />
                <span>15/05/2023</span>
                <span className="date-arrow">→</span>
                <Calendar size={16} className="date-icon" />
                <span>09/05/2023</span>
              </div>
            </div>

            {/* TYPE OF RIDE CHIPS */}
            <div className="filter-group">
              <label className="filter-label">Tipo de Rodada</label>
              <div className="chips-row">
                {['Carretera', 'Off-road', 'Mixta'].map(cat => (
                  <button 
                    key={cat}
                    className={`chip-btn ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(selectedCategory === cat ? '' : cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* DIFFICULTY CHIPS */}
            <div className="filter-group">
              <label className="filter-label">Dificultad</label>
              <div className="chips-row">
                {['Fácil', 'Media', 'Difícil'].map(diff => (
                  <button 
                    key={diff}
                    className={`chip-btn ${selectedDifficulty === diff ? 'active' : ''}`}
                    onClick={() => setSelectedDifficulty(selectedDifficulty === diff ? '' : diff)}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* DISTANCE SLIDER */}
            <div className="filter-group">
              <label className="filter-label">Distancia</label>
              <input 
                type="range" 
                min="0" 
                max="1000" 
                value={distanceMax} 
                onChange={(e) => setDistanceMax(Number(e.target.value))}
                className="distance-range-slider"
              />
              <div className="slider-ticks">
                <span>0</span>
                <span>250</span>
                <span>750</span>
                <span>100k</span>
              </div>
            </div>

            {/* UPCOMING RIDES SCROLLABLE LIST */}
            <div className="filter-group upcoming-section">
              <h3 className="upcoming-heading">Rodadas Próximas</h3>
              
              <div className="rides-list-container">
                {filteredRides.map((ride, idx) => (
                  <div 
                    key={ride.id} 
                    className={`ride-list-card ${selectedRideId === ride.id ? 'selected' : ''}`}
                    onClick={() => {
                      setIsCreatingRoute(false);
                      setSelectedRideId(ride.id);
                    }}
                  >
                    <div className="card-numeric-badge">{idx + 1}</div>
                    
                    <div className="mini-card-map-thumb">
                      <img src="/assets/route_cafe_map.png" alt={ride.title} className="thumb-img" />
                    </div>

                    <div className="mini-card-details">
                      <h4 className="mini-ride-title">{ride.title}</h4>
                      <p className="mini-ride-date">
                        <Calendar size={12} /> {ride.date}
                      </p>
                      <p className="mini-ride-attendees">
                        <Users size={12} /> {ride.attendees} confirmados
                      </p>
                    </div>

                    <div className="mini-card-signal">
                      <div className="signal-bars">
                        <span className="bar b1 active"></span>
                        <span className="bar b2 active"></span>
                        <span className="bar b3 active"></span>
                        <span className="bar b4"></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        )}

        {/* REAL INTERACTIVE MAP CANVAS */}
        <main className="real-map-container">
          
          {/* SEARCH OVERLAY IN MAP HEADER */}
          <div className="map-search-overlay">
            <div className="map-search-box">
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder="Buscar rodada por nombre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="map-search-input"
              />
              <ChevronDown size={18} className="dropdown-arrow-icon" />
            </div>
          </div>

          <MapContainer 
            center={startPoint ? [startPoint.lat, startPoint.lng] : selectedRide ? selectedRide.center : [4.675, -74.065]} 
            zoom={selectedRide ? selectedRide.zoom : 12} 
            scrollWheelZoom={true}
            className="leaflet-map-element"
            zoomControl={false}
          >
            <MapViewController 
              center={startPoint ? [startPoint.lat, startPoint.lng] : selectedRide ? selectedRide.center : [4.675, -74.065]} 
              zoom={selectedRide ? selectedRide.zoom : 12} 
            />

            <MapClickEventsHandler 
              isCreatingRoute={isCreatingRoute}
              startPoint={startPoint}
              setStartPoint={setStartPoint}
              endPoint={endPoint}
              setEndPoint={setEndPoint}
              setRouteCreationStep={setRouteCreationStep}
            />

            {/* CartoDB Dark Matter Base Tiles */}
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            {/* RENDER ACTIVE SELECTED ROUTE */}
            {!isCreatingRoute && selectedRide && (
              <>
                <Polyline 
                  positions={selectedRide.path}
                  pathOptions={{
                    color: '#00d2ff',
                    weight: 5,
                    opacity: 0.95,
                    lineCap: 'round',
                    lineJoin: 'round'
                  }}
                />

                {selectedRide.waypoints.map((wp, i) => (
                  <Marker 
                    key={i} 
                    position={[wp.lat, wp.lng]}
                    icon={createCustomIcon(wp.name, '#ff9d00')}
                  >
                    <Popup className="custom-leaflet-popup">
                      <strong>{wp.name}</strong>
                    </Popup>
                  </Marker>
                ))}
              </>
            )}

            {/* RENDER LIVE CREATION ROUTE (START & END MARKERS) */}
            {isCreatingRoute && (
              <>
                {startPoint && (
                  <Marker 
                    position={[startPoint.lat, startPoint.lng]}
                    icon={createCustomIcon('🟢 Punto de Partida', '#22c55e')}
                  >
                    <Popup>🟢 Punto de Partida (Origen)</Popup>
                  </Marker>
                )}

                {endPoint && (
                  <Marker 
                    position={[endPoint.lat, endPoint.lng]}
                    icon={createCustomIcon('🔴 Punto de Llegada', '#ef4444')}
                  >
                    <Popup>🔴 Punto de Llegada (Destino)</Popup>
                  </Marker>
                )}

                {liveCreationPath.length > 0 && (
                  <Polyline 
                    positions={liveCreationPath}
                    pathOptions={{
                      color: '#00ffff',
                      weight: 5,
                      dashArray: '10, 10',
                      opacity: 0.9
                    }}
                  />
                )}
              </>
            )}

          </MapContainer>

          {/* FLOATING ELEVATION POPUP CARD (WHEN NOT IN CREATION MODE) */}
          {!isCreatingRoute && selectedRide && (
            <div className="route-profile-popup-card">
              <div className="profile-card-header">
                <div className="title-group">
                  <span className="route-icon-badge">🗺️</span>
                  <div>
                    <h3 className="profile-route-title">{selectedRide.title.toUpperCase()}</h3>
                    <span className="profile-route-subtitle">{selectedRide.subtitle}</span>
                  </div>
                </div>
                <button className="close-profile-btn" onClick={() => setSelectedRideId(null)}>
                  <X size={16} />
                </button>
              </div>

              <div className="profile-stats-bar">
                <div className="stat-pill">
                  <Mountain size={14} color="#00d2ff" />
                  <span>Elevación: <strong>{selectedRide.elevationDelta}</strong></span>
                </div>
                <div className="stat-pill difficulty-pill">
                  <Flame size={14} color="#ff7a00" />
                  <span>{selectedRide.difficulty}</span>
                </div>
              </div>

              {/* SVG MOUNTAIN ELEVATION GRAPH PROFILE */}
              <div className="elevation-profile-graph">
                <svg viewBox="0 0 300 80" className="elevation-svg">
                  <defs>
                    <linearGradient id="elevationGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#ffba00" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#ffba00" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>
                  <path 
                    d="M0,75 L0,55 Q30,20 60,45 T120,25 T180,50 T240,15 T300,60 L300,75 Z" 
                    fill="url(#elevationGrad)" 
                  />
                  <path 
                    d="M0,55 Q30,20 60,45 T120,25 T180,50 T240,15 T300,60" 
                    fill="none" 
                    stroke="#ffba00" 
                    strokeWidth="2.5" 
                  />
                </svg>
                <div className="graph-axis-labels">
                  <span>0m</span>
                  <span>20m</span>
                  <span>40m</span>
                  <span>60m</span>
                  <span>100k</span>
                </div>
              </div>

              <div className="profile-card-footer">
                <span className="confirmed-label">Elevación confirmada</span>
                <span className="dist-value">📏 {selectedRide.distance}</span>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* SAVE ROUTE MODAL FORM */}
      {showSaveModal && (
        <div className="modal-backdrop">
          <div className="create-ride-modal">
            <div className="modal-header">
              <h3>Guardar y Publicar Rodada</h3>
              <button className="modal-close-btn" onClick={() => setShowSaveModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveRouteSubmit} className="create-ride-form">
              <div className="form-field">
                <label>Nombre de la Rodada</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej: Ruta Transandina"
                  value={saveForm.title}
                  onChange={(e) => setSaveForm({...saveForm, title: e.target.value})}
                />
              </div>

              <div className="calculated-summary-box">
                <div><span>Distancia:</span> <strong>{calculatedDistance} km</strong></div>
                <div><span>Desnivel:</span> <strong>{calculatedElevation} m</strong></div>
                <div><span>Dificultad:</span> <strong>{suggestedDifficulty}</strong></div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>Fecha de la Rodada</label>
                  <input 
                    type="date" 
                    required
                    value={saveForm.date}
                    onChange={(e) => setSaveForm({...saveForm, date: e.target.value})}
                  />
                </div>
                <div className="form-field">
                  <label>Tipo de Rodada</label>
                  <select 
                    value={saveForm.type}
                    onChange={(e) => setSaveForm({...saveForm, type: e.target.value})}
                  >
                    <option value="Carretera">Carretera</option>
                    <option value="Off-road">Off-road</option>
                    <option value="Mixta">Mixta</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowSaveModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-submit-ride">
                  Publicar en el Mapa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Rides;
