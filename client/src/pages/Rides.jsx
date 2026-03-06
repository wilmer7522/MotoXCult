import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Rides.css';

const Rides = () => {
  const { t } = useLanguage();
  const [rides, setRides] = useState([
    { id: 1, title: 'Ruta del Volcán', date: 'Fin de Semana', type: 'Carretera', difficulty: 'Difícil', elevation: '2131m', distance: '12km', attendees: 193 },
    { id: 2, title: 'Ruta del Café', date: '15 de Mayo', type: 'Mixta', difficulty: 'Media', elevation: '1500m', distance: '80km', attendees: 133 }
  ]);

  return (
    <div className="rides-container">
      <div className="rides-sidebar">
        <header className="sidebar-header">
          <h1>{t.rides.title}</h1>
        </header>

        <section className="filter-section">
          <h3>{t.rides.date}</h3>
          <div className="date-picker">
            <span>15/05/2026 → 09/01/2026</span>
          </div>

          <h3>{t.rides.type}</h3>
          <div className="filter-chips">
            <button className="chip active">Carretera</button>
            <button className="chip">Off-road</button>
            <button className="chip">Mixta</button>
          </div>

          <h3>{t.rides.difficulty}</h3>
          <div className="filter-chips">
            <button className="chip">Fácil</button>
            <button className="chip active">Media</button>
            <button className="chip">Difícil</button>
          </div>

          <h3>{t.rides.distance}</h3>
          <input type="range" min="0" max="100" className="distance-slider" />
          <div className="range-labels">
            <span>0</span>
            <span>100k</span>
          </div>
        </section>

        <section className="upcoming-rides">
          <h3>{t.rides.upcoming}</h3>
          <div className="mini-ride-list">
            {rides.map(ride => (
              <div key={ride.id} className="mini-ride-card">
                <div className="ride-badge">{ride.id}</div>
                <div className="mini-ride-info">
                  <h4>{ride.title}</h4>
                  <p>📅 {ride.date}</p>
                  <p>👥 {ride.attendees} {t.rides.confirmed}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="map-view">
        <div className="map-placeholder">
          <div className="map-overlay-card">
            <div className="overlay-header">
              <h3>RUTA DEL VOLCÁN</h3>
              <p>(Fin de Semana)</p>
            </div>
            <div className="overlay-stats">
              <span>⛰️ Elevación: {rides[0].elevation}</span>
              <span>🔥 {rides[0].difficulty}</span>
            </div>
            <div className="overlay-footer">
              <span>Elevación confirmada 📏 {rides[0].distance}</span>
            </div>
          </div>
        </div>
        <div className="map-controls">
          <button className="cta">{t.rides.newRide}</button>
          <button className="secondary-btn">{t.garage.myRides}</button>
        </div>
      </div>
    </div>
  );
};

export default Rides;
