import { Button, SimpleGrid, useDisclosure } from "@chakra-ui/react";
import PageHeader from "../components/PageHeader";
import {
  useCamps,
  useDeleteCamp,
  CampCard,
  CampFormModal,
  CampGetType,
} from "../camps";

interface Props {
  campGetType: CampGetType;
}

const Camps = ({ campGetType }: Props) => {
  const { data: camps, isLoading, error } = useCamps(campGetType);
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
      <PageHeader
        label={
          campGetType === CampGetType.schedule ? "Schedule Camps" : "Camps"
        }
      >
        {campGetType === CampGetType.schedule && (
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
              campGetType === CampGetType.schedule
                ? () => deleteCamp.mutate(camp.id)
                : undefined
            }
            campGetType={campGetType}
          />
        ))}
      </SimpleGrid>
      {campGetType === CampGetType.schedule && (
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
