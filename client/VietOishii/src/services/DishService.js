import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}`;

const getDishes = async () => {
  try {
    const response = await axios.get(`${API_URL}/dishes`);
    console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching dishes:', error);
    throw error;
  }
};

const searchDishes = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/search/${query}`);
    console.log('Search API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error searching dishes:', error);
    throw error;
  }
};

const filterDishes = async (filters) => {
  try {
    const response = await axios.post(`${API_URL}/filter_dishes`, filters);
    console.log('Filter API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error filtering dishes:', error);
    throw error;
  }
};

export default {
  getDishes,
  searchDishes,
  filterDishes,
};