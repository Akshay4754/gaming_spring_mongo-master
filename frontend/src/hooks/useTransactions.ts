import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionsApi } from '../api/transactions';
import { Transaction, CreateTransactionRequest } from '../types';

// Query keys
export const transactionKeys = {
  all: ['transactions'] as const,
  lists: () => [...transactionKeys.all, 'list'] as const,
  byMember: (memberId: string) => [...transactionKeys.all, 'member', memberId] as const,
};

// Get all transactions (admin only)
export const useTransactions = () => {
  return useQuery({
    queryKey: transactionKeys.lists(),
    queryFn: () => transactionsApi.getTransactions(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get transactions by member
export const useTransactionsByMember = (memberId: string) => {
  return useQuery({
    queryKey: transactionKeys.byMember(memberId),
    queryFn: () => transactionsApi.getTransactionsByMember(memberId),
    enabled: !!memberId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Create transaction mutation
export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (transactionData: CreateTransactionRequest) => 
      transactionsApi.createTransaction(transactionData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: transactionKeys.byMember(variables.memberId) });
    },
  });
};
