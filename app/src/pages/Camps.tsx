import { Button, SimpleGrid, useDisclosure } from "@chakra-ui/react";
import BodyContainer from "../components/BodyContainer";
import PageHeader from "../components/PageHeader";
import useCamps from "../camps/hooks/useCamps";
import CampCard from "../camps/components/CampCard";
import produce from "immer";
import { Camp, scheduleCampService } from "../camps/services/camp-service";
import CampFormModal from "../camps/components/CampFormModal";

interface Props {
  forScheduling?: boolean;
}

const Camps = ({ forScheduling }: Props) => {
  const { camps, error, isLoading, setCamps, setError } = useCamps({
    forScheduling,
  });
  const {
    isOpen: newIsOpen,
    onOpen: newOnOpen,
    onClose: newOnClose,
  } = useDisclosure();

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
      <PageHeader label={forScheduling ? "Schedule Camps" : "Camps"}>
        {forScheduling && (
          <Button size="lg" variant="outline" onClick={newOnOpen}>
            Add Camp
          </Button>
        )}
      </PageHeader>
      <SimpleGrid columns={{ sm: 1, md: 2, lg: 2, xl: 2 }} spacing={5}>
        {camps.map((camp) => (
          <CampCard
            key={camp.id}
            camp={camp}
            onDelete={forScheduling ? () => handleDelete(camp) : undefined}
          />
        ))}
      </SimpleGrid>
      {forScheduling && (
        <CampFormModal
          title="Add Camp"
          isOpen={newIsOpen}
          onClose={newOnClose}
          camps={camps}
          setCamps={setCamps}
        />
      )}
    </BodyContainer>
  );
};

export default Camps;
