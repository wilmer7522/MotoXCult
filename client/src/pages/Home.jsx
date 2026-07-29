import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      <section className="hero full-bleed">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="animate-fade-in">
            {t.home.heroTitle}<br/>
            <span className="highlight neon-text">{t.home.heroSubtitle}</span>
          </h1>
          {!isAuthenticated && (
            <Link to="/register">
              <button className="cta hero-btn">{t.home.cta}</button>
            </Link>
          )}
        </div>
      </section>

      <div className="content-wrap">
        <div className="container">
          <section className="featured-rides">
            <h2 className="section-title">{t.home.nextRides}</h2>
            <div className="ride-grid">
              <div className="ride-card">
                <div className="ride-badge">1</div>
                <div className="ride-info">
                  <h3>Ruta del Café (Jun 15)</h3>
                  <p>📅 15 de 2026</p>
                  <button className="secondary-btn">{t.home.viewDetails}</button>
                </div>
              </div>
              <div className="ride-card">
                <div className="ride-badge">2</div>
                <div className="ride-info">
                  <h3>Vuelta a la Costa (Jul 1-3)</h3>
                  <p>📅 Jul 1-3</p>
                  <button className="secondary-btn">{t.home.viewDetails}</button>
                </div>
              </div>
            </div>
          </section>

          <section className="forum-preview full-bleed dark-accent">
            <div className="container">
              <h2 className="section-title">{t.home.lastThreads}</h2>
              <div className="forum-list">
                <div className="forum-item">
                  <div className="forum-icon">💬</div>
                  <div className="forum-text">
                    <h4>Consejos para novatos</h4>
                    <p>2 threads • Consejos para novatos</p>
                  </div>
                </div>
                <div className="forum-item">
                  <div className="forum-icon">🔥</div>
                  <div className="forum-text">
                    <h4>¿Aceite sintético o mineral?</h4>
                    <p>7 threads • Mecánica</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Home;
