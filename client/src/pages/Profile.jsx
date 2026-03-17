import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  if (!user) return null;

  return (
    <div className="profile-page full-bleed">
      <div className="container">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="profile-title-area">
            <h1>{user.name}</h1>
            <p className="profile-club">{user.club || 'SIN CLUB'}</p>
          </div>
        </div>

        <div className="profile-grid">
          <section className="profile-section">
            <h2>{t.profile.personalInfo}</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>{t.auth.email}</label>
                <p>{user.email}</p>
              </div>
              <div className="info-item">
                <label>{t.auth.phone}</label>
                <p>{user.phone || 'N/A'}</p>
              </div>
              <div className="info-item">
                <label>{t.auth.birthDate}</label>
                <p>{user.birthDate ? new Date(user.birthDate).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div className="info-item">
                <label>{t.auth.country}</label>
                <p>{user.country || 'N/A'}</p>
              </div>
              <div className="info-item">
                <label>{t.auth.city}</label>
                <p>{user.city || 'N/A'}</p>
              </div>
            </div>
            <button className="cta save-btn">{t.profile.saveChanges}</button>
          </section>

          <aside className="profile-stats">
            <div className="stat-card">
              <h3>Karma</h3>
              <p className="stat-value">{user.karma || 0}</p>
            </div>
            <div className="stat-card">
              <h3>{t.nav.garage}</h3>
              <p className="stat-value">{user.bikes?.length || 0}</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Profile;
