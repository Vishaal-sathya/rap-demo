import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const stationAPI = {
  getStations: async () => {
    try {
      const response = await api.get('/stations');
      return response.data;
    } catch (error) {
      console.error('Error fetching stations:', error);
      throw error;
    }
  },
};

export const trainAPI = {
  searchTrains: async (searchParams) => {
    try {
      const response = await api.get('/trains/search', { params: searchParams });
      return response.data;
    } catch (error) {
      console.error('Error searching trains:', error);
      throw error;
    }
  },
};

export default api;
