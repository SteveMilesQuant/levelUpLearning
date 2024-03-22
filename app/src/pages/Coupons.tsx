import BodyContainer from "../components/BodyContainer";
import PageHeader from "../components/PageHeader";
import { CouponsTable } from "../coupons";

const Coupons = () => {
  return (
    <BodyContainer>
      <PageHeader>Coupons</PageHeader>
      <CouponsTable />
    </BodyContainer>
  );
};

export default Coupons;
