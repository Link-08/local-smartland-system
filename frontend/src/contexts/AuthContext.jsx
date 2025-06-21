import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:26443/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing token and user data on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Try to fetch fresh user data from server
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            
            // Fetch fresh data from server
            const response = await axios.get(`${API_URL}/auth/profile`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            
            // Create updated user object with fresh data
            const freshUserData = {
              id: response.data.id,
              email: response.data.email,
              role: response.data.role,
              firstName: response.data.firstName,
              lastName: response.data.lastName,
              phone: response.data.phone,
              username: response.data.username,
              avatar: response.data.avatar,
              createdAt: response.data.createdAt
            };
            
            // Update localStorage and state with fresh data
            localStorage.setItem('user', JSON.stringify(freshUserData));
            setUser(freshUserData);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Error fetching fresh user data:', error);
          // If server request fails, fall back to stored data
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            try {
              const userData = JSON.parse(storedUser);
              setUser(userData);
              setIsAuthenticated(true);
            } catch (parseError) {
              console.error('Error parsing stored user data:', parseError);
              localStorage.removeItem('token');
              localStorage.removeItem('user');
            }
          }
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      setIsAuthenticated(true);
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.error || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, firstName, lastName, phoneNumber, role) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/auth/register`, {
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        role
      });
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      setIsAuthenticated(true);
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(error.response?.data?.error || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = async () => {
    try {
      console.log('updateUser function called');
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        throw new Error('No authentication token found');
      }

      console.log('Fetching updated user data for ID:', user.id);
      const response = await axios.get(`${API_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Received user data from server:', response.data);

      // Create a new user object with all the necessary fields
      const updatedUserData = {
        id: response.data.id,
        email: response.data.email,
        role: response.data.role,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        phone: response.data.phone,
        username: response.data.username,
        avatar: response.data.avatar,
        createdAt: response.data.createdAt
      };
      console.log('Combined user data:', updatedUserData);

      // Update localStorage first
      localStorage.setItem('user', JSON.stringify(updatedUserData));
      console.log('Updated user data in localStorage');
      
      // Then update the state
      setUser(updatedUserData);
      console.log('Updated user state in context');
      
      return updatedUserData;
    } catch (error) {
      console.error('Error in updateUser:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
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