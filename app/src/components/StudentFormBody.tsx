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
import { BsChevronDown } from "react-icons/bs";
import ErrorMessage from "./ErrorMessage";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { Student } from "../services/student-service";

interface Props {
  haveSubmitted: boolean;
  selectedGrade: number;
  setSelectedGrade: (selectedGrade: number) => void;
  register: UseFormRegister<{ name: string }>;
  errors: FieldErrors<{ name: string }>;
  student?: Student;
}

const StudentFormBody = ({
  student,
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
        <Input {...register("name")} type="text" defaultValue={student?.name} />
      </FormControl>
      {errors.name && <ErrorMessage>{errors.name.message || ""}</ErrorMessage>}
      <FormControl>
        <FormLabel>Grade</FormLabel>
        <Menu>
          <MenuButton as={Button} rightIcon={<BsChevronDown />}>
            {selectedGrade || "Grade"}
          </MenuButton>
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
      {haveSubmitted && selectedGrade === 0 && (
        <ErrorMessage>Grade level is required.</ErrorMessage>
      )}
    </VStack>
  );
};

export default StudentFormBody;
