import {
  Box,
  Button,
  Divider,
  HStack,
  Input,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import useShoppingCart from "../hooks/useShoppingCart";
import { CreditCard, PaymentForm } from "react-square-web-payments-sdk";
import BodyContainer from "../components/BodyContainer";
import CartItemCard from "../components/CartItemCard";
import PageHeader from "../components/PageHeader";
import { useEnrollment } from "../hooks/useEnrollments";
import { useState } from "react";
import AlertMessage from "../components/AlertMessage";
import { Coupon } from "../coupons/Coupon";
import { axiosInstance } from "../services/api-client";
import { locale } from "../constants";

const Checkout = () => {
  const { items, totalCost, removeItem, clearCart } = useShoppingCart();

  const [alertContext, setAlertContext] = useState<
    undefined | { status: "error" | "success"; message: string }
  >(undefined);
  const [couponCode, setCouponCode] = useState<undefined | string>(undefined);
  const [coupon, setCoupon] = useState<undefined | Coupon>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const enroll = useEnrollment({
    onSubmit: () => setIsLoading(true),
    onSuccess: () => {
      clearCart();
      setAlertContext({
        status: "success",
        message: `Enrollment successful. You should be able to see the camps your students are enrolled in by viewing them in "My Students".`,
      });
      setIsLoading(false);
    },
    onError: (errorMessage) => {
      clearCart();
      setAlertContext({
        status: "error",
        message:
          `There was a problem completing your enrollment. Please email us at support@leveluplearningnc.com. Error message: ` +
          errorMessage,
      });
      setIsLoading(false);
    },
  });

  if (isLoading)
    return (
      <BodyContainer>
        <Box marginX="auto" width="fit-content">
          <Spinner size="xl" />
        </Box>
      </BodyContainer>
    );

  const percentDiscount =
    coupon && coupon.discount_type === "percent" ? coupon.discount_amount : 0;
  const fixedDiscount =
    coupon && coupon.discount_type === "dollars"
      ? coupon.discount_amount * 100
      : 0;
  const pennyCost = totalCost * (100 - percentDiscount) - fixedDiscount;

  return (
    <BodyContainer>
      {alertContext && (
        <AlertMessage
          status={alertContext.status}
          onClose={() => setAlertContext(undefined)}
        >
          {alertContext.message}
        </AlertMessage>
      )}
      {items.length > 0 && (
        <>
          <PageHeader>Checkout</PageHeader>
          <Stack spacing={3}>
            {items.map((item) => (
              <CartItemCard
                key={item.camp_id + ", " + item.student_id}
                camp_id={item.camp_id}
                student_id={item.student_id}
                onDelete={() => removeItem(item)}
              />
            ))}
            <Divider orientation="horizontal" marginY={5} />
            <HStack justifyContent="space-between" padding={2}>
              <Text>
                <strong>Coupon code:</strong>
              </Text>
              <Input onChange={(event) => setCouponCode(event.target.value)} />
              <Button
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
              </Button>
            </HStack>
            <HStack justifyContent="space-between" padding={2}>
              <Text fontSize={20}>
                <strong>Total:</strong>
              </Text>
              <HStack justifyContent="right" spacing={2}>
                {coupon && (
                  <Text textColor="red" textDecoration="line-through">
                    ${totalCost}
                  </Text>
                )}
                <Text>${pennyCost / 100}</Text>
              </HStack>
            </HStack>
            <Box paddingTop={7}>
              <PaymentForm
                applicationId={import.meta.env.VITE_SQUARE_APPLICATION_ID}
                cardTokenizeResponseReceived={async (token, verifiedBuyer) => {
                  enroll({
                    payment_token: token.token,
                    coupon_code: coupon?.code,
                    enrollments: items,
                  });
                }}
                locationId={import.meta.env.VITE_SQUARE_LOCATION_ID}
                createPaymentRequest={() => ({
                  countryCode: "US",
                  currencyCode: "USD",
                  total: {
                    amount: pennyCost.toString(),
                    label: "Total",
                  },
                })}
              >
                <CreditCard />
              </PaymentForm>
            </Box>
          </Stack>
        </>
      )}
    </BodyContainer>
  );
};

export default Checkout;
