import { createContext, useContext, useState, useEffect } from 'react';
import api from '../config/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const fetchUser = async () => {
    if (isFetching) {
      return user;
    }

    setIsFetching(true);
    try {
      const response = await api.get('/api/auth/me');
      if (response.data && response.data.user) {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data.user;
      }
      throw new Error('Invalid user data received');
    } catch (error) {
      console.error('Error fetching user data:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      throw error;
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token) {
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        try {
          await fetchUser();
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', {
        email,
        password
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (username, email, password, role) => {
    try {
      const response = await api.post('/api/auth/register', {
        username,
        email,
        password,
        role
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = async () => {
    try {
      const updatedUser = await fetchUser();
      return updatedUser;
    } catch (error) {
      console.error('Error updating user data:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    fetchUser,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 