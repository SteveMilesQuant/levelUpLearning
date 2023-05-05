import {
  FormControl,
  FormLabel,
  Input,
  VStack,
  Select,
} from "@chakra-ui/react";
import { z } from "zod";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import InputError from "../../components/InputError";
import { studentSchema } from "../hooks/useStudentForm";

interface Props {
  register: UseFormRegister<z.infer<typeof studentSchema>>;
  errors: FieldErrors<z.infer<typeof studentSchema>>;
}

const StudentFormBody = ({ register, errors }: Props) => {
  const grades = Array.from(Array(12).keys()).map((x) => (x + 1).toString());

  return (
    <VStack spacing={2}>
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
    </VStack>
  );
};

export default StudentFormBody;
