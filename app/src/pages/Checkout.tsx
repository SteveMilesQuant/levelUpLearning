import { Box, Divider, HStack, Stack, Text } from "@chakra-ui/react";
import useShoppingCart from "../hooks/useShoppingCart";
import { CreditCard, PaymentForm } from "react-square-web-payments-sdk";
import BodyContainer from "../components/BodyContainer";
import CartItemCard from "../components/CartItemCard";
import PageHeader from "../components/PageHeader";
import { useEnrollment } from "../hooks/useEnrollment";

const Checkout = () => {
  const { items, totalCost, removeItem, clearCart } = useShoppingCart();
  const enroll = useEnrollment(clearCart);

  if (items.length === 0) return null;

  const pennyCost = totalCost * 100;

  return (
    <BodyContainer>
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
          <Text fontSize={20}>
            <strong>Total:</strong>
          </Text>
          <Text>${totalCost}</Text>
        </HStack>
        <Box paddingTop={7}>
          <PaymentForm
            applicationId={import.meta.env.VITE_SQUARE_APPLICATION_ID}
            cardTokenizeResponseReceived={async (token, verifiedBuyer) => {
              enroll({ payment_token: token.token, enrollments: items });
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
    </BodyContainer>
  );
};

export default Checkout;
