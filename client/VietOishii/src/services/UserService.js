import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}`;

const signin = async (username, password) => {
  try {
    const response = await axios.post(
      `${API_URL}/login`,
      { username, password },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('signin API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

const signup = async (username, email, password) => {
  try {
    const response = await axios.post(
      `${API_URL}/register`,
      { username, email, password },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('register API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error registering:', error.response ? error.response.data : error.message);
    throw new Error('Failed to register. Please try again later.');
  }
};

export default {
  signin,
  signup,
};