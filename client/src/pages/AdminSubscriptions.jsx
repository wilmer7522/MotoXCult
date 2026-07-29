import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import { ShieldCheck, Crown, Check, X, Smartphone, Award, Calendar, Phone, Mail, MapPin, ExternalLink, Image as ImageIcon, AlertTriangle } from 'lucide-react';
import './AdminSubscriptions.css';

const AdminSubscriptions = () => {
  const { user } = useAuth();
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [previewModalImg, setPreviewModalImg] = useState(null);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/admin/subscriptions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setClubs(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (clubId) => {
    if (!window.confirm('¿Seguro que deseas aprobar el pago de este Moto Club y activar su Insignia Dorada VIP?')) return;
    setActionLoading(clubId);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/admin/subscriptions/${clubId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        alert('¡Suscripción Aprobada! El Moto Club tiene su Insignia Dorada VIP activa.');
        fetchSubscriptions();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (clubId) => {
    const reason = window.prompt('Ingresa el motivo del rechazo para notificar al líder del Moto Club (ej. Comprobante no legible o valor incorrecto):', 'Comprobante no válido o no se pudo verificar la transacción.');
    if (reason === null) return;

    setActionLoading(clubId);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/admin/subscriptions/${clubId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rejectionReason: reason })
      });
      if (res.ok) {
        alert('Solicitud rechazada con éxito. El motivo fue registrado y notificado al líder.');
        fetchSubscriptions();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div className="admin-loading">Cargando Panel de Administración...</div>;

  const pendingClubs = clubs.filter(c => c.paymentStatus === 'PENDING_VERIFICATION');
  const activeClubs = clubs.filter(c => c.isSubscriptionActive === 1);
  const rejectedClubs = clubs.filter(c => c.paymentStatus === 'REJECTED');

  return (
    <div className="admin-page full-bleed">
      <div className="container">
        
        <header className="admin-header">
          <span className="admin-badge"><ShieldCheck size={16} /> PANEL DE ADMINISTRACIÓN - WILMER ROJAS</span>
          <h1>VERIFICACIÓN DE PAGOS NEQUI, BRE-B & PAYPAL</h1>
          <p>Revisa y aprueba las suscripciones de Moto Clubs para activar su Insignia Dorada VIP.</p>
        </header>

        {/* Sección Solicitudes Pendientes */}
        <section className="admin-section">
          <h2><Smartphone size={22} className="pink-icon" /> 1. Pagos Pendientes de Verificación ({pendingClubs.length})</h2>

          {pendingClubs.length === 0 ? (
            <div className="no-pending-box">
              <Check size={36} />
              <p>No hay pagos pendientes por revisar en este momento.</p>
            </div>
          ) : (
            <div className="admin-cards-list">
              {pendingClubs.map(club => (
                <div key={club.id} className="admin-sub-card pending">
                  <div className="card-top">
                    <div className="club-mini-info">
                      {club.logo ? (
                        <img src={club.logo} alt={club.name} className="mini-logo" />
                      ) : (
                        <div className="mini-logo-fallback">{club.name.charAt(0)}</div>
                      )}
                      <div>
                        <h3>{club.name}</h3>
                        <span className="meta-loc"><MapPin size={12} /> {club.city}, {club.country}</span>
                      </div>
                    </div>

                    <span className="plan-badge-tag">
                      Plan: {club.selectedPlan === 'annual' ? 'Anual' : 'Mensual'}
                    </span>
                  </div>

                  <div className="card-middle">
                    <div className="ref-highlight-box">
                      <span className="ref-label">Número / ID de Referencia:</span>
                      <span className="ref-code">{club.paymentReference || 'No especificado'}</span>
                      
                      {club.paymentImage && (
                        <button 
                          type="button" 
                          className="btn-view-proof"
                          onClick={() => setPreviewModalImg(club.paymentImage)}
                        >
                          <ImageIcon size={14} /> Ver Captura del Comprobante 📷
                        </button>
                      )}
                    </div>

                    <div className="leader-contact">
                      <span><Award size={14} /> <strong>Líder:</strong> {club.leaderName}</span>
                      <span><Mail size={14} /> {club.leaderEmail}</span>
                      <span><Phone size={14} /> {club.leaderPhone || 'No especificado'}</span>
                    </div>
                  </div>

                  <div className="card-actions">
                    <button 
                      className="btn-approve-gold"
                      onClick={() => handleApprove(club.id)}
                      disabled={actionLoading === club.id}
                    >
                      <Crown size={16} /> {actionLoading === club.id ? 'Aprobando...' : 'Aprobar Pago & Activar VIP 👑'}
                    </button>

                    <button 
                      className="btn-reject"
                      onClick={() => handleReject(club.id)}
                      disabled={actionLoading === club.id}
                    >
                      <X size={16} /> Rechazar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Sección Clubs Activos */}
        <section className="admin-section" style={{ marginTop: '3rem' }}>
          <h2><Crown size={22} className="gold-icon" /> 2. Moto Clubs VIP Activos / Aprobados ({activeClubs.length})</h2>
          
          <div className="active-clubs-table">
            <table>
              <thead>
                <tr>
                  <th>Moto Club</th>
                  <th>Líder</th>
                  <th>Sede</th>
                  <th>Plan</th>
                  <th>Referencia</th>
                  <th>Estado</th>
                  <th>Vencimiento</th>
                </tr>
              </thead>
              <tbody>
                {activeClubs.map(c => (
                  <tr key={c.id}>
                    <td><strong>{c.name}</strong></td>
                    <td>{c.leaderName} ({c.leaderEmail})</td>
                    <td>{c.city}, {c.country}</td>
                    <td>{c.selectedPlan === 'annual' ? 'Anual' : 'Mensual'}</td>
                    <td><code>{c.paymentReference || '—'}</code></td>
                    <td><span className="active-status-badge">ACTIVO VIP</span></td>
                    <td>{c.subscriptionExpiresAt ? new Date(c.subscriptionExpiresAt).toLocaleDateString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Sección Historial de Rechazados */}
        <section className="admin-section" style={{ marginTop: '3rem' }}>
          <h2><AlertTriangle size={22} style={{ color: '#ef4444' }} /> 3. Historial de Solicitudes Rechazadas ({rejectedClubs.length})</h2>

          {rejectedClubs.length === 0 ? (
            <div className="no-pending-box">
              <Check size={36} />
              <p>No hay solicitudes rechazadas en el historial.</p>
            </div>
          ) : (
            <div className="active-clubs-table">
              <table>
                <thead>
                  <tr>
                    <th>Moto Club</th>
                    <th>Líder</th>
                    <th>Referencia Envisada</th>
                    <th>Motivo de Rechazo</th>
                    <th>Estado</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {rejectedClubs.map(c => (
                    <tr key={c.id}>
                      <td><strong>{c.name}</strong></td>
                      <td>{c.leaderName} ({c.leaderEmail})</td>
                      <td><code>{c.paymentReference || '—'}</code></td>
                      <td style={{ color: '#fca5a5', fontWeight: '600' }}>{c.rejectionReason || 'Comprobante no válido'}</td>
                      <td><span className="rejected-status-badge">RECHAZADO</span></td>
                      <td>
                        <button 
                          className="btn-approve-gold"
                          style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                          onClick={() => handleApprove(c.id)}
                          disabled={actionLoading === c.id}
                        >
                          <Crown size={12} /> Aprobar Manualmente
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

      </div>

      {/* Modal Visor de Captura de Pantalla Completa */}
      {previewModalImg && (
        <div className="modal-backdrop" onClick={() => setPreviewModalImg(null)}>
          <div className="image-preview-modal" onClick={e => e.stopPropagation()}>
            <div className="image-modal-header">
              <h3>Captura del Comprobante de Pago</h3>
              <button className="btn-close-modal" onClick={() => setPreviewModalImg(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="image-modal-body">
              <img src={previewModalImg} alt="Comprobante completo" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubscriptions;
