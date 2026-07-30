import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Search, SlidersHorizontal, Plus, Calendar, MapPin, 
  Mountain, Flame, Users, X, ChevronDown, Check, Compass, Gauge,
  Navigation, CheckCircle2, RotateCcw, ArrowRight, Target, Map, RotateCw,
  Globe, Lock, ShieldCheck, UserCheck, Edit3, Trash2, AlertTriangle, Bell, RefreshCw
} from 'lucide-react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import './Rides.css';

// Real road polyline coordinates for Cúcuta -> San Antonio del Táchira (349 exact turn-by-turn road points)
const REAL_CUCUTA_SAN_ANTONIO_PATH = [[7.893516,-72.507726],[7.893602,-72.507272],[7.894064,-72.507355],[7.894612,-72.507463],[7.895072,-72.507564],[7.895592,-72.507606],[7.895659,-72.507244],[7.895775,-72.506613],[7.895795,-72.506496],[7.895016,-72.505374],[7.894982,-72.505328],[7.894573,-72.504743],[7.894508,-72.504652],[7.894475,-72.50461],[7.894436,-72.50455],[7.894155,-72.50413],[7.893382,-72.50297],[7.893276,-72.502811],[7.893045,-72.502465],[7.89291,-72.502262],[7.892531,-72.501694],[7.891746,-72.500549],[7.891697,-72.500463],[7.890873,-72.499246],[7.89064,-72.498905],[7.890596,-72.498829],[7.890058,-72.49806],[7.889258,-72.496892],[7.889156,-72.496748],[7.889092,-72.496658],[7.889081,-72.496638],[7.889058,-72.496609],[7.889038,-72.496593],[7.888844,-72.496502],[7.888824,-72.496489],[7.888787,-72.496459],[7.888757,-72.496429],[7.888729,-72.496396],[7.888696,-72.496349],[7.888668,-72.496304],[7.88836,-72.495718],[7.888303,-72.495608],[7.888083,-72.495216],[7.888032,-72.495124],[7.888014,-72.495095],[7.887601,-72.494452],[7.887566,-72.494404],[7.886705,-72.493096],[7.886477,-72.492759],[7.886195,-72.492352],[7.885986,-72.492042],[7.885455,-72.491279],[7.88532,-72.491085],[7.884378,-72.489696],[7.884209,-72.489446],[7.884024,-72.489166],[7.883801,-72.488823],[7.883195,-72.487917],[7.882828,-72.487386],[7.882749,-72.487278],[7.88265,-72.487168],[7.882549,-72.487083],[7.882453,-72.487016],[7.882332,-72.486956],[7.882208,-72.486913],[7.882074,-72.48689],[7.881956,-72.486882],[7.881834,-72.486886],[7.88168,-72.486908],[7.881533,-72.486954],[7.881148,-72.487131],[7.880772,-72.487299],[7.880679,-72.487343],[7.879775,-72.487739],[7.879014,-72.488067],[7.878766,-72.488184],[7.878672,-72.48823],[7.878571,-72.488273],[7.878486,-72.488308],[7.878419,-72.488329],[7.878326,-72.488356],[7.878207,-72.488383],[7.878106,-72.4884],[7.877965,-72.488418],[7.877823,-72.488431],[7.877697,-72.488437],[7.877503,-72.488438],[7.877357,-72.488429],[7.87725,-72.488418],[7.877165,-72.488405],[7.877038,-72.48838],[7.876788,-72.488321],[7.876358,-72.488214],[7.876071,-72.488147],[7.875856,-72.488091],[7.875624,-72.488021],[7.875422,-72.487951],[7.875321,-72.487916],[7.875236,-72.48789],[7.875125,-72.487863],[7.875019,-72.487841],[7.874902,-72.487825],[7.8748,-72.487814],[7.874621,-72.487805],[7.874453,-72.487796],[7.874333,-72.487794],[7.874073,-72.487804],[7.873843,-72.48782],[7.873385,-72.48786],[7.872917,-72.487916],[7.872739,-72.487938],[7.87263,-72.487949],[7.872532,-72.487951],[7.872455,-72.487949],[7.872362,-72.487941],[7.872278,-72.487923],[7.872186,-72.487903],[7.871831,-72.487791],[7.871703,-72.487743],[7.871627,-72.487712],[7.871541,-72.487667],[7.871433,-72.487602],[7.87134,-72.487541],[7.871236,-72.487463],[7.871147,-72.48739],[7.870428,-72.486779],[7.870321,-72.486692],[7.870243,-72.486628],[7.870164,-72.486567],[7.870102,-72.486521],[7.870047,-72.486483],[7.870005,-72.486458],[7.86992,-72.486414],[7.869852,-72.486384],[7.869771,-72.486351],[7.869669,-72.486315],[7.869598,-72.486292],[7.869515,-72.486263],[7.869445,-72.486241],[7.869372,-72.486215],[7.869311,-72.486186],[7.869258,-72.48616],[7.869202,-72.486126],[7.869154,-72.486095],[7.869084,-72.486035],[7.868858,-72.485851],[7.868691,-72.485712],[7.867998,-72.485128],[7.867256,-72.484472],[7.866546,-72.483811],[7.866397,-72.483658],[7.866113,-72.483361],[7.865997,-72.483244],[7.86591,-72.483169],[7.865823,-72.483102],[7.865749,-72.483046],[7.865035,-72.482555],[7.864884,-72.482445],[7.864464,-72.482172],[7.863757,-72.481712],[7.86365,-72.48164],[7.863541,-72.481558],[7.863414,-72.481478],[7.862315,-72.480749],[7.862225,-72.48069],[7.861971,-72.480522],[7.861907,-72.480479],[7.860956,-72.479834],[7.860877,-72.479776],[7.860178,-72.479305],[7.859862,-72.479105],[7.859377,-72.478755],[7.859318,-72.478716],[7.858722,-72.478319],[7.858403,-72.478097],[7.857909,-72.47774],[7.85772,-72.477614],[7.85708,-72.477183],[7.857,-72.47713],[7.856888,-72.477052],[7.856769,-72.476964],[7.856653,-72.476892],[7.855654,-72.47621],[7.85548,-72.476094],[7.854505,-72.475444],[7.854241,-72.475269],[7.853937,-72.475059],[7.852618,-72.47415],[7.852419,-72.474017],[7.85193,-72.47369],[7.851308,-72.47326],[7.850683,-72.472836],[7.85016,-72.472481],[7.849896,-72.472306],[7.849847,-72.472274],[7.84983,-72.472262],[7.849601,-72.472108],[7.84798,-72.471018],[7.846964,-72.470335],[7.845906,-72.469623],[7.844914,-72.468964],[7.844888,-72.468944],[7.844576,-72.468728],[7.844541,-72.468707],[7.843616,-72.468054],[7.841447,-72.466591],[7.841018,-72.466313],[7.840473,-72.465936],[7.839768,-72.465434],[7.839617,-72.465332],[7.839487,-72.465248],[7.839325,-72.46515],[7.839192,-72.465075],[7.839078,-72.465012],[7.83996,-72.464967],[7.838389,-72.464709],[7.838081,-72.464589],[7.837901,-72.464515],[7.837781,-72.464465],[7.837692,-72.464429],[7.837595,-72.46439],[7.837549,-72.464372],[7.837344,-72.464291],[7.837113,-72.4642],[7.835936,-72.463695],[7.835557,-72.463535],[7.835173,-72.463379],[7.834711,-72.463204],[7.834625,-72.463182],[7.834595,-72.463175],[7.834096,-72.463055],[7.834051,-72.463045],[7.833969,-72.463031],[7.833903,-72.463023],[7.83383,-72.463014],[7.833748,-72.463006],[7.833632,-72.462998],[7.833529,-72.462994],[7.833402,-72.462994],[7.833292,-72.462997],[7.833042,-72.463001],[7.832699,-72.463012],[7.831976,-72.463033],[7.831548,-72.463049],[7.831228,-72.463068],[7.830633,-72.46309],[7.829931,-72.463129],[7.829889,-72.463133],[7.829151,-72.463178],[7.828413,-72.463208],[7.827758,-72.463217],[7.827646,-72.463213],[7.827568,-72.463207],[7.827502,-72.463193],[7.827426,-72.463181],[7.827337,-72.46316],[7.827223,-72.463127],[7.827091,-72.463081],[7.826762,-72.46296],[7.825697,-72.462561],[7.825639,-72.462536],[7.82554,-72.462483],[7.825458,-72.462443],[7.825129,-72.462259],[7.82496,-72.462115],[7.824848,-72.462013],[7.824727,-72.461867],[7.82463,-72.46172],[7.824555,-72.461605],[7.824488,-72.461499],[7.824425,-72.461388],[7.824362,-72.461265],[7.824316,-72.461153],[7.824278,-72.461058],[7.824241,-72.460953],[7.824167,-72.460715],[7.824094,-72.460452],[7.824027,-72.460208],[7.823906,-72.459769],[7.823827,-72.459485],[7.823747,-72.459212],[7.823669,-72.45893],[7.823604,-72.458706],[7.823569,-72.458599],[7.823528,-72.458491],[7.823487,-72.458388],[7.82344,-72.458287],[7.823367,-72.458147],[7.823321,-72.458057],[7.823278,-72.457986],[7.823217,-72.457889],[7.82314,-72.457774],[7.82304,-72.45763],[7.822959,-72.45753],[7.822878,-72.457436],[7.82278,-72.457334],[7.822688,-72.457247],[7.822615,-72.457181],[7.822349,-72.45696],[7.822024,-72.456682],[7.821902,-72.456577],[7.821734,-72.456433],[7.821353,-72.4561],[7.821046,-72.455852],[7.820766,-72.455606],[7.819794,-72.454793],[7.819289,-72.454346],[7.819073,-72.454142],[7.818812,-72.453862],[7.81872,-72.453746],[7.818697,-72.45371],[7.818673,-72.453671],[7.818617,-72.453555],[7.818568,-72.453436],[7.818527,-72.453314],[7.818494,-72.453189],[7.818468,-72.453063],[7.818451,-72.452935],[7.818442,-72.452806],[7.818271,-72.452187],[7.817561,-72.449548],[7.817522,-72.449441],[7.817473,-72.449287],[7.817436,-72.44911],[7.817418,-72.449024],[7.817409,-72.448939],[7.817407,-72.448752],[7.817397,-72.448735],[7.817391,-72.448715],[7.81739,-72.448695],[7.817396,-72.448667],[7.81741,-72.448643],[7.817431,-72.448624],[7.81745,-72.448457],[7.817456,-72.448388],[7.817471,-72.448128],[7.817482,-72.447967],[7.817523,-72.44757],[7.817545,-72.447329],[7.817592,-72.446699],[7.817664,-72.445929],[7.81768,-72.445719],[7.817726,-72.445083],[7.817771,-72.444461],[7.817023,-72.444348],[7.816361,-72.444269],[7.816446,-72.443275],[7.816608,-72.443286],[7.816701,-72.443293]];

// Initial Default Sample Rides
const INITIAL_DEFAULT_RIDES = [
  {
    id: 1,
    title: 'Ruta Cúcuta - San Antonio',
    subtitle: '(Frontera Andina)',
    country: '🇨🇴 Colombia / 🇻🇪 Venezuela',
    location: 'Cúcuta, Norte de Santander',
    date: '15 de Mayo, 2026',
    isoDate: '2026-05-15',
    type: 'Carretera',
    difficulty: 'Media',
    privacy: 'public',
    clubName: '',
    elevationDelta: '133m',
    distance: '12.8 km',
    attendees: 193,
    isAttending: true,
    center: [7.855, -72.475],
    zoom: 13,
    path: REAL_CUCUTA_SAN_ANTONIO_PATH,
    waypoints: [
      { lat: 7.893516, lng: -72.507726, name: '🟢 Cúcuta Partida', type: 'view' },
      { lat: 7.816701, lng: -72.443293, name: '🔴 San Antonio Llegada', type: 'food' }
    ]
  },
  {
    id: 2,
    title: 'Ruta del Café',
    subtitle: '(Circuito Valles)',
    country: '🇨🇴 Colombia',
    location: 'Manizales, Caldas',
    date: '15 de Junio, 2026',
    isoDate: '2026-06-15',
    type: 'Mixta',
    difficulty: 'Media',
    privacy: 'private',
    clubName: 'Moto Club Cúcuta High Speed',
    elevationDelta: '450m',
    distance: '85.0 km',
    attendees: 133,
    isAttending: false,
    center: [4.810, -74.120],
    zoom: 12,
    path: [
      [4.850, -74.180], [4.870, -74.140], [4.840, -74.080],
      [4.780, -74.090], [4.760, -74.150], [4.800, -74.190], [4.850, -74.180]
    ],
    waypoints: [
      { lat: 4.870, lng: -74.140, name: '🟢 Finca El Cafetal', type: 'view' },
      { lat: 4.840, lng: -74.080, name: '🔴 Estación de Gasolina', type: 'fuel' }
    ]
  },
  {
    id: 3,
    title: 'Vuelta a la Costa',
    subtitle: '(Travesía Marítima)',
    country: '🇨🇴 Colombia',
    location: 'Santa Marta, Magdalena',
    date: '01 de Julio, 2026',
    isoDate: '2026-07-01',
    type: 'Off-road',
    difficulty: 'Fácil',
    privacy: 'public',
    clubName: '',
    elevationDelta: '120m',
    distance: '150.0 km',
    attendees: 248,
    isAttending: false,
    center: [4.580, -74.150],
    zoom: 11,
    path: [
      [4.620, -74.220], [4.650, -74.150], [4.610, -74.080],
      [4.540, -74.110], [4.510, -74.190], [4.560, -74.240], [4.620, -74.220]
    ],
    waypoints: [
      { lat: 4.620, lng: -74.220, name: '🟢 Mirador de la Costa', type: 'view' },
      { lat: 4.560, lng: -74.240, name: '🔴 Bahia del Mar', type: 'food' }
    ]
  }
];

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
    if (center && center[0] && center[1]) {
      map.flyTo(center, zoom, { duration: 1.5 });
    }
  }, [center, zoom, map]);
  return null;
};

// Interactive Picker Component inside Location Modal
const LocationPickerMapEvents = ({ tempPos, setTempPos }) => {
  useMapEvents({
    click(e) {
      setTempPos({ lat: e.latlng.lat, lng: e.latlng.lng });
    }
  });
  return null;
};

const Rides = () => {
  const { t } = useLanguage();

  // Filter & Sidebar States
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'my-rides' | 'open' | 'club'
  const [selectedCategory, setSelectedCategory] = useState('Todas'); // 'Todas' | 'Carretera' | 'Off-road' | 'Mixta'
  const [selectedDifficulty, setSelectedDifficulty] = useState('Todas'); // 'Todas' | 'Fácil' | 'Media' | 'Difícil'
  const [distanceMax, setDistanceMax] = useState(500); // 500 = All
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedRideId, setSelectedRideId] = useState(1);

  // Form Creation / Edit Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRideId, setEditingRideId] = useState(null); // null = Create Mode, number = Edit Mode
  const [showMapPickerModal, setShowMapPickerModal] = useState(false);
  const [pickerTargetType, setPickerTargetType] = useState('start'); // 'start' or 'end'

  // Delete Confirmation Modal States
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [rideToDelete, setRideToDelete] = useState(null);

  // Creation/Edit Form Data
  const [createForm, setCreateForm] = useState({
    title: '',
    country: '🇨🇴 Colombia',
    location: '',
    date: '',
    type: 'Carretera',
    difficulty: 'Media',
    privacy: 'public', // 'public' | 'private'
    clubName: 'Moto Club Cúcuta High Speed',
    startPoint: null, // { lat, lng, name }
    endPoint: null,   // { lat, lng, name }
    distanceKm: 0,
    elevationM: 0
  });

  // State to hold calculated real road path coordinates
  const [calculatedPath, setCalculatedPath] = useState([]);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);

  // Temporary Map Picker States
  const [tempPos, setTempPos] = useState({ lat: 4.675, lng: -74.065 });
  const [searchQueryPicker, setSearchQueryPicker] = useState('');
  const [isSearchingGeocode, setIsSearchingGeocode] = useState(false);

  // Persistent Rides Data from localStorage with Fallback Recovery
  const [ridesList, setRidesList] = useState(() => {
    try {
      const saved = localStorage.getItem('motoxcult_rides_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Error reading rides from localStorage:", e);
    }
    return INITIAL_DEFAULT_RIDES;
  });

  // Automatically persist ridesList changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('motoxcult_rides_list', JSON.stringify(ridesList));
    } catch (e) {
      console.error("Error saving rides to localStorage:", e);
    }
  }, [ridesList]);

  // Restore Default Rides if needed
  const handleRestoreDefaultRides = () => {
    setRidesList(INITIAL_DEFAULT_RIDES);
    setSelectedRideId(1);
    handleResetFilters();
    try {
      localStorage.setItem('motoxcult_rides_list', JSON.stringify(INITIAL_DEFAULT_RIDES));
    } catch (e) {
      console.error(e);
    }
  };

  // Comprehensive Filtering Logic
  const filteredRides = ridesList.filter(ride => {
    // 0. Top Bar Tab Filter
    if (activeTab === 'open' && ride.privacy !== 'public') return false;
    if (activeTab === 'club' && ride.privacy !== 'private') return false;

    // 1. Search Query
    const matchesSearch = !searchQuery || 
      ride.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ride.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ride.location && ride.location.toLowerCase().includes(searchQuery.toLowerCase()));

    // 2. Category Filter ('Todas' or match)
    const matchesCategory = selectedCategory === 'Todas' || !selectedCategory || ride.type === selectedCategory;

    // 3. Difficulty Filter ('Todas' or match)
    const matchesDifficulty = selectedDifficulty === 'Todas' || !selectedDifficulty || ride.difficulty === selectedDifficulty;

    // 4. Distance Slider Filter
    const numDist = parseFloat(ride.distance.replace(/[^0-9.]/g, '')) || 0;
    const matchesDistance = distanceMax >= 500 ? true : numDist <= distanceMax;

    // 5. Date Filter (Desde - Hasta)
    let matchesDate = true;
    const rideDateStr = ride.isoDate || ride.date;
    if (filterStartDate) {
      matchesDate = matchesDate && rideDateStr >= filterStartDate;
    }
    if (filterEndDate) {
      matchesDate = matchesDate && rideDateStr <= filterEndDate;
    }

    return matchesSearch && matchesCategory && matchesDifficulty && matchesDistance && matchesDate;
  });

  const selectedRide = filteredRides.find(r => r.id === selectedRideId) || filteredRides[0] || ridesList[0];

  // Sync category, difficulty, distance slider & date fields when selecting a ride card
  const handleSelectRideCard = (ride) => {
    setSelectedRideId(ride.id);
  };

  // Toggle RSVP Attendance
  const handleToggleAttendance = (rideId, e) => {
    if (e) e.stopPropagation();
    setRidesList(prev => prev.map(ride => {
      if (ride.id === rideId) {
        const nextAttending = !ride.isAttending;
        return {
          ...ride,
          isAttending: nextAttending,
          attendees: nextAttending ? ride.attendees + 1 : Math.max(0, ride.attendees - 1)
        };
      }
      return ride;
    }));
  };

  // Open Edit Modal for a specific ride
  const handleOpenEditModal = (ride, e) => {
    if (e) e.stopPropagation();
    setEditingRideId(ride.id);

    const startWp = ride.waypoints?.find(w => w.name.includes('🟢')) || ride.waypoints?.[0];
    const endWp = ride.waypoints?.find(w => w.name.includes('🔴')) || ride.waypoints?.[1];

    setCreateForm({
      title: ride.title,
      country: ride.country || '🇨🇴 Colombia',
      location: ride.location || '',
      date: ride.isoDate || '',
      type: ride.type || 'Carretera',
      difficulty: ride.difficulty || 'Media',
      privacy: ride.privacy || 'public',
      clubName: ride.clubName || 'Moto Club Cúcuta High Speed',
      startPoint: startWp ? { lat: startWp.lat, lng: startWp.lng, name: startWp.name.replace('🟢 ', '') } : null,
      endPoint: endWp ? { lat: endWp.lat, lng: endWp.lng, name: endWp.name.replace('🔴 ', '') } : null,
      distanceKm: parseFloat(ride.distance.replace(/[^0-9.]/g, '')) || 0,
      elevationM: parseInt((ride.elevationDelta || '0').replace(/[^0-9]/g, ''), 10) || 0
    });

    setCalculatedPath(ride.path || []);
    setShowCreateModal(true);
  };

  // Open Delete Confirmation Modal for a specific ride
  const handleOpenDeleteModal = (ride, e) => {
    if (e) e.stopPropagation();
    setRideToDelete(ride);
    setShowDeleteConfirm(true);
  };

  // Confirm Delete Operation
  const confirmDeleteRide = () => {
    if (!rideToDelete) return;
    const updatedList = ridesList.filter(r => r.id !== rideToDelete.id);
    setRidesList(updatedList.length > 0 ? updatedList : INITIAL_DEFAULT_RIDES);

    if (selectedRideId === rideToDelete.id) {
      setSelectedRideId(updatedList.length > 0 ? updatedList[0].id : 1);
    }

    setShowDeleteConfirm(false);
    setRideToDelete(null);
  };

  // Open Create Modal cleanly
  const handleOpenCreateModal = () => {
    setEditingRideId(null);
    setCreateForm({
      title: '',
      country: '🇨🇴 Colombia',
      location: '',
      date: '',
      type: 'Carretera',
      difficulty: 'Media',
      privacy: 'public',
      clubName: 'Moto Club Cúcuta High Speed',
      startPoint: null,
      endPoint: null,
      distanceKm: 0,
      elevationM: 0
    });
    setCalculatedPath([]);
    setShowCreateModal(true);
  };

  // Fetch real turn-by-turn road geometry from OSRM Routing API when both start and end points exist
  useEffect(() => {
    if (createForm.startPoint && createForm.endPoint) {
      const fetchRealRoadRoute = async () => {
        setIsCalculatingRoute(true);
        const { lat: startLat, lng: startLng } = createForm.startPoint;
        const { lat: endLat, lng: endLng } = createForm.endPoint;

        try {
          const osrmUrl = `https://routing.openstreetmap.de/routed-car/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;
          const response = await fetch(osrmUrl);
          const data = await response.json();

          if (data && data.routes && data.routes.length > 0) {
            const route = data.routes[0];
            const distKm = Number((route.distance / 1000).toFixed(1));
            const elevM = Math.round(distKm * 9.2 + 105);
            const autoDiff = distKm < 30 ? 'Fácil' : distKm < 80 ? 'Media' : 'Difícil';

            const leafletCoords = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);

            setCalculatedPath(leafletCoords);
            setCreateForm(prev => ({
              ...prev,
              distanceKm: distKm,
              elevationM: elevM,
              difficulty: autoDiff
            }));
          } else {
            const fallbackPath = [[startLat, startLng], [endLat, endLng]];
            setCalculatedPath(fallbackPath);
          }
        } catch (err) {
          console.error("OSRM Route fetch error:", err);
          const fallbackPath = [[startLat, startLng], [endLat, endLng]];
          setCalculatedPath(fallbackPath);
        } finally {
          setIsCalculatingRoute(false);
        }
      };

      fetchRealRoadRoute();
    }
  }, [createForm.startPoint, createForm.endPoint]);

  // Open Map Picker Modal for Start or Destination
  const handleOpenMapPicker = (targetType) => {
    setPickerTargetType(targetType);
    const initialPos = targetType === 'start' 
      ? (createForm.startPoint || { lat: 4.675, lng: -74.065 })
      : (createForm.endPoint || createForm.startPoint || { lat: 4.675, lng: -74.065 });
    
    setTempPos({ lat: initialPos.lat, lng: initialPos.lng });
    setShowMapPickerModal(true);
  };

  // Perform geocoding search for address/city
  const handleGeocodeSearch = async (e) => {
    e.preventDefault();
    if (!searchQueryPicker.trim()) return;

    setIsSearchingGeocode(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQueryPicker)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        const top = data[0];
        setTempPos({ lat: parseFloat(top.lat), lng: parseFloat(top.lon) });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearchingGeocode(false);
    }
  };

  // Confirm point selection from Map Picker Modal
  const handleConfirmLocation = () => {
    const pointName = searchQueryPicker.trim() || (pickerTargetType === 'start' ? 'Punto de Partida' : 'Punto de Llegada');
    const pointObj = {
      lat: Number(tempPos.lat.toFixed(5)),
      lng: Number(tempPos.lng.toFixed(5)),
      name: pointName
    };

    if (pickerTargetType === 'start') {
      setCreateForm(prev => ({ ...prev, startPoint: pointObj }));
    } else {
      setCreateForm(prev => ({ ...prev, endPoint: pointObj }));
    }

    setShowMapPickerModal(false);
    setSearchQueryPicker('');
  };

  // Handle final Form Submit (Supports Create & Edit)
  const handleCreateRideSubmit = (e) => {
    e.preventDefault();
    if (!createForm.title || !createForm.startPoint || !createForm.endPoint) return;

    const start = createForm.startPoint;
    const end = createForm.endPoint;

    const midLat = (start.lat + end.lat) / 2;
    const midLng = (start.lng + end.lng) / 2;

    const finalPath = calculatedPath.length > 0 ? calculatedPath : [[start.lat, start.lng], [end.lat, end.lng]];

    if (editingRideId) {
      // EDIT EXISTING RIDE
      setRidesList(ridesList.map(ride => {
        if (ride.id === editingRideId) {
          return {
            ...ride,
            title: createForm.title,
            country: createForm.country,
            location: createForm.location || `${start.name} → ${end.name}`,
            subtitle: `(${start.name} → ${end.name})`,
            date: createForm.date || ride.date,
            isoDate: createForm.date || ride.isoDate,
            type: createForm.type,
            difficulty: createForm.difficulty,
            privacy: createForm.privacy,
            clubName: createForm.privacy === 'private' ? createForm.clubName : '',
            elevationDelta: `${createForm.elevationM}m`,
            distance: `${createForm.distanceKm} km`,
            center: [midLat, midLng],
            path: finalPath,
            waypoints: [
              { lat: start.lat, lng: start.lng, name: `🟢 ${start.name}`, type: 'view' },
              { lat: end.lat, lng: end.lng, name: `🔴 ${end.name}`, type: 'food' }
            ]
          };
        }
        return ride;
      }));
      setSelectedRideId(editingRideId);
    } else {
      // CREATE NEW RIDE
      const newRideObj = {
        id: Date.now(),
        title: createForm.title,
        country: createForm.country,
        location: createForm.location || `${start.name} → ${end.name}`,
        subtitle: `(${start.name} → ${end.name})`,
        date: createForm.date || 'Próximamente',
        isoDate: createForm.date || new Date().toISOString().split('T')[0],
        type: createForm.type,
        difficulty: createForm.difficulty,
        privacy: createForm.privacy,
        clubName: createForm.privacy === 'private' ? createForm.clubName : '',
        elevationDelta: `${createForm.elevationM}m`,
        distance: `${createForm.distanceKm} km`,
        attendees: 1,
        isAttending: true,
        center: [midLat, midLng],
        zoom: 12,
        path: finalPath,
        waypoints: [
          { lat: start.lat, lng: start.lng, name: `🟢 ${start.name}`, type: 'view' },
          { lat: end.lat, lng: end.lng, name: `🔴 ${end.name}`, type: 'food' }
        ]
      };
      setRidesList([newRideObj, ...ridesList]);
      setSelectedRideId(newRideObj.id);
    }

    setShowCreateModal(false);
    setEditingRideId(null);
    setCreateForm({
      title: '',
      country: '🇨🇴 Colombia',
      location: '',
      date: '',
      type: 'Carretera',
      difficulty: 'Media',
      privacy: 'public',
      clubName: 'Moto Club Cúcuta High Speed',
      startPoint: null,
      endPoint: null,
      distanceKm: 0,
      elevationM: 0
    });
    setCalculatedPath([]);
  };

  // Reset all sidebar filters
  const handleResetFilters = () => {
    setActiveTab('all');
    setSelectedCategory('Todas');
    setSelectedDifficulty('Todas');
    setDistanceMax(500);
    setFilterStartDate('');
    setFilterEndDate('');
    setSearchQuery('');
  };

  return (
    <div className="rides-page-wrapper">
      
      {/* TOP HEADER ACTION BAR */}
      <div className="rides-top-bar">
        <div className="top-bar-left">
          <button 
            className="create-ride-cta-btn"
            onClick={handleOpenCreateModal}
          >
            <Plus size={18} />
            <span>Crear Nueva Rodada</span>
          </button>

          <button 
            className={`pill-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            Todas las Rodadas
          </button>

          <button 
            className={`pill-tab-btn ${activeTab === 'open' ? 'active' : ''}`}
            onClick={() => setActiveTab(activeTab === 'open' ? 'all' : 'open')}
          >
            🌐 Rodadas Abiertas (Públicas)
          </button>

          <button 
            className={`pill-tab-btn ${activeTab === 'club' ? 'active' : ''}`}
            onClick={() => setActiveTab(activeTab === 'club' ? 'all' : 'club')}
          >
            🔒 Rodadas de Mi Club
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button className="reset-filters-btn" onClick={handleResetFilters} title="Limpiar todos los filtros">
                  <RotateCw size={14} /> Restablecer
                </button>
                <button className="close-panel-btn" onClick={() => setSidebarOpen(false)}>
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* REAL DATE RANGE FILTER INPUTS */}
            <div className="filter-group">
              <label className="filter-label">Filtrar por Fecha</label>
              <div className="date-filter-row">
                <div className="date-input-wrapper">
                  <span className="input-sub-label">Desde</span>
                  <input 
                    type="date" 
                    value={filterStartDate} 
                    onChange={(e) => setFilterStartDate(e.target.value)}
                    className="sidebar-date-input"
                  />
                </div>
                <div className="date-input-wrapper">
                  <span className="input-sub-label">Hasta</span>
                  <input 
                    type="date" 
                    value={filterEndDate} 
                    onChange={(e) => setFilterEndDate(e.target.value)}
                    className="sidebar-date-input"
                  />
                </div>
              </div>
            </div>

            {/* TYPE OF RIDE CHIPS WITH 'TODAS' */}
            <div className="filter-group">
              <label className="filter-label">Tipo de Rodada</label>
              <div className="chips-row">
                {['Todas', 'Carretera', 'Off-road', 'Mixta'].map(cat => (
                  <button 
                    key={cat}
                    className={`chip-btn ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* DIFFICULTY CHIPS WITH 'TODAS' */}
            <div className="filter-group">
              <label className="filter-label">Dificultad</label>
              <div className="chips-row">
                {['Todas', 'Fácil', 'Media', 'Difícil'].map(diff => (
                  <button 
                    key={diff}
                    className={`chip-btn ${selectedDifficulty === diff ? 'active' : ''}`}
                    onClick={() => setSelectedDifficulty(diff)}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* DISTANCE SLIDER FILTER WITH SELECTED ROUTE INDICATOR */}
            <div className="filter-group">
              <div className="distance-label-row">
                <label className="filter-label">Distancia Máxima</label>
                <span className="distance-badge-value">
                  {distanceMax >= 500 ? 'Todas (Sin Límite)' : `${distanceMax} km`}
                </span>
              </div>
              
              {selectedRide && (
                <div className="selected-route-dist-hint">
                  📍 Ruta activa: <strong>{selectedRide.distance}</strong> ({selectedRide.title})
                </div>
              )}

              <input 
                type="range" 
                min="10" 
                max="500" 
                step="5"
                value={distanceMax} 
                onChange={(e) => setDistanceMax(Number(e.target.value))}
                className="distance-range-slider"
              />
              <div className="slider-ticks">
                <span>10 km</span>
                <span>150 km</span>
                <span>300 km</span>
                <span>500+ km</span>
              </div>
            </div>

            {/* UPCOMING RIDES SCROLLABLE LIST WITH RSVP, LOCATION & NOTIFICATIONS */}
            <div className="filter-group upcoming-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                <h3 className="upcoming-heading" style={{ margin: 0 }}>Rodadas Próximas</h3>
                <span className="ride-count-pill">{filteredRides.length} resultado{filteredRides.length !== 1 ? 's' : ''}</span>
              </div>
              
              <div className="rides-list-container">
                {filteredRides.length === 0 ? (
                  <div className="no-rides-empty-box">
                    <p>No se encontraron rodadas con los filtros seleccionados.</p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                      <button className="btn-reset" onClick={handleResetFilters}>Restablecer Filtros</button>
                      <button className="btn-reset" onClick={handleRestoreDefaultRides} style={{ background: 'rgba(255,186,0,0.2)', color: '#ffba00' }}>
                        Restaurar Rodadas
                      </button>
                    </div>
                  </div>
                ) : (
                  filteredRides.map((ride, idx) => (
                    <div 
                      key={ride.id} 
                      className={`ride-list-card ${selectedRide?.id === ride.id ? 'selected' : ''}`}
                      onClick={() => handleSelectRideCard(ride)}
                    >
                      <div className="card-numeric-badge">{idx + 1}</div>
                      
                      <div className="mini-card-map-thumb">
                        <img src="/assets/route_cafe_map.png" alt={ride.title} className="thumb-img" />
                      </div>

                      <div className="mini-card-details">
                        <div className="mini-ride-title-row">
                          <h4 className="mini-ride-title">{ride.title}</h4>
                          {ride.privacy === 'private' ? (
                            <span className="privacy-pill-tag private-tag" title={`Solo integrantes del club: ${ride.clubName}`}>
                              <Lock size={10} /> <span className="privacy-pill-text">{ride.clubName || 'Solo Club'}</span>
                            </span>
                          ) : (
                            <span className="privacy-pill-tag public-tag" title="Pública para todos los moteros">
                              <Globe size={10} /> <span className="privacy-pill-text">Pública</span>
                            </span>
                          )}
                        </div>

                        {/* COUNTRY & EXACT LOCATION */}
                        <div className="mini-ride-location-bar">
                          <span className="country-flag-badge">{ride.country || '🇨🇴 Colombia'}</span>
                          <span className="location-name-text"><MapPin size={11} /> {ride.location || ride.subtitle}</span>
                        </div>

                        <p className="mini-ride-date">
                          <Calendar size={12} /> {ride.date}
                        </p>

                        <div className="mini-ride-attendees-row">
                          <span className="mini-ride-attendees"><Users size={12} /> {ride.attendees} confirmados</span>
                          <button 
                            className={`btn-rsvp-toggle ${ride.isAttending ? 'attending' : ''}`}
                            onClick={(e) => handleToggleAttendance(ride.id, e)}
                            title={ride.isAttending ? 'Confirmado. Haz clic para cancelar' : 'Haz clic para unirte a la rodada'}
                          >
                            {ride.isAttending ? <CheckCircle2 size={12} /> : <Plus size={12} />}
                            {ride.isAttending ? 'Asistiré' : 'Unirme'}
                          </button>
                        </div>

                        {/* NOTIFICATION AUDIENCE BANNER */}
                        <div className="notification-audience-banner">
                          <Bell size={11} className="bell-icon" />
                          <span>
                            {ride.privacy === 'private' 
                              ? `Notificación enviada a miembros de ${ride.clubName}`
                              : `Notificación enviada a moteros de ${ride.country || 'Colombia'}`
                            }
                          </span>
                        </div>

                        {/* EDIT & DELETE ACTION BUTTONS */}
                        <div className="card-action-bar">
                          <button 
                            className="card-action-btn btn-edit-ride" 
                            onClick={(e) => handleOpenEditModal(ride, e)}
                            title="Editar esta rodada"
                          >
                            <Edit3 size={13} /> Editar
                          </button>
                          <button 
                            className="card-action-btn btn-delete-ride" 
                            onClick={(e) => handleOpenDeleteModal(ride, e)}
                            title="Borrar esta rodada"
                          >
                            <Trash2 size={13} /> Borrar
                          </button>
                        </div>
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
                  ))
                )}
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
                placeholder="Buscar rodada por nombre o ciudad..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="map-search-input"
              />
              <ChevronDown size={18} className="dropdown-arrow-icon" />
            </div>
          </div>

          <MapContainer 
            center={selectedRide ? selectedRide.center : [4.675, -74.065]} 
            zoom={selectedRide ? selectedRide.zoom : 12} 
            scrollWheelZoom={true}
            className="leaflet-map-element"
            zoomControl={false}
          >
            <MapViewController 
              center={selectedRide ? selectedRide.center : [4.675, -74.065]} 
              zoom={selectedRide ? selectedRide.zoom : 12} 
            />

            {/* CartoDB Dark Matter Base Tiles */}
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            {/* RENDER SELECTED ROUTE WITH REAL ROAD POLYLINE */}
            {selectedRide && (
              <>
                <Polyline 
                  positions={selectedRide.path}
                  pathOptions={{
                    color: selectedRide.privacy === 'private' ? '#ff9d00' : '#00d2ff',
                    weight: 6,
                    opacity: 0.95,
                    lineCap: 'round',
                    lineJoin: 'round'
                  }}
                />

                {selectedRide.waypoints.map((wp, i) => (
                  <Marker 
                    key={i} 
                    position={[wp.lat, wp.lng]}
                    icon={createCustomIcon(wp.name, wp.name.includes('🟢') ? '#22c55e' : wp.name.includes('🔴') ? '#ef4444' : '#ff9d00')}
                  >
                    <Popup className="custom-leaflet-popup">
                      <strong>{wp.name}</strong>
                    </Popup>
                  </Marker>
                ))}
              </>
            )}

          </MapContainer>

          {/* FLOATING ELEVATION POPUP CARD WITH LOCATION, RSVP & NOTIFICATION BANNER */}
          {selectedRide && (
            <div className="route-profile-popup-card">
              <div className="profile-card-header">
                <div className="title-group">
                  <span className="route-icon-badge">🗺️</span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h3 className="profile-route-title">{selectedRide.title.toUpperCase()}</h3>
                      {selectedRide.privacy === 'private' ? (
                        <span className="privacy-pill-tag private-tag"><Lock size={10} /> Privada</span>
                      ) : (
                        <span className="privacy-pill-tag public-tag"><Globe size={10} /> Pública</span>
                      )}
                    </div>
                    <span className="profile-route-subtitle">{selectedRide.country} • {selectedRide.location}</span>
                  </div>
                </div>
              </div>

              {/* NOTIFICATION AUDIENCE IN POPUP */}
              <div className="popup-notification-banner">
                <Bell size={12} className="bell-icon" />
                <span>
                  {selectedRide.privacy === 'private' 
                    ? `Notificación enviada a los integrantes de ${selectedRide.clubName}`
                    : `Notificación pública enviada a los moteros de ${selectedRide.country}`
                  }
                </span>
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

              {/* RSVP CONFIRMATION BUTTON IN POPUP CARD */}
              <div className="popup-rsvp-bar">
                <button 
                  className={`btn-popup-rsvp ${selectedRide.isAttending ? 'attending' : ''}`}
                  onClick={(e) => handleToggleAttendance(selectedRide.id, e)}
                >
                  {selectedRide.isAttending ? <CheckCircle2 size={16} /> : <Plus size={16} />}
                  <span>{selectedRide.isAttending ? '✅ Asistencia Confirmada (Asistiré)' : '🏍️ Unirme a esta Rodada'}</span>
                </button>
              </div>

              <div className="profile-card-footer">
                <span className="confirmed-label">
                  👥 {selectedRide.attendees} moteros confirmados
                </span>
                <span className="dist-value">📏 {selectedRide.distance}</span>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* FORM CREATION / EDIT MODAL WITH COUNTRY & LOCATION FIELDS */}
      {showCreateModal && (
        <div className="modal-backdrop">
          <div className="create-ride-modal">
            <div className="modal-header">
              <h3>{editingRideId ? '✏️ Editar Rodada' : '➕ Crear Nueva Rodada'}</h3>
              <button className="modal-close-btn" onClick={() => setShowCreateModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateRideSubmit} className="create-ride-form">
              <div className="form-field">
                <label>Nombre de la Rodada</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej: Ruta Transandina"
                  value={createForm.title}
                  onChange={(e) => setCreateForm({...createForm, title: e.target.value})}
                />
              </div>

              {/* COUNTRY & LOCATION FIELDS */}
              <div className="form-row">
                <div className="form-field">
                  <label>País</label>
                  <select 
                    value={createForm.country}
                    onChange={(e) => setCreateForm({...createForm, country: e.target.value})}
                  >
                    <option value="🇨🇴 Colombia">🇨🇴 Colombia</option>
                    <option value="🇻🇪 Venezuela">🇻🇪 Venezuela</option>
                    <option value="🇪🇨 Ecuador">🇪🇨 Ecuador</option>
                    <option value="🇵🇪 Perú">🇵🇪 Perú</option>
                    <option value="🇲🇽 México">🇲🇽 México</option>
                  </select>
                </div>

                <div className="form-field">
                  <label>Ubicación / Ciudad Principal</label>
                  <input 
                    type="text" 
                    placeholder="Ej: Cúcuta, Norte de Santander"
                    value={createForm.location}
                    onChange={(e) => setCreateForm({...createForm, location: e.target.value})}
                  />
                </div>
              </div>

              {/* PRIVACY SELECTOR CONTROL */}
              <div className="form-field">
                <label>Visibilidad y Privacidad de la Rodada</label>
                <div className="privacy-toggle-group">
                  <button 
                    type="button"
                    className={`privacy-toggle-btn ${createForm.privacy === 'public' ? 'active' : ''}`}
                    onClick={() => setCreateForm({...createForm, privacy: 'public'})}
                  >
                    <Globe size={16} />
                    <div>
                      <strong>🌐 Pública</strong>
                      <span className="privacy-sub-hint">Envía notificación a todos los moteros</span>
                    </div>
                  </button>

                  <button 
                    type="button"
                    className={`privacy-toggle-btn ${createForm.privacy === 'private' ? 'active' : ''}`}
                    onClick={() => setCreateForm({...createForm, privacy: 'private'})}
                  >
                    <Lock size={16} />
                    <div>
                      <strong>🔒 Privada (Solo Club)</strong>
                      <span className="privacy-sub-hint">Envía notificación a miembros del club</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* CLUB SELECTOR WHEN PRIVATE */}
              {createForm.privacy === 'private' && (
                <div className="form-field">
                  <label>Seleccionar Club Destinado</label>
                  <select 
                    value={createForm.clubName}
                    onChange={(e) => setCreateForm({...createForm, clubName: e.target.value})}
                  >
                    <option value="Moto Club Cúcuta High Speed">Moto Club Cúcuta High Speed</option>
                    <option value="Los Halcones del Norte">Los Halcones del Norte</option>
                    <option value="Piston Cult Colombia">Piston Cult Colombia</option>
                  </select>
                </div>
              )}

              {/* PUNTO DE PARTIDA FIELD */}
              <div className="form-field">
                <label>🟢 Punto de Partida (Origen)</label>
                <div className="location-picker-input-group">
                  <input 
                    type="text"
                    readOnly
                    placeholder="Ningún punto seleccionado..."
                    value={createForm.startPoint ? `${createForm.startPoint.name} (${createForm.startPoint.lat}, ${createForm.startPoint.lng})` : ''}
                  />
                  <button 
                    type="button" 
                    className="btn-open-picker"
                    onClick={() => handleOpenMapPicker('start')}
                  >
                    <MapPin size={16} /> 📌 Seleccionar en Mapa
                  </button>
                </div>
              </div>

              {/* PUNTO DE LLEGADA FIELD */}
              <div className="form-field">
                <label>🔴 Punto de Llegada (Destino)</label>
                <div className="location-picker-input-group">
                  <input 
                    type="text"
                    readOnly
                    placeholder="Ningún punto seleccionado..."
                    value={createForm.endPoint ? `${createForm.endPoint.name} (${createForm.endPoint.lat}, ${createForm.endPoint.lng})` : ''}
                  />
                  <button 
                    type="button" 
                    className="btn-open-picker"
                    onClick={() => handleOpenMapPicker('end')}
                  >
                    <MapPin size={16} /> 📌 Seleccionar en Mapa
                  </button>
                </div>
              </div>

              {/* AUTO-CALCULATED SUMMARY BOX FROM REAL ROUTING */}
              {createForm.startPoint && createForm.endPoint && (
                <div className="calculated-summary-box">
                  {isCalculatingRoute ? (
                    <div style={{ width: '100%', textAlign: 'center', color: '#ffba00' }}>
                      ⚡ Calculando trazado real de carreteras por GPS...
                    </div>
                  ) : (
                    <>
                      <div><span>Distancia Real:</span> <strong>{createForm.distanceKm} km</strong></div>
                      <div><span>Desnivel:</span> <strong>{createForm.elevationM} m</strong></div>
                      <div><span>Dificultad:</span> <strong>{createForm.difficulty}</strong></div>
                    </>
                  )}
                </div>
              )}

              <div className="form-row">
                <div className="form-field">
                  <label>Fecha de la Rodada</label>
                  <input 
                    type="date" 
                    required
                    value={createForm.date}
                    onChange={(e) => setCreateForm({...createForm, date: e.target.value})}
                  />
                </div>
                <div className="form-field">
                  <label>Tipo de Rodada</label>
                  <select 
                    value={createForm.type}
                    onChange={(e) => setCreateForm({...createForm, type: e.target.value})}
                  >
                    <option value="Carretera">Carretera</option>
                    <option value="Off-road">Off-road</option>
                    <option value="Mixta">Mixta</option>
                  </select>
                </div>
              </div>

              <div className="form-field">
                <label>Dificultad (Personalizada)</label>
                <select 
                  value={createForm.difficulty}
                  onChange={(e) => setCreateForm({...createForm, difficulty: e.target.value})}
                >
                  <option value="Fácil">Fácil</option>
                  <option value="Media">Media</option>
                  <option value="Difícil">Difícil</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowCreateModal(false)}>
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn-submit-ride"
                  disabled={!createForm.startPoint || !createForm.endPoint || isCalculatingRoute}
                >
                  {editingRideId ? 'Guardar Cambios' : 'Publicar en el Mapa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL OVERLAY */}
      {showDeleteConfirm && rideToDelete && (
        <div className="modal-backdrop picker-backdrop">
          <div className="delete-confirm-modal">
            <div className="delete-modal-icon">
              <AlertTriangle size={36} color="#ef4444" />
            </div>
            <h3>¿Eliminar Rodada?</h3>
            <p>
              ¿Estás seguro de que deseas eliminar permanentemente la rodada <strong>"{rideToDelete.title}"</strong>? Esta acción no se puede deshacer.
            </p>
            <div className="delete-modal-actions">
              <button className="btn-cancel-delete" onClick={() => setShowDeleteConfirm(false)}>
                Cancelar
              </button>
              <button className="btn-confirm-delete" onClick={confirmDeleteRide}>
                <Trash2 size={16} /> Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GOOGLE MAPS STYLE LOCATION PICKER OVERLAY MODAL */}
      {showMapPickerModal && (
        <div className="modal-backdrop picker-backdrop">
          <div className="map-picker-modal">
            <div className="picker-modal-header">
              <h3>
                {pickerTargetType === 'start' ? '🟢 Seleccionar Punto de Partida (Origen)' : '🔴 Seleccionar Punto de Llegada (Destino)'}
              </h3>
              <button className="modal-close-btn" onClick={() => setShowMapPickerModal(false)}>
                <X size={20} />
              </button>
            </div>

            {/* ADDRESS / CITY SEARCH BAR */}
            <form onSubmit={handleGeocodeSearch} className="picker-search-bar">
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder="Buscar ciudad, lugar o dirección (ej: Cúcuta, San Antonio, Bogotá)..."
                value={searchQueryPicker}
                onChange={(e) => setSearchQueryPicker(e.target.value)}
              />
              <button type="submit" className="btn-geocode-search">
                {isSearchingGeocode ? 'Buscando...' : 'Buscar'}
              </button>
            </form>

            <div className="picker-map-wrapper">
              <MapContainer 
                center={[tempPos.lat, tempPos.lng]} 
                zoom={14} 
                className="picker-leaflet-canvas"
                zoomControl={true}
              >
                <MapViewController center={[tempPos.lat, tempPos.lng]} zoom={14} />
                <LocationPickerMapEvents tempPos={tempPos} setTempPos={setTempPos} />
                
                <TileLayer
                  attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                <Marker 
                  position={[tempPos.lat, tempPos.lng]}
                  icon={createCustomIcon(
                    pickerTargetType === 'start' ? '🟢 Partida' : '🔴 Llegada',
                    pickerTargetType === 'start' ? '#22c55e' : '#ef4444'
                  )}
                />
              </MapContainer>

              <div className="picker-coords-badge">
                📍 Lat: <strong>{tempPos.lat.toFixed(5)}</strong> | Lng: <strong>{tempPos.lng.toFixed(5)}</strong>
              </div>
            </div>

            <div className="picker-modal-footer">
              <span className="picker-instruction-hint">💡 Haz clic en cualquier lugar del mapa o busca una dirección para fijar el punto.</span>
              <button type="button" className="btn-confirm-picker" onClick={handleConfirmLocation}>
                <Check size={18} /> Confirmar Ubicación
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Rides;
