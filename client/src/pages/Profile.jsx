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

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({...formData});

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    setEditData({...formData});
  }, [formData]);

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
        const formattedDate = data.birthDate ? new Date(data.birthDate).toISOString().split('T')[0] : '';
        const countryCode = allCountries.find(c => c.name === data.country)?.isoCode || '';
        
        const newData = {
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          birthDate: formattedDate,
          country: data.country || '',
          countryCode: countryCode,
          city: data.city || '',
          club: data.club || ''
        };
        setFormData(newData);

        if (countryCode) {
          setCities(City.getCitiesOfCountry(countryCode));
        }

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
        body: JSON.stringify(editData)
      });
      const data = await res.json();
      if (res.ok) {
        setFormData(editData);
        login(data, token);
        setMessage({ type: 'success', text: t.profile.success });
        setIsEditing(false);
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
    setEditData({ ...editData, countryCode: code, country: countryName, city: '' });
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
            {formData.name?.charAt(0).toUpperCase()}
          </div>
          <div className="profile-title-area">
            <h1>{formData.name}</h1>
            <p className="profile-club">{formData.club || 'SIN CLUB'}</p>
          </div>
          {!isEditing && (
            <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>
              {lang === 'es' ? 'Editar Perfil' : 'Edit Profile'}
            </button>
          )}
        </div>

        <div className="profile-grid">
          <section className="profile-section">
            <div className="section-header">
              <h2>{t.profile.personalInfo}</h2>
            </div>
            
            {message.text && (
              <div className={`form-message ${message.type}`}>
                {message.text}
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="info-grid editing">
                  <div className="info-item">
                    <label>{t.auth.name}</label>
                    <input 
                      type="text" 
                      value={editData.name} 
                      onChange={(e) => setEditData({...editData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="info-item">
                    <label>{t.auth.email}</label>
                    <input 
                      type="email" 
                      value={editData.email} 
                      disabled
                    />
                  </div>
                  <div className="info-item">
                    <label>{t.auth.phone}</label>
                    <input 
                      type="tel" 
                      value={editData.phone} 
                      onChange={(e) => setEditData({...editData, phone: e.target.value})}
                      placeholder="+57..."
                    />
                  </div>
                  <div className="info-item">
                    <label>{t.auth.birthDate}</label>
                    <input 
                      type="date" 
                      value={editData.birthDate} 
                      onChange={(e) => setEditData({...editData, birthDate: e.target.value})}
                    />
                  </div>
                  <div className="info-item">
                    <label>{t.auth.country}</label>
                    <select 
                      value={editData.countryCode} 
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
                      value={editData.city} 
                      onChange={(e) => setEditData({...editData, city: e.target.value})} 
                      required
                      disabled={!editData.countryCode}
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
                      value={editData.club} 
                      onChange={(e) => setEditData({...editData, club: e.target.value.toUpperCase()})}
                      className="uppercase-input"
                    />
                  </div>
                </div>
                <div className="edit-actions">
                  <button type="submit" className="cta save-btn">{t.profile.saveChanges}</button>
                  <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>
                    {lang === 'es' ? 'Cancelar' : 'Cancel'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="info-grid view-mode">
                <div className="info-item">
                  <label>{t.auth.name}</label>
                  <p className="view-value">{formData.name}</p>
                </div>
                <div className="info-item">
                  <label>{t.auth.email}</label>
                  <p className="view-value">{formData.email}</p>
                </div>
                <div className="info-item">
                  <label>{t.auth.phone}</label>
                  <p className="view-value">{formData.phone || '—'}</p>
                </div>
                <div className="info-item">
                  <label>{t.auth.birthDate}</label>
                  <p className="view-value">{formData.birthDate ? new Date(formData.birthDate + 'T00:00:00').toLocaleDateString() : '—'}</p>
                </div>
                <div className="info-item">
                  <label>{t.auth.country}</label>
                  <p className="view-value">{formData.country || '—'}</p>
                </div>
                <div className="info-item">
                  <label>{t.auth.city}</label>
                  <p className="view-value">{formData.city || '—'}</p>
                </div>
                <div className="info-item full-width">
                  <label>{t.auth.club}</label>
                  <p className="view-value club-highlight">{formData.club || 'SIN CLUB'}</p>
                </div>
              </div>
            )}
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
