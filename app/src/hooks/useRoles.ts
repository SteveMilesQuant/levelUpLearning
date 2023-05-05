import { useQuery, UseQueryResult } from "@tanstack/react-query";
import ms from "ms";
import APIClient from "../services/api-client";

export interface Role {
  name: string;
}

const apiClient = new APIClient<Role>("/roles");

const useRoles = (signedIn: boolean) =>
  useQuery<Role[], Error>({
    queryKey: ["roles"],
    queryFn: apiClient.getAll,
    staleTime: ms("5m"),
    enabled: signedIn,
  });

export default useRoles;
