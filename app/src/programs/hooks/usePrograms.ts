import { CACHE_KEY_PROGRAMS, ProgramData, Program } from "../Program";
import UseAPI from "../../hooks/useApi";
import APIClient from "../../services/api-client";

const usePrograms = new UseAPI<ProgramData, Program>(
  new APIClient<ProgramData, Program>("/programs"),
  CACHE_KEY_PROGRAMS
);

export default usePrograms.useDataList;
export const useProgram = usePrograms.useData;
export const useAddProgram = usePrograms.useAdd;
export const useUpdateProgram = usePrograms.useUpdate;
export const useDeleteProgram = usePrograms.useDelete;
