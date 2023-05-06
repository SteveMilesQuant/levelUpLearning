import APIHooks from "../services/api-hooks";
import APIClient from "../services/api-client";
import ms from "ms";
import { User, UserData } from "../services/user-service";

export const CACHE_KEY_INSTRUCTORS = ["instructors"];

const instructorHooks = new APIHooks<User, UserData>(
  new APIClient<User, UserData>("/instructors"),
  CACHE_KEY_INSTRUCTORS,
  ms("5m")
);

export default instructorHooks.useDataList;
