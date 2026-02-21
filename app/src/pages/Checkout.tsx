import { Box, CloseButton, Divider, HStack, Spinner, Stack, Text } from "@chakra-ui/react";
import useShoppingCart from "../hooks/useShoppingCart";
import BodyContainer from "../components/BodyContainer";
import CartItemCard from "../components/CartItemCard";
import PageHeader from "../components/PageHeader";
import { useState } from "react";
import { CouponCode } from "../coupons";
import CheckoutTotalDisplay from "../components/CheckoutTotalDisplay";
import CheckoutPayment from "../components/CheckoutPayment";
import { CheckoutTotal } from "../hooks/useEnrollments";
import useAlert from "../hooks/useAlerts";

const Checkout = () => {
  const { items, removeItem, clearCart, coupons, setCoupons } = useShoppingCart();
  const [totals, setTotals] = useState<CheckoutTotal>({ total_cost: 0.0, disc_cost: 0.0, coupons: [] });
  const { setAlert } = useAlert();

  const [isLoadingTotals, setIsLoadingTotals] = useState<boolean>(false);
  const [isLoadingPayment, setIsLoadingPayment] = useState<boolean>(false);

  if (isLoadingPayment)
    return (
      <BodyContainer>
        <Box marginX="auto" width="fit-content">
          <Spinner size="xl" />
        </Box>
      </BodyContainer>
    );

  const handleNewCoupon = (code: string) => {
    if (code.length > 0) {
      setCoupons([...totals.coupons.map(c => c.code), code.toUpperCase()]); // this will trigger a re-totaling
    }
  }

  const handleTotalingSuccess = (data?: CheckoutTotal) => {
    if (data) setTotals(data);
    setIsLoadingTotals(false);
  }

  const handleTotalingError = (errorMessage?: string) => {
    if (errorMessage) {
      setAlert({
        status: "error",
        message: errorMessage,
      });
    }
    setCoupons(totals.coupons.map(c => c.code)); // may trigger retotaling
    // Don't set loading totals to false, since they could be wrong
  }

  const handlePaymentSuccess = () => {
    clearCart();
    setCoupons([]);
    setAlert({
      status: "success",
      message: `Enrollment successful. You should be able to see the camps your students are enrolled in by viewing them in "My Students".`,
    });
    setIsLoadingPayment(false);
    // navigate("/forms");
  };

  const handlePaymentError = (errorMessage?: string) => {
    setAlert({
      status: "error",
      message:
        `There was a problem completing your enrollment. Please email us at support@leveluplearningnc.com. Error message: ` +
        errorMessage,
    });
    setIsLoadingPayment(false);
  };

  const total_coupon =
    totals.coupons.length === 1 && totals.coupons[0].camp_ids?.length === 0 && (totals.coupons[0].applies_to_all || totals.coupons[0].discount_type !== "dollars")
      ? totals.coupons[0]
      : undefined;

  return (
    <BodyContainer>
      {items.length > 0 && (
        <>
          <PageHeader>Checkout</PageHeader>
          <Stack spacing={4}>
            {items.map((item) => (
              <CartItemCard
                key={item.camp_id + ", " + item.student_id}
                camp_id={item.camp_id}
                student_id={item.student_id}
                half_day={item.half_day}
                onDelete={() => removeItem(item)}
                coupon={total_coupon || totals.coupons.find(c => c.camp_ids?.includes(item.camp_id))}
              />
            ))}
            <Divider orientation="horizontal" marginY={5} />
            <CouponCode
              onSubmit={handleNewCoupon}
            />
            <HStack width="full" spacing={3}>
              <Text><strong>Applied coupons:</strong></Text>
              {totals.coupons.map((c, index) =>
                <Box position="relative" paddingLeft={5} paddingRight={7} paddingY={3} borderWidth="1px" borderRadius={20} key={index}>
                  <CloseButton position="absolute" top="1" right="1" onClick={() => { setCoupons(coupons.filter(code => code != c.code)) }} size="sm" />
                  {c.code}
                </Box>)
              }
            </HStack>
            <CheckoutTotalDisplay
              coupons={coupons}
              checkoutItems={items}
              isLoading={isLoadingTotals}
              totals={totals}
              onSubmit={() => setIsLoadingTotals(true)}
              onSuccess={handleTotalingSuccess}
              onError={handleTotalingError}
            />
            <Box paddingTop={7}>
              <CheckoutPayment
                coupons={totals.coupons.map(c => c.code)}
                checkoutItems={items}
                pennyCost={totals.disc_cost}
                onSubmit={() => setIsLoadingPayment(true)}
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
