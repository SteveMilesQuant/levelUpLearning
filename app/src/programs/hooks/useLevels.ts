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
  return new APIHooks<Level, LevelData>(
    new APIClient<Level, LevelData>(`/programs/${programId}/levels`),
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
    return {} as UseMutationResult<
      Level,
      Error,
      LevelData,
      AddDataContext<Level>
    >;
  const levelHooks = useLevelHooks(programId);

  // Apply custom mutation where we append to end, instead of beginning, and initialize list_index
  const queryMutation = (newData: LevelData, dataList: Level[]) => {
    const newLevel = {
      id: 0, // always set id to zero on new objects
      ...newData,
      list_index: dataList.length + 1,
    };
    return [...dataList, newLevel];
  };

  return levelHooks.useAdd(onAdd, queryMutation);
};

export const useUpdateLevel = (programId?: number) => {
  if (!programId)
    return {} as UseMutationResult<
      Level,
      Error,
      Level,
      UpdateDataContext<Level>
    >;
  const levelHooks = useLevelHooks(programId);

  // Apply custom mutation where we update list indices for other levels when target level moves
  const queryMutation = (newData: Level, dataList: Level[]) => {
    const origData = dataList.find((level) => level.id === newData.id);
    if (!origData || origData.list_index === newData.list_index)
      return dataList.map((data) => (data.id === newData.id ? newData : data));
    const minIdx = Math.min(origData.list_index, newData.list_index);
    const maxIdx = Math.max(origData.list_index, newData.list_index);
    const direction = origData.list_index < newData.list_index ? -1 : 1;
    const newList = dataList.map((level) =>
      level.id === newData.id
        ? newData
        : level.list_index > minIdx || level.list_index > maxIdx
        ? level
        : { ...level, list_index: level.list_index + direction }
    );
    return newList;
  };

  return levelHooks.useUpdate({ queryMutation });
};

export const useDeleteLevel = (programId?: number, onDelete?: () => void) => {
  if (!programId)
    return {} as UseMutationResult<
      any,
      Error,
      number,
      DeleteDataContext<Level>
    >;
  const levelHooks = useLevelHooks(programId);

  // Apply custom mutation where we update list_index for levels after deleted level
  const queryMutation = (dataId: number, dataList: Level[]) => {
    const delData = dataList.find((level) => level.id === dataId);
    if (!delData) return dataList;
    return dataList
      .filter((level) => level.id !== dataId)
      .map((level) =>
        level.list_index < delData.list_index
          ? level
          : { ...level, list_index: level.list_index - 1 }
      );
  };

  return levelHooks.useDelete(onDelete, queryMutation);
};
