import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, AuthSession } from '../types/auth';
import { authService } from '../services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  loading: boolean;
  login: (returnUrl?: string) => Promise<void> | void;
  logout: () => void;
  refreshSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AuthSession>({
    isAuthenticated: false,
    user: null,
    token: null,
    expiresAt: null,
  });
  const [loading, setLoading] = useState(true);

  const refreshSession = () => {
    const current = authService.getSession();
    setSession(current);
    setLoading(false);
  };

  useEffect(() => {
    refreshSession();
  }, []);

  const login = async (returnUrl: string = '/profile') => {
    await authService.initiateOidcLogin(returnUrl);
  };

  const logout = () => {
    authService.logout();
    setSession({
      isAuthenticated: false,
      user: null,
      token: null,
      expiresAt: null,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: session.isAuthenticated,
        user: session.user,
        loading,
        login,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
