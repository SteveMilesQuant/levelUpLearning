import { useQueryClient } from "@tanstack/react-query";
import APIClient from "../services/api-client";
import { Student } from "../students";
import { CACHE_KEY_CAMPS } from "../camps";

export interface SingleEnrollment {
  student_id: number;
  camp_id: number;
}

export interface EnrollmentData {
  payment_token?: string;
  enrollments: SingleEnrollment[];
}

const enrollmentClient = new APIClient<Student[], EnrollmentData>("/enroll");

export const useEnrollment = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  const enroll = (data: EnrollmentData) => {
    enrollmentClient.post(data).then(() => {
      queryClient.invalidateQueries({
        queryKey: CACHE_KEY_CAMPS,
        exact: false,
      });
      if (onSuccess) onSuccess();
    });
  };

  return enroll;
};
