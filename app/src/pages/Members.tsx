import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import PageHeader from "../components/PageHeader";
import useUsers from "../hooks/useUsers";
import useRoles from "../hooks/useRoles";

const Members = () => {
  const { data: roles } = useRoles();
  const { data: users, isLoading, error } = useUsers();

  if (isLoading) return null;
  if (error) throw error;

  return (
    <>
      <PageHeader label="Members" />
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Roles</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <Tr key={user.id}>
                <Td>{user.full_name}</Td>
                <Td>{user.email_address}</Td>
                <Td>{user.roles.join(", ")}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Members;
