import { useState } from 'react';
import api from '../services/api';

export function useHotels() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchHotels = async (params) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/v1/hotels/search', params);
      setHotels(response.data.hotels);
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
      const response = await api.get('/api/v1/hotels/history');
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { hotels, loading, error, searchHotels, getHistory };
}
