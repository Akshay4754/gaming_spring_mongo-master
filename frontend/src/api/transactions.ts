import apiClient from './client';
import { Transaction, CreateTransactionRequest } from '../types';

export const transactionsApi = {
  // Get all transactions (admin only)
  getTransactions: async (): Promise<Transaction[]> => {
    const response = await apiClient.get('/transactions');
    return response.data;
  },

  // Get transactions by member ID
  getTransactionsByMember: async (memberId: string): Promise<Transaction[]> => {
    const response = await apiClient.get(`/transactions/member/${memberId}`);
    return response.data;
  },

  // Create transaction (user purchases game)
  createTransaction: async (transactionData: CreateTransactionRequest): Promise<Transaction> => {
    const response = await apiClient.post('/transactions', transactionData);
    return response.data;
  },
};
