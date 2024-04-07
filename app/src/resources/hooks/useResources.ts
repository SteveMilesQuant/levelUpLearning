import ms from "ms";
import APIClient from "../../services/api-client";
import APIHooks, {
  AddArgs,
  AddDataContext,
  DeleteArgs,
  DeleteDataContext,
  UpdateArgs,
  UpdateDataContext,
} from "../../services/api-hooks";
import { CACHE_KEY_RESOURCES, Resource, ResourceData } from "../Resource";
import { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import { CACHE_KEY_RESOURCE_GROUPS } from "..";

const useResourceHooks = (resourceGroupId: number) => {
  return new APIHooks<Resource, ResourceData>(
    new APIClient<Resource, ResourceData>(
      `/resource_groups/${resourceGroupId}/resources`
    ),
    [
      ...CACHE_KEY_RESOURCE_GROUPS,
      resourceGroupId.toString(),
      ...CACHE_KEY_RESOURCES,
    ],
    ms("5m")
  );
};

const useResources = (resourceGroupId?: number) => {
  if (!resourceGroupId) return {} as UseQueryResult<Resource[], Error>;
  const resourceHooks = useResourceHooks(resourceGroupId);
  return resourceHooks.useDataList();
};
export default useResources;

export const useResource = (resourceGroupId?: number, resourceId?: number) => {
  if (!resourceGroupId || !resourceId)
    return {} as UseQueryResult<Resource, Error>;
  const resourceHooks = useResourceHooks(resourceGroupId);
  return resourceHooks.useData(resourceId);
};

export const useAddResource = (
  resourceGroupId?: number,
  addArgs?: AddArgs<Resource, ResourceData>
) => {
  if (!resourceGroupId)
    return {} as UseMutationResult<
      Resource,
      Error,
      ResourceData,
      AddDataContext<Resource>
    >;
  const resourceHooks = useResourceHooks(resourceGroupId);

  // Apply custom mutation where we append to end, instead of beginning, and initialize list_index
  const queryMutation = (newData: ResourceData, dataList: Resource[]) => {
    const newResource = {
      id: 0, // always set id to zero on new objects
      group_id: resourceGroupId,
      ...newData,
      list_index: dataList.length + 1,
    };
    return [...dataList, newResource];
  };

  return resourceHooks.useAdd({ queryMutation, ...addArgs });
};

export const useUpdateResource = (
  resourceGroupId?: number,
  updateArgs?: UpdateArgs<Resource>
) => {
  if (!resourceGroupId)
    return {} as UseMutationResult<
      Resource,
      Error,
      Resource,
      UpdateDataContext<Resource>
    >;
  const resourceHooks = useResourceHooks(resourceGroupId);

  // Apply custom mutation where we update list indices for other resources when target resource moves
  const queryMutation = (newData: Resource, dataList: Resource[]) => {
    const origData = dataList.find((resource) => resource.id === newData.id);
    if (!origData || origData.list_index === newData.list_index)
      return dataList.map((data) => (data.id === newData.id ? newData : data));
    const minIdx = Math.min(origData.list_index, newData.list_index);
    const maxIdx = Math.max(origData.list_index, newData.list_index);
    const direction = origData.list_index < newData.list_index ? -1 : 1;
    const newList = dataList.map((resource) =>
      resource.id === newData.id
        ? newData
        : resource.list_index < minIdx || resource.list_index > maxIdx
        ? resource
        : { ...resource, list_index: resource.list_index + direction }
    );

    return newList;
  };

  return resourceHooks.useUpdate({ queryMutation, ...updateArgs });
};

export const useDeleteResource = (
  resourceGroupId?: number,
  deleteArgs?: DeleteArgs<Resource>
) => {
  if (!resourceGroupId)
    return {} as UseMutationResult<
      any,
      Error,
      number,
      DeleteDataContext<Resource>
    >;
  const resourceHooks = useResourceHooks(resourceGroupId);

  // Apply custom mutation where we update list_index for resources after deleted resource
  const queryMutation = (dataId: number, dataList: Resource[]) => {
    const delData = dataList.find((resource) => resource.id === dataId);
    if (!delData) return dataList;
    return dataList
      .filter((resource) => resource.id !== dataId)
      .map((resource) =>
        resource.list_index < delData.list_index
          ? resource
          : { ...resource, list_index: resource.list_index - 1 }
      );
  };

  return resourceHooks.useDelete({ queryMutation, ...deleteArgs });
};
