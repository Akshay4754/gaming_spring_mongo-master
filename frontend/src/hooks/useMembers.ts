import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { membersApi } from '../api/members';
import { Member, MemberFormData, MemberProfileDto } from '../types';

// Query keys
export const memberKeys = {
  all: ['members'] as const,
  lists: () => [...memberKeys.all, 'list'] as const,
  details: () => [...memberKeys.all, 'detail'] as const,
  detail: (id: string) => [...memberKeys.details(), id] as const,
  profile: (phone: string) => [...memberKeys.all, 'profile', phone] as const,
};

// Get all members (admin only)
export const useMembers = () => {
  return useQuery({
    queryKey: memberKeys.lists(),
    queryFn: () => membersApi.getMembers(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get single member
export const useMember = (id: string) => {
  return useQuery({
    queryKey: memberKeys.detail(id),
    queryFn: () => membersApi.getMember(id),
    enabled: !!id,
  });
};

// Get member profile by phone
export const useMemberProfile = (phone: string) => {
  return useQuery({
    queryKey: memberKeys.profile(phone),
    queryFn: () => membersApi.searchMemberByPhone(phone),
    enabled: !!phone,
  });
};

// Create member mutation
export const useCreateMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (memberData: MemberFormData) => membersApi.createMember(memberData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: memberKeys.lists() });
    },
  });
};

// Update member mutation
export const useUpdateMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: MemberFormData }) => 
      membersApi.updateMember(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: memberKeys.lists() });
      queryClient.invalidateQueries({ queryKey: memberKeys.detail(id) });
    },
  });
};

// Delete member mutation
export const useDeleteMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => membersApi.deleteMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: memberKeys.lists() });
    },
  });
};
