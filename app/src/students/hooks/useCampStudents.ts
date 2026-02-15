import ms from "ms";
import APIClient from "../../services/api-client";
import APIHooks, {
  DeleteArgs,
  DeleteDataContext,
} from "../../services/api-hooks";
import { CACHE_KEY_STUDENTS, Student, StudentData } from "../Student";
import { CACHE_KEY_CAMPS } from "../../camps";
import { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import { HalfDayType } from "../../hooks/useEnrollments";

export interface CampStudent extends Student {
  half_day?: HalfDayType;
}

const useStudentHooks = (campId: number) =>
  new APIHooks<CampStudent, StudentData>(
    new APIClient<CampStudent, StudentData>(`/camps/${campId}/students`),
    [...CACHE_KEY_CAMPS, campId.toString(), ...CACHE_KEY_STUDENTS],
    ms("5m")
  );

const useCampStudents = (campId?: number) => {
  if (!campId) return {} as UseQueryResult<CampStudent[], Error>;
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
