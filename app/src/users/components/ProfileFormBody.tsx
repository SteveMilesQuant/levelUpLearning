import { Checkbox, FormControl, FormLabel, Input, Stack } from "@chakra-ui/react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import InputError from "../../components/InputError";
import { FormData } from "../hooks/useUserForm";

interface Props {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  isReadOnly?: boolean;
  contactOnly?: boolean;
}

const ProfileFormBody = ({ register, errors, isReadOnly, contactOnly }: Props) => {
  return (
    <Stack spacing={5}>
      {!contactOnly &&
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
      }
      <FormControl>
        <FormLabel>Preferred Email</FormLabel>
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
      <FormControl>
        <FormLabel>Contact me about</FormLabel>
        <Stack spacing={3} marginY={3}>
          <Checkbox disabled={true} isChecked={true}>Camps my students are enrolled in</Checkbox>
          <Checkbox disabled={isReadOnly} {...register("receive_marketing_emails")}>Announcements and offers</Checkbox>
        </Stack>
      </FormControl>
    </Stack >
  );
};

export default ProfileFormBody;
