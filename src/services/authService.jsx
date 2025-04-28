import axios from 'axios';

const API_URL = "https://todolist-backend-c8pj.onrender.com/api/auth";

export const register = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      username,
      email,
      password,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Registration Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });
    
    if (response.data.token) {
      const userData = {
        token: response.data.token,
        email, // Store email for reference
      };
      console.log('Storing user in localStorage:', userData); // Debug log
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    }
    throw new Error('No token received');
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error;
  }
};