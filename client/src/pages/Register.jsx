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
    country: '',
    countryCode: '',
    city: ''
  });
  const [cities, setCities] = useState([]);
  const americanCodes = ['AR', 'BO', 'BR', 'CA', 'CL', 'CO', 'CR', 'CU', 'DO', 'EC', 'SV', 'GT', 'HN', 'MX', 'NI', 'PA', 'PY', 'PE', 'PR', 'UY', 'VE', 'US', 'JM', 'HT', 'TT'];
  const allCountries = Country.getAllCountries().filter(c => americanCodes.includes(c.isoCode));
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`https://motoxcult-api.onrender.com/api/auth/register`, {
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

  return (
    <div className="auth-page full-bleed">
      <div className="container">
        <div className="auth-card register-card">
          <h1>{t.auth.registerTitle}</h1>
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
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
              <div className="form-group">
                <label>{t.auth.birthDate}</label>
                <input 
                  type="date" 
                  value={formData.birthDate} 
                  onChange={(e) => setFormData({...formData, birthDate: e.target.value})} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>{t.auth.phone}</label>
                <input 
                  type="tel" 
                  placeholder="+57 300..."
                  value={formData.phone} 
                  onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                  required 
                />
              </div>
              <div className="form-group">
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
              <div className="form-group full-width">
                <label>{t.auth.club}</label>
                <input 
                  type="text" 
                  placeholder="ESCRIBE AQUÍ EL CLUB"
                  className="uppercase-input"
                  value={formData.club} 
                  onChange={(e) => setFormData({...formData, club: e.target.value.toUpperCase()})} 
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
