import apiClient from './client';

export const healthApi = {
  // Check service health
  getHealth: async () => {
    const response = await apiClient.get('/api/health');
    return response.data;
  },

  // Simple test endpoint
  getTest: async () => {
    const response = await apiClient.get('/api/test');
    return response.data;
  },
};
