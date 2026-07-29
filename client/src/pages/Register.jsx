import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../config';
import { Country, City } from 'country-state-city';
import './Auth.css';

const Register = () => {
  const { t, lang } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    birthDate: '',
    country: '',
    countryCode: '',
    city: ''
  });
  const [cities, setCities] = useState([]);
  const americanCodes = ['AR', 'BO', 'BR', 'CA', 'CL', 'CO', 'CR', 'CU', 'DO', 'EC', 'SV', 'GT', 'HN', 'MX', 'NI', 'PA', 'PY', 'PE', 'PR', 'UY', 'VE', 'US', 'JM', 'HT', 'TT'];
  const allCountries = Country.getAllCountries().filter(c => americanCodes.includes(c.isoCode));
  const [error, setError] = useState('');

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
    
    let updatedPhone = formData.phone || '';
    if (!updatedPhone || updatedPhone.startsWith('+')) {
      updatedPhone = prefix ? `${prefix} ` : '';
    }

    setFormData({ 
      ...formData, 
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
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        login(data.user, data.token);
        navigate('/garage');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(t.auth.error);
    }
  };

  const currentPrefix = getPhonePrefix(formData.countryCode);

  return (
    <div className="auth-page full-bleed">
      <div className="container">
        <div className="auth-card register-card">
          <h1>{t.auth.registerTitle}</h1>
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              {/* 1. Nombre Completo */}
              <div className="form-group">
                <label>{t.auth.name}</label>
                <input 
                  type="text" 
                  placeholder="Ej. Juan Pérez"
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  required 
                />
              </div>

              {/* 2. Correo Electrónico */}
              <div className="form-group">
                <label>{t.auth.email}</label>
                <input 
                  type="email" 
                  placeholder="correo@ejemplo.com"
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  required 
                />
              </div>

              {/* 3. Contraseña */}
              <div className="form-group">
                <label>{t.auth.password}</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={formData.password} 
                  onChange={(e) => setFormData({...formData, password: e.target.value})} 
                  required 
                />
              </div>

              {/* 4. País (Primero) */}
              <div className="form-group">
                <label>{t.auth.country}</label>
                <select 
                  value={formData.countryCode} 
                  onChange={handleCountryChange} 
                  required
                >
                  <option value="">{lang === 'es' ? 'Selecciona un país' : 'Select a country'}</option>
                  {allCountries.map(c => (
                    <option key={c.isoCode} value={c.isoCode}>{c.name} (+{c.phonecode})</option>
                  ))}
                </select>
              </div>

              {/* 5. Ciudad (Dependiente del País) */}
              <div className="form-group">
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

              {/* 6. Teléfono (Con prefijo de país dinámico) */}
              <div className="form-group">
                <label>{t.auth.phone}</label>
                <div className={`phone-input-container ${currentPrefix ? 'has-prefix' : ''}`}>
                  {currentPrefix && (
                    <span className="phone-prefix-badge">{currentPrefix}</span>
                  )}
                  <input 
                    type="tel" 
                    placeholder={currentPrefix ? "300 123 4567" : "+57 300 123 4567"}
                    value={formData.phone} 
                    onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                    required 
                  />
                </div>
              </div>

              {/* 7. Fecha de Nacimiento */}
              <div className="form-group full-width">
                <label>{t.auth.birthDate}</label>
                <input 
                  type="date" 
                  value={formData.birthDate} 
                  onChange={(e) => setFormData({...formData, birthDate: e.target.value})} 
                  required 
                />
              </div>
            </div>
            <button type="submit" className="cta auth-btn">{t.auth.registerBtn}</button>
          </form>
          <p className="auth-footer">
            {t.auth.hasAccount} <Link to="/login">{t.nav.login}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
