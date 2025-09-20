import apiClient from './client';
import { Game, GameFormData } from '../types';

export const gamesApi = {
  // Get all games
  getGames: async (params?: {
    page?: number;
    size?: number;
    genre?: string;
    platform?: string;
    search?: string;
  }) => {
    const response = await apiClient.get('/games', { params });
    return response.data;
  },

  // Get game by ID
  getGame: async (id: string): Promise<Game> => {
    const response = await apiClient.get(`/games/${id}`);
    return response.data;
  },

  // Create game (admin only)
  createGame: async (gameData: GameFormData): Promise<Game> => {
    const response = await apiClient.post('/games', gameData);
    return response.data;
  },

  // Update game (admin only)
  updateGame: async (id: string, gameData: GameFormData): Promise<Game> => {
    const response = await apiClient.put(`/games/${id}`, gameData);
    return response.data;
  },

  // Delete game (admin only)
  deleteGame: async (id: string): Promise<void> => {
    await apiClient.delete(`/games/${id}`);
  },
};
