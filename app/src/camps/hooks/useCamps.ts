import ms from "ms";
import APIHooks from "../../services/api-hooks";
import APIClient from "../../services/api-client";
import { CACHE_KEY_CAMPS, Camp, CampData } from "../Camp";

export interface CampQuery {
  is_published?: boolean;
  instructor_id?: number;
  enroll_full_day_allowed?: boolean;
  enroll_half_day_allowed?: boolean;
  single_day_only?: boolean;
}

const campHooks = new APIHooks<Camp, CampData>(
  new APIClient<Camp, CampData>("/camps"),
  CACHE_KEY_CAMPS,
  ms("5m")
);

const useCamps = (campQuery: CampQuery, disabled: boolean) => {
  return campHooks.useDataList(
    Object.keys(campQuery).length ? { params: { ...campQuery } } : undefined,
    disabled
  );
};

export default useCamps;
export const useCamp = campHooks.useData;
export const useAddCamp = campHooks.useAdd;
export const useUpdateCamp = campHooks.useUpdate;
export const useDeleteCamp = campHooks.useDelete;
