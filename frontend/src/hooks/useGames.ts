import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gamesApi } from '../api/games';
import { Game, GameFormData } from '../types';

// Query keys
export const gameKeys = {
  all: ['games'] as const,
  lists: () => [...gameKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...gameKeys.lists(), filters] as const,
  details: () => [...gameKeys.all, 'detail'] as const,
  detail: (id: string) => [...gameKeys.details(), id] as const,
};

// Get all games
export const useGames = (params?: {
  page?: number;
  size?: number;
  genre?: string;
  platform?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: gameKeys.list(params || {}),
    queryFn: () => gamesApi.getGames(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get single game
export const useGame = (id: string) => {
  return useQuery({
    queryKey: gameKeys.detail(id),
    queryFn: () => gamesApi.getGame(id),
    enabled: !!id,
  });
};

// Create game mutation
export const useCreateGame = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (gameData: GameFormData) => gamesApi.createGame(gameData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gameKeys.lists() });
    },
  });
};

// Update game mutation
export const useUpdateGame = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: GameFormData }) => 
      gamesApi.updateGame(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: gameKeys.lists() });
      queryClient.invalidateQueries({ queryKey: gameKeys.detail(id) });
    },
  });
};

// Delete game mutation
export const useDeleteGame = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => gamesApi.deleteGame(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gameKeys.lists() });
    },
  });
};
