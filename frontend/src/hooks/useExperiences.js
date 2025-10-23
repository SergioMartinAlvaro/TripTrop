import { useState } from 'react';
import api from '../services/api';

export function useExperiences() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchExperiences = async (params) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/v1/experiences/search', params);
      setExperiences(response.data.experiences);
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
      const response = await api.get('/api/v1/experiences/history');
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { experiences, loading, error, searchExperiences, getHistory };
}
