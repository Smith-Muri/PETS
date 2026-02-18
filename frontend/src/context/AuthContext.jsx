import { createContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('auth_token');
      
      if (savedToken) {
        try {
          setToken(savedToken);
          const response = await authAPI.getMe();
          setUser(response.data.data);
          setError(null);
        } catch (err) {
        
          localStorage.removeItem('auth_token');
          setToken(null);
          setUser(null);
        }
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, []);


  const login = useCallback((loginToken, userData) => {
    localStorage.setItem('auth_token', loginToken);
    setToken(loginToken);
    setUser(userData);
    setError(null);
  }, []);


  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
    setError(null);
  }, []);


  const isAuthenticated = !!token && !!user;

  const value = {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

