import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Forum.css';

const Forum = () => {
  const { t } = useLanguage();

  const categories = [
    { title: 'General', icon: '💬' },
    { title: 'Mecánica y Taller', icon: '🔧' },
    { title: 'Rutas y Viajes', icon: '🗺️' },
    { title: 'Cultura Biker', icon: '🏍️' }
  ];

  const threads = [
    { id: 1, title: '¿Mejor ruta por el Eje Cafetero?', category: 'General', replies: 3, views: 293, authorAvatar: 'https://i.pravatar.cc/50?u=1' },
    { id: 2, title: '¿Aceite sintético o mineral?', category: 'Mecánica y Taller', replies: 3, views: 208, authorAvatar: 'https://i.pravatar.cc/50?u=2' },
    { id: 3, title: '¿Rutas de la Cottán?', category: 'Mecánica y Taller', replies: 4, views: 198, authorAvatar: 'https://i.pravatar.cc/50?u=3' }
  ];

  return (
    <div className="forum-page full-bleed">
      <div className="container">
        <div className="forum-container">
        <aside className="forum-sidebar">
          <button className="cta new-topic-btn">{t.forum.newTopic}</button>
          <h3>{t.forum.categories}</h3>
          <nav className="category-nav">
            {categories.map(cat => (
              <button key={cat.title}>
                <span className="cat-icon">{cat.icon}</span>
                {cat.title}
              </button>
            ))}
          </nav>
        </aside>

        <main className="forum-main">
          <div className="forum-header">
            <input type="text" placeholder={t.forum.searchPlaceholder} className="search-bar" />
          </div>
          
          <h2>{t.forum.title}</h2>
          <div className="thread-list">
            {threads.map(thread => (
              <div key={thread.id} className="thread-card">
                <div className="thread-author">
                  <img src={thread.authorAvatar} alt="Author" />
                </div>
                <div className="thread-content">
                  <h3>{thread.title}</h3>
                  <span className="thread-cat">{thread.category}</span>
                </div>
                <div className="thread-stats">
                  <div className="stat"><span>{thread.replies}</span><p>{t.forum.statReplies}</p></div>
                  <div className="stat"><span>{thread.views}</span><p>{t.forum.statViews}</p></div>
                </div>
                <div className="thread-meta">
                  <span>2h</span>
                  <p>{t.forum.lastPost}</p>
                  <div className="active-dot"></div>
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

export default Forum;
