import {
  FormControl,
  FormLabel,
  Input,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { FormData } from "../hooks/useUserForm";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import InputError from "../../components/InputError";

interface Props {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  isReadOnly?: boolean;
}

const InstructorFormBody = ({ register, errors, isReadOnly }: Props) => {
  return (
    <Stack spacing={5}>
      <FormControl>
        <FormLabel>Name</FormLabel>

        <Input type="text" isReadOnly={true} {...register("full_name")} />
      </FormControl>
      <FormControl>
        <FormLabel>Subjects</FormLabel>
        <InputError
          label={errors.instructor_subjects?.message}
          isOpen={errors.instructor_subjects ? true : false}
        >
          <Input
            type="text"
            isReadOnly={isReadOnly}
            {...register("instructor_subjects")}
          />
        </InputError>
      </FormControl>
      <FormControl>
        <FormLabel>About</FormLabel>
        <InputError
          label={errors.instructor_description?.message}
          isOpen={errors.instructor_description ? true : false}
        >
          <Input
            as={Textarea}
            size="xl"
            height="15rem"
            isReadOnly={isReadOnly}
            {...register("instructor_description")}
          />
        </InputError>
      </FormControl>
    </Stack>
  );
};

export default InstructorFormBody;
