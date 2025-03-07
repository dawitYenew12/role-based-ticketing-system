import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:3000/v1/auth';

export const authService = {
  login: async (email, password) => {
    try {
      const response = await axios.post(
        `${API_URL}/login`, 
        { email, password },
        { withCredentials: true }
      );
      
      if (response.status === 200 && response.data.success) {
        const token = response.data.token.access.token;
        localStorage.setItem('access_token', token);
        return { success: true, data: response.data };
      }
      
      return { success: false, error: 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Invalid email or password. Please try again.' 
      };
    }
  },
  
  signup: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/signup`, { email, password });
      
      if (response.status === 201 && response.data.success) {
        return { success: true, message: response.data.message };
      }
      
      return { success: false, error: 'Signup failed' };
    } catch (error) {
      console.error('Signup error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Signup failed. Please try again.' 
      };
    }
  },
  
  signupWithRole: async (email, password, role) => {
    try {
      const response = await axios.post(`${API_URL}/signup-with-role`, { email, password, role });
      
      if (response.status === 201 && response.data.success) {
        return { success: true, message: response.data.message };
      }
      
      return { success: false, error: 'Signup failed' };
    } catch (error) {
      console.error('Signup with role error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Signup failed. Please try again.' 
      };
    }
  },
  
  logout: () => {
    localStorage.removeItem('access_token');
  },
  
  getCurrentUser: () => {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        return jwtDecode(token);
      }
      return null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  },
  
  isAuthenticated: () => {
    const token = localStorage.getItem('access_token');
    if (!token) return false;
    
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      // Check if token is expired
      return decodedToken.exp > currentTime;
    } catch (error) {
      return false;
    }
  },
  
  getUserRole: () => {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        const decodedToken = jwtDecode(token);
        return decodedToken.role;
      }
      return null;
    } catch (error) {
      console.error('Error getting user role:', error);
      return null;
    }
  }
}; 