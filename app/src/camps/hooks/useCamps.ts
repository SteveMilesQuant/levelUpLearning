import ms from "ms";
import APIHooks from "../../services/api-hooks";
import APIClient from "../../services/api-client";
import { CACHE_KEY_CAMPS, CACHE_KEY_SCHEDULE, Camp, CampData } from "../Camp";
import { CACHE_KEY_STUDENTS } from "../../students";

export enum CampGetType {
  camps,
  teach,
  schedule,
}

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

const teachHooks = new APIHooks<Camp, CampData>(
  new APIClient<Camp, CampData>("/teach"),
  CACHE_KEY_SCHEDULE,
  ms("5m")
);

const writeCampHooks = new APIHooks<Camp, CampData>(
  new APIClient<Camp, CampData>("/camps"),
  CACHE_KEY_SCHEDULE,
  ms("5m")
);

const useCamps = (getType?: CampGetType, studentId?: number) => {
  if (getType === CampGetType.schedule) {
    return teachHooks.useDataList();
  } else if (getType === CampGetType.teach) {
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
export const useAddCamp = writeCampHooks.useAdd;
export const useUpdateCamp = writeCampHooks.useUpdate;
export const useDeleteCamp = writeCampHooks.useDelete;
