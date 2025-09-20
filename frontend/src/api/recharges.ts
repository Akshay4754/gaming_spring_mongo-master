import apiClient from './client';
import { Recharge, CreateRechargeRequest } from '../types';

export const rechargesApi = {
  // Get all recharges (admin only)
  getRecharges: async (): Promise<Recharge[]> => {
    const response = await apiClient.get('/recharges');
    return response.data;
  },

  // Get recharges by member ID
  getRechargesByMember: async (memberId: string): Promise<Recharge[]> => {
    const response = await apiClient.get(`/recharges/member/${memberId}`);
    return response.data;
  },

  // Create recharge (user adds balance)
  createRecharge: async (rechargeData: CreateRechargeRequest): Promise<Recharge> => {
    const response = await apiClient.post('/recharges', rechargeData);
    return response.data;
  },
};
