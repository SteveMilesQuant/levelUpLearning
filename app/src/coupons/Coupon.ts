export interface CouponData {
  code: string;
  discount_type: "dollars" | "percent";
  discount_amount: number;
  expiration?: string;
  used_count: number;
  max_count: number;
  camp_ids?: number[];
  applies_to_all: boolean;
  user_can_reuse: boolean;
}

export interface Coupon extends CouponData {
  id: number;
}
