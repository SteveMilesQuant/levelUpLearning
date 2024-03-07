import { PaymentForm, CreditCard } from "react-square-web-payments-sdk";
import { SingleEnrollment, useEnrollment } from "../hooks/useEnrollments";
import SubmitButton from "./SubmitButton";

interface Props {
  couponCode?: string;
  checkoutItems: SingleEnrollment[];
  pennyCost: number;
  onSubmit: () => void;
  onSuccess: () => void;
  onError: (errorMessage?: string) => void;
}

const CheckoutPayment = ({
  couponCode,
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
              payment_token: token.token,
              coupon_code: couponCode,
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
              coupon_code: couponCode,
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
