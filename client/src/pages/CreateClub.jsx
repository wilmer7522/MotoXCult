import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { API_URL } from '../config';
import { Country, City } from 'country-state-city';
import { 
  ShieldCheck, 
  Award, 
  Globe, 
  Building, 
  CheckCircle, 
  Zap, 
  Lock, 
  Sparkles, 
  ArrowRight, 
  Image as ImageIcon, 
  MessageSquare, 
  Instagram, 
  Copy, 
  Check, 
  Smartphone, 
  Send, 
  CreditCard, 
  ExternalLink, 
  FileText, 
  Upload, 
  Link as LinkIcon 
} from 'lucide-react';
import './CreateClub.css';

const CreateClub = () => {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    banner: '',
    description: '',
    country: '',
    countryCode: '',
    city: '',
    whatsappGroup: '',
    instagram: ''
  });

  const [logoInputType, setLogoInputType] = useState('file'); // 'file' or 'url'
  const [bannerInputType, setBannerInputType] = useState('file'); // 'file' or 'url'
  const [logoFileName, setLogoFileName] = useState('');
  const [bannerFileName, setBannerFileName] = useState('');
  const [proofFileName, setProofFileName] = useState('');

  const [cities, setCities] = useState([]);
  const americanCodes = ['AR', 'BO', 'BR', 'CA', 'CL', 'CO', 'CR', 'CU', 'DO', 'EC', 'SV', 'GT', 'HN', 'MX', 'NI', 'PA', 'PY', 'PE', 'PR', 'UY', 'VE', 'US', 'JM', 'HT', 'TT'];
  const allCountries = Country.getAllCountries().filter(c => americanCodes.includes(c.isoCode));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [existingClubData, setExistingClubData] = useState(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [createdClub, setCreatedClub] = useState(null);

  // Payment Modal state
  const [paymentMethod, setPaymentMethod] = useState('nequi');
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [paymentRef, setPaymentRef] = useState('');
  const [proofImageBase64, setProofImageBase64] = useState('');
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [copiedNequi, setCopiedNequi] = useState(false);
  const [copiedPaypal, setCopiedPaypal] = useState(false);

  const handleCountryChange = (e) => {
    const code = e.target.value;
    const countryName = allCountries.find(c => c.isoCode === code)?.name || '';
    setFormData({ ...formData, countryCode: code, country: countryName, city: '' });
    if (code) {
      setCities(City.getCitiesOfCountry(code));
      if (code !== 'CO') {
        setPaymentMethod('paypal');
      } else {
        setPaymentMethod('nequi');
      }
    } else {
      setCities([]);
    }
  };

  const handleFileUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      if (field === 'logo') setLogoFileName(file.name);
      if (field === 'banner') setBannerFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteExistingClub = async () => {
    if (!existingClubData?.id) return;
    if (!window.confirm(`¿Estás seguro de que deseas eliminar permanentemente el Moto Club "${existingClubData.name}"?`)) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/clubs/${existingClubData.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || 'Moto Club eliminado con éxito.');
        setError('');
        setExistingClubData(null);
      } else {
        alert(data.message || 'Error al eliminar el club.');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión.');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setExistingClubData(null);
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/clubs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        setCreatedClub(data);
        if (data.isSubscriptionActive === 1 || data.paymentStatus === 'APPROVED') {
          alert(`¡FELICITACIONES! Tu Moto Club "${data.name}" ha sido creado y publicado con éxito.\n\nSe ha conservado y transferido automáticamente tu Suscripción VIP Activa con Insignia Dorada.`);
          navigate(`/clubs/${data.id}`);
        } else {
          setShowSubscriptionModal(true);
        }
      } else {
        setError(data.message || 'Error registrando Moto Club');
        if (data.existingClubId) {
          setExistingClubData({ id: data.existingClubId, name: data.existingClubName });
        }
      }
    } catch (err) {
      setError(err.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const copyNequi = () => {
    navigator.clipboard.writeText('3185503428');
    setCopiedNequi(true);
    setTimeout(() => setCopiedNequi(false), 2500);
  };

  const copyPaypal = () => {
    navigator.clipboard.writeText('wilmer7522@gmail.com');
    setCopiedPaypal(true);
    setTimeout(() => setCopiedPaypal(false), 2500);
  };

  const handleProofImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProofFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofImageBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaymentSubmit = async () => {
    if (!paymentRef.trim()) {
      alert('Por favor ingresa el número o ID de referencia de la transacción');
      return;
    }

    if (!proofImageBase64) {
      alert('Es obligatorio adjuntar la captura de pantalla del comprobante de pago');
      return;
    }

    if (!createdClub) return;
    setSubmittingPayment(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/clubs/${createdClub.id}/submit-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          paymentReference: `${paymentMethod.toUpperCase()}: ${paymentRef}`,
          paymentImage: proofImageBase64,
          selectedPlan
        })
      });

      if (res.ok) {
        alert('¡Comprobante temporal enviado a verificación! El administrador revisará tu pago activando tu insignia dorada VIP.');
        navigate(`/clubs/${createdClub.id}`);
      } else {
        alert('Error al enviar el comprobante');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingPayment(false);
    }
  };

  return (
    <div className="create-club-page full-bleed">
      <div className="container">
        
        <div className="create-club-header">
          <span className="badge-official"><ShieldCheck size={16} /> REGISTRO DE LÍDERES M.C.</span>
          <h1>REGISTRA TU MOTO CLUB OFICIAL</h1>
          <p>Oficializa tu grupo motero, adquiere tu insignia de verificado y lidera la comunidad en tu ciudad.</p>
        </div>

        <div className="create-club-card">
          {user?.club && (
            <div className="single-club-restriction-banner" style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '14px', padding: '1.5rem', marginBottom: '2rem', textAlign: 'center' }}>
              <h3 style={{ color: '#ef4444', marginTop: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                ⚠️ RESTRICCIÓN DE MOTO CLUB ÚNICO
              </h3>
              <p style={{ color: '#cbd5e1', fontSize: '0.95rem', margin: '0.5rem 0 1.2rem 0' }}>
                Actualmente estás registrado en el club <strong>{user.club}</strong>. Solo puedes pertenecer o ser presidente de un solo Moto Club a la vez. Si deseas crear uno nuevo, primero debes salir o eliminar tu club actual.
              </p>
              <button 
                type="button" 
                onClick={() => navigate('/clubs')} 
                style={{ background: '#ff8c00', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: '800', cursor: 'pointer' }}
              >
                Ver Lista de Moto Clubes
              </button>
            </div>
          )}

          {error && (
            <div className="error-banner" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center', textAlign: 'center' }}>
              <div>{error}</div>
              {existingClubData && (
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.25rem' }}>
                  <button
                    type="button"
                    onClick={() => navigate(`/clubs/${existingClubData.id}`)}
                    style={{ background: '#ff8c00', color: '#000', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', fontSize: '0.85rem' }}
                  >
                    👁️ Ver Mi Moto Club ({existingClubData.name})
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteExistingClub}
                    style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', fontSize: '0.85rem' }}
                  >
                    🗑️ Eliminar Moto Club "{existingClubData.name}"
                  </button>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="club-form">
            <div className="form-section-title">
              <Award size={20} className="orange-icon" /> 1. Datos Principales del Club
            </div>

            <div className="form-grid-2col">
              <div className="input-group full-width">
                <label>Nombre Oficial del Moto Club *</label>
                <input 
                  type="text" 
                  placeholder="Ej. LOS REYES M.C. COLOMBIA"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div className="input-group">
                <label><Globe size={14} /> País Sede *</label>
                <select value={formData.countryCode} onChange={handleCountryChange} required>
                  <option value="">Selecciona un país</option>
                  {allCountries.map(c => (
                    <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label><Building size={14} /> Ciudad Sede *</label>
                <select 
                  value={formData.city} 
                  onChange={(e) => setFormData({...formData, city: e.target.value})} 
                  required
                  disabled={!formData.countryCode}
                >
                  <option value="">Selecciona una ciudad</option>
                  {cities.map((c, idx) => (
                    <option key={`${c.name}-${idx}`} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Escudo / Logo Input Estilizado */}
              <div className="input-group full-width">
                <div className="label-row-with-toggle">
                  <label><ImageIcon size={14} /> Escudo / Logo del Club (PNG/JPG)</label>
                  <div className="toggle-mode-pills">
                    <button 
                      type="button" 
                      className={`pill-btn ${logoInputType === 'file' ? 'active' : ''}`}
                      onClick={() => setLogoInputType('file')}
                    >
                      <Upload size={12} /> Subir Archivo
                    </button>
                    <button 
                      type="button" 
                      className={`pill-btn ${logoInputType === 'url' ? 'active' : ''}`}
                      onClick={() => setLogoInputType('url')}
                    >
                      <LinkIcon size={12} /> Pegar URL
                    </button>
                  </div>
                </div>

                {logoInputType === 'file' ? (
                  <label className="custom-file-upload-box">
                    <input 
                      type="file" 
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      onChange={(e) => handleFileUpload(e, 'logo')}
                    />
                    <div className="upload-box-content">
                      <Upload size={18} className="upload-icon" />
                      <span>
                        {logoFileName 
                          ? `✓ Archivo seleccionado: ${logoFileName}` 
                          : 'Seleccionar archivo de imagen (.png, .jpg)'}
                      </span>
                    </div>
                  </label>
                ) : (
                  <input 
                    type="url" 
                    placeholder="https://ejemplo.com/escudo.png"
                    value={formData.logo}
                    onChange={(e) => setFormData({...formData, logo: e.target.value})}
                  />
                )}

                {formData.logo && (
                  <div className="image-preview-inline">
                    <span>Vista previa del Escudo:</span>
                    <img src={formData.logo} alt="Escudo preview" className="mini-preview-img" />
                  </div>
                )}
              </div>

              {/* Portada / Banner Input Estilizado */}
              <div className="input-group full-width">
                <div className="label-row-with-toggle">
                  <label><ImageIcon size={14} /> Portada / Banner del Club (PNG/JPG)</label>
                  <div className="toggle-mode-pills">
                    <button 
                      type="button" 
                      className={`pill-btn ${bannerInputType === 'file' ? 'active' : ''}`}
                      onClick={() => setBannerInputType('file')}
                    >
                      <Upload size={12} /> Subir Archivo
                    </button>
                    <button 
                      type="button" 
                      className={`pill-btn ${bannerInputType === 'url' ? 'active' : ''}`}
                      onClick={() => setBannerInputType('url')}
                    >
                      <LinkIcon size={12} /> Pegar URL
                    </button>
                  </div>
                </div>

                {bannerInputType === 'file' ? (
                  <label className="custom-file-upload-box">
                    <input 
                      type="file" 
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      onChange={(e) => handleFileUpload(e, 'banner')}
                    />
                    <div className="upload-box-content">
                      <Upload size={18} className="upload-icon" />
                      <span>
                        {bannerFileName 
                          ? `✓ Archivo seleccionado: ${bannerFileName}` 
                          : 'Seleccionar archivo de portada (.png, .jpg)'}
                      </span>
                    </div>
                  </label>
                ) : (
                  <input 
                    type="url" 
                    placeholder="https://ejemplo.com/portada.jpg"
                    value={formData.banner}
                    onChange={(e) => setFormData({...formData, banner: e.target.value})}
                  />
                )}

                {formData.banner && (
                  <div className="image-preview-inline">
                    <span>Vista previa de Portada:</span>
                    <img src={formData.banner} alt="Banner preview" className="banner-preview-img" />
                  </div>
                )}
              </div>

              <div className="input-group full-width">
                <label>Descripción / Historia del Club</label>
                <textarea 
                  rows={4}
                  placeholder="Cuenta la historia del club, estilo de motos (custom, touring, enduro, pista) o requisitos para unirse..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="input-group">
                <label><MessageSquare size={14} /> Enlace Grupo de WhatsApp / Telegram</label>
                <input 
                  type="url" 
                  placeholder="https://chat.whatsapp.com/..."
                  value={formData.whatsappGroup}
                  onChange={(e) => setFormData({...formData, whatsappGroup: e.target.value})}
                />
              </div>

              <div className="input-group">
                <label><Instagram size={14} /> Instagram del Club</label>
                <input 
                  type="text" 
                  placeholder="@losreyesmc"
                  value={formData.instagram}
                  onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                />
              </div>
            </div>

            <div className="form-submit-bar">
              <button type="submit" className="btn-submit-glow" disabled={loading}>
                {loading ? 'Oficializando Moto Club...' : (
                  (user?.leaderSubscriptionExpiresAt && new Date(user.leaderSubscriptionExpiresAt) > new Date())
                    ? 'OFICIALIZAR Y CREAR MOTO CLUB 🚀 (Suscripción VIP Activa)'
                    : 'Continuar a Selección de Método de Pago'
                )} <ArrowRight size={18} />
              </button>
            </div>
          </form>
        </div>

      </div>

      {/* Modal de Pago Directo Nequi / Bre-B & PayPal USD */}
      {showSubscriptionModal && (
        <div className="modal-backdrop">
          <div className="subscription-modal-card nequi-modal">
            <div className="modal-header">
              <h2>ACTIVACIÓN DE MOTO CLUB VIP</h2>
              <p>Elige tu método de pago preferido (Colombia o Internacional) para activar la Insignia Dorada 👑 de <strong>{formData.name}</strong>.</p>
            </div>

            {/* Pestañas de Métodos de Pago */}
            <div className="payment-tabs-header">
              <button 
                type="button" 
                className={`tab-btn ${paymentMethod === 'nequi' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('nequi')}
              >
                🇨🇴 Colombia (Nequi / Bre-B)
              </button>
              <button 
                type="button" 
                className={`tab-btn ${paymentMethod === 'paypal' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('paypal')}
              >
                🌎 Internacional (PayPal USD / Tarjetas)
              </button>
            </div>

            {/* Planes de Suscripción */}
            <div className="plans-selection">
              <div 
                className={`plan-card ${selectedPlan === 'monthly' ? 'selected' : ''}`}
                onClick={() => setSelectedPlan('monthly')}
              >
                <div className="plan-radio"></div>
                <div className="plan-details">
                  <h3>Plan Rider Club (Mensual)</h3>
                  <div className="plan-price">
                    {paymentMethod === 'nequi' ? '$29.900 COP' : '$10.00 USD'} <span>/ mes</span>
                  </div>
                </div>
              </div>

              <div 
                className={`plan-card featured ${selectedPlan === 'annual' ? 'selected' : ''}`}
                onClick={() => setSelectedPlan('annual')}
              >
                <span className="best-value-badge"><Sparkles size={12} /> MÁS POPULAR</span>
                <div className="plan-radio"></div>
                <div className="plan-details">
                  <h3>Plan Leyenda M.C. (Anual)</h3>
                  <div className="plan-price">
                    {paymentMethod === 'nequi' ? '$249.900 COP' : '$100.00 USD'} <span>/ año</span>
                  </div>
                  <p className="plan-savings">Incluye 2 meses GRATIS + Insignia Dorada VIP</p>
                </div>
              </div>
            </div>

            {/* Datos Nequi / Bre-B (COLOMBIA) */}
            {paymentMethod === 'nequi' && (
              <div className="nequi-info-box">
                <div className="nequi-box-header">
                  <h4>DATOS DE TRANSFERENCIA COLOMBIA (COP)</h4>
                  <span className="nequi-badge-small">Nequi & Bre-B</span>
                </div>

                <div className="nequi-detail-row">
                  <span className="label">Número Nequi / Llave Bre-B:</span>
                  <div className="number-copy-group">
                    <span className="number">318 550 3428</span>
                    <button type="button" className="btn-copy" onClick={copyNequi}>
                      {copiedNequi ? <Check size={14} className="copied" /> : <Copy size={14} />} {copiedNequi ? '¡Copiado!' : 'Copiar'}
                    </button>
                  </div>
                </div>

                <div className="nequi-detail-row">
                  <span className="label">Titular de la Cuenta:</span>
                  <span className="val-holder">Wilmer Rojas</span>
                </div>
              </div>
            )}

            {/* Datos PayPal USD (INTERNACIONAL) */}
            {paymentMethod === 'paypal' && (
              <div className="paypal-info-box">
                <div className="nequi-box-header">
                  <h4>DATOS DE PAGO INTERNACIONAL (USD)</h4>
                  <span className="paypal-badge-small">PayPal & Credit Cards</span>
                </div>

                <div className="nequi-detail-row">
                  <span className="label">Enlace Directo de Pago:</span>
                  <a 
                    href={`https://paypal.me/wilmer7522/${selectedPlan === 'annual' ? '100' : '10'}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-paypal-link"
                  >
                    Abrir PayPal.me/wilmer7522 <ExternalLink size={14} />
                  </a>
                </div>

                <div className="nequi-detail-row">
                  <span className="label">Correo / Usuario PayPal:</span>
                  <div className="number-copy-group">
                    <span className="number-sm">wilmer7522@gmail.com</span>
                    <button type="button" className="btn-copy" onClick={copyPaypal}>
                      {copiedPaypal ? <Check size={14} className="copied" /> : <Copy size={14} />} {copiedPaypal ? '¡Copiado!' : 'Copiar'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Campos Obligatorios de Referencia y Captura Temporales */}
            <div className="payment-proof-fields">
              <div className="input-group">
                <label><FileText size={14} /> Número / ID de Transacción * (Obligatorio)</label>
                <input 
                  type="text" 
                  placeholder={paymentMethod === 'nequi' ? "Ej. M10928374 (Nequi / Bre-B)" : "Ej. 9AB12345CD67890 (PayPal Transaction ID)"}
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label><Upload size={14} /> Adjuntar Captura de Pantalla del Comprobante * (Temporal)</label>
                
                <label className="custom-file-upload-box">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleProofImageFileChange}
                  />
                  <div className="upload-box-content">
                    <Upload size={18} className="upload-icon" />
                    <span>
                      {proofFileName 
                        ? `✓ Comprobante seleccionado: ${proofFileName}` 
                        : 'Seleccionar imagen del comprobante (.png, .jpg)'}
                    </span>
                  </div>
                </label>

                <span className="input-hint">🔒 El archivo se guardará temporalmente y se eliminará automáticamente una vez aprobado o rechazado el pago para no ocupar espacio.</span>
                
                {proofImageBase64 && (
                  <div className="proof-preview-box">
                    <span className="preview-label">Vista Previa del Comprobante:</span>
                    <img src={proofImageBase64} alt="Comprobante de pago" className="proof-thumbnail" />
                  </div>
                )}
              </div>
            </div>

            <div className="modal-actions">
              <button 
                type="button"
                className="btn-pay-now nequi-btn" 
                onClick={handlePaymentSubmit} 
                disabled={submittingPayment}
              >
                <Send size={16} /> {submittingPayment ? 'Enviando Datos...' : 'Enviar Comprobante a Verificación'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CreateClub;
