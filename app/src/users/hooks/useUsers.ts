import APIHooks from "../../services/api-hooks";
import APIClient from "../../services/api-client";
import ms from "ms";
import { User, UserData } from "../User";

export const CACHE_KEY_USERS = ["users"];

export interface UserQuery {
  role?: string;
}

const usersHooks = new APIHooks<User, UserData>(
  new APIClient<User, UserData>("/users"),
  CACHE_KEY_USERS,
  ms("5m")
);

const useUsers = (userQuery?: UserQuery) => {
  return usersHooks.useDataList(
    userQuery ? { params: { ...userQuery } } : undefined
  );
};
export default useUsers;
