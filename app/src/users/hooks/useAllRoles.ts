import { useQuery } from "@tanstack/react-query";
import APIClient from "../../services/api-client";
import { Role } from "../Role";

export const CACHE_KEY_ROLES = ["roles"];

const apiClient = new APIClient<Role>("/roles");

const useRoles = () =>
  useQuery<Role[], Error>({
    queryKey: CACHE_KEY_ROLES,
    queryFn: apiClient.getAll,
    staleTime: 0,
  });

export default useRoles;
