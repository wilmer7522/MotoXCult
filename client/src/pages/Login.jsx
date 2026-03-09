import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../config';
import './Auth.css';

const Login = () => {
  const { t } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`https://motoxcult-api.onrender.com/api/auth/login`, {
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
        <div className="auth-card">
          <h1>{t.auth.loginTitle}</h1>
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>{t.auth.email}</label>
              <input 
                type="email" 
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                required 
              />
            </div>
            <div className="form-group">
              <label>{t.auth.password}</label>
              <input 
                type="password" 
                value={formData.password} 
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                required 
              />
            </div>
            <button type="submit" className="cta auth-btn">{t.auth.loginBtn}</button>
          </form>
          <p className="auth-footer">
            {t.auth.noAccount} <Link to="/register">{t.nav.join}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
