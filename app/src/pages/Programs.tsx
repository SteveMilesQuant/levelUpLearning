import { SimpleGrid, useDisclosure, Button } from "@chakra-ui/react";
import BodyContainer from "../components/BodyContainer";
import usePrograms from "../programs/hooks/usePrograms";
import ProgramCard from "../programs/components/ProgramCard";
import programService from "../programs/program-service";
import { Program } from "../programs/Program";
import produce from "immer";
import PageHeader from "../components/PageHeader";
import ProgramFormModal from "../programs/components/ProgramFormModal";

const Programs = () => {
  const { programs, error, isLoading, setPrograms, setError } = usePrograms();
  const {
    isOpen: newIsOpen,
    onOpen: newOnOpen,
    onClose: newOnClose,
  } = useDisclosure();

  const handleDelete = (program: Program) => {
    const origPrograms = [...programs];
    setPrograms(
      produce((draft) => {
        const index = draft.findIndex((s) => s.id === program.id);
        if (index >= 0) draft.splice(index, 1);
      })
    );
    programService.delete(program.id).catch(() => {
      setPrograms(origPrograms);
    });
  };

  return (
    <BodyContainer>
      <PageHeader label="Programs">
        <Button size="lg" variant="outline" onClick={newOnOpen}>
          Add Program
        </Button>
      </PageHeader>
      <SimpleGrid columns={{ sm: 1, md: 2, lg: 3, xl: 3 }} spacing={5}>
        {programs.map((program) => (
          <ProgramCard
            key={program.id}
            program={program}
            onDelete={() => handleDelete(program)}
          />
        ))}
      </SimpleGrid>
      <ProgramFormModal
        title="Add Program"
        isOpen={newIsOpen}
        onClose={newOnClose}
        programs={programs}
        setPrograms={setPrograms}
      />
    </BodyContainer>
  );
};

export default Programs;
