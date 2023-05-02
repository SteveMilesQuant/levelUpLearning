import ms from "ms";
import APIHooks from "../../services/api-hooks";
import APIClient from "../../services/api-client";
import { CACHE_KEY_CAMPS, CACHE_KEY_SCHEDULE, Camp, CampData } from "../Camp";
import { CACHE_KEY_STUDENTS } from "../../students";

const campHooks = new APIHooks<Camp, CampData>(
  new APIClient<Camp, CampData>("/camps"),
  CACHE_KEY_CAMPS,
  ms("5m")
);

const scheduleHooks = new APIHooks<Camp, CampData>(
  new APIClient<Camp, CampData>("/schedule"),
  CACHE_KEY_SCHEDULE,
  ms("5m")
);

const useCamps = (forScheduling?: boolean, studentId?: number) => {
  if (forScheduling) {
    return scheduleHooks.useDataList();
  } else if (studentId) {
    const studentCampHooks = new APIHooks<Camp, CampData>(
      new APIClient<Camp, CampData>(`/students/${studentId}/camps`),
      [...CACHE_KEY_STUDENTS, studentId.toString(), ...CACHE_KEY_CAMPS],
      ms("5m")
    );
    return studentCampHooks.useDataList();
  } else {
    return campHooks.useDataList();
  }
};

export default useCamps;
export const useCamp = campHooks.useData;
export const useAddCamp = campHooks.useAdd;
export const useUpdateCamp = campHooks.useUpdate;
export const useDeleteCamp = campHooks.useDelete;
