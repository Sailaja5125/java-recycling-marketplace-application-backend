import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';
import { set } from 'date-fns';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // ✅ track error separately


  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await authAPI.getMe(); // backend reads cookie
        setUser(response.data);
        setError(null); // Clear any previous errors on successful auth
      } catch (error) {
        console.error('Auth init failed:', error);
        const message =
          error.response?.data?.error ||
          error.response?.data?.message ||
          'Authentication failed';
        setError(message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      // backend sets cookie, response contains user info
      setUser(response.data.user);
      setError(null); // Clear any previous errors on successful login
      return { success: true };
    } catch (error) {
      if(error.response?.data === 'Already Loggedin') {
        setUser(error.response.data.user);
        return { success: true };
      }
      
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Login failed';
      return {
        success: false,
        error: message,
      };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await authAPI.signup(userData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Signup failed',
      };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout(); // backend clears cookie
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};