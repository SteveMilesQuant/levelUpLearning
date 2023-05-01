import { Button, SimpleGrid, useDisclosure } from "@chakra-ui/react";
import BodyContainer from "../components/BodyContainer";
import PageHeader from "../components/PageHeader";
import useCamps, { useDeleteCamp } from "../camps/hooks/useCamps";
import CampCard from "../camps/components/CampCard";
import CampFormModal from "../camps/components/CampFormModal";

interface Props {
  forScheduling?: boolean;
}

const Camps = ({ forScheduling }: Props) => {
  const { data: camps, isLoading, error } = useCamps(forScheduling, undefined);
  const deleteCamp = useDeleteCamp();
  const {
    isOpen: newIsOpen,
    onOpen: newOnOpen,
    onClose: newOnClose,
  } = useDisclosure();

  if (isLoading) return null;
  if (error) throw error;

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
            onDelete={
              forScheduling ? () => deleteCamp.mutate(camp.id) : undefined
            }
          />
        ))}
      </SimpleGrid>
      {forScheduling && (
        <CampFormModal
          title="Add Camp"
          isOpen={newIsOpen}
          onClose={newOnClose}
        />
      )}
    </BodyContainer>
  );
};

export default Camps;
