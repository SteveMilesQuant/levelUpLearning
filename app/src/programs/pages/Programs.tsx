import { SimpleGrid, useDisclosure, Button } from "@chakra-ui/react";
import BodyContainer from "../../components/BodyContainer";
import usePrograms from "../hooks/usePrograms";
import ProgramCard from "../components/ProgramCard";
import programService, { Program } from "../services/program-service";
import produce from "immer";
import PageHeader from "../../components/PageHeader";
import ProgramForm from "../components/ProgramForm";

const Programs = () => {
  const { programs, error, isLoading, setPrograms, setError } = usePrograms();
  const {
    isOpen: newIsOpen,
    onOpen: newOnOpen,
    onClose: newOnClose,
  } = useDisclosure();

  const handleDelete = (program: Program) => {
    const origPrograms = programs;
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

  const handleAdd = (program: Program) => {
    setPrograms(
      produce((draft) => {
        draft.push(program);
      })
    );
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
            program={program}
            onDelete={() => handleDelete(program)}
          />
        ))}
      </SimpleGrid>
      <ProgramForm
        title="Add Program"
        isOpen={newIsOpen}
        onClose={newOnClose}
        onSubmit={(program) => handleAdd(program)}
      />
    </BodyContainer>
  );
};

export default Programs;
