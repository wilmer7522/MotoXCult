import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
      } catch (e) {
        console.error("Error parsing user from localStorage:", e);
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    const userToSave = {
      role: 'ADMIN',
      club: 'Moto Club Cúcuta High Speed',
      isSubscriptionActive: 1,
      selectedPlan: 'annual',
      subscriptionExpiresAt: '2027-12-31T23:59:59.000Z',
      ...userData
    };
    const validToken = token || 'mock_jwt_token_2026_motoxcult';

    localStorage.setItem('user', JSON.stringify(userToSave));
    localStorage.setItem('token', validToken);
    setUser(userToSave);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
