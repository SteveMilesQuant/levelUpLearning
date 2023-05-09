import { FormControl, FormLabel, Select, SimpleGrid } from "@chakra-ui/react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { FormData } from "../hooks/useCampForm";
import InputError from "../../components/InputError";
import { usePrograms } from "../../programs";
import { useInstructors } from "../../users";

interface Props {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  isReadOnly?: boolean;
}

const CampFormBody = ({ register, errors, isReadOnly }: Props) => {
  const { data: programs } = usePrograms();
  const { data: instructors } = useInstructors();

  return (
    <SimpleGrid columns={1} gap={5}>
      <FormControl>
        <FormLabel>Program</FormLabel>
        <InputError
          label={errors.program_id?.message}
          isOpen={errors.program_id ? true : false}
        >
          <Select {...register("program_id")} isReadOnly={isReadOnly}>
            <option value="">Select program</option>
            {programs?.map((program) => (
              <option key={program.id} value={program.id}>
                {program.title}
              </option>
            ))}
          </Select>
        </InputError>
      </FormControl>
      <FormControl>
        <FormLabel>Instructor</FormLabel>
        <InputError
          label={errors.primary_instructor_id?.message}
          isOpen={errors.primary_instructor_id ? true : false}
        >
          <Select
            {...register("primary_instructor_id")}
            isReadOnly={isReadOnly}
          >
            <option value="">Select primary instructor</option>
            {instructors?.map((instructor) => (
              <option key={instructor.id} value={instructor.id}>
                {instructor.full_name + " (" + instructor.email_address + ")"}
              </option>
            ))}
          </Select>
        </InputError>
      </FormControl>
    </SimpleGrid>
  );
};

export default CampFormBody;
