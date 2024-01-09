import {
  Box,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
} from "@chakra-ui/react";
import ListButton from "../../components/ListButton";
import {
  useCampInstructors,
  useDeleteCampInstructor,
} from "../hooks/useCampInstructors";
import { useEffect, useState } from "react";
import { User } from "../User";
import InstructorForm from "./InstructorForm";
import AddInstructorMenu from "./AddInstructorMenu";
import { FaChevronDown } from "react-icons/fa";

interface Props {
  campId: number;
  isPublicFacing?: boolean;
  isReadOnly?: boolean;
}

const InstructorList = ({ campId, isPublicFacing, isReadOnly }: Props) => {
  const { data: instructors, isLoading, error } = useCampInstructors(campId);
  const deleteInstructor = useDeleteCampInstructor(campId);

  const [selectedInstructor, setSelectedInstructor] = useState({} as User);
  useEffect(() => {
    if (instructors) setSelectedInstructor(instructors[0]);
  }, [!!instructors]);

  if (isLoading) return null;
  if (error) throw error;

  return (
    <Stack spacing={5}>
      <Menu autoSelect={true}>
        <MenuButton as={Button} rightIcon={<FaChevronDown />}>
          {selectedInstructor.full_name}
        </MenuButton>
        <MenuList>
          {instructors?.map((instructor) => (
            <MenuItem
              key={instructor.id}
              onClick={() => setSelectedInstructor(instructor)}
            >
              {instructor.full_name}
            </MenuItem>
          ))}
          {!isReadOnly && (
            <AddInstructorMenu campId={campId} instructors={instructors} />
          )}
        </MenuList>
      </Menu>
      <Box width="100%">
        {instructors
          ?.filter((instructor) => instructor.id === selectedInstructor?.id)
          .map((instructor) => (
            <InstructorForm
              key={instructor.id}
              instructor={instructor}
              isPublicFacing={isPublicFacing}
              isReadOnly={true}
              deleteInstructor={!isReadOnly ? deleteInstructor : undefined}
            />
          ))}
      </Box>
    </Stack>
  );
};

export default InstructorList;
