import apiClient from './client';
import { Member, MemberFormData, MemberProfileDto, SearchRequestDto } from '../types';

export const membersApi = {
  // Get all members (admin only)
  getMembers: async (): Promise<Member[]> => {
    const response = await apiClient.get('/members');
    return response.data;
  },

  // Get member by ID
  getMember: async (id: string): Promise<Member> => {
    const response = await apiClient.get(`/members/${id}`);
    return response.data;
  },

  // Create member (signup)
  createMember: async (memberData: MemberFormData): Promise<Member> => {
    const response = await apiClient.post('/members', memberData);
    return response.data;
  },

  // Update member (admin only)
  updateMember: async (id: string, memberData: MemberFormData): Promise<Member> => {
    const response = await apiClient.put(`/members/${id}`, memberData);
    return response.data;
  },

  // Delete member (admin only)
  deleteMember: async (id: string): Promise<void> => {
    await apiClient.delete(`/members/${id}`);
  },

  // Search member by phone
  searchMemberByPhone: async (phone: string): Promise<MemberProfileDto> => {
    const response = await apiClient.post('/members/search', { phone });
    return response.data;
  },
};
