import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { API_URL } from '../config';
import './Garage.css';

const Garage = () => {
  const { t } = useLanguage();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBike, setNewBike] = useState({ brand: '', model: '', year: '', nickname: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users/me`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setProfile(data);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBike = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/users/bikes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newBike)
      });
      if (res.ok) {
        setShowAddForm(false);
        setNewBike({ brand: '', model: '', year: '', nickname: '' });
        fetchProfile();
      }
    } catch (err) {
      console.error('Error adding bike:', err);
    }
  };

  const [uploadingBikeId, setUploadingBikeId] = useState(null);

  const handlePhotoUpload = async (e, bikeId) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingBikeId(bikeId);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('bikeId', bikeId);

    try {
      const res = await fetch(`${API_URL}/api/users/photos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
          // Don't set Content-Type here, browser sets it automatically with boundary for FormData
        },
        body: formData
      });
      
      if (res.ok) {
        fetchProfile(); // Refresh the data to show the new photo
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (err) {
      console.error('Error uploading photo:', err);
      alert('Error de conexión al subir la foto.');
    } finally {
      setUploadingBikeId(null);
    }
  };

  if (loading) return <div className="loading">Cargando Garaje...</div>;
  if (!profile) return <div className="error">No se pudo cargar el perfil.</div>;

  return (
    <div className="garage-page full-bleed">
      <div className="container">
        <div className="garage-container">
        <aside className="profile-sidebar">
          <div className="profile-card">
            <div className="avatar-wrapper">
              <img src={profile.avatar || `https://i.pravatar.cc/150?u=${profile.email}`} alt={profile.name} />
            </div>
            <h2>{profile.name}</h2>
            <p className="location">{profile.location || 'Ubicación no definida'}</p>
            <div className="karma-badge">{t.garage.karma}: {profile.karma}</div>
          </div>
          <nav className="profile-nav">
            <button className="active">{t.garage.myGarage}</button>
            <button>{t.garage.myRides}</button>
            <button>{t.garage.messages}</button>
            <button>{t.garage.settings}</button>
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
              <div className="form-row">
                <input 
                  placeholder="Marca" 
                  value={newBike.brand} 
                  onChange={e => setNewBike({...newBike, brand: e.target.value})} 
                  required 
                />
                <input 
                  placeholder="Modelo" 
                  value={newBike.model} 
                  onChange={e => setNewBike({...newBike, model: e.target.value})} 
                  required 
                />
              </div>
              <div className="form-row">
                <input 
                  type="number" 
                  placeholder="Año" 
                  value={newBike.year} 
                  onChange={e => setNewBike({...newBike, year: e.target.value})} 
                  required 
                />
                <input 
                  placeholder="Apodo (Opcional)" 
                  value={newBike.nickname} 
                  onChange={e => setNewBike({...newBike, nickname: e.target.value})} 
                />
              </div>
              <button type="submit" className="cta">Guardar Moto</button>
            </form>
          )}

          <div className="bike-grid">
            {profile.bikes?.map(bike => (
              <div key={bike.id} className="bike-card">
                <div className="bike-image">
                  <img src={bike.photo || (bike.photos?.length > 0 ? bike.photos[0].url : '/assets/bmw_r1250gs.png')} alt={bike.model} />
                  <span className="bike-number">{bike.id}</span>
                </div>
                <div className="bike-info">
                  <h3>{bike.brand} {bike.model}</h3>
                  <p className="nickname">{bike.nickname || 'Sin apodo'}</p>
                  <div className="bike-meta">
                    <span>📅 {bike.year}</span>
                    <span>📷 {bike.photos?.length || 0} / 10 fotos</span>
                  </div>
                  <div className="bike-actions">
                    <input 
                      type="file" 
                      id={`photo-upload-${bike.id}`} 
                      style={{ display: 'none' }}
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(e, bike.id)}
                    />
                    <button 
                      className="secondary-btn" 
                      onClick={() => document.getElementById(`photo-upload-${bike.id}`).click()}
                      disabled={bike.photos?.length >= 10 || uploadingBikeId === bike.id}
                    >
                      {uploadingBikeId === bike.id ? 'Subiendo...' : 'Añadir Foto'}
                    </button>
                    <button className="secondary-btn">{t.home.viewDetails}</button>
                  </div>
                </div>
              </div>
            ))}
            {profile.bikes?.length === 0 && !showAddForm && (
              <p className="empty-msg">Aún no tienes motos en tu garaje. ¡Añade la primera!</p>
            )}
          </div>
        </main>
      </div>
    </div>
    </div>
  );
};

export default Garage;

