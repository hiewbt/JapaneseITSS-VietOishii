import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}`;

const signin = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    console.log('signin API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};
const signup = async (username, email, password) => {
    try {
      const response = await axios.post(`${API_URL}/register`, { username, email, password });
      console.log('register API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    }
  };

export default {
  signin,
  signup,
};