export interface CouponData {
  code: string;
  discount_type: "dollars" | "percent";
  discount_amount: number;
  expiration?: string;
  used_count: number;
  max_count: number;
}

export interface Coupon extends CouponData {
  id: number;
  been_used: boolean;
}
