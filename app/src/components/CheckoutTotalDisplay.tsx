import { HStack, Spinner, Text } from "@chakra-ui/react";
import { SingleEnrollment, useEnrollment } from "../hooks/useEnrollments";
import { useEffect } from "react";
import { CheckoutTotal } from "../hooks/useEnrollments";


interface Props {
  isLoading: boolean;
  coupons: string[];
  checkoutItems: SingleEnrollment[];
  totals: CheckoutTotal;
  onSubmit: () => void;
  onSuccess: (data?: CheckoutTotal) => void;
  onError: (errorMessage?: string) => void;
}

const CheckoutTotalDisplay = ({ isLoading, coupons, checkoutItems, totals, onSubmit, onSuccess, onError }: Props) => {
  const enroll = useEnrollment({
    onSubmit: onSubmit,
    onSuccess: onSuccess,
    onError: onError,
  });

  useEffect(() => {
    enroll({
      execute_transaction: false,
      payment_token: undefined,
      coupons: coupons,
      enrollments: checkoutItems,
    })
  }, [coupons, checkoutItems]);

  const total_dollars = totals.total_cost * 0.01;
  const total_string = Number.isInteger(total_dollars) ? total_dollars.toString() : total_dollars.toFixed(2);

  const disc_dollars = totals.disc_cost * 0.01;
  const disc_string = Number.isInteger(disc_dollars) ? disc_dollars.toString() : disc_dollars.toFixed(2);

  return (
    <HStack justifyContent="space-between">
      <Text fontSize={20}>
        <strong>Total:</strong>
      </Text>
      {!isLoading &&
        <HStack justifyContent="right" spacing={2}>
          {totals.total_cost && totals.total_cost > totals.disc_cost && (
            <Text textColor="red" textDecoration="line-through">
              ${total_string}
            </Text>
          )}
          <Text>${disc_string}</Text>
        </HStack>
      }
      {isLoading && <Spinner />}
    </HStack>
  );
};

export default CheckoutTotalDisplay;
