import { Box, Divider, HStack, Stack, Text } from "@chakra-ui/react";
import useShoppingCart from "../hooks/useShoppingCart";
import { CreditCard, PaymentForm } from "react-square-web-payments-sdk";
import BodyContainer from "../components/BodyContainer";
import CartItemCard from "../components/CartItemCard";
import PageHeader from "../components/PageHeader";
import { useEnrollment } from "../hooks/useEnrollments";
import { useState } from "react";
import AlertMessage from "../components/AlertMessage";

const Checkout = () => {
  const { items, totalCost, removeItem, clearCart } = useShoppingCart();
  const [alertContext, setAlertContext] = useState<
    undefined | { status: "error" | "success"; message: string }
  >(undefined);

  const enroll = useEnrollment({
    onSuccess: () => {
      clearCart();
      setAlertContext({
        status: "success",
        message: `Enrollment successful. You should be able to see the camps your students are enrolled in by viewing them in "My Students".`,
      });
    },
    onError: (errorMessage) => {
      clearCart();
      setAlertContext({
        status: "error",
        message:
          `There was a problem completing your enrollment. Please email us at support@leveluplearningnc.com. Error message: ` +
          errorMessage,
      });
    },
  });

  const pennyCost = totalCost * 100;

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
        </>
      )}
    </BodyContainer>
  );
};

export default Checkout;
