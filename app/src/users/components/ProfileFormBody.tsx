import { FormControl, FormLabel, Input, Stack } from "@chakra-ui/react";
import { User } from "../User";

interface Props {
  user: User;
  isReadOnly?: boolean;
}

const ProfileFormBody = ({ user, isReadOnly }: Props) => {
  return (
    <Stack spacing={5}>
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input
          type="text"
          isReadOnly={isReadOnly}
          value={user.full_name}
          onChange={() => {}}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          isReadOnly={isReadOnly}
          value={user.email_address}
          onChange={() => {}}
        />
      </FormControl>
    </Stack>
  );
};

export default ProfileFormBody;
