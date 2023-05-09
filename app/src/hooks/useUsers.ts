import APIHooks from "../services/api-hooks";
import APIClient from "../services/api-client";
import ms from "ms";
import { User, UserData } from "../services/user-service";

export const CACHE_KEY_USERS = ["users"];

const usersHooks = new APIHooks<User, UserData>(
  new APIClient<User, UserData>("/users"),
  CACHE_KEY_USERS,
  ms("5m")
);

export default usersHooks.useDataList;
