import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axiosClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('pulseflow_token') || null);
  const [loading, setLoading] = useState(true);

  // Load user on mount if token exists
  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/me');
        if (res.data.success) {
          setUser(res.data.user);
          localStorage.setItem('pulseflow_user', JSON.stringify(res.data.user));
        }
      } catch (err) {
        console.error('Failed to authenticate token:', err);
        localStorage.removeItem('pulseflow_token');
        localStorage.removeItem('pulseflow_user');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      localStorage.setItem('pulseflow_token', res.data.token);
      localStorage.setItem('pulseflow_user', JSON.stringify(res.data.user));
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data.user;
    }
  };

  const register = async (name, email, password, role = 'Developer') => {
    const res = await api.post('/auth/register', { name, email, password, role });
    if (res.data.success) {
      localStorage.setItem('pulseflow_token', res.data.token);
      localStorage.setItem('pulseflow_user', JSON.stringify(res.data.user));
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data.user;
    }
  };

  const logout = () => {
    localStorage.removeItem('pulseflow_token');
    localStorage.removeItem('pulseflow_user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedData) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedData };
      localStorage.setItem('pulseflow_user', JSON.stringify(merged));
      return merged;
    });
  };

  const isAdmin = user?.role === 'Admin';
  const isManager = user?.role === 'Manager' || isAdmin;
  const isDeveloper = user?.role === 'Developer' || isManager;
  const isViewer = user?.role === 'Viewer';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin,
        isManager,
        isDeveloper,
        isViewer,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
