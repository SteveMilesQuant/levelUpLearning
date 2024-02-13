import { CACHE_KEY_STUDENTS, Student, StudentData } from "../Student";
import APIHooks from "../../services/api-hooks";
import APIClient from "../../services/api-client";
import ms from "ms";

const studentHooks = new APIHooks<Student, StudentData>(
  new APIClient<Student, StudentData>("/students"),
  CACHE_KEY_STUDENTS,
  ms("5m")
);

export default studentHooks.useDataList;
export const useStudent = studentHooks.useData;
export const useAddStudent = studentHooks.useAdd;
export const useUpdateStudent = studentHooks.useUpdate;
export const useDeleteStudent = studentHooks.useDelete;
