import {
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  Box,
} from "@chakra-ui/react";
import { BsChevronDown } from "react-icons/bs";
import { User } from "../User";
import { useAddCampInstructor } from "../hooks/useCampInstructors";
import useUsers from "../hooks/useUsers";
import TextButton from "../../components/TextButton";

interface Props {
  campId: number;
  instructors: User[];
}

const AddInstructorMenu = ({ campId, instructors }: Props) => {
  const {
    data: allInstructors,
    isLoading,
    error,
  } = useUsers({ role: "INSTRUCTOR" });
  const addInstructor = useAddCampInstructor(campId);

  if (isLoading) return null;
  if (error) throw error;

  const addableInstructors = allInstructors?.filter(
    (instructor) => !instructors.find((i) => i.id === instructor.id)
  );
  if (!addableInstructors || addableInstructors.length === 0) return null;

  return (
    <Box>
      {/* Wrap menu in box to avoid warnings ("applying css to popover") */}
      <Menu>
        <MenuButton
          as={Button}
          bgColor="brand.buttonBg"
          rightIcon={<BsChevronDown />}
        >
          Add instructor
        </MenuButton>
        <MenuList bgColor="brand.buttonBg">
          {addableInstructors?.map((instructor) => (
            <MenuItem
              key={instructor.id}
              bgColor="brand.buttonBg"
              onClick={() => addInstructor.mutate(instructor.id)}
            >
              {instructor.full_name + " (" + instructor.email_address + ")"}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Box>
  );
};

export default AddInstructorMenu;
