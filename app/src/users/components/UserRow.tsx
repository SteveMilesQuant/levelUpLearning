import { Select, Td, Tr } from "@chakra-ui/react";
import { User } from "../User";
import { useAddRole, useRemoveRole } from "../hooks/useRoles";
import { ChangeEvent } from "react";

interface Props {
  user: User;
  roles?: string[];
}

const UserRow = ({ user, roles }: Props) => {
  const addRole = useAddRole(user.id);
  const removeRole = useRemoveRole(user.id);

  const handleChangeRole = (e: ChangeEvent<HTMLSelectElement>) => {
    if (!roles) return;
    const tgtIndex = roles.findIndex((role) => role === e.target.value);
    if (tgtIndex === -1) return;
    const newRoles = roles.filter(
      (role, index) => index <= tgtIndex && !user.roles.find((r) => r === role)
    );
    const deleteRoles = roles.filter(
      (role, index) => index > tgtIndex && user.roles.find((r) => r === role)
    );
    newRoles.forEach((role) => addRole?.mutate(role));
    deleteRoles.forEach((role) => removeRole?.mutate(role));
  };

  return (
    <Tr>
      <Td>{user.full_name}</Td>
      <Td>{user.email_address}</Td>
      <Td>
        <Select
          value={user.roles.slice(-1)[0]}
          isDisabled={user.id === 1}
          onChange={handleChangeRole}
        >
          {roles?.map((role) => (
            <option key={role} value={role}>
              {role.charAt(0).toUpperCase() +
                role.slice(1, role.length).toLowerCase()}
            </option>
          ))}
        </Select>
      </Td>
    </Tr>
  );
};

export default UserRow;
