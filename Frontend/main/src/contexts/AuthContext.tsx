
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthState, LoginCredentials, RegisterCredentials, User } from '@/types';
import { toast } from '@/components/ui/sonner';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const navigate = useNavigate();

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          const user = JSON.parse(storedUser) as User;
          
          setAuthState({
            user,
            token: storedToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setAuthState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Error loading user from localStorage', error);
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    loadUser();
  }, []);

  // In a real application, you'd make API calls to your backend
  // This is a mock implementation
  const login = async (credentials: LoginCredentials) => {
    try {
      // In a real app, this would be a fetch call to your backend API
      // Simulating API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock user data - in a real app, this would come from your backend
      const mockUser: User = {
        id: '1',
        email: credentials.email,
        name: 'Test User',
        role: credentials.email.includes('admin') ? 'admin' : 'client',
        createdAt: new Date().toISOString(),
      };

      // Mock JWT token - in a real app, this would come from your backend
      const mockToken = 'mock-jwt-token';

      // Save to localStorage
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      // Update state
      setAuthState({
        user: mockUser,
        token: mockToken,
        isAuthenticated: true,
        isLoading: false,
      });

      toast.success("Logged in successfully");
      navigate(mockUser.role === 'admin' ? '/admin/dashboard' : '/dashboard');
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
      console.error('Login error', error);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      // In a real app, this would be a fetch call to your backend API
      // Simulating API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock user data - in a real app, this would come from your backend
      const mockUser: User = {
        id: '2',
        email: credentials.email,
        name: credentials.name,
        role: 'client', // By default, new users are clients
        createdAt: new Date().toISOString(),
      };

      // Mock JWT token - in a real app, this would come from your backend
      const mockToken = 'mock-jwt-token';

      // Save to localStorage
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      // Update state
      setAuthState({
        user: mockUser,
        token: mockToken,
        isAuthenticated: true,
        isLoading: false,
      });

      toast.success("Account created successfully");
      navigate('/dashboard');
    } catch (error) {
      toast.error("Registration failed. Please try again.");
      console.error('Registration error', error);
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Update state
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
    
    toast.success("Logged out successfully");
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
