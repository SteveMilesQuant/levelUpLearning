import { useQuery } from "@tanstack/react-query";
import APIClient from "../services/api-client";
import { Role } from "./useRoles";

export const CACHE_KEY_USER_ROLES = ["user", "roles"];

const apiClient = new APIClient<Role>("/user/roles");

const useRoles = (signedIn: boolean) =>
  useQuery<Role[], Error>({
    queryKey: CACHE_KEY_USER_ROLES,
    queryFn: apiClient.getAll,
    staleTime: 0,
    enabled: signedIn,
  });

export default useRoles;
