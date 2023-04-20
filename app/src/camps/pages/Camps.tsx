import { SimpleGrid } from "@chakra-ui/react";
import BodyContainer from "../../components/BodyContainer";
import PageHeader from "../../components/PageHeader";
import useCamps from "../hooks/useCamps";
import CampCard from "../components/CampCard";
import produce from "immer";
import { Camp, scheduleCampService } from "../services/camp-service";

interface Props {
  forScheduling?: boolean;
}

const Camps = ({ forScheduling }: Props) => {
  const { camps, error, isLoading, setCamps, setError } = useCamps({
    forScheduling,
  });

  const handleDelete = (camp: Camp) => {
    const origPrograms = [...camps];
    setCamps(
      produce((draft) => {
        const index = draft.findIndex((s) => s.id === camp.id);
        if (index >= 0) draft.splice(index, 1);
      })
    );
    scheduleCampService.delete(camp.id).catch(() => {
      setCamps(origPrograms);
    });
  };

  return (
    <BodyContainer>
      <PageHeader label={forScheduling ? "Schedule Camps" : "Camps"} />
      <SimpleGrid columns={{ sm: 1, md: 2, lg: 2, xl: 2 }} spacing={5}>
        {camps.map((camp) => (
          <CampCard
            camp={camp}
            onDelete={forScheduling ? () => handleDelete(camp) : undefined}
          />
        ))}
      </SimpleGrid>
    </BodyContainer>
  );
};

export default Camps;
