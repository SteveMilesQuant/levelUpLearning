import APIClient from "../../services/api-client";
import { CACHE_KEY_ROLES } from "./useAllRoles";
import { CACHE_KEY_USERS } from "./useUsers";
import {
  UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

export const useAddRole = (userId?: number) => {
  const queryClient = useQueryClient();
  if (!userId) return {} as UseMutationResult<string, Error, string>;
  const apiClient = new APIClient<string>(`/users/${userId}/roles`);
  return useMutation<string, Error, string>({
    mutationKey: [...CACHE_KEY_USERS, userId, ...CACHE_KEY_ROLES],
    mutationFn: (name: string) => apiClient.post(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CACHE_KEY_USERS });
    },
  });
};

export const useRemoveRole = (userId?: number) => {
  const queryClient = useQueryClient();
  if (!userId) return {} as UseMutationResult<any, Error, string>;
  const apiClient = new APIClient<string>(`/users/${userId}/roles`);
  return useMutation<any, Error, string>({
    mutationKey: [...CACHE_KEY_USERS, userId, ...CACHE_KEY_ROLES],
    mutationFn: (name: string) => apiClient.delete(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CACHE_KEY_USERS });
    },
  });
};
