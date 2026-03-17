import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../config';
import './Auth.css';

const Register = () => {
  const { t } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '',
    birthDate: '',
    country: '',
    city: '',
    phone: '',
    club: ''
  });
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
                <input 
                  type="text" 
                  placeholder="Ej. Colombia"
                  value={formData.country} 
                  onChange={(e) => setFormData({...formData, country: e.target.value})} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>{t.auth.city}</label>
                <input 
                  type="text" 
                  placeholder="Ej. Medellín"
                  value={formData.city} 
                  onChange={(e) => setFormData({...formData, city: e.target.value})} 
                  required 
                />
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
