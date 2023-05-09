import { useQuery } from "@tanstack/react-query";
import APIClient from "../../services/api-client";
import { User } from "../User";

export const CACHE_KEY_USER = ["user"];

const apiClient = new APIClient<User>("/user");

const useUser = (signedIn: boolean) =>
  useQuery<User, Error>({
    queryKey: CACHE_KEY_USER,
    queryFn: () => apiClient.get(),
    staleTime: 0,
    enabled: signedIn,
  });

export default useUser;
