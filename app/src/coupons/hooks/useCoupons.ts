import APIHooks from "../../services/api-hooks";
import APIClient from "../../services/api-client";
import ms from "ms";
import { Coupon, CouponData } from "../Coupon";
import { useQuery } from "@tanstack/react-query";

export const CACHE_KEY_COUPONS = ["coupons"];

const couponsClient = new APIClient<Coupon, CouponData>("/coupons");
const couponsHooks = new APIHooks<Coupon, CouponData>(
  couponsClient,
  CACHE_KEY_COUPONS,
  ms("5m")
);

export default couponsHooks.useDataList;
export const useAddCoupon = couponsHooks.useAdd;
export const useUpdateCoupon = couponsHooks.useUpdate;
export const useDeleteCoupon = couponsHooks.useDelete;

// Single coupon is by code instead of id
export const useCoupon = (coupon_code?: string) => {
  const singleCacheKey = [...CACHE_KEY_COUPONS];
  if (coupon_code) singleCacheKey.push(coupon_code);
  return useQuery<Coupon, Error>({
    queryKey: singleCacheKey,
    queryFn: () => couponsClient.get(coupon_code),
    staleTime: ms("5m"),
  });
};
