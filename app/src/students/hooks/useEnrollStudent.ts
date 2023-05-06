import ms from "ms";
import APIClient from "../../services/api-client";
import { Student } from "../Student";
import APIHooks from "../../services/api-hooks";
import { UseMutationResult } from "@tanstack/react-query";

const useEnrollHooks = (campId?: number) =>
  new APIHooks<Student, { id?: number }>(
    new APIClient<Student, { id?: number }>(`/camps/${campId}/students`),
    ["camps", campId?.toString() || "", "students"],
    ms("5m")
  );

const useEnrollStudent = (campId?: number) => {
  if (!campId) return {} as UseMutationResult<any, Error, any>;
  const enrollHooks = useEnrollHooks(campId);
  return enrollHooks.useEnroll();
};

export default useEnrollStudent;
