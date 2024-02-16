export interface CouponData {
  code: string;
  discount_type: "dollars" | "percent";
  discount_amount: number;
  expiration?: string;
}

export interface Coupon extends CouponData {
  id: number;
}
