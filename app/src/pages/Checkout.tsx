import { Box, Divider, Spinner, Stack } from "@chakra-ui/react";
import useShoppingCart from "../hooks/useShoppingCart";
import BodyContainer from "../components/BodyContainer";
import CartItemCard from "../components/CartItemCard";
import PageHeader from "../components/PageHeader";
import { useState } from "react";
import AlertMessage from "../components/AlertMessage";
import { Coupon } from "../coupons/Coupon";
import { CouponCode } from "../coupons";
import CheckoutTotal from "../components/CheckoutTotal";
import CheckoutPayment from "../components/CheckoutPayment";

const Checkout = () => {
  const { items, totalCost, removeItem, clearCart } = useShoppingCart();

  const [alertContext, setAlertContext] = useState<
    undefined | { status: "error" | "success"; message: string }
  >(undefined);

  const [coupon, setCoupon] = useState<undefined | Coupon>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  const handlePaymentSuccess = () => {
    clearCart();
    setAlertContext({
      status: "success",
      message: `Enrollment successful. You should be able to see the camps your students are enrolled in by viewing them in "My Students".`,
    });
    setIsLoading(false);
  };

  const handlePaymentError = (errorMessage?: string) => {
    clearCart();
    setAlertContext({
      status: "error",
      message:
        `There was a problem completing your enrollment. Please email us at support@leveluplearningnc.com. Error message: ` +
        errorMessage,
    });
    setIsLoading(false);
  };

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
            <CouponCode
              setCoupon={setCoupon}
              setAlertContext={setAlertContext}
            />
            <CheckoutTotal
              subtotal={coupon ? totalCost : undefined}
              total={pennyCost / 100}
            />
            <Box paddingTop={7}>
              <CheckoutPayment
                couponCode={coupon?.code}
                checkoutItems={items}
                pennyCost={pennyCost}
                onSubmit={() => setIsLoading(true)}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </Box>
          </Stack>
        </>
      )}
    </BodyContainer>
  );
};

export default Checkout;
