import {
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  Textarea,
} from "@chakra-ui/react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { FormData } from "../hooks/useLevelForm";
import InputError from "../../components/InputError";

interface Props {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  isReadOnly?: boolean;
}

const LevelFormBody = ({ register, errors, isReadOnly }: Props) => {
  return (
    <SimpleGrid columns={1} gap={5}>
      <FormControl>
        <FormLabel>Title</FormLabel>
        <InputError
          label={errors.title?.message}
          isOpen={errors.title ? true : false}
        >
          <Input {...register("title")} type="text" isReadOnly={isReadOnly} />
        </InputError>
      </FormControl>
      <FormControl>
        <FormLabel>Description</FormLabel>
        <InputError
          label={errors.description?.message}
          isOpen={errors.description ? true : false}
        >
          <Input
            {...register("description")}
            as={Textarea}
            size="xl"
            height="15rem"
            isReadOnly={isReadOnly}
          />
        </InputError>
      </FormControl>
    </SimpleGrid>
  );
};

export default LevelFormBody;
