import APIHooks, { DeleteDataContext } from "../../services/api-hooks";
import APIClient from "../../services/api-client";
import ms from "ms";
import { User, UserData } from "../User";
import { CACHE_KEY_CAMPS } from "../../camps";
import { UseMutationResult, UseQueryResult } from "@tanstack/react-query";

export const CACHE_KEY_INSTRUCTORS = ["instructors"];

const useCampInstructorHooks = (campId: number) => {
  return new APIHooks<User, UserData>(
    new APIClient<User, UserData>(`/camps/${campId}/instructors`),
    [...CACHE_KEY_CAMPS, campId.toString(), ...CACHE_KEY_INSTRUCTORS],
    ms("5m")
  );
};

export const useCampInstructors = (campId?: number) => {
  if (!campId) return {} as UseQueryResult<User[], Error>;
  const campInstructorHooks = useCampInstructorHooks(campId);
  return campInstructorHooks.useDataList();
};

export const useDeleteCampInstructor = (campId?: number) => {
  if (!campId)
    return {} as UseMutationResult<any, Error, number, DeleteDataContext<User>>;
  const campInstructorHooks = useCampInstructorHooks(campId);
  return campInstructorHooks.useDelete();
};

export const useAddCampInstructor = (campId?: number) => {
  if (!campId) return {} as UseMutationResult<User, Error, number, unknown>;
  const campInstructorHooks = useCampInstructorHooks(campId);
  return campInstructorHooks.useEnroll();
};
