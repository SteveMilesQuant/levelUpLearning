import { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import { CACHE_KEY_CAMPS } from "../Camp";
import APIHooks, {
  AddDataContext,
  DeleteDataContext,
  UpdateDataContext,
} from "../../services/api-hooks";
import APIClient from "../../services/api-client";
import ms from "ms";
import {
  CACHE_KEY_LEVEL_SCHEDULES,
  LevelSchedule,
  LevelScheduleData,
} from "../LevelSchedule";

const useLevelScheduleHooks = (campId: number) => {
  return new APIHooks<LevelSchedule, LevelScheduleData>(
    new APIClient<LevelSchedule, LevelScheduleData>(`/camps/${campId}/levels`),
    [...CACHE_KEY_CAMPS, campId.toString(), ...CACHE_KEY_LEVEL_SCHEDULES],
    ms("5m")
  );
};

const useLevelSchedules = (campId?: number) => {
  if (!campId) return {} as UseQueryResult<LevelSchedule[], Error>;
  const levelHooks = useLevelScheduleHooks(campId);
  return levelHooks.useDataList();
};
export default useLevelSchedules;

export const useLevelSchedule = (campId?: number, levelId?: number) => {
  if (!campId || !levelId) return {} as UseQueryResult<LevelSchedule, Error>;
  const levelHooks = useLevelScheduleHooks(campId);
  return levelHooks.useData(levelId);
};

export const useAddLevelSchedule = (campId?: number, onAdd?: () => void) => {
  if (!campId)
    return {} as UseMutationResult<
      LevelSchedule,
      Error,
      LevelScheduleData,
      AddDataContext<LevelSchedule>
    >;
  const levelHooks = useLevelScheduleHooks(campId);
  return levelHooks.useAdd(onAdd);
};

export const useUpdateLevelSchedule = (campId?: number) => {
  if (!campId)
    return {} as UseMutationResult<
      LevelSchedule,
      Error,
      LevelSchedule,
      UpdateDataContext<LevelSchedule>
    >;
  const levelHooks = useLevelScheduleHooks(campId);
  return levelHooks.useUpdate();
};

export const useDeleteLevelSchedule = (campId?: number) => {
  if (!campId)
    return {} as UseMutationResult<
      any,
      Error,
      number,
      DeleteDataContext<LevelSchedule>
    >;
  const levelHooks = useLevelScheduleHooks(campId);
  return levelHooks.useDelete();
};
