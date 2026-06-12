import React, { createContext, useState, useCallback, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', { email, password });
      const data = response.data;

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);

      return data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Login failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (email, password, firstName, lastName) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/register', { email, password, firstName, lastName });
      const data = response.data;

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);

      return data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Registration failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  }, []);

  const getMe = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    try {
      const response = await api.get('/auth/me');
      const data = response.data;

      setUser(data.user);
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to fetch user';
      setError(message);
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token && !user) {
      getMe();
    }
  }, [token, user, getMe]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
