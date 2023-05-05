import { useQuery } from "@tanstack/react-query";
import APIClient from "../services/api-client";

export interface Role {
  name: string;
}

export const CACHE_KEY_ROLES = ["roles"];

const apiClient = new APIClient<Role>("/roles");

const useRoles = (signedIn: boolean) => {
  return useQuery<Role[], Error>({
    queryKey: CACHE_KEY_ROLES,
    queryFn: apiClient.getAll,
    staleTime: 0,
    enabled: signedIn,
  });
};

export default useRoles;
