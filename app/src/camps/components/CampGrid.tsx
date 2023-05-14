import { SimpleGrid } from "@chakra-ui/react";
import useCamps, { CampGetType, useDeleteCamp } from "../hooks/useCamps";
import CampCard from "./CampCard";

interface Props {
  campGetType: CampGetType;
}

const CampGrid = ({ campGetType }: Props) => {
  const { data: camps, isLoading, error } = useCamps(campGetType);
  const deleteCamp = useDeleteCamp();

  if (isLoading) return null;
  if (error) throw error;

  return (
    <SimpleGrid columns={{ sm: 1, md: 2, lg: 2, xl: 2 }} spacing={5}>
      {camps.map((camp) => (
        <CampCard
          key={camp.id}
          camp={camp}
          onDelete={
            campGetType === CampGetType.schedule
              ? () => deleteCamp.mutate(camp.id)
              : undefined
          }
          campGetType={campGetType}
        />
      ))}
    </SimpleGrid>
  );
};

export default CampGrid;
