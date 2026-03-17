import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { API_URL } from '../config';
import { Country, City } from 'country-state-city';
import './Profile.css';

const Profile = () => {
  const { user, login } = useAuth();
  const { t, lang } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    country: '',
    city: '',
    club: '',
    countryCode: ''
  });
  const [cities, setCities] = useState([]);
  const americanCodes = ['AR', 'BO', 'BR', 'CA', 'CL', 'CO', 'CR', 'CU', 'DO', 'EC', 'SV', 'GT', 'HN', 'MX', 'NI', 'PA', 'PY', 'PE', 'PR', 'UY', 'VE', 'US', 'JM', 'HT', 'TT'];
  const allCountries = Country.getAllCountries().filter(c => americanCodes.includes(c.isoCode));
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`https://motoxcult-api.onrender.com/api/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        // Formatear fecha para el input date (YYYY-MM-DD)
        const formattedDate = data.birthDate ? new Date(data.birthDate).toISOString().split('T')[0] : '';
        
        const countryCode = allCountries.find(c => c.name === data.country)?.isoCode || '';
        
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          birthDate: formattedDate,
          country: data.country || '',
          countryCode: countryCode,
          city: data.city || '',
          club: data.club || ''
        });

        if (countryCode) {
          setCities(City.getCitiesOfCountry(countryCode));
        }

        // Update local auth context with fresh data (including bikes)
        login(data, token);
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`https://motoxcult-api.onrender.com/api/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        login(data, token);
        setMessage({ type: 'success', text: t.profile.success });
      } else {
        setMessage({ type: 'error', text: data.message || t.profile.error });
      }
    } catch (err) {
      setMessage({ type: 'error', text: t.profile.error });
    }
  };
  const handleCountryChange = (e) => {
    const code = e.target.value;
    const countryName = allCountries.find(c => c.isoCode === code)?.name || '';
    setFormData({ ...formData, countryCode: code, country: countryName, city: '' });
    if (code) {
      setCities(City.getCitiesOfCountry(code));
    } else {
      setCities([]);
    }
  };

  if (!user || loading) return <div className="loading-screen">Cargando perfil...</div>;

  return (
    <div className="profile-page full-bleed">
      <div className="container">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="profile-title-area">
            <h1>{user.name}</h1>
            <p className="profile-club">{user.club || 'SIN CLUB'}</p>
          </div>
        </div>

        <div className="profile-grid">
          <section className="profile-section">
            <h2>{t.profile.personalInfo}</h2>
            {message.text && (
              <div className={`form-message ${message.type}`}>
                {message.text}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="info-grid">
                <div className="info-item">
                  <label>{t.auth.name}</label>
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="info-item">
                  <label>{t.auth.email}</label>
                  <input 
                    type="email" 
                    value={formData.email} 
                    disabled
                  />
                  <small style={{color: 'var(--text-muted)'}}>El email no se puede cambiar</small>
                </div>
                <div className="info-item">
                  <label>{t.auth.phone}</label>
                  <input 
                    type="tel" 
                    value={formData.phone} 
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+57..."
                  />
                </div>
                <div className="info-item">
                  <label>{t.auth.birthDate}</label>
                  <input 
                    type="date" 
                    value={formData.birthDate} 
                    onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                  />
                </div>
                <div className="info-item">
                  <label>{t.auth.country}</label>
                  <select 
                    value={formData.countryCode} 
                    onChange={handleCountryChange} 
                    required
                  >
                    <option value="">{lang === 'es' ? 'Selecciona un país' : 'Select a country'}</option>
                    {allCountries.map(c => (
                      <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="info-item">
                  <label>{t.auth.city}</label>
                  <select 
                    value={formData.city} 
                    onChange={(e) => setFormData({...formData, city: e.target.value})} 
                    required
                    disabled={!formData.countryCode}
                  >
                    <option value="">{lang === 'es' ? 'Selecciona una ciudad' : 'Select a city'}</option>
                    {cities.map((c, index) => (
                      <option key={`${c.name}-${index}`} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="info-item full-width">
                  <label>{t.auth.club}</label>
                  <input 
                    type="text" 
                    value={formData.club} 
                    onChange={(e) => setFormData({...formData, club: e.target.value.toUpperCase()})}
                    className="uppercase-input"
                  />
                </div>
              </div>
              <button type="submit" className="cta save-btn">{t.profile.saveChanges}</button>
            </form>
          </section>

          <aside className="profile-stats">
            <div className="stat-card">
              <h3>Karma</h3>
              <p className="stat-value">{user.karma || 0}</p>
            </div>
            <div className="stat-card">
              <h3>{t.nav.garage}</h3>
              <p className="stat-value">{user.bikes?.length || 0}</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Profile;
