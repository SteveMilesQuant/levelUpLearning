import { Button, SimpleGrid, useDisclosure } from "@chakra-ui/react";
import PageHeader from "../components/PageHeader";
import { useCamps, useDeleteCamp, CampCard, CampFormModal } from "../camps";

interface Props {
  forScheduling: boolean;
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
    <>
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
            forScheduling={forScheduling}
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
    </>
  );
};

export default Camps;
