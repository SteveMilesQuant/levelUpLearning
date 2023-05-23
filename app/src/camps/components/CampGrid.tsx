import { SimpleGrid } from "@chakra-ui/react";
import useCamps, { CampQuery, useDeleteCamp } from "../hooks/useCamps";
import CampCard from "./CampCard";
import { useUser } from "../../users";
import { useContext } from "react";
import CampsContext, { CampsContextType } from "../campsContext";

const CampGrid = () => {
  const { data: user } = useUser();
  const campQuery = {} as CampQuery;
  const campsContextType = useContext(CampsContext);
  if (campsContextType !== CampsContextType.schedule)
    campQuery["is_published"] = true;
  if (campsContextType === CampsContextType.teach)
    campQuery["instructor_id"] = user?.id;
  const {
    data: camps,
    isLoading,
    error,
  } = useCamps(campQuery, campsContextType === CampsContextType.teach && !user);
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
            campsContextType === CampsContextType.schedule
              ? () => deleteCamp.mutate(camp.id)
              : undefined
          }
        />
      ))}
    </SimpleGrid>
  );
};

export default CampGrid;
