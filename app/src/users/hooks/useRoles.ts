import { useQuery } from "@tanstack/react-query";
import APIClient from "../../services/api-client";

export const CACHE_KEY_ROLES = ["roles"];

const apiClient = new APIClient<string>("/roles");

const useRoles = () =>
  useQuery<string[], Error>({
    queryKey: CACHE_KEY_ROLES,
    queryFn: apiClient.getAll,
    staleTime: 0,
  });

export default useRoles;
