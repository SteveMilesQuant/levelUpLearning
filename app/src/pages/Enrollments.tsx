import {
  Link,
  Table,
  TableContainer,
  Tbody,
  Td,
  Thead,
  Tr,
} from "@chakra-ui/react";
import BodyContainer from "../components/BodyContainer";
import PageHeader from "../components/PageHeader";
import useEnrollments from "../hooks/useEnrollments";
import { Link as RouterLink } from "react-router-dom";
import ThText from "../components/ThText";

const Enrollments = () => {
  const { data: enrollments, isLoading, error } = useEnrollments();

  if (error) throw error;

  return (
    <BodyContainer>
      <PageHeader>All enrollments</PageHeader>
      {!isLoading && (
        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <ThText>Guardian</ThText>
                <ThText>Email</ThText>
                <ThText>Student</ThText>
                <ThText>Grade level</ThText>
                <ThText>Camp</ThText>
                <ThText>Receipt number</ThText>
                <ThText>Coupon code</ThText>
              </Tr>
            </Thead>
            <Tbody>
              {enrollments.map((enrollment) => (
                <Tr key={enrollment.id}>
                  <Td>{enrollment.guardian.full_name}</Td>
                  <Td>{enrollment.guardian.email_address}</Td>
                  <Td>{enrollment.student.name}</Td>
                  <Td>{enrollment.student.grade_level}</Td>
                  <Td>
                    <Link
                      as={RouterLink}
                      to={"/schedule/" + enrollment.camp.id}
                      isExternal={true}
                    >
                      {enrollment.camp.program.title}
                    </Link>
                  </Td>
                  <Td>{enrollment.square_receipt_number}</Td>
                  <Td>{enrollment.coupon_code}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </BodyContainer>
  );
};

export default Enrollments;
