import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, LoginRequest } from '../types';

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for development
const MOCK_USERS = [
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@gamezone.test',
    password: 'Admin123!',
    role: 'ADMIN' as const,
    memberId: 'admin-1',
  },
  {
    id: 'user-1',
    name: 'Regular User',
    email: 'user@gamezone.test',
    password: 'User123!',
    role: 'USER' as const,
    memberId: 'user-1',
  },
];

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem('auth_token');
        const userStr = localStorage.getItem('auth_user');
        
        if (token && userStr) {
          const user = JSON.parse(userStr);
          setAuthState({
            user,
            token,
            isAuthenticated: true,
          });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear invalid data
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequest): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Mock authentication - replace with real API call in production
      const user = MOCK_USERS.find(
        u => u.email === credentials.email && u.password === credentials.password
      );

      if (user) {
        const token = 'mock-jwt-token-' + Date.now();
        const userData = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          memberId: user.memberId,
        };

        // Store in localStorage
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(userData));

        setAuthState({
          user: userData,
          token,
          isAuthenticated: true,
        });

        setIsLoading(false);
        return true;
      } else {
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  };

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Production-ready auth functions (commented out for now)
/*
// Uncomment and modify these functions when backend auth is implemented

const login = async (credentials: LoginRequest): Promise<boolean> => {
  setIsLoading(true);
  
  try {
    const response = await apiClient.post('/auth/login', credentials);
    const { token, user, role } = response.data;

    // Store in localStorage
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));

    setAuthState({
      user: { ...user, role },
      token,
      isAuthenticated: true,
    });

    setIsLoading(false);
    return true;
  } catch (error) {
    console.error('Login error:', error);
    setIsLoading(false);
    return false;
  }
};

const refreshToken = async (): Promise<boolean> => {
  try {
    const response = await apiClient.post('/auth/refresh');
    const { token } = response.data;
    
    localStorage.setItem('auth_token', token);
    return true;
  } catch (error) {
    console.error('Token refresh failed:', error);
    logout();
    return false;
  }
};
*/
