import APIHooks from "../../services/api-hooks";
import APIClient from "../../services/api-client";
import ms from "ms";
import { User, UserData } from "../User";
import { CACHE_KEY_CAMPS } from "../../camps";
import { UseQueryResult } from "@tanstack/react-query";

export const CACHE_KEY_INSTRUCTORS = ["instructors"];

const instructorHooks = new APIHooks<User, UserData>(
  new APIClient<User, UserData>("/instructors"),
  CACHE_KEY_INSTRUCTORS,
  ms("5m")
);

export default instructorHooks.useDataList;

export const useCampInstructors = (campId?: number) => {
  if (!campId) return {} as UseQueryResult<User[], Error>;

  const campInstructorHooks = new APIHooks<User, UserData>(
    new APIClient<User, UserData>(`/camps/${campId}/instructors`),
    [...CACHE_KEY_CAMPS, campId.toString(), ...CACHE_KEY_INSTRUCTORS],
    ms("5m")
  );

  return campInstructorHooks.useDataList();
};
