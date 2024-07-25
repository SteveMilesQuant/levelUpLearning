import { HStack, Input, Text } from "@chakra-ui/react";
import { useState } from "react";
import { locale } from "../../constants";
import { axiosInstance } from "../../services/api-client";
import { Coupon } from "../Coupon";
import TextButton from "../../components/TextButton";

interface Props {
  setCoupon: (coupon?: Coupon) => void;
  setAlertContext: (alertContext?: {
    status: "error" | "success";
    message: string;
  }) => void;
}

const CouponCode = ({ setCoupon, setAlertContext }: Props) => {
  const [couponCode, setCouponCode] = useState<undefined | string>(undefined);
  return (
    <HStack justifyContent="space-between" padding={2}>
      <Text>
        <strong>Coupon code:</strong>
      </Text>
      <Input onChange={(event) => setCouponCode(event.target.value)} />
      <TextButton
        onClick={() => {
          if (couponCode && couponCode.length > 0) {
            axiosInstance
              .get<Coupon>("/coupons/" + couponCode)
              .then((res) => {
                const newCoupon = res.data;
                const expiration = newCoupon.expiration
                  ? new Date(newCoupon.expiration + "T00:00:00")
                  : undefined;
                if (expiration && expiration < new Date()) {
                  setAlertContext({
                    status: "error",
                    message:
                      "The coupon code " +
                      newCoupon.code +
                      " expired on " +
                      expiration.toLocaleDateString(locale, {
                        dateStyle: "short",
                      }),
                  });
                  setCoupon(undefined);
                } else if (
                  newCoupon.max_count &&
                  newCoupon.max_count > 0 &&
                  newCoupon.used_count >= newCoupon.max_count
                ) {
                  setAlertContext({
                    status: "error",
                    message:
                      "The coupon code " +
                      newCoupon.code +
                      " has been used the maximum number of times.",
                  });
                  setCoupon(undefined);
                }
                else if (newCoupon.been_used) {
                  setAlertContext({
                    status: "error",
                    message:
                      "You have already used the coupon code " +
                      newCoupon.code +
                      ". Sorry, but each user can only use each coupon once.",
                  });
                  setCoupon(undefined);
                } else {
                  setCoupon(res.data);
                }
              })
              .catch(() => {
                setAlertContext({
                  status: "error",
                  message: "Invalid coupon code: " + couponCode,
                });
              });
          } else {
            setCoupon(undefined);
          }
        }}
      >
        Apply
      </TextButton>
    </HStack>
  );
};

export default CouponCode;
