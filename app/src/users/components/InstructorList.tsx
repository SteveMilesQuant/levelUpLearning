import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
} from "@chakra-ui/react";
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
      <Box>
        {/* Wrap menu in box to avoid warnings ("applying css to popover") */}
        <Menu autoSelect={true}>
          <MenuButton
            as={Button}
            bgColor="brand.buttonBg"
            rightIcon={<FaChevronDown />}
            _hover={{
              bgColor: "brand.hover"
            }}
          >
            {selectedInstructor.full_name}
          </MenuButton>
          <MenuList bgColor="brand.buttonBg">
            {instructors?.map((instructor) => (
              <MenuItem
                key={instructor.id}
                onClick={() => setSelectedInstructor(instructor)}
                bgColor="brand.buttonBg"
                _hover={{
                  bgColor: "brand.hover"
                }}
              >
                {instructor.full_name}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </Box>
      {!isReadOnly && (
        <AddInstructorMenu campId={campId} instructors={instructors} />
      )}
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
