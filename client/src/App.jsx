import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Garage from './pages/Garage';
import Rides from './pages/Rides';
import Forum from './pages/Forum';
import Shop from './pages/Shop';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import './styles/theme.css';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <div style={{ width: '100%', margin: 0, padding: 0 }}>
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected Routes */}
                <Route 
                  path="/garage" 
                  element={
                    <ProtectedRoute>
                      <Garage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/rides" 
                  element={
                    <ProtectedRoute>
                      <Rides />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/forum" 
                  element={
                    <ProtectedRoute>
                      <Forum />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/shop" 
                  element={
                    <ProtectedRoute>
                      <Shop />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Add more routes as we build */}
              </Routes>
            </main>
            <footer style={{ padding: '3rem 0', background: '#080808', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', width: '100%' }}>
              <div className="container">
                <p>&copy; 2024 MOTO-X CULT. Todos los derechos reservados.</p>
                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '2rem' }}>
                  <a href="/about" style={{ color: 'inherit', textDecoration: 'none' }}>Nosotros</a>
                  <a href="/contact" style={{ color: 'inherit', textDecoration: 'none' }}>Contacto</a>
                  <a href="/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>Privacidad</a>
                </div>
              </div>
            </footer>
          </div>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
