import { useState } from 'react';
import api from '../services/api';

export function useItineraries() {
  const [itineraries, setItineraries] = useState([]);
  const [currentItinerary, setCurrentItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchItineraries = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/v1/itineraries');
      setItineraries(response.data);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchItinerary = async (id) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/v1/itineraries/${id}`);
      setCurrentItinerary(response.data);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const generateItinerary = async (params) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/v1/itineraries/generate', params);
      setCurrentItinerary(response.data);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createItinerary = async (data) => {
    setLoading(true);
    try {
      const response = await api.post('/api/v1/itineraries', data);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateItinerary = async (id, data) => {
    setLoading(true);
    try {
      const response = await api.put(`/api/v1/itineraries/${id}`, data);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteItinerary = async (id) => {
    setLoading(true);
    try {
      await api.delete(`/api/v1/itineraries/${id}`);
      setItineraries(itineraries.filter(i => i.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getRecommendations = async (preferences, budget) => {
    setLoading(true);
    try {
      const response = await api.post('/api/v1/itineraries/recommendations', {
        preferences,
        budget
      });
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    itineraries,
    currentItinerary,
    loading,
    error,
    fetchItineraries,
    fetchItinerary,
    generateItinerary,
    createItinerary,
    updateItinerary,
    deleteItinerary,
    getRecommendations,
  };
}
