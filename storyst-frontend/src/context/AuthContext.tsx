import React, { createContext, useState, useEffect, useCallback } from 'react';
import axiosInstance from '@/api/axiosInstance';
import { isAxiosError } from 'axios';
import type { DashboardResponse } from '@/types/api';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((token: string, userData: User) => {
    localStorage.setItem('jwt_token', token);
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setIsAuthenticated(true);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('jwt_token');
    delete axiosInstance.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  const checkAuthStatus = useCallback(async () => {
    setIsLoading(true);
    const token = localStorage.getItem('jwt_token');

    if (token) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      try {
        const response = await axiosInstance.get<DashboardResponse>('/dashboard');
        setUser(response.data.user);
        setIsAuthenticated(true);
      } catch (error: unknown) {
        if (isAxiosError(error)) {
          console.error("Erro ao validar token:", error.response?.data?.message || error.message);
        } else if (error instanceof Error) {
          console.error("Erro inesperado ao validar token:", error.message);
        } else {
          console.error("Erro desconhecido ao validar token:", error);
        }
        logout();
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    setIsLoading(false);
  }, [logout]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const contextValue = {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};