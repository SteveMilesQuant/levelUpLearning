import { Box, HStack, Stack } from "@chakra-ui/react";
import ListButton from "../../components/ListButton";
import {
  useCampInstructors,
  useDeleteCampInstructor,
} from "../hooks/useCampInstructors";
import { useEffect, useState } from "react";
import { User } from "../User";
import InstructorForm from "./InstructorForm";
import AddInstructorMenu from "./AddInstructorMenu";
import { CampsPageContext } from "../../camps";

interface Props {
  campId: number;
  campsPageContext?: CampsPageContext;
}

const InstructorList = ({ campId, campsPageContext }: Props) => {
  const { data: instructors, isLoading, error } = useCampInstructors(campId);
  const deleteInstructor = useDeleteCampInstructor(campId);

  const [selectedInstructor, setSelectedInstructor] = useState({} as User);
  useEffect(() => {
    if (instructors) setSelectedInstructor(instructors[0]);
  }, [!!instructors]);

  if (isLoading) return null;
  if (error) throw error;

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
          {campsPageContext === CampsPageContext.schedule && (
            <AddInstructorMenu campId={campId} instructors={instructors} />
          )}
        </Stack>
        <Box width="100%">
          {instructors
            ?.filter((instructor) => instructor.id === selectedInstructor?.id)
            .map((instructor) => (
              <InstructorForm
                key={instructor.id}
                instructor={instructor}
                isReadOnly={true}
                deleteInstructor={
                  campsPageContext === CampsPageContext.schedule
                    ? deleteInstructor
                    : undefined
                }
              />
            ))}
        </Box>
      </HStack>
    </>
  );
};

export default InstructorList;
