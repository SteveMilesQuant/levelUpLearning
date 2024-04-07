import { FormControl, FormLabel, Input, Stack } from "@chakra-ui/react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import InputError from "../../components/InputError";
import { FormData } from "../hooks/useResourceGroupForm";

interface Props {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  isReadOnly: boolean;
}

const ProgramFormBody = ({ register, errors, isReadOnly }: Props) => {
  return (
    <Stack spacing={5}>
      <FormControl>
        <FormLabel>Title</FormLabel>
        <InputError
          label={errors.title?.message}
          isOpen={errors.title ? true : false}
        >
          <Input {...register("title")} type="text" isReadOnly={isReadOnly} />
        </InputError>
      </FormControl>
    </Stack>
  );
};

export default ProgramFormBody;
