import { TableContainer, Table, Thead, Tr, Tbody, Td } from "@chakra-ui/react";
import useCoupons from "../hooks/useCoupons";
import CouponsTableRow from "./CouponsTableRow";
import { useState } from "react";
import ThText from "../../components/ThText";
import TextButton from "../../components/TextButton";

const CouponsTable = () => {
  const { data: coupons, isLoading, error } = useCoupons();
  const [isAdding, setIsAdding] = useState(false);

  if (error) throw error;
  if (isLoading || !coupons) return null;

  return (
    <TableContainer>
      <Table variant="simple"
        sx={{ tableLayout: "auto" }}>
        <Thead>
          <Tr>
            <ThText>Code</ThText>
            <ThText>Type</ThText>
            <ThText>Value</ThText>
            <ThText>Expiration</ThText>
            <ThText>Used Count</ThText>
            <ThText>Max Usages</ThText>
            <ThText>Valid Camp(s)</ThText>
            <ThText>{/* placeholder for crud buttons */}</ThText>
          </Tr>
        </Thead>
        <Tbody>
          {coupons.map((coupon) => (
            <CouponsTableRow key={coupon.id} coupon={coupon} />
          ))}
          {isAdding && (
            <CouponsTableRow
              onCancel={() => setIsAdding(false)}
              onSuccess={() => setIsAdding(false)}
            />
          )}
          {!isAdding && (
            <Tr>
              <Td>
                <TextButton onClick={() => setIsAdding(true)}>Add</TextButton>
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default CouponsTable;
