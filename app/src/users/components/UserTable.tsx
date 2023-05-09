import { Table, TableContainer, Tbody, Th, Thead, Tr } from "@chakra-ui/react";
import useAllRoles from "../hooks/useAllRoles";
import useUsers from "../hooks/useUsers";
import UserRow from "./UserRow";

const UserTable = () => {
  const { data: roles } = useAllRoles();
  const { data: users, isLoading, error } = useUsers();

  if (isLoading) return null;
  if (error) throw error;

  return (
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
            <UserRow key={user.id} user={user} roles={roles} />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default UserTable;
