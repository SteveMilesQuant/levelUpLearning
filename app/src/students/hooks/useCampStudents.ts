import ms from "ms";
import APIClient from "../../services/api-client";
import APIHooks, {
  DeleteArgs,
  DeleteDataContext,
} from "../../services/api-hooks";
import { CACHE_KEY_STUDENTS, Student, StudentData } from "../Student";
import { CACHE_KEY_CAMPS } from "../../camps";
import { UseMutationResult, UseQueryResult } from "@tanstack/react-query";

const useStudentHooks = (campId: number) =>
  new APIHooks<Student, StudentData>(
    new APIClient<Student, StudentData>(`/camps/${campId}/students`),
    [...CACHE_KEY_CAMPS, campId.toString(), ...CACHE_KEY_STUDENTS],
    ms("5m")
  );

const useCampStudents = (campId?: number) => {
  if (!campId) return {} as UseQueryResult<Student[], Error>;
  const studentHooks = useStudentHooks(campId);
  return studentHooks.useDataList();
};
export default useCampStudents;

export const useDisenrollStudent = (
  campId?: number,
  options?: DeleteArgs<Student>
) => {
  if (!campId)
    return {} as UseMutationResult<
      any,
      Error,
      number,
      DeleteDataContext<Student>
    >;
  const studentHooks = useStudentHooks(campId);
  return studentHooks.useDelete(options);
};
