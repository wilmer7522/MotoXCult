import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import { Upload, Link as LinkIcon, Image as ImageIcon, Plus, Trash2, ShieldCheck, Award, Edit3, Save, X } from 'lucide-react';
import './Garage.css';

const Garage = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [profile, setProfile] = useState(user || null);
  const [loading, setLoading] = useState(!user);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBike, setNewBike] = useState({ brand: '', model: '', year: '', nickname: '', plate: '', image: '' });
  const [imageInputType, setImageInputType] = useState('file');
  const [bikeFileName, setBikeFileName] = useState('');
  const [submittingBike, setSubmittingBike] = useState(false);

  // Edit Bike Modal State
  const [editingBike, setEditingBike] = useState(null);
  const [editImageInputType, setEditImageInputType] = useState('file');
  const [editBikeFileName, setEditBikeFileName] = useState('');
  const [submittingEdit, setSubmittingEdit] = useState(false);

  const handleOpenEditModal = (bike) => {
    setEditingBike({ ...bike });
    setEditImageInputType('file');
    setEditBikeFileName('');
  };

  const handleEditFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditBikeFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingBike(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateBike = async (e) => {
    e.preventDefault();
    if (!editingBike) return;
    setSubmittingEdit(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/users/bikes/${editingBike.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingBike)
      });
      if (res.ok) {
        setEditingBike(null);
        fetchProfile();
      } else {
        const errData = await res.json();
        alert(errData.message || 'Error actualizando motocicleta');
      }
    } catch (err) {
      console.error('Error updating bike:', err);
    } finally {
      setSubmittingEdit(false);
    }
  };

  useEffect(() => {
    if (user) setProfile(prev => prev || user);
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        if (user) setProfile(user);
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok && data) {
        let bikesList = data.bikes || [];
        if (!bikesList || bikesList.length === 0) {
          const bikesRes = await fetch(`${API_URL}/api/users/bikes`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (bikesRes.ok) {
            bikesList = await bikesRes.json();
          }
        }
        setProfile({ ...data, bikes: bikesList });
      } else if (user) {
        setProfile(user);
      }
    } catch (err) {
      console.error('Error fetching profile in garage:', err);
      if (user) setProfile(user);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBikeFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewBike(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddBike = async (e) => {
    e.preventDefault();
    setSubmittingBike(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/users/bikes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newBike)
      });
      if (res.ok) {
        setShowAddForm(false);
        setNewBike({ brand: '', model: '', year: '', nickname: '', image: '' });
        setBikeFileName('');
        fetchProfile();
      } else {
        const errData = await res.json();
        alert(errData.message || 'Error registrando motocicleta');
      }
    } catch (err) {
      console.error('Error adding bike:', err);
    } finally {
      setSubmittingBike(false);
    }
  };

  const handleDeleteBike = async (bikeId) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta moto de tu garaje?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/users/bikes/${bikeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        fetchProfile();
      }
    } catch (err) {
      console.error('Error deleting bike:', err);
    }
  };

  const [uploadingBikeId, setUploadingBikeId] = useState(null);

  const handlePhotoUpload = async (e, bikeId) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingBikeId(bikeId);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/users/photos`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ bikeId, image: reader.result })
        });
        
        if (res.ok) {
          fetchProfile();
        } else {
          const errorData = await res.json();
          alert(`Error: ${errorData.message}`);
        }
      } catch (err) {
        console.error('Error uploading photo:', err);
      } finally {
        setUploadingBikeId(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const activeProfile = profile || user;

  if (loading && !activeProfile) return <div className="loading">Cargando Garaje...</div>;
  if (!activeProfile) return <div className="error">Por favor inicia sesión para acceder a tu garaje.</div>;

  return (
    <div className="garage-page full-bleed">
      <div className="container">
        <div className="garage-container">
          <aside className="profile-sidebar">
            <div className="profile-card">
              <div className="avatar-wrapper">
                <img src={activeProfile.avatar || `https://i.pravatar.cc/150?u=${activeProfile.email}`} alt={activeProfile.name} />
              </div>
              <h2>{activeProfile.name}</h2>
              <p className="location">{activeProfile.city || activeProfile.country || 'Piloto Registrado'}</p>
              <div className="karma-badge">{activeProfile.club ? `🛡️ ${activeProfile.club}` : 'Sin Moto Club'}</div>
            </div>
            <nav className="profile-nav">
              <button className="active">{t.garage.myGarage}</button>
            </nav>
          </aside>

          <main className="garage-main">
            <header className="garage-header">
              <h1>{t.garage.title}</h1>
              <button className="cta" onClick={() => setShowAddForm(!showAddForm)}>
                {showAddForm ? 'Cancelar' : t.garage.addBike}
              </button>
            </header>

            {showAddForm && (
              <form className="add-bike-form" onSubmit={handleAddBike}>
                <h3>{t.garage.addBike}</h3>
                <div className="form-group">
                  <label><Award size={14} /> {t.garage.brand || 'Marca de la Motocicleta'} *</label>
                  <input
                    type="text"
                    placeholder="Ej. Yamaha, Honda, BMW"
                    value={newBike.brand}
                    onChange={(e) => setNewBike({ ...newBike, brand: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label><ShieldCheck size={14} /> {t.garage.model || 'Modelo de la Motocicleta'} *</label>
                  <input
                    type="text"
                    placeholder="Ej. MT-09, Africa Twin, R1250GS"
                    value={newBike.model}
                    onChange={(e) => setNewBike({ ...newBike, model: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Año de Fabricación *</label>
                  <input
                    type="number"
                    placeholder="Ej. 2023"
                    value={newBike.year}
                    onChange={(e) => setNewBike({ ...newBike, year: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Apodo de tu Moto (Opcional)</label>
                  <input
                    type="text"
                    placeholder="Ej. La Fiera, La Bestia"
                    value={newBike.nickname}
                    onChange={(e) => setNewBike({ ...newBike, nickname: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>🆔 Placa de la Motocicleta (Privada - Solo Líder y Tú)</label>
                  <input
                    type="text"
                    placeholder="Ej. ABC-123 o 123-XYZ"
                    value={newBike.plate || ''}
                    onChange={(e) => setNewBike({ ...newBike, plate: e.target.value.toUpperCase() })}
                  />
                </div>

                {/* Subida de Imagen Directa / URL con Vista Previa estilo Cyberpunk/Clubes */}
                <div className="form-group full-width">
                  <div className="label-row-with-toggle">
                    <label><ImageIcon size={14} /> Foto de la Motocicleta</label>
                    <div className="toggle-mode-pills">
                      <button
                        type="button"
                        className={`pill-btn ${imageInputType === 'file' ? 'active' : ''}`}
                        onClick={() => { setImageInputType('file'); setNewBike(prev => ({ ...prev, image: '' })); setBikeFileName(''); }}
                      >
                        <Upload size={13} /> Subir Archivo
                      </button>
                      <button
                        type="button"
                        className={`pill-btn ${imageInputType === 'url' ? 'active' : ''}`}
                        onClick={() => { setImageInputType('url'); setNewBike(prev => ({ ...prev, image: '' })); setBikeFileName(''); }}
                      >
                        <LinkIcon size={13} /> Enlace URL
                      </button>
                    </div>
                  </div>

                  {imageInputType === 'file' ? (
                    <div className="file-upload-box">
                      <input
                        type="file"
                        accept="image/*"
                        id="bike-file-input"
                        onChange={handleFileUpload}
                        hidden
                      />
                      <label htmlFor="bike-file-input" className="file-upload-dropzone">
                        <div className="dropzone-icon-circle">
                          <Upload size={22} />
                        </div>
                        <div className="dropzone-text">
                          <span className="primary-text">
                            {bikeFileName ? `Archivo seleccionado: ${bikeFileName}` : 'Haz clic aquí para subir la foto de tu moto'}
                          </span>
                          <span className="secondary-text">Formatos permitidos: JPG, PNG, WEBP</span>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <input
                      type="url"
                      className="modern-url-input"
                      placeholder="https://ejemplo.com/mi-moto.jpg"
                      value={newBike.image}
                      onChange={(e) => setNewBike({ ...newBike, image: e.target.value })}
                    />
                  )}

                  {newBike.image && (
                    <div className="bike-image-preview-container">
                      <span className="preview-tag">VISTA PREVIA DE TU MOTO</span>
                      <img src={newBike.image} alt="Vista previa de la moto" className="bike-preview-img" />
                    </div>
                  )}
                </div>

                <div className="form-actions">
                  <button type="submit" className="cta" disabled={submittingBike}>
                    {submittingBike ? 'Guardando...' : 'Guardar Motocicleta'}
                  </button>
                </div>
              </form>
            )}

            <div className="bikes-grid">
              {activeProfile.bikes && activeProfile.bikes.length > 0 ? (
                activeProfile.bikes.map((bike) => (
                  <div key={bike.id} className="bike-card" style={{ position: 'relative' }}>
                    <div className="bike-image">
                      <img 
                        src={bike.image || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=600'} 
                        alt={`${bike.brand} ${bike.model}`} 
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: bike.imagePosition === 'contain' ? 'contain' : 'cover',
                          objectPosition: bike.imagePosition === 'contain' ? 'center center' : (bike.imagePosition || 'center center')
                        }} 
                      />
                    </div>
                    <div className="bike-info" style={{ padding: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.8rem' }}>
                      <div>
                        <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.1rem', fontWeight: 800 }}>{bike.brand} {bike.model}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                          <span style={{ color: '#94a3b8', fontSize: '0.88rem', fontWeight: 600 }}>{bike.year} {bike.nickname ? `• "${bike.nickname}"` : ''}</span>
                          {bike.plate && (
                            <span style={{
                              background: 'rgba(255, 215, 0, 0.15)',
                              color: '#ffd700',
                              border: '1px solid rgba(255, 215, 0, 0.4)',
                              padding: '2px 8px',
                              borderRadius: '8px',
                              fontWeight: '900',
                              fontSize: '0.78rem'
                            }}>
                              🔒 PLACA: {bike.plate}
                            </span>
                          )}
                        </div>
                      </div>

                      <button 
                        className="btn-edit-bike" 
                        onClick={() => handleOpenEditModal(bike)}
                        style={{
                          background: 'rgba(255, 140, 0, 0.12)',
                          color: '#ff8c00',
                          border: '1px solid rgba(255, 140, 0, 0.4)',
                          borderRadius: '10px',
                          padding: '7px 14px',
                          fontWeight: 800,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <Edit3 size={14} /> Editar Moto
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-bikes">
                  <p>{t.garage.noBikes}</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Modal Estilizado de Edición de Motocicleta */}
      {editingBike && (
        <div className="modal-backdrop-dark" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div className="edit-bike-modal" style={{
            background: '#0f172a',
            border: '1px solid rgba(255, 140, 0, 0.4)',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '650px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.95)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '1rem' }}>
              <h3 style={{ margin: 0, color: '#ff8c00', fontSize: '1.2rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Edit3 size={20} /> Editar Motocicleta
              </h3>
              <button 
                onClick={() => setEditingBike(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleUpdateBike} className="add-bike-form" style={{ background: 'transparent', padding: 0, margin: 0, border: 'none' }}>
              <div className="form-group">
                <label><Award size={14} /> Marca de la Motocicleta *</label>
                <input
                  type="text"
                  value={editingBike.brand || ''}
                  onChange={(e) => setEditingBike({ ...editingBike, brand: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label><ShieldCheck size={14} /> Modelo de la Motocicleta *</label>
                <input
                  type="text"
                  value={editingBike.model || ''}
                  onChange={(e) => setEditingBike({ ...editingBike, model: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Año de Fabricación *</label>
                <input
                  type="number"
                  value={editingBike.year || ''}
                  onChange={(e) => setEditingBike({ ...editingBike, year: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Apodo de tu Moto (Opcional)</label>
                <input
                  type="text"
                  value={editingBike.nickname || ''}
                  onChange={(e) => setEditingBike({ ...editingBike, nickname: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>🆔 Placa de la Motocicleta (Privada - Solo Líder y Tú)</label>
                <input
                  type="text"
                  value={editingBike.plate || ''}
                  onChange={(e) => setEditingBike({ ...editingBike, plate: e.target.value.toUpperCase() })}
                />
              </div>

              {/* Subida / Cambio de Foto con Toggle URL/Archivo */}
              <div className="form-group full-width">
                <div className="label-row-with-toggle">
                  <label><ImageIcon size={14} /> Foto de la Motocicleta</label>
                  <div className="toggle-mode-pills">
                    <button
                      type="button"
                      className={`pill-btn ${editImageInputType === 'file' ? 'active' : ''}`}
                      onClick={() => { setEditImageInputType('file'); setEditBikeFileName(''); }}
                    >
                      <Upload size={13} /> Subir Archivo
                    </button>
                    <button
                      type="button"
                      className={`pill-btn ${editImageInputType === 'url' ? 'active' : ''}`}
                      onClick={() => { setEditImageInputType('url'); setEditBikeFileName(''); }}
                    >
                      <LinkIcon size={13} /> Enlace URL
                    </button>
                  </div>
                </div>

                {editImageInputType === 'file' ? (
                  <div className="file-upload-box">
                    <input
                      type="file"
                      accept="image/*"
                      id="edit-bike-file-input"
                      onChange={handleEditFileUpload}
                      hidden
                    />
                    <label htmlFor="edit-bike-file-input" className="file-upload-dropzone">
                      <div className="dropzone-icon-circle">
                        <Upload size={22} />
                      </div>
                      <div className="dropzone-text">
                        <span className="primary-text">
                          {editBikeFileName ? `Archivo seleccionado: ${editBikeFileName}` : 'Haz clic aquí para cambiar/subir la foto de tu moto'}
                        </span>
                        <span className="secondary-text">Formatos permitidos: JPG, PNG, WEBP</span>
                      </div>
                    </label>
                  </div>
                ) : (
                  <input
                    type="url"
                    className="modern-url-input"
                    placeholder="https://ejemplo.com/mi-moto.jpg"
                    value={editingBike.image || ''}
                    onChange={(e) => setEditingBike({ ...editingBike, image: e.target.value })}
                  />
                )}

                {editingBike.image && (
                  <div className="bike-image-preview-container">
                    <span className="preview-tag">FOTO ACTUAL / VISTA PREVIA</span>
                    <img 
                      src={editingBike.image} 
                      alt="Vista previa" 
                      className="bike-preview-img" 
                    />
                  </div>
                )}
              </div>

              {/* Botones de Acción del Modal */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', flexWrap: 'wrap', gap: '1rem' }}>
                <button
                  type="button"
                  style={{
                    background: 'rgba(239, 68, 68, 0.15)',
                    color: '#ef4444',
                    border: '1px solid #ef4444',
                    borderRadius: '10px',
                    padding: '10px 18px',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onClick={() => {
                    handleDeleteBike(editingBike.id);
                    setEditingBike(null);
                  }}
                >
                  <Trash2 size={16} /> Eliminar Moto
                </button>

                <div style={{ display: 'flex', gap: '0.8rem' }}>
                  <button
                    type="button"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: '#94a3b8',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '10px',
                      padding: '10px 18px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                    onClick={() => setEditingBike(null)}
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    style={{
                      background: 'linear-gradient(135deg, #ff8c00, #e67e00)',
                      color: '#000000',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '10px 22px',
                      fontWeight: 900,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      boxShadow: '0 4px 15px rgba(255, 140, 0, 0.35)'
                    }}
                    disabled={submittingEdit}
                  >
                    <Save size={16} /> {submittingEdit ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Garage;
