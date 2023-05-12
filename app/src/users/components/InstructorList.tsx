import {
  Box,
  Button,
  HStack,
  List,
  ListItem,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import ListButton from "../../components/ListButton";
import useInstructors, {
  useAddCampInstructor,
  useCampInstructors,
  useDeleteCampInstructor,
} from "../hooks/useInstructors";
import { useEffect, useState } from "react";
import { User } from "../User";
import InstructorFormBody from "./InstructorFormBody";
import { BsChevronDown } from "react-icons/bs";
import DeleteButton from "../../components/DeleteButton";
import { CampGetType } from "../../camps";

interface Props {
  campId?: number;
  campGetType?: CampGetType;
}

const InstructorList = ({ campId, campGetType }: Props) => {
  const { data: instructors, isLoading, error } = useCampInstructors(campId);
  const { data: allInstructors } = useInstructors();
  const deleteInstructor = useDeleteCampInstructor(campId);
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
        <List spacing={3}>
          {instructors?.map((instructor) => (
            <HStack key={instructor.id}>
              <ListButton
                isSelected={selectedInstructor?.id === instructor.id}
                onClick={() => setSelectedInstructor(instructor)}
              >
                {instructor.full_name}
              </ListButton>
              {campGetType === CampGetType.schedule && (
                <DeleteButton
                  onConfirm={() => deleteInstructor.mutate(instructor.id)}
                >
                  {instructor.full_name}
                </DeleteButton>
              )}
            </HStack>
          ))}
          {campGetType === CampGetType.schedule &&
            addableInstructors &&
            addableInstructors.length > 0 && (
              <ListItem>
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
              </ListItem>
            )}
        </List>
        <Box width="100%">
          {instructors
            ?.filter((instructor) => instructor.id === selectedInstructor?.id)
            .map((instructor) => (
              <InstructorFormBody
                key={instructor.id}
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
