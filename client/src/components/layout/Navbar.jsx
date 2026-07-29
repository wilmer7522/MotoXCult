import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { lang, toggleLanguage, t } = useLanguage();
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        <img src="/assets/logo.png" alt="Moto-X Cult Logo" />
        <span>MOTO-X CULT</span>
      </Link>
      
      <ul className="nav-links">
        <li><Link to="/">{t.nav.home}</Link></li>
        {isAuthenticated && (
          <>
            <li><Link to="/rides">{t.nav.rides}</Link></li>
            <li><Link to="/forum">{t.nav.forum}</Link></li>
            <li><Link to="/garage">{t.nav.garage}</Link></li>
            <li><Link to="/shop">{t.nav.shop}</Link></li>
          </>
        )}
      </ul>

      <div className="nav-auth">
        <button className="lang-toggle" onClick={toggleLanguage}>
          {lang === 'es' ? 'EN' : 'ES'}
        </button>
        
        {!isAuthenticated ? (
          <>
            <Link to="/login">
              <button className="login-btn">{t.nav.login}</button>
            </Link>
            <Link to="/register">
              <button className="cta">{t.nav.join}</button>
            </Link>
          </>
        ) : (
          <div className="user-nav-actions">
            <Link to="/profile" className="user-name">{user?.name}</Link>
            <button className="logout-btn" onClick={logout}>Cerrar Sesión</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
