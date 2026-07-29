import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Search, SlidersHorizontal, Plus, Calendar, MapPin, 
  Mountain, Flame, Users, X, ChevronDown, Check, Compass, Gauge
} from 'lucide-react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import './Rides.css';

// Fix Leaflet Default Marker Assets
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Create Custom Glowing Waypoint Marker Icon
const createCustomIcon = (label, iconType = 'point') => {
  const iconHtml = `
    <div className="custom-map-marker">
      <div className="marker-glow-dot"></div>
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

const Rides = () => {
  const { t } = useLanguage();

  // Active Filter States
  const [activeTab, setActiveTab] = useState('all'); // 'create', 'my-rides', 'open', 'all'
  const [selectedCategory, setSelectedCategory] = useState('Carretera');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Media');
  const [distanceMax, setDistanceMax] = useState(750);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedRideId, setSelectedRideId] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Ride Form State
  const [newRide, setNewRide] = useState({
    title: '',
    date: '',
    type: 'Carretera',
    difficulty: 'Media',
    distance: '50km',
    elevation: '800m',
    attendees: 1
  });

  // Mock Sample Routes matching reference UI
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
        { lat: 4.640, lng: -74.115, name: 'Mirador Stenam', type: 'view' },
        { lat: 4.675, lng: -74.125, name: 'Restaurante Biker', type: 'food' },
        { lat: 4.705, lng: -74.110, name: 'Restaurante Biker', type: 'food' }
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
        { lat: 4.840, lng: -74.080, name: 'Estación de Gasolina', type: 'fuel' },
        { lat: 4.780, lng: -74.090, name: 'Parador Los Laureles', type: 'food' }
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
        { lat: 4.650, lng: -74.150, name: 'Mirador de la Costa', type: 'view' },
        { lat: 4.610, lng: -74.080, name: 'Restaurante Marisco', type: 'food' }
      ]
    }
  ]);

  const selectedRide = ridesList.find(r => r.id === selectedRideId) || ridesList[0];

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newRide.title) return;

    const created = {
      id: Date.now(),
      title: newRide.title,
      subtitle: '(Nueva Rodada)',
      date: newRide.date || 'Próximamente',
      type: newRide.type,
      difficulty: newRide.difficulty,
      elevationDelta: newRide.elevation,
      distance: newRide.distance,
      attendees: 1,
      center: [4.650, -74.080],
      zoom: 12,
      path: [
        [4.680, -74.100],
        [4.700, -74.060],
        [4.670, -74.030],
        [4.630, -74.050],
        [4.640, -74.090],
        [4.680, -74.100]
      ],
      waypoints: [
        { lat: 4.700, lng: -74.060, name: 'Punto de Salida', type: 'view' },
        { lat: 4.670, lng: -74.030, name: 'Parador Biker', type: 'food' }
      ]
    };

    setRidesList([created, ...ridesList]);
    setSelectedRideId(created.id);
    setShowCreateModal(false);
    setNewRide({ title: '', date: '', type: 'Carretera', difficulty: 'Media', distance: '50km', elevation: '800m', attendees: 1 });
  };

  const filteredRides = ridesList.filter(ride => {
    const matchesSearch = ride.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ride.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? ride.type === selectedCategory : true;
    const matchesDifficulty = selectedDifficulty ? ride.difficulty === selectedDifficulty : true;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="rides-page-wrapper">
      
      {/* TOP HEADER ACTION BAR */}
      <div className="rides-top-bar">
        <div className="top-bar-left">
          <button 
            className="create-ride-cta-btn"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={18} />
            <span>Crear Nueva Rodada</span>
          </button>

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
                    onClick={() => setSelectedRideId(ride.id)}
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

        {/* INTERACTIVE REAL MAP CANVAS */}
        <main className="real-map-container">
          
          {/* SEARCH OVERLAY IN MAP HEADER */}
          <div className="map-search-overlay">
            <div className="map-search-box">
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder="Fueras a rodada..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="map-search-input"
              />
              <ChevronDown size={18} className="dropdown-arrow-icon" />
            </div>
          </div>

          <MapContainer 
            center={selectedRide.center} 
            zoom={selectedRide.zoom} 
            scrollWheelZoom={true}
            className="leaflet-map-element"
            zoomControl={false}
          >
            <MapViewController center={selectedRide.center} zoom={selectedRide.zoom} />

            {/* CartoDB Dark Matter Base Tiles */}
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            {/* Glowing Neon Blue Route Polyline */}
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

            {/* Route Waypoint Markers */}
            {selectedRide.waypoints.map((wp, i) => (
              <Marker 
                key={i} 
                position={[wp.lat, wp.lng]}
                icon={createCustomIcon(wp.name, wp.type)}
              >
                <Popup className="custom-leaflet-popup">
                  <strong>{wp.name}</strong>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* FLOATING ELEVATION POPUP CARD (MATCHING REFERENCE MOCKUP EXACTLY) */}
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

        </main>
      </div>

      {/* CREATE RIDE MODAL FORM */}
      {showCreateModal && (
        <div className="modal-backdrop">
          <div className="create-ride-modal">
            <div className="modal-header">
              <h3>Crear Nueva Rodada</h3>
              <button className="modal-close-btn" onClick={() => setShowCreateModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="create-ride-form">
              <div className="form-field">
                <label>Nombre de la Ruta</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej: Ruta de los Andes"
                  value={newRide.title}
                  onChange={(e) => setNewRide({...newRide, title: e.target.value})}
                />
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>Fecha</label>
                  <input 
                    type="date" 
                    required
                    value={newRide.date}
                    onChange={(e) => setNewRide({...newRide, date: e.target.value})}
                  />
                </div>
                <div className="form-field">
                  <label>Tipo de Rodada</label>
                  <select 
                    value={newRide.type}
                    onChange={(e) => setNewRide({...newRide, type: e.target.value})}
                  >
                    <option value="Carretera">Carretera</option>
                    <option value="Off-road">Off-road</option>
                    <option value="Mixta">Mixta</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>Dificultad</label>
                  <select 
                    value={newRide.difficulty}
                    onChange={(e) => setNewRide({...newRide, difficulty: e.target.value})}
                  >
                    <option value="Fácil">Fácil</option>
                    <option value="Media">Media</option>
                    <option value="Difícil">Difícil</option>
                  </select>
                </div>
                <div className="form-field">
                  <label>Distancia (km)</label>
                  <input 
                    type="text"
                    placeholder="Ej: 120 km"
                    value={newRide.distance}
                    onChange={(e) => setNewRide({...newRide, distance: e.target.value})}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowCreateModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-submit-ride">
                  Publicar Rodada
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
