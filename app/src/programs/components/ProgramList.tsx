import { SimpleGrid } from "@chakra-ui/react";
import usePrograms from "../hooks/usePrograms";
import ProgramCard from "./ProgramCard";

const ProgramList = () => {
  const { data: programs, error, isLoading } = usePrograms();

  if (isLoading || !programs) return null;
  if (error) throw error;

  return (
    <SimpleGrid columns={{ sm: 1, md: 2, lg: 2, xl: 2 }} spacing={5}>
      {programs.map((program) => (
        <ProgramCard key={program.id} program={program} />
      ))}
    </SimpleGrid>
  );
};

export default ProgramList;
