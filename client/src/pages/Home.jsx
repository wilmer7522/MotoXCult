import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Calendar, MessageSquare, Flame, Sun, Palmtree } from 'lucide-react';
import './Home.css';

const Home = () => {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      {/* HERO SECTION - UNCROPPED FULL NATURAL IMAGE */}
      <section className="hero full-bleed">
        <div className="hero-img-wrapper">
          <img src="/assets/Home.png" alt="MOTO X CULT Portada" className="hero-full-img" />
          <div className="hero-overlay"></div>
        </div>
        
        <div className="hero-container container">
          <div className="hero-content">
            <h1 className="hero-title">
              MÁS QUE MOTOS,<br/>
              UNA <span className="hero-gradient-text">HERMANDAD<br/>GLOBAL.</span>
            </h1>
            
            {!isAuthenticated && (
              <Link to="/register">
                <button className="hero-cta-btn">Crea tu Cuenta Gratis</button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* MAIN CONTENT WRAPPER */}
      <div className="content-wrap">
        <div className="container">
          
          {/* PRÓXIMAS RODADAS SECTION */}
          <section className="rodadas-section">
            <h2 className="section-title-clean">PRÓXIMAS RODADAS</h2>
            
            <div className="rodadas-grid">
              {/* CARD 1: Ruta del Café */}
              <div className="rodada-card">
                <div className="card-badge">1</div>
                <div className="card-media map-media">
                  <img src="/assets/route_cafe_map.png" alt="Mapa Ruta del Café" className="map-img" />
                </div>
                <div className="card-info">
                  <h3 className="card-title">Ruta del Café (Jun 15)</h3>
                  <div className="card-meta">
                    <Calendar size={14} className="meta-icon" />
                    <span>15 de 2023</span>
                  </div>
                  <Link to="/rides">
                    <button className="card-btn-action">Ver Detalles</button>
                  </Link>
                </div>
              </div>

              {/* CARD 2: Vuelta a la Costa */}
              <div className="rodada-card">
                <div className="card-badge">2</div>
                <div className="card-media icon-media">
                  <div className="coast-icon-art">
                    <Sun size={24} color="#ffba00" className="sun-icon" />
                    <Palmtree size={36} color="#ffba00" className="palm-icon" />
                  </div>
                </div>
                <div className="card-info">
                  <h3 className="card-title">Vuelta a la Costa (Jul 1-3)</h3>
                  <div className="card-meta">
                    <Calendar size={14} className="meta-icon" />
                    <span>Jul 1-3</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ÚLTIMOS DEBATES EN EL FORO SECTION */}
          <section className="forum-section">
            <h2 className="section-title-clean">ÚLTIMOS DEBATES EN EL FORO</h2>
            
            <div className="forum-grid">
              {/* DEBATE CARD 1 */}
              <div className="forum-card">
                <div className="forum-badge-icon">
                  <MessageSquare size={20} color="#ffba00" />
                </div>
                <div className="forum-details">
                  <h4 className="forum-card-title">Consejos para novatos</h4>
                  <p className="forum-card-meta">2 threads • Consejos para novatos</p>
                </div>
                <div className="forum-avatars">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80" alt="Usuario 1" className="avatar-img avatar-1" />
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80" alt="Usuario 2" className="avatar-img avatar-2" />
                </div>
              </div>

              {/* DEBATE CARD 2 */}
              <div className="forum-card">
                <div className="forum-badge-icon">
                  <Flame size={20} color="#ff7a00" />
                </div>
                <div className="forum-details">
                  <h4 className="forum-card-title">¿Aceite sintético o mineral?</h4>
                  <p className="forum-card-meta">1 threads • 2/xintaltico</p>
                </div>
                <div className="forum-avatars">
                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80" alt="Usuario 3" className="avatar-img avatar-1" />
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80" alt="Usuario 4" className="avatar-img avatar-2" />
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
