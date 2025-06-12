// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { apiRequest } from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      const savedUser = localStorage.getItem('user');
      
      if (!token || !savedUser) {
        setLoading(false);
        return;
      }
      
      try {
        // Validate the token by getting user profile
        const headers = {
          'Authorization': `Bearer ${token}`
        };
        
        const userData = await apiRequest('/api/users/profile', 'GET', null, headers);
        setCurrentUser(userData);
      } catch (err) {
        console.error('Auth token validation failed:', err);
        // Clear invalid auth data
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setError('Your session has expired. Please log in again.');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await apiRequest('/api/users/login', 'POST', { email, password });
      
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setCurrentUser(response.user);
      setError(null);
      return response.user;
    } catch (err) {
      setError(err.message || 'Authentication failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      await apiRequest('/api/users/register', 'POST', userData);
      setError(null);
      // Don't automatically log in after registration
      return true;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  // Function to check if user is admin
  const isAdmin = () => {
    return currentUser?.role === 'admin';
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    isAdmin,
    setError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
