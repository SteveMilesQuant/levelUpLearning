import { CACHE_KEY_PROGRAMS, ProgramData, Program } from "../Program";
import APIHooks from "../../services/api-hooks";
import APIClient from "../../services/api-client";
import ms from "ms";

const programHooks = new APIHooks<ProgramData, Program>(
  new APIClient<ProgramData, Program>("/programs"),
  CACHE_KEY_PROGRAMS,
  ms("5m")
);

export default programHooks.useDataList;
export const useProgram = programHooks.useData;
export const useAddProgram = programHooks.useAdd;
export const useUpdateProgram = programHooks.useUpdate;
export const useDeleteProgram = programHooks.useDelete;
