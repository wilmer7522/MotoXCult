import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Garage.css';

const Garage = () => {
  const { t } = useLanguage();

  const user = {
    name: 'Carlos R.',
    location: 'Medellín, Colombia',
    karma: 450,
    avatar: 'https://i.pravatar.cc/150?u=carlos'
  };

  const bikes = [
    { id: 1, brand: 'BMW', model: 'R1250GS', nickname: 'La Aventurera', year: 2023, specs: '28 m • 30 km', image: '/assets/bmw_r1250gs.png' },
    { id: 2, brand: 'Harley Davidson', model: 'Iron 883', nickname: 'La Urbana', year: 2018, specs: '21 m • 10 km', image: '/assets/harley_883.png' }
  ];

  return (
    <div className="garage-page full-bleed">
      <div className="container">
        <div className="garage-container">
        <aside className="profile-sidebar">
          <div className="profile-card">
            <div className="avatar-wrapper">
              <img src={user.avatar} alt={user.name} />
            </div>
            <h2>{user.name}</h2>
            <p className="location">{user.location}</p>
            <div className="karma-badge">{t.garage.karma}: {user.karma}</div>
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
            <button className="cta">{t.garage.addBike}</button>
          </header>
          <div className="bike-grid">
            {bikes.map(bike => (
              <div key={bike.id} className="bike-card">
                <div className="bike-image">
                  <img src={bike.image} alt={bike.model} />
                  <span className="bike-number">{bike.id}</span>
                </div>
                <div className="bike-info">
                  <h3>{bike.brand} {bike.model}</h3>
                  <p className="nickname">{bike.nickname}</p>
                  <div className="bike-meta">
                    <span>📅 {bike.year}</span>
                    <span>🔧 {bike.specs}</span>
                  </div>
                  <button className="secondary-btn">{t.home.viewDetails}</button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
    </div>
  );
};

export default Garage;
