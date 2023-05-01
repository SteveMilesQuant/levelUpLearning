import { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import { CACHE_KEY_PROGRAMS } from "../Program";
import APIHooks, {
  AddDataContext,
  DeleteDataContext,
  UpdateDataContext,
} from "../../services/api-hooks";
import APIClient from "../../services/api-client";
import ms from "ms";
import { CACHE_KEY_LEVELS, Level, LevelData } from "../Level";

const useLevelHooks = (programId: number) => {
  return new APIHooks<LevelData, Level>(
    new APIClient<LevelData, Level>(`/programs/${programId}/levels`),
    [...CACHE_KEY_PROGRAMS, programId.toString(), ...CACHE_KEY_LEVELS],
    ms("5m")
  );
};

const useLevels = (programId?: number) => {
  if (!programId) return {} as UseQueryResult<Level[], Error>;
  const levelHooks = useLevelHooks(programId);
  return levelHooks.useDataList();
};
export default useLevels;

export const useLevel = (programId?: number, levelId?: number) => {
  if (!programId || !levelId) return {} as UseQueryResult<Level, Error>;
  const levelHooks = useLevelHooks(programId);
  return levelHooks.useData(levelId);
};

export const useAddLevel = (programId?: number, onAdd?: () => void) => {
  if (!programId)
    return {} as UseMutationResult<Level, Error, Level, AddDataContext<Level>>;
  const levelHooks = useLevelHooks(programId);
  return levelHooks.useAdd(onAdd);
};

export const useUpdateLevel = (programId?: number, onUpdate?: () => void) => {
  if (!programId)
    return {} as UseMutationResult<
      Level,
      Error,
      Level,
      UpdateDataContext<Level>
    >;
  const levelHooks = useLevelHooks(programId);
  return levelHooks.useUpdate(onUpdate);
};

export const useDeleteLevel = (programId?: number, onDelete?: () => void) => {
  if (!programId)
    return {} as UseMutationResult<any, Error, any, DeleteDataContext<Level>>;
  const levelHooks = useLevelHooks(programId);
  return levelHooks.useDelete(onDelete);
};
