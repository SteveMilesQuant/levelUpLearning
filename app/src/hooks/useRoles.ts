import { useQuery } from "@tanstack/react-query";
import ms from "ms";
import APIClient from "../services/api-client";

export interface Role {
  name: string;
}

const apiClient = new APIClient<Role>("/roles");

export default () => {
  return useQuery<Role[], Error>({
    queryKey: ["roles"],
    queryFn: apiClient.getAll,
    staleTime: ms("24h"),
  });
};
