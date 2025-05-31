import { PaymentForm, CreditCard } from "react-square-web-payments-sdk";
import { SingleEnrollment, useEnrollment } from "../hooks/useEnrollments";
import SubmitButton from "./SubmitButton";

interface Props {
  coupons: string[];
  checkoutItems: SingleEnrollment[];
  pennyCost: number;
  onSubmit: () => void;
  onSuccess: () => void;
  onError: (errorMessage?: string) => void;
}

const CheckoutPayment = ({
  coupons,
  checkoutItems,
  pennyCost,
  onSubmit,
  onSuccess,
  onError,
}: Props) => {
  const enroll = useEnrollment({
    onSubmit: onSubmit,
    onSuccess: onSuccess,
    onError: onError,
  });

  return (
    <>
      {pennyCost > 0 && (
        <PaymentForm
          applicationId={import.meta.env.VITE_SQUARE_APPLICATION_ID}
          cardTokenizeResponseReceived={async (token, verifiedBuyer) => {
            enroll({
              execute_transaction: true,
              payment_token: token.token,
              coupons: coupons,
              enrollments: checkoutItems,
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
      )}
      {pennyCost <= 0 && (
        <SubmitButton
          onClick={() => {
            enroll({
              execute_transaction: true,
              coupons: coupons,
              enrollments: checkoutItems,
            });
          }}
        >
          Enroll
        </SubmitButton>
      )}
    </>
  );
};

export default CheckoutPayment;
