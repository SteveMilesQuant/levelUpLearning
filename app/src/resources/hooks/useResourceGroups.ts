import {
  CACHE_KEY_RESOURCE_GROUPS,
  ResourceGroupData,
  ResourceGroup,
} from "../ResourceGroup";
import APIHooks from "../../services/api-hooks";
import APIClient from "../../services/api-client";
import ms from "ms";

const resourceGroupHooks = new APIHooks<ResourceGroup, ResourceGroupData>(
  new APIClient<ResourceGroup, ResourceGroupData>("/resource_groups"),
  CACHE_KEY_RESOURCE_GROUPS,
  ms("5m")
);

export default resourceGroupHooks.useDataList;
export const useResourceGroup = resourceGroupHooks.useData;
export const useAddResourceGroup = resourceGroupHooks.useAdd;
export const useUpdateResourceGroup = resourceGroupHooks.useUpdate;
export const useDeleteResourceGroup = resourceGroupHooks.useDelete;
