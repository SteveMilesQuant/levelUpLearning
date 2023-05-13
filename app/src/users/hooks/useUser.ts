import { useQuery } from "@tanstack/react-query";
import APIClient from "../../services/api-client";
import { User, UserData } from "../User";
import useAuth from "./useAuth";
import APIHooks from "../../services/api-hooks";
import ms from "ms";

export const CACHE_KEY_USER = ["user"];

const userHooks = new APIHooks<User, UserData>(
  new APIClient<User, UserData>("/user"),
  CACHE_KEY_USER,
  ms("5m")
);

export const useUpdateUser = () =>
  userHooks.useUpdate({ endpointIgnoresId: true });

const useUser = () => userHooks.useData(undefined, true);

export default useUser;
