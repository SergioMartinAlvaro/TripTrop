import { useState } from 'react';
import api from '../services/api';

export function useFlights() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchFlights = async (params) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/v1/flights/search', params);
      setFlights(response.data.flights);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getHistory = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/v1/flights/history');
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { flights, loading, error, searchFlights, getHistory };
}
