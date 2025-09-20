import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rechargesApi } from '../api/recharges';
import { Recharge, CreateRechargeRequest } from '../types';

// Query keys
export const rechargeKeys = {
  all: ['recharges'] as const,
  lists: () => [...rechargeKeys.all, 'list'] as const,
  byMember: (memberId: string) => [...rechargeKeys.all, 'member', memberId] as const,
};

// Get all recharges (admin only)
export const useRecharges = () => {
  return useQuery({
    queryKey: rechargeKeys.lists(),
    queryFn: () => rechargesApi.getRecharges(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get recharges by member
export const useRechargesByMember = (memberId: string) => {
  return useQuery({
    queryKey: rechargeKeys.byMember(memberId),
    queryFn: () => rechargesApi.getRechargesByMember(memberId),
    enabled: !!memberId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Create recharge mutation
export const useCreateRecharge = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (rechargeData: CreateRechargeRequest) => rechargesApi.createRecharge(rechargeData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: rechargeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: rechargeKeys.byMember(variables.memberId) });
    },
  });
};
