import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Plus, MapPin, Users, Award, ExternalLink, Search, Crown, Clock, AlertCircle, XCircle, Calendar } from 'lucide-react';
import './Clubs.css';

const formatDateShort = (dateString) => {
  if (!dateString) return null;
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return null;
  }
};

const calculateDaysRemaining = (expiryDateString) => {
  if (!expiryDateString) return null;
  try {
    const expiry = new Date(expiryDateString);
    const now = new Date();
    const diffMs = expiry.getTime() - now.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  } catch {
    return null;
  }
};

const Clubs = () => {
  const { user } = useAuth();
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const res = await fetch(`${API_URL}/api/clubs`);
      const data = await res.json();
      if (res.ok) {
        setClubs(data);
      }
    } catch (err) {
      console.error('Error cargando clubs:', err);
    } finally {
      setLoading(false);
    }
  };

  const citiesList = [...new Set(clubs.map(c => c.city).filter(Boolean))];

  const filteredClubs = clubs.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (c.city && c.city.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCity = selectedCity ? c.city === selectedCity : true;
    return matchesSearch && matchesCity;
  });

  if (loading) {
    return <div className="clubs-loading">Cargando Moto Clubs...</div>;
  }

  return (
    <div className="clubs-page full-bleed">
      <div className="container">
        
        {/* Header Hero */}
        <div className="clubs-hero">
          <h1>DIRECTORIO DE MOTO CLUBS</h1>
          <p>Descubre los mejores grupos moteros de la región, únete a sus rodadas u oficializa tu propio Moto Club.</p>
          <Link to="/clubs/new" className="btn-create-club-glow">
            <Plus size={18} /> REGISTRAR MI MOTO CLUB
          </Link>
        </div>

        {/* Filtros */}
        <div className="clubs-filter-bar">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Buscar por nombre de club o ciudad..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <select 
            value={selectedCity} 
            onChange={e => setSelectedCity(e.target.value)}
            className="city-select"
          >
            <option value="">Todas las ciudades</option>
            {citiesList.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Grid de Clubs */}
        <div className="clubs-grid">
          {filteredClubs.length === 0 ? (
            <div className="no-clubs-card">
              <Award size={48} />
              <h3>No se encontraron Moto Clubs</h3>
              <p>Sé el primero en registrar tu club en esta ubicación.</p>
            </div>
          ) : (
            filteredClubs.map(club => (
              <div key={club.id} className={`club-card ${club.isSubscriptionActive ? 'verified-vip' : ''}`}>
                <div className="club-card-cover" style={{ backgroundImage: `url(${club.banner || '/assets/garage-bg.jpg'})` }}>
                  <div className="cover-overlay"></div>
                  {club.isSubscriptionActive ? (
                    <span className="gold-vip-badge">
                      <Crown size={14} /> CLUB VERIFICADO VIP
                    </span>
                  ) : club.paymentStatus === 'PENDING_VERIFICATION' ? (
                    <span className="pending-verification-badge">
                      <Clock size={14} /> EN VERIFICACIÓN DE PAGO
                    </span>
                  ) : club.paymentStatus === 'REJECTED' ? (
                    <span className="rejected-badge">
                      <XCircle size={14} /> SOLICITUD RECHAZADA
                    </span>
                  ) : club.paymentStatus === 'EXPIRED' ? (
                    <span className="expired-badge">
                      <AlertCircle size={14} /> SUSCRIPCIÓN VENCIDA
                    </span>
                  ) : (
                    <span className="standard-badge">MOTO CLUB</span>
                  )}
                </div>

                <div className="club-card-body">
                  <div className="club-logo-wrapper">
                    {club.logo ? (
                      <img src={club.logo} alt={club.name} className="club-logo-img" />
                    ) : (
                      <div className="club-logo-fallback">{club.name.charAt(0)}</div>
                    )}
                  </div>

                  <h2 className="club-name">{club.name}</h2>
                  
                  <div className="club-meta">
                    <span className="club-location"><MapPin size={14} /> {club.city}, {club.country}</span>
                    <span className="club-leader"><Award size={14} /> Líder: {club.leaderName || 'Oficial'}</span>
                    {club.createdAt && (
                      <span className="club-created-date" style={{ color: '#94a3b8', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.3rem', width: '100%', marginTop: '0.3rem' }}>
                        <Calendar size={13} style={{ color: '#ff8c00' }} /> Fundado: {formatDateShort(club.createdAt)}
                      </span>
                    )}
                  </div>

                  {user && user.id === club.leaderId && club.subscriptionExpiresAt && (
                    <div className="club-card-expiration-info" style={{ margin: '0.6rem 0', padding: '6px 10px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '0.78rem', color: '#cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span><strong>Vence:</strong> {formatDateShort(club.subscriptionExpiresAt)}</span>
                      {(() => {
                        const days = calculateDaysRemaining(club.subscriptionExpiresAt);
                        if (days === null) return null;
                        if (days > 0) {
                          return <span style={{ color: '#4ade80', fontWeight: '800' }}>🎯 {days} {days === 1 ? 'día' : 'días'} restantes</span>;
                        } else if (days >= -3) {
                          return <span style={{ color: '#f59e0b', fontWeight: '800' }}>⚠️ En prórroga</span>;
                        } else {
                          return <span style={{ color: '#ef4444', fontWeight: '800' }}>🔴 Vencido</span>;
                        }
                      })()}
                    </div>
                  )}

                  <p className="club-desc">
                    {club.description || 'Moto Club oficial registrado en la comunidad MotoXCult.'}
                  </p>

                  <div className="club-card-footer">
                    <Link to={`/clubs/${club.id}`} className="btn-view-club">
                      Ver Perfil del Club <ExternalLink size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default Clubs;
