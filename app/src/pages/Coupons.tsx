import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
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
