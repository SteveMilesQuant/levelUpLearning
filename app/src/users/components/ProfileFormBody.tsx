import { FormControl, FormLabel, Input, Stack } from "@chakra-ui/react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import InputError from "../../components/InputError";
import { FormData } from "../hooks/useUserForm";

interface Props {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  isReadOnly?: boolean;
}

const ProfileFormBody = ({ register, errors, isReadOnly }: Props) => {
  return (
    <Stack spacing={5}>
      <FormControl>
        <FormLabel>Name</FormLabel>
        <InputError
          label={errors.full_name?.message}
          isOpen={errors.full_name ? true : false}
        >
          <Input
            type="text"
            isReadOnly={isReadOnly}
            {...register("full_name")}
          />
        </InputError>
      </FormControl>
      <FormControl>
        <FormLabel>Email</FormLabel>
        <InputError
          label={errors.email_address?.message}
          isOpen={errors.email_address ? true : false}
        >
          <Input
            type="email"
            isReadOnly={isReadOnly}
            {...register("email_address")}
          />
        </InputError>
      </FormControl>
    </Stack>
  );
};

export default ProfileFormBody;
