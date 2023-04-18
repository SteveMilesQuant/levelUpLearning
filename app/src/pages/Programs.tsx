import { Button, Divider, Heading, SimpleGrid, HStack } from "@chakra-ui/react";
import BodyContainer from "../components/BodyContainer";
import usePrograms from "../hooks/usePrograms";
import ProgramCard from "../components/ProgramCard";
import programService, { Program } from "../services/program-service";
import produce from "immer";
import PageHeader from "../components/PageHeader";

const Programs = () => {
  const { programs, error, isLoading, setPrograms, setError } = usePrograms();

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
    console.log(program);
  };

  return (
    <BodyContainer>
      <PageHeader label="Programs"></PageHeader>
      <SimpleGrid columns={{ sm: 1, md: 2, lg: 3, xl: 3 }} spacing={5}>
        {programs.map((program) => (
          <ProgramCard
            program={program}
            onDelete={() => handleDelete(program)}
          />
        ))}
      </SimpleGrid>
    </BodyContainer>
  );
};

export default Programs;
