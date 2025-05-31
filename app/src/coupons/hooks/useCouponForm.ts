import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { object, string, number, date, InferType, array } from "yup";
import { Coupon } from "../Coupon";
import { useAddCoupon, useUpdateCoupon } from "./useCoupons";

export const couponSchema = object().shape({
  code: string().required(),
  discount_type: string().required().oneOf(["dollars", "percent"]),
  discount_amount: number().required().integer().positive(),
  max_count: number().integer().nullable(),
  y_expiration: date().optional(),
  camp_ids: array().of(number().integer()),
});

export type FormData = InferType<typeof couponSchema>;

const useCouponForm = (coupon?: Coupon) => {
  const {
    register,
    control,
    handleSubmit: handleFormSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(couponSchema),
    defaultValues: useMemo(() => {
      return {
        ...coupon,
        discount_type: coupon?.discount_type || "percent",
        max_count: coupon?.max_count || null,
        y_expiration: coupon?.expiration
          ? new Date(coupon.expiration + "T00:00:00")
          : undefined,
      };
    }, [coupon]),
  });

  const addCoupon = useAddCoupon();
  const updateCoupon = useUpdateCoupon();

  const handleClose = () => {
    reset({ ...coupon });
  };

  const handleSubmitLocal = (data: FieldValues) => {
    if (!isValid) return;

    const newCoupon = {
      id: 0,
      ...coupon,
      ...data,
      expiration: data.y_expiration
        ? data.y_expiration.getFullYear() +
        (data.y_expiration.getMonth() < 9 ? "-0" : "-") +
        (data.y_expiration.getMonth() + 1) +
        (data.y_expiration.getDate() < 9 ? "-0" : "-") +
        data.y_expiration.getDate()
        : undefined,
    } as Coupon;

    if (coupon) {
      // Update character
      updateCoupon.mutate(newCoupon);
    } else {
      // Add new character
      addCoupon.mutate(newCoupon);
    }
  };

  const handleSubmit = () => {
    handleFormSubmit(handleSubmitLocal)();
  };

  return {
    register,
    control,
    errors,
    handleClose,
    handleSubmit,
    isValid,
  };
};

export default useCouponForm;
