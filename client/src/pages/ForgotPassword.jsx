import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import { KeyRound, Mail, CheckCircle2, ShieldCheck } from 'lucide-react';
import './Auth.css';

const ForgotPassword = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1 = Enter Email, 2 = Enter Code & New Password
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(data.message);
        if (data.resetCode) {
          setResetCode(data.resetCode);
        }
        setStep(2);
      } else {
        setError(data.message || 'No se pudo enviar el correo de recuperación.');
      }
    } catch (err) {
      setError('Error de conexión al servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetCode || resetCode.length < 6) {
      alert('Ingresa el código de verificación de 6 dígitos recibido.');
      return;
    }
    if (!newPassword || newPassword.length < 4) {
      alert('La nueva contraseña debe tener al menos 4 caracteres.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, resetCode, newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        alert('¡Contraseña restablecida exitosamente! Iniciando sesión...');
        navigate('/login');
      } else {
        setError(data.message || 'Error al restablecer la contraseña.');
      }
    } catch (err) {
      setError('Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page full-bleed">
      <div className="container">
        <div className="auth-card">
          <h1>RECUPERAR CONTRASEÑA 🔐</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem', lineHeight: '1.4' }}>
            {step === 1 
              ? 'Ingresa tu correo registrado. Te enviaremos un código de verificación de 6 dígitos.' 
              : 'Ingresa el código de 6 dígitos enviado a tu correo y tu nueva contraseña.'}
          </p>

          {error && <div className="auth-error">{error}</div>}
          {success && (
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#34d399', padding: '12px', borderRadius: '12px', marginBottom: '1.25rem', fontSize: '0.88rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>{success}</div>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleSendCode}>
              <div className="form-group">
                <label><Mail size={14} /> Correo Electrónico Registrado</label>
                <input 
                  type="email" 
                  placeholder="tuemail@ejemplo.com"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  disabled={loading}
                  required 
                />
              </div>
              <button type="submit" className="cta auth-btn" disabled={loading}>
                {loading ? 'Enviando Código...' : 'Enviar Código por Correo'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword}>
              <div className="form-group">
                <label><ShieldCheck size={14} /> Código de Verificación de 6 Dígitos *</label>
                <input 
                  type="text" 
                  placeholder="Ej. 849201"
                  value={resetCode} 
                  onChange={(e) => setResetCode(e.target.value)} 
                  disabled={loading}
                  required 
                  maxLength={6}
                  style={{ letterSpacing: '4px', fontWeight: '800', textAlign: 'center', fontSize: '1.2rem' }}
                />
              </div>

              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label><KeyRound size={14} /> Nueva Contraseña *</label>
                <input 
                  type="password" 
                  placeholder="Ingresa tu nueva clave de acceso"
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  disabled={loading}
                  required 
                />
              </div>

              <button type="submit" className="cta auth-btn" disabled={loading} style={{ marginTop: '1.25rem' }}>
                {loading ? 'Restableciendo Clave...' : 'Restablecer Contraseña e Iniciar Sesión'}
              </button>

              <button 
                type="button" 
                onClick={() => setStep(1)} 
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '0.85rem', width: '100%', marginTop: '1rem', cursor: 'pointer' }}
              >
                ← Probar con otro correo
              </button>
            </form>
          )}

          <p className="auth-footer" style={{ marginTop: '1.5rem' }}>
            <Link to="/login">← Volver al inicio de sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
