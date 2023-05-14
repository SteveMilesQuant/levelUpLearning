import {
  Box,
  Button,
  HStack,
  Stack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import ListButton from "../../components/ListButton";
import useInstructors, {
  useAddCampInstructor,
  useCampInstructors,
} from "../hooks/useInstructors";
import { useEffect, useState } from "react";
import { User } from "../User";
import InstructorForm from "./InstructorForm";
import { BsChevronDown } from "react-icons/bs";
import { CampGetType } from "../../camps";

interface Props {
  campId?: number;
  campGetType?: CampGetType;
}

const InstructorList = ({ campId, campGetType }: Props) => {
  const { data: instructors, isLoading, error } = useCampInstructors(campId);
  const { data: allInstructors } = useInstructors();
  const addInstructor = useAddCampInstructor(campId);

  const [selectedInstructor, setSelectedInstructor] = useState<
    User | undefined
  >(undefined);
  useEffect(() => {
    if (instructors) setSelectedInstructor(instructors[0]);
  }, [!!instructors]);

  if (isLoading) return null;
  if (error) throw error;

  const addableInstructors = allInstructors?.filter(
    (instructor) => !instructors.find((i) => i.id === instructor.id)
  );

  return (
    <>
      <HStack alignItems="start" spacing={10}>
        <Stack spacing={3}>
          {instructors?.map((instructor) => (
            <HStack key={instructor.id}>
              <ListButton
                isSelected={selectedInstructor?.id === instructor.id}
                onClick={() => setSelectedInstructor(instructor)}
              >
                {instructor.full_name}
              </ListButton>
            </HStack>
          ))}
          {campGetType === CampGetType.schedule &&
            addableInstructors &&
            addableInstructors.length > 0 && (
              <Box>
                {/* Wrap menu in box to avoid warnings ("applying css to popover") */}
                <Menu>
                  <MenuButton as={Button} rightIcon={<BsChevronDown />}>
                    Add instructor
                  </MenuButton>
                  <MenuList>
                    {addableInstructors?.map((instructor) => (
                      <MenuItem
                        key={instructor.id}
                        onClick={() => addInstructor.mutate(instructor.id)}
                      >
                        {instructor.full_name +
                          " (" +
                          instructor.email_address +
                          ")"}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              </Box>
            )}
        </Stack>
        <Box width="100%">
          {instructors
            ?.filter((instructor) => instructor.id === selectedInstructor?.id)
            .map((instructor) => (
              <InstructorForm
                key={instructor.id}
                campId={campId}
                instructor={instructor}
                isReadOnly={campGetType !== CampGetType.schedule}
              />
            ))}
        </Box>
      </HStack>
    </>
  );
};

export default InstructorList;
