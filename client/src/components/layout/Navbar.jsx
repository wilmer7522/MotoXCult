import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Bell, CheckCheck, Crown, ShieldCheck, MapPin, Calendar } from 'lucide-react';
import { API_URL } from '../../config';
import './Navbar.css';

const Navbar = () => {
  const { lang, toggleLanguage, t } = useLanguage();
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const notifRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 15000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch(`${API_URL}/api/notifications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
        const count = data.filter(n => n.unread === 1 || n.unread === true).length;
        setUnreadCount(count);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = async (notif) => {
    setShowNotifications(false);
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/api/notifications/${notif.id}/read`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (e) {
      console.error(e);
    }

    if (notif.link) {
      navigate(notif.link);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/api/notifications/mark-all-read`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        <img src="/assets/logo.png" alt="MOTO X CULT Logo" />
        <span>MOTO X CULT</span>
      </Link>
      
      <ul className="nav-links">
        <li><NavLink to="/" end className={({ isActive }) => (isActive ? 'active-nav-link' : '')}>{t.nav.home}</NavLink></li>
        <li><NavLink to="/clubs" className={({ isActive }) => (isActive ? 'active-nav-link' : '')}>CLUBES</NavLink></li>
        {isAuthenticated && (
          <>
            <li><NavLink to="/rides" className={({ isActive }) => (isActive ? 'active-nav-link' : '')}>{t.nav.rides}</NavLink></li>
            <li><NavLink to="/forum" className={({ isActive }) => (isActive ? 'active-nav-link' : '')}>{t.nav.forum}</NavLink></li>
            <li><NavLink to="/garage" className={({ isActive }) => (isActive ? 'active-nav-link' : '')}>{t.nav.garage}</NavLink></li>
            <li><NavLink to="/shop" className={({ isActive }) => (isActive ? 'active-nav-link' : '')}>{t.nav.shop}</NavLink></li>
            {(user?.role === 'ADMIN' || user?.email === 'wilmer7522@gmail.com') && (
              <li>
                <NavLink 
                  to="/admin/subscriptions" 
                  className={({ isActive }) => (isActive ? 'active-nav-link admin-active' : 'admin-link')}
                >
                  👑 ADMIN
                </NavLink>
              </li>
            )}
          </>
        )}
      </ul>

      <div className="nav-auth">
        <button className="lang-toggle" onClick={toggleLanguage}>
          {lang === 'es' ? 'EN' : 'ES'}
        </button>

        {isAuthenticated && (
          <div className="notif-wrapper" ref={notifRef} style={{ position: 'relative' }}>
            <button 
              className="notification-bell-btn" 
              onClick={() => setShowNotifications(!showNotifications)}
              title="Notificaciones"
            >
              <Bell size={19} />
              {unreadCount > 0 && (
                <span className="bell-badge-dot">{unreadCount}</span>
              )}
            </button>

            {showNotifications && (
              <div className="notifications-dropdown">
                <div className="notif-header">
                  <h4><Bell size={16} style={{ color: '#ff8c00' }} /> Notificaciones</h4>
                  {unreadCount > 0 && (
                    <button className="btn-mark-read" onClick={handleMarkAllRead}>
                      <CheckCheck size={14} style={{ verticalAlign: 'middle', marginRight: '3px' }} />
                      Marcar leídas
                    </button>
                  )}
                </div>

                <div className="notif-list">
                  {notifications.length === 0 ? (
                    <div className="notif-empty">No tienes notificaciones por el momento.</div>
                  ) : (
                    notifications.map(n => (
                      <div 
                        key={n.id} 
                        className={`notif-item ${n.unread ? 'unread' : ''}`}
                        onClick={() => handleNotificationClick(n)}
                        style={{ cursor: 'pointer' }}
                      >
                        <span className="notif-icon">{n.icon || '🔔'}</span>
                        <div className="notif-content">
                          <strong style={{ color: '#f8fafc', fontSize: '0.84rem', display: 'block', marginBottom: '2px' }}>{n.title}</strong>
                          <p style={{ margin: 0, fontSize: '0.82rem', color: '#cbd5e1' }}>{n.message}</p>
                          <span className="notif-time" style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
                            {n.createdAt ? new Date(n.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        
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
            <NavLink to="/profile" className={({ isActive }) => (isActive ? 'user-name active-nav-link' : 'user-name')}>{user?.name}</NavLink>
            <button className="logout-btn" onClick={logout}>Cerrar Sesión</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
