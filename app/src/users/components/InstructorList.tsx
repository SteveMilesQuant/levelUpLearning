import { Box, HStack, List } from "@chakra-ui/react";
import ListButton from "../../components/ListButton";
import { useCampInstructors } from "../hooks/useInstructors";
import { useEffect, useState } from "react";
import { User } from "../User";

interface Props {
  campId?: number;
  forScheduling?: boolean;
}

const InstructorList = ({ campId, forScheduling }: Props) => {
  const { data: instructors, isLoading, error } = useCampInstructors(campId);

  const [selectedInstructor, setSelectedInstructor] = useState<
    User | undefined
  >(undefined);
  useEffect(() => {
    if (instructors) setSelectedInstructor(instructors[0]);
  }, [!!instructors]);

  if (isLoading) return null;
  if (error) throw error;

  return (
    <HStack alignItems="start" spacing={10}>
      <List spacing={3}>
        {instructors?.map((instructor) => (
          <ListButton
            key={instructor.id}
            isSelected={selectedInstructor?.id === instructor.id}
            onClick={() => setSelectedInstructor(instructor)}
          >
            {instructor.full_name}
          </ListButton>
        ))}
      </List>
      <Box width="100%">
        {instructors
          ?.filter((instructor) => instructor.id === selectedInstructor?.id)
          .map((instructor) => (
            <div key={instructor.id}>{instructor.email_address}</div>
          ))}
      </Box>
    </HStack>
  );
};

export default InstructorList;
