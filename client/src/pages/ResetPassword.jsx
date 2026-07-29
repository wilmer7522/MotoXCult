import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { API_URL } from '../config';
import './Auth.css';

const ResetPassword = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess(data.message);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(data.message || t.auth.error);
      }
    } catch (err) {
      setError(t.auth.error);
    }
  };

  return (
    <div className="auth-page full-bleed">
      <div className="container">
        <div className="auth-card">
          <h1>{t.auth.resetTitle}</h1>
          
          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}

          {!success ? (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>{t.auth.resetTokenLabel}</label>
                <input 
                  type="text" 
                  value={token} 
                  onChange={(e) => setToken(e.target.value)} 
                  placeholder="Token de recuperación"
                  required 
                />
              </div>
              <div className="form-group">
                <label>{t.auth.newPassword}</label>
                <input 
                  type="password" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  placeholder="Mínimo 6 caracteres"
                  required 
                />
              </div>
              <div className="form-group">
                <label>Confirmar Nueva Contraseña</label>
                <input 
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  placeholder="Repite la contraseña"
                  required 
                />
              </div>
              <button type="submit" className="cta auth-btn">{t.auth.resetBtn}</button>
            </form>
          ) : (
            <div style={{ marginTop: '1.5rem' }}>
              <button onClick={() => navigate('/login')} className="cta auth-btn">
                {t.auth.backToLogin}
              </button>
            </div>
          )}

          <p className="auth-footer">
            <Link to="/login">{t.auth.backToLogin}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
