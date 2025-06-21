import { HStack } from "@chakra-ui/react";
import BodyContainer from "../components/BodyContainer";
import PageHeader from "../components/PageHeader";
import { CouponsTable } from "../coupons";
import TextButton from "../components/TextButton";
import { useState } from "react";

const Coupons = () => {
  const [showExpiredCoupons, setShowExpiredCoupons] = useState(false);


  return (
    <BodyContainer>
      <PageHeader rightButton={
        <HStack justify="space-between" spacing={3}>
          {showExpiredCoupons && (
            <TextButton onClick={() => setShowExpiredCoupons(false)}>
              Show valid coupons
            </TextButton>
          )}
          {!showExpiredCoupons && (
            <TextButton onClick={() => setShowExpiredCoupons(true)}>
              Show expired coupons
            </TextButton>
          )}
        </HStack>

      }>Coupons</PageHeader>
      <CouponsTable showExpiredCoupons={showExpiredCoupons} />
    </BodyContainer>
  );
};

export default Coupons;
