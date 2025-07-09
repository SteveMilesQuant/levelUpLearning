import { CACHE_KEY_STUDENTS, Student, StudentData } from "../Student";
import APIHooks from "../../services/api-hooks";
import APIClient from "../../services/api-client";
import ms from "ms";
import { useQueryClient } from "@tanstack/react-query";
import { CACHE_KEY_CAMPS } from "../../camps";

export interface StudentMoveData {
  from_camp_id: number;
  to_camp_id: number;
}

interface StudentMoveArgs {
  onSubmit?: () => void;
  onSuccess?: () => void;
  onError?: (detail?: string) => void;
}

const studentHooks = new APIHooks<Student, StudentData>(
  new APIClient<Student, StudentData>("/students"),
  CACHE_KEY_STUDENTS,
  ms("5m")
);

export const useStudentMove = (student_id: number, {
  onSubmit,
  onSuccess,
  onError,
}: StudentMoveArgs) => {
  const queryClient = useQueryClient();
  const studentMoveClient = new APIClient<void, StudentMoveData>(`/students/${student_id}/move`);

  const enroll = (data: StudentMoveData) => {
    if (onSubmit) onSubmit();
    studentMoveClient
      .post(data)
      .then(() => {
        queryClient.invalidateQueries({
          queryKey: CACHE_KEY_CAMPS,
          exact: false,
        });
        queryClient.invalidateQueries({
          queryKey: CACHE_KEY_STUDENTS,
          exact: false,
        });
        if (onSuccess) onSuccess();
      })
      .catch((error) => {
        if (onError) {
          if (error.response) onError(error.response.data?.detail);
          else if (error.message) onError(error.message);
        }
      });
  };

  return enroll;
}

export default studentHooks.useDataList;
export const useStudent = studentHooks.useData;
export const useAddStudent = studentHooks.useAdd;
export const useUpdateStudent = studentHooks.useUpdate;
export const useDeleteStudent = studentHooks.useDelete;
