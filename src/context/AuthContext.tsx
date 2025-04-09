
import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { User, AuthState } from '@/types/user';
import { toast } from 'sonner';

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const defaultState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: true,
  error: null,
};

// Check if user is already logged in
const getInitialState = (): AuthState => {
  try {
    const storedUser = localStorage.getItem('taskAceUser');
    const storedToken = localStorage.getItem('taskAceToken');
    const tokenExpiry = localStorage.getItem('taskAceTokenExpiry');
    
    if (storedUser && storedToken && tokenExpiry) {
      // Check if token is expired
      if (Number(tokenExpiry) > Date.now()) {
        return {
          isAuthenticated: true,
          user: JSON.parse(storedUser),
          isLoading: false,
          error: null,
        };
      } else {
        // Token expired, clear storage
        localStorage.removeItem('taskAceUser');
        localStorage.removeItem('taskAceToken');
        localStorage.removeItem('taskAceTokenExpiry');
      }
    }
  } catch (error) {
    console.error('Error parsing stored user data:', error);
  }
  
  return {
    ...defaultState,
    isLoading: false,
  };
};

type Action = 
  | { type: 'LOGIN_START' | 'REGISTER_START' | 'RESET_PASSWORD_START' | 'UPDATE_PROFILE_START' }
  | { type: 'LOGIN_SUCCESS' | 'REGISTER_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE' | 'REGISTER_FAILURE' | 'RESET_PASSWORD_FAILURE' | 'UPDATE_PROFILE_FAILURE'; payload: string }
  | { type: 'RESET_PASSWORD_SUCCESS' }
  | { type: 'UPDATE_PROFILE_SUCCESS'; payload: Partial<User> }
  | { type: 'LOGOUT' };

const authReducer = (state: AuthState, action: Action): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
    case 'RESET_PASSWORD_START':
    case 'UPDATE_PROFILE_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        isLoading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
    case 'RESET_PASSWORD_FAILURE':
    case 'UPDATE_PROFILE_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'RESET_PASSWORD_SUCCESS':
      return {
        ...state,
        isLoading: false,
        error: null,
      };
    case 'UPDATE_PROFILE_SUCCESS':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
        isLoading: false,
        error: null,
      };
    case 'LOGOUT':
      return {
        ...defaultState,
        isLoading: false,
      };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, defaultState, getInitialState);

  // Mock authentication functions - in a real app, these would connect to a backend
  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, validate credentials with a server
      if (email === 'demo@example.com' && password === 'password') {
        const user: User = {
          id: '1',
          email,
          name: 'Demo User',
          createdAt: new Date().toISOString(),
        };
        
        // Set token expiry to 7 days from now
        const expiryTime = Date.now() + (7 * 24 * 60 * 60 * 1000);
        
        localStorage.setItem('taskAceUser', JSON.stringify(user));
        localStorage.setItem('taskAceToken', 'mock-token-' + Date.now());
        localStorage.setItem('taskAceTokenExpiry', expiryTime.toString());
        
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        toast.success('Successfully logged in!');
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      toast.error(errorMessage);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      dispatch({ type: 'REGISTER_START' });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, register user with a server
      const user: User = {
        id: crypto.randomUUID(),
        email,
        name,
        createdAt: new Date().toISOString(),
      };
      
      // Set token expiry to 7 days from now
      const expiryTime = Date.now() + (7 * 24 * 60 * 60 * 1000);
      
      localStorage.setItem('taskAceUser', JSON.stringify(user));
      localStorage.setItem('taskAceToken', 'mock-token-' + Date.now());
      localStorage.setItem('taskAceTokenExpiry', expiryTime.toString());
      
      dispatch({ type: 'REGISTER_SUCCESS', payload: user });
      toast.success('Successfully registered!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      dispatch({ type: 'REGISTER_FAILURE', payload: errorMessage });
      toast.error(errorMessage);
    }
  };

  const logout = () => {
    localStorage.removeItem('taskAceUser');
    localStorage.removeItem('taskAceToken');
    localStorage.removeItem('taskAceTokenExpiry');
    
    // Clear user-specific app data
    const allKeys = Object.keys(localStorage);
    allKeys.forEach(key => {
      if (key.startsWith('productivityApp_user_')) {
        localStorage.removeItem(key);
      }
    });
    
    dispatch({ type: 'LOGOUT' });
    toast.success('Successfully logged out!');
  };

  const resetPassword = async (email: string) => {
    try {
      dispatch({ type: 'RESET_PASSWORD_START' });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      dispatch({ type: 'RESET_PASSWORD_SUCCESS' });
      toast.success('Password reset instructions sent to your email!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password reset failed';
      dispatch({ type: 'RESET_PASSWORD_FAILURE', payload: errorMessage });
      toast.error(errorMessage);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      dispatch({ type: 'UPDATE_PROFILE_START' });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (state.user) {
        const updatedUser = { ...state.user, ...data };
        localStorage.setItem('taskAceUser', JSON.stringify(updatedUser));
        
        dispatch({ type: 'UPDATE_PROFILE_SUCCESS', payload: data });
        toast.success('Profile updated successfully!');
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Profile update failed';
      dispatch({ type: 'UPDATE_PROFILE_FAILURE', payload: errorMessage });
      toast.error(errorMessage);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        register,
        logout,
        resetPassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
