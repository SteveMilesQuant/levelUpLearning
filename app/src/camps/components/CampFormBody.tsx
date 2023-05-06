import { FormControl, FormLabel, SimpleGrid } from "@chakra-ui/react";
import { Program } from "../../programs";
import { User } from "../../services/user-service";

interface Props {
  selectedProgram?: Program;
  setSelectedProgram: (program?: Program) => void;
  selectedInstructor?: User;
  setSelectedInstructor: (user?: User) => void;
  isReadOnly?: boolean;
}

const CampFormBody = ({
  selectedProgram,
  setSelectedProgram,
  selectedInstructor,
  setSelectedInstructor,
  isReadOnly,
}: Props) => {
  return (
    <SimpleGrid columns={1} gap={5}>
      <FormControl>
        <FormLabel>Program</FormLabel>
      </FormControl>
      <FormControl>
        <FormLabel>Instructor</FormLabel>
      </FormControl>
    </SimpleGrid>
  );
};

export default CampFormBody;
