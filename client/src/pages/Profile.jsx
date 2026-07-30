import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { API_URL } from '../config';
import { Country, City } from 'country-state-city';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Award, 
  Flame, 
  Bike, 
  Edit3, 
  Save, 
  X, 
  Camera, 
  ShieldCheck, 
  Globe, 
  Building 
} from 'lucide-react';
import './Profile.css';

const formatDateDisplay = (dateStr) => {
  if (!dateStr) return '—';
  const cleanStr = String(dateStr).split('T')[0];
  const parts = cleanStr.split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    const mIdx = parseInt(month, 10) - 1;
    if (mIdx >= 0 && mIdx < 12) {
      return `${parseInt(day, 10)} de ${months[mIdx]} de ${year}`;
    }
  }
  return cleanStr;
};

const Profile = () => {
  const { user, login } = useAuth();
  const { t, lang } = useLanguage();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    birthDate: user?.birthDate || user?.birthdate ? (user.birthDate || user.birthdate).split('T')[0] : '',
    country: user?.country || '',
    city: user?.city || '',
    club: user?.club || '',
    countryCode: '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
    karma: user?.karma || 0,
    bikes: []
  });

  const [cities, setCities] = useState([]);
  const americanCodes = ['AR', 'BO', 'BR', 'CA', 'CL', 'CO', 'CR', 'CU', 'DO', 'EC', 'SV', 'GT', 'HN', 'MX', 'NI', 'PA', 'PY', 'PE', 'PR', 'UY', 'VE', 'US', 'JM', 'HT', 'TT'];
  const allCountries = Country.getAllCountries().filter(c => americanCodes.includes(c.isoCode));
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({...formData});
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (user) {
      const rawUserDate = user.birthDate || user.birthdate || '';
      const formattedUserDate = rawUserDate ? rawUserDate.split('T')[0] : '';

      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name || '',
        email: user.email || prev.email || '',
        phone: user.phone || prev.phone || '',
        birthDate: prev.birthDate || formattedUserDate,
        country: user.country || prev.country || '',
        city: user.city || prev.city || '',
        club: user.club || prev.club || '',
        avatar: user.avatar || prev.avatar || '',
        bio: user.bio || prev.bio || ''
      }));
    }
  }, [user]);

  useEffect(() => {
    setEditData({...formData});
  }, [formData]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        const rawDate = data.birthDate || data.birthdate || '';
        const formattedDate = rawDate ? rawDate.split('T')[0] : '';
        const countryCode = allCountries.find(c => c.name === data.country)?.isoCode || '';
        
        const newData = {
          name: data.name || user?.name || '',
          email: data.email || user?.email || '',
          phone: data.phone || user?.phone || '',
          birthDate: formattedDate,
          country: data.country || user?.country || '',
          countryCode: countryCode,
          city: data.city || user?.city || '',
          club: data.club || user?.club || '',
          avatar: data.avatar || user?.avatar || '',
          bio: data.bio || user?.bio || '',
          karma: data.karma || user?.karma || 0,
          bikes: data.bikes || []
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

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const getPhonePrefix = (code) => {
    if (!code) return '';
    const cObj = Country.getCountryByCode(code);
    return cObj ? `+${cObj.phonecode}` : '';
  };

  const handleCountryChange = (e) => {
    const code = e.target.value;
    const countryObj = allCountries.find(c => c.isoCode === code);
    const countryName = countryObj?.name || '';
    const prefix = countryObj ? `+${countryObj.phonecode}` : '';
    
    let updatedPhone = editData.phone || '';
    if (!updatedPhone || updatedPhone.startsWith('+')) {
      updatedPhone = prefix ? `${prefix} ` : '';
    }

    setEditData({ 
      ...editData, 
      countryCode: code, 
      country: countryName, 
      city: '',
      phone: updatedPhone
    });

    if (code) {
      setCities(City.getCitiesOfCountry(code));
    } else {
      setCities([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      let currentAvatarUrl = editData.avatar;

      if (avatarFile) {
        const reader = new FileReader();
        currentAvatarUrl = await new Promise((resolve) => {
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(avatarFile);
        });
      }

      const profileEndpoints = [
        `${API_URL}/api/users/profile`,
        `${API_URL}/api/users/me`,
        `https://motoxcult-api.wilmer7522.workers.dev/api/users/profile`,
        `https://motoxcult-api.wilmer7522.workers.dev/api/users/me`
      ];

      let data = null;
      let resOk = false;

      for (const endpoint of profileEndpoints) {
        try {
          const res = await fetch(endpoint, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ ...editData, avatar: currentAvatarUrl })
          });

          const contentType = res.headers.get('content-type') || '';
          if (res.ok && contentType.includes('application/json')) {
            data = await res.json();
            resOk = true;
            break;
          }
        } catch(e) {
          console.warn('Endpoint retry failed:', endpoint, e);
        }
      }

      if (resOk && data) {
        const rawDate = data.birthDate || data.birthdate || editData.birthDate || '';
        const updatedDate = rawDate ? rawDate.split('T')[0] : '';
        const newSavedData = { 
          ...editData, 
          name: data.name || editData.name,
          email: data.email || editData.email || user?.email,
          birthDate: updatedDate, 
          avatar: data.avatar || currentAvatarUrl 
        };
        setFormData(newSavedData);
        login({ ...user, ...newSavedData }, token);
        setMessage({ type: 'success', text: t.profile.success });
        setIsEditing(false);
        setAvatarFile(null);
        setAvatarPreview(null);
      } else {
        setMessage({ type: 'error', text: 'Error al actualizar el perfil. Por favor intenta de nuevo.' });
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      setMessage({ type: 'error', text: err.message || t.profile.error });
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setAvatarFile(null);
    setAvatarPreview(null);
    setEditData({...formData});
  };

  if (!user && loading) {
    return (
      <div className="profile-loading-screen">
        <div className="spinner"></div>
        <p>Cargando Perfil Motero...</p>
      </div>
    );
  }

  const currentPrefix = getPhonePrefix(editData.countryCode);
  const activeEmail = formData.email || user?.email || '';

  return (
    <div className="profile-page full-bleed">
      <div className="container">
        
        {/* Banner de Cabecera Estilo VIP / Cyberpunk Biker */}
        <div className="profile-hero-card">
          <div className="profile-cover-bg"></div>
          <div className="profile-header-content">
            <div className={`profile-avatar-container ${isEditing ? 'editing' : ''}`}>
              <div className="avatar-ring">
                {avatarPreview || formData.avatar ? (
                  <img src={avatarPreview || formData.avatar} alt="Avatar" className="avatar-img" />
                ) : (
                  <div className="avatar-fallback">
                    {formData.name?.charAt(0).toUpperCase() || <User size={48} />}
                  </div>
                )}
              </div>
            </div>

            <div className="profile-identity">
              <div className="identity-top">
                <h1>{formData.name || user?.name || 'Motero MotoXCult'}</h1>
                <span className="biker-badge">
                  <ShieldCheck size={14} /> MIEMBRO VERIFICADO
                </span>
              </div>
              <p className="profile-club-tag">
                <Award size={16} /> {formData.club || user?.club ? `CLUB: ${formData.club || user?.club}` : 'SIN CLUB ASIGNADO'}
              </p>
            </div>

            <div className="header-action">
              {!isEditing ? (
                <button className="btn-edit-glow" onClick={() => setIsEditing(true)}>
                  <Edit3 size={16} /> {lang === 'es' ? 'Editar Perfil' : 'Edit Profile'}
                </button>
              ) : (
                <button className="btn-cancel-top" onClick={cancelEdit}>
                  <X size={16} /> {lang === 'es' ? 'Cancelar' : 'Cancel'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="profile-grid-layout">
          {/* Formulario / Detalle de Información */}
          <main className="profile-main-card">
            <div className="card-header-styled">
              <h2>
                <User size={22} className="orange-icon" /> {t.profile.personalInfo}
              </h2>
              {isEditing && <span className="mode-badge">Modo Edición</span>}
            </div>

            {message.text && (
              <div className={`notification-banner ${message.type}`}>
                {message.text}
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleSubmit} className="modern-form">
                <div className="form-grid-2col">
                  {/* 1. Nombre Completo */}
                  <div className="input-group">
                    <label><User size={14} /> {t.auth.name}</label>
                    <input 
                      type="text" 
                      value={editData.name} 
                      onChange={(e) => setEditData({...editData, name: e.target.value})}
                      placeholder="Tu nombre completo"
                      required
                    />
                  </div>

                  {/* 2. Correo Electrónico (Siempre visible con el correo registrado) */}
                  <div className="input-group">
                    <label><Mail size={14} /> {t.auth.email}</label>
                    <input 
                      type="email" 
                      value={activeEmail} 
                      disabled
                      className="readonly-input"
                    />
                  </div>

                  {/* 3. País (Primero) */}
                  <div className="input-group">
                    <label><Globe size={14} /> {t.auth.country}</label>
                    <select 
                      value={editData.countryCode} 
                      onChange={handleCountryChange} 
                    >
                      <option value="">{lang === 'es' ? 'Selecciona un país' : 'Select a country'}</option>
                      {allCountries.map(c => (
                        <option key={c.isoCode} value={c.isoCode}>{c.name} (+{c.phonecode})</option>
                      ))}
                    </select>
                  </div>

                  {/* 4. Ciudad (Filtrada según el País) */}
                  <div className="input-group">
                    <label><Building size={14} /> {t.auth.city}</label>
                    <select 
                      value={editData.city} 
                      onChange={(e) => setEditData({...editData, city: e.target.value})} 
                      disabled={!editData.countryCode}
                    >
                      <option value="">{lang === 'es' ? 'Selecciona una ciudad' : 'Select a city'}</option>
                      {cities.map((c, index) => (
                        <option key={`${c.name}-${index}`} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* 5. Teléfono (Con el prefijo dinámico del país) */}
                  <div className="input-group">
                    <label><Phone size={14} /> {t.auth.phone}</label>
                    <div className={`phone-input-container ${currentPrefix ? 'has-prefix' : ''}`}>
                      {currentPrefix && (
                        <span className="phone-prefix-badge">{currentPrefix}</span>
                      )}
                      <input 
                        type="tel" 
                        value={editData.phone} 
                        onChange={(e) => setEditData({...editData, phone: e.target.value})}
                        placeholder={currentPrefix ? "300 123 4567" : "+57 300 123 4567"}
                      />
                    </div>
                  </div>

                  {/* 6. Fecha de Nacimiento */}
                  <div className="input-group">
                    <label><Calendar size={14} /> {t.auth.birthDate}</label>
                    <input 
                      type="date" 
                      value={editData.birthDate} 
                      onChange={(e) => setEditData({...editData, birthDate: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-actions-bar">
                  <button type="submit" className="btn-save-glow" disabled={loading}>
                    <Save size={16} /> {loading ? 'Guardando...' : t.profile.saveChanges}
                  </button>
                  <button type="button" className="btn-cancel-glass" onClick={cancelEdit}>
                    <X size={16} /> {lang === 'es' ? 'Cancelar' : 'Cancel'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-display-grid">
                <div className="display-box">
                  <span className="box-label"><User size={14} /> {t.auth.name}</span>
                  <span className="box-value">{formData.name || user?.name || 'Sin especificar'}</span>
                </div>

                <div className="display-box">
                  <span className="box-label"><Mail size={14} /> {t.auth.email}</span>
                  <span className="box-value">{activeEmail || 'Sin especificar'}</span>
                </div>

                <div className="display-box">
                  <span className="box-label"><Globe size={14} /> {t.auth.country}</span>
                  <span className="box-value">{formData.country || user?.country || '—'}</span>
                </div>

                <div className="display-box">
                  <span className="box-label"><Building size={14} /> {t.auth.city}</span>
                  <span className="box-value">{formData.city || user?.city || '—'}</span>
                </div>

                <div className="display-box">
                  <span className="box-label"><Phone size={14} /> {t.auth.phone}</span>
                  <span className="box-value">{formData.phone || user?.phone || '—'}</span>
                </div>

                <div className="display-box">
                  <span className="box-label"><Calendar size={14} /> {t.auth.birthDate}</span>
                  <span className="box-value">
                    {formatDateDisplay(formData.birthDate || user?.birthDate || user?.birthdate)}
                  </span>
                </div>
              </div>
            )}
          </main>

          {/* Lateral de Estadísticas e Impacto */}
          <aside className="profile-sidebar-stats">
            <div className="stat-glow-card karma-card">
              <div className="stat-icon-wrapper">
                <Flame size={28} />
              </div>
              <div className="stat-info">
                <h3>KARMA MOTERO</h3>
                <span className="stat-number">{formData.karma || user?.karma || 0}</span>
                <p className="stat-desc">Puntos por rodadas y aporte a la comunidad</p>
              </div>
            </div>

            <div className="stat-glow-card garage-card">
              <div className="stat-icon-wrapper">
                <Bike size={28} />
              </div>
              <div className="stat-info">
                <h3>GARAJE VIRTUAL</h3>
                <span className="stat-number">{formData.bikes?.length || 0}</span>
                <p className="stat-desc">Motocicletas registradas en tu garaje</p>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default Profile;
