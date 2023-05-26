import { SimpleGrid } from "@chakra-ui/react";
import { useDeleteCamp } from "../hooks/useCamps";
import CampCard from "./CampCard";
import { Camp } from "../Camp";

interface Props {
  camps: Camp[];
  isReadOnly?: boolean;
}

const CampGrid = ({ camps, isReadOnly }: Props) => {
  const deleteCamp = useDeleteCamp();

  return (
    <SimpleGrid columns={{ sm: 1, md: 2, lg: 2, xl: 2 }} spacing={5}>
      {camps.map((camp) => (
        <CampCard
          key={camp.id}
          camp={camp}
          onDelete={isReadOnly ? undefined : () => deleteCamp.mutate(camp.id)}
        />
      ))}
    </SimpleGrid>
  );
};

export default CampGrid;
