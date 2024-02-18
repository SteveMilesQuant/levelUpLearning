import { useQueryClient } from "@tanstack/react-query";
import APIClient from "../services/api-client";
import { Student } from "../students";
import { CACHE_KEY_CAMPS, Camp } from "../camps";
import APIHooks from "../services/api-hooks";
import { User } from "../users";
import ms from "ms";
import { CACHE_KEY_COUPONS } from "../coupons";

export interface SingleEnrollment {
  student_id: number;
  camp_id: number;
}

export interface EnrollmentData {
  payment_token?: string;
  coupon_code?: string;
  enrollments: SingleEnrollment[];
}

interface Enrollment {
  id: number;
  guardian: User;
  camp: Camp;
  student: Student;
  square_receipt_number: string;
  coupon_code?: string;
}

const CACHE_KEY_ENROLLMENTS = ["enrollments"];

const enrollmentClient = new APIClient<Student[], EnrollmentData>("/enroll");

interface EnrollmentArgs {
  onSubmit?: () => void;
  onSuccess?: () => void;
  onError?: (detail?: string) => void;
}

// useEnrollment is only for enrolling (purchasing)
export const useEnrollment = ({
  onSubmit,
  onSuccess,
  onError,
}: EnrollmentArgs) => {
  const queryClient = useQueryClient();

  const enroll = (data: EnrollmentData) => {
    if (onSubmit) onSubmit();
    enrollmentClient
      .post(data)
      .then(() => {
        queryClient.invalidateQueries({
          queryKey: CACHE_KEY_CAMPS,
          exact: false,
        });
        queryClient.invalidateQueries({
          queryKey: CACHE_KEY_ENROLLMENTS,
          exact: true,
        });
        if (data.coupon_code) {
          queryClient.invalidateQueries({
            queryKey: CACHE_KEY_COUPONS,
            exact: true,
          });
        }
        if (onSuccess) onSuccess();
      })
      .catch((error) => {
        if (onError) onError(error.response.data.detail);
      });
  };

  return enroll;
};

// useEnrollments is for an admin to see all existing enrollments
const enrollmentsHooks = new APIHooks<Enrollment>(
  new APIClient<Enrollment>("/enrollments"),
  CACHE_KEY_ENROLLMENTS,
  ms("5m")
);
export default enrollmentsHooks.useDataList;
