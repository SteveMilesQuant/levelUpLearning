import {
  FormControl,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
} from "@chakra-ui/react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import InputError from "../../components/InputError";
import { FormData } from "../hooks/useStudentForm";

interface Props {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
}

const StudentFormBody = ({ register, errors }: Props) => {
  const grades = Array.from(Array(12).keys()).map((x) => (x + 1).toString());

  return (
    <SimpleGrid columns={1} gap={5}>
      <FormControl>
        <FormLabel>Name</FormLabel>
        <InputError
          label={errors.name?.message}
          isOpen={errors.name ? true : false}
        >
          <Input {...register("name")} type="text" />
        </InputError>
      </FormControl>
      <FormControl>
        <FormLabel>Grade</FormLabel>
        <InputError
          label={errors.grade_level?.message}
          isOpen={errors.grade_level ? true : false}
        >
          <Select {...register("grade_level")}>
            <option value="">Select grade</option>
            {grades.map((grade) => (
              <option key={grade} value={grade}>
                {grade}
              </option>
            ))}
          </Select>
        </InputError>
      </FormControl>
    </SimpleGrid>
  );
};

export default StudentFormBody;
