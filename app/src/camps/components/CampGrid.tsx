import { SimpleGrid } from "@chakra-ui/react";
import useCamps, { CampQuery, useDeleteCamp } from "../hooks/useCamps";
import CampCard from "./CampCard";
import { CampsPageContext } from "../Camp";
import { useUser } from "../../users";

interface Props {
  campsPageContext: CampsPageContext;
}

const CampGrid = ({ campsPageContext }: Props) => {
  const { data: user } = useUser();
  const campQuery = {} as CampQuery;
  if (campsPageContext !== CampsPageContext.schedule)
    campQuery["is_published"] = true;
  if (campsPageContext === CampsPageContext.teach)
    campQuery["instructor_id"] = user?.id;
  const {
    data: camps,
    isLoading,
    error,
  } = useCamps(campQuery, campsPageContext === CampsPageContext.teach && !user);
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
            campsPageContext === CampsPageContext.schedule
              ? () => deleteCamp.mutate(camp.id)
              : undefined
          }
          campsPageContext={campsPageContext}
        />
      ))}
    </SimpleGrid>
  );
};

export default CampGrid;
