import { Table, TableContainer, Tbody, Thead, Tr } from "@chakra-ui/react";
import useAllRoles from "../hooks/useAllRoles";
import useUsers from "../hooks/useUsers";
import UserRow from "./UserRow";
import ThText from "../../components/ThText";

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
            <ThText>Name</ThText>
            <ThText>Email</ThText>
            <ThText>Role</ThText>
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
