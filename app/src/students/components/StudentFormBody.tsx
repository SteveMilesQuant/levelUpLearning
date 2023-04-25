import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  VStack,
} from "@chakra-ui/react";
import { z } from "zod";
import { BsChevronDown } from "react-icons/bs";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { Student } from "../services/student-service";
import InputError from "../../components/InputError";
import { studentSchema } from "../hooks/useStudentForm";

interface Props {
  haveSubmitted: boolean;
  selectedGrade: number;
  setSelectedGrade: (selectedGrade: number) => void;
  register: UseFormRegister<z.infer<typeof studentSchema>>;
  errors: FieldErrors<z.infer<typeof studentSchema>>;
}

const StudentFormBody = ({
  haveSubmitted,
  selectedGrade,
  setSelectedGrade,
  register,
  errors,
}: Props) => {
  const grades = Array.from(Array(12).keys()).map((x) => x + 1);

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

        <Menu>
          <InputError
            label="Grade level is required."
            isOpen={haveSubmitted && selectedGrade === 0}
          >
            <MenuButton as={Button} rightIcon={<BsChevronDown />}>
              {selectedGrade || "Grade"}
            </MenuButton>
          </InputError>
          <MenuList>
            {grades.map((grade) => (
              <MenuItem
                key={grade}
                onClick={() => {
                  setSelectedGrade(grade);
                }}
              >
                {grade}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </FormControl>
    </VStack>
  );
};

export default StudentFormBody;
