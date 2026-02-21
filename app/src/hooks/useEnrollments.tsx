import { useQueryClient } from "@tanstack/react-query";
import APIClient from "../services/api-client";
import { CACHE_KEY_STUDENTS, Student } from "../students";
import { CACHE_KEY_CAMPS, Camp } from "../camps";
import APIHooks from "../services/api-hooks";
import { User } from "../users";
import ms from "ms";
import { CACHE_KEY_COUPONS } from "../coupons";
import { CouponData } from "../coupons/Coupon";

export type HalfDayType = "AM" | "PM";

export interface SingleEnrollment {
  student_id: number;
  camp_id: number;
  half_day?: HalfDayType;
}

// Enrollment data is for users trying to enroll their students in camps
export interface EnrollmentData {
  execute_transaction: boolean;
  payment_token?: string;
  coupons: string[];
  enrollments: SingleEnrollment[];
}

export interface CheckoutTotal {
  total_cost: number; // integer total in cents
  disc_cost: number; // integer total in cents
  coupons: CouponData[];
}

// Enrollment is for admins querying current enrollments
interface Enrollment {
  id: number;
  guardian: User;
  camp: Camp;
  student: Student;
  square_receipt_number: string;
  coupon_code?: string;
}

const CACHE_KEY_ENROLLMENTS = ["enrollments"];

const enrollmentClient = new APIClient<CheckoutTotal, EnrollmentData>("/enroll");

interface EnrollmentArgs {
  onSubmit?: () => void;
  onSuccess?: (data?: CheckoutTotal) => void;
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
      .then((data) => {
        queryClient.invalidateQueries({
          queryKey: CACHE_KEY_CAMPS,
          exact: false,
        });
        queryClient.invalidateQueries({
          queryKey: CACHE_KEY_STUDENTS,
          exact: false,
        });
        queryClient.invalidateQueries({
          queryKey: CACHE_KEY_ENROLLMENTS,
          exact: true,
        });
        queryClient.invalidateQueries({
          queryKey: CACHE_KEY_COUPONS,
          exact: true,
        });
        if (onSuccess) onSuccess(data);
      })
      .catch((error) => {
        if (onError) {
          if (error.response) onError(error.response.data?.detail);
          else if (error.message) onError(error.message);
        }
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
