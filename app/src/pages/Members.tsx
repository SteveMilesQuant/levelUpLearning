import {
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import PageHeader from "../components/PageHeader";
import { useRoles, useUsers } from "../users";

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
              <Th>Role</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <Tr key={user.id}>
                <Td>{user.full_name}</Td>
                <Td>{user.email_address}</Td>
                <Td>
                  <Select
                    value={user.roles.slice(-1)[0].name}
                    isReadOnly={true}
                  >
                    {roles?.map((role) => (
                      <option key={role.name} value={role.name}>
                        {role.name.charAt(0).toUpperCase() +
                          role.name.slice(1, role.name.length).toLowerCase()}
                      </option>
                    ))}
                  </Select>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Members;
