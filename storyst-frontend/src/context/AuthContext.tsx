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
  error: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resetAuthState = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    setError(null);
  }, []);

  const login = useCallback((token: string, userData: User) => {
    try {
      localStorage.setItem('jwt_token', token);
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
      setUser(userData);
      setError(null);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setError('Falha ao salvar dados de autenticação');
    }
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem('jwt_token');
      delete axiosInstance.defaults.headers.common['Authorization'];
      resetAuthState();
      setIsLoading(false);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      setError('Falha ao remover dados de autenticação');
      setIsLoading(false);
    }
  }, [resetAuthState]);

  const checkAuthStatus = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    const timeoutId = setTimeout(() => {
      console.warn('Timeout ao verificar autenticação');
      setIsLoading(false);
      setError('Tempo limite excedido ao verificar autenticação');
    }, 10000);
    
    try {
      const token = localStorage.getItem('jwt_token');
      
      if (!token) {
        resetAuthState();
        setIsLoading(false);
        clearTimeout(timeoutId);
        return;
      }
      
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const response = await axiosInstance.get<DashboardResponse>('/auth/dashboard');
      
      setUser(response.data.user);
      setIsAuthenticated(true);
      setError(null);
    } catch (error) {
      if (isAxiosError(error)) {
        const statusCode = error.response?.status;
        const errorMessage = error.response?.data?.message || error.message;
        
        console.error(`Erro ${statusCode} ao validar token:`, errorMessage);
        
        if (statusCode === 401 || statusCode === 403) {
          setError('Sessão expirada ou inválida');
        } else if (statusCode && statusCode >= 500) {
          setError('Erro no servidor. Tente novamente mais tarde');
        } else {
          setError(`Erro ao validar autenticação: ${errorMessage}`);
        }
      } else if (error instanceof Error) {
        console.error('Erro inesperado ao validar token:', error.message);
        setError(`Erro inesperado: ${error.message}`);
      } else {
        console.error('Erro desconhecido ao validar token:', error);
        setError('Erro desconhecido ao validar autenticação');
      }
      
      logout();
    } finally {
      setIsLoading(false);
      clearTimeout(timeoutId);
    }
  }, [logout, resetAuthState]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const contextValue = {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    error,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};