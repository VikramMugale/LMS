import React, { createContext, useReducer, useEffect, useContext } from 'react';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const initialState = {
  user: null,
  loading: true,
  error: null
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, error: null };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  
  // Use reducer instead of multiple useState
  const { user, loading, error } = state;

  // Add proper error handling
  const handleError = (error) => {
    console.error(error);
    dispatch({ type: 'SET_ERROR', payload: error.message });
  };

  useEffect(() => {
    // Check for logged-in user on mount
    const initializeAuth = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
          // Optionally verify token with backend
          // const isValid = await api.verifyToken(storedUser.token);
          dispatch({ type: 'SET_USER', payload: storedUser });
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        logout(); // Clear invalid data
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeAuth();
  }, []);

  const login = async (userData) => {
    try {
      dispatch({ type: 'SET_USER', payload: userData });
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    dispatch({ type: 'SET_USER', payload: null });
    localStorage.removeItem('user');
  };

  if (loading) {
    return <div>Loading...</div>; // Or a proper loading component
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;