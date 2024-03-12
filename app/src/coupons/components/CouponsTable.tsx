import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
} from "@chakra-ui/react";
import useCoupons from "../hooks/useCoupons";
import CouponsTableRow from "./CouponsTableRow";
import { useState } from "react";

const CouponsTable = () => {
  const { data: coupons, isLoading, error } = useCoupons();
  const [isAdding, setIsAdding] = useState(false);

  if (error) throw error;
  if (isLoading || !coupons) return null;

  return (
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            <Th>Code</Th>
            <Th>Type</Th>
            <Th>Value</Th>
            <Th>Expiration</Th>
            <Th>Used Count</Th>
            <Th>Max Usages</Th>
            <Th>{/* placeholder for crud buttons */}</Th>
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
                <Button onClick={() => setIsAdding(true)}>Add</Button>
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default CouponsTable;
