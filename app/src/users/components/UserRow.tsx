import { Select, Td, Tr } from "@chakra-ui/react";
import { User } from "../User";
import { Role } from "../Role";
import { useAddRole, useRemoveRole } from "../hooks/useRoles";
import { ChangeEvent } from "react";

interface Props {
  user: User;
  roles?: Role[];
}

const UserRow = ({ user, roles }: Props) => {
  const addRole = useAddRole(user.id);
  const removeRole = useRemoveRole(user.id);

  const handleChangeRole = (e: ChangeEvent<HTMLSelectElement>) => {
    if (!roles) return;
    const tgtIndex = roles.findIndex((role) => role.name === e.target.value);
    if (tgtIndex === -1) return;
    const newRoles = roles.filter(
      (role, index) =>
        index <= tgtIndex && !user.roles.find((r) => r.name == role.name)
    );
    const deleteRoles = roles.filter(
      (role, index) =>
        index > tgtIndex && user.roles.find((r) => r.name == role.name)
    );
    newRoles.forEach((role) => addRole?.mutate(role.name));
    deleteRoles.forEach((role) => removeRole?.mutate(role.name));
  };

  return (
    <Tr>
      <Td>{user.full_name}</Td>
      <Td>{user.email_address}</Td>
      <Td>
        <Select
          value={user.roles.slice(-1)[0].name}
          isDisabled={user.id === 1}
          onChange={handleChangeRole}
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
  );
};

export default UserRow;
