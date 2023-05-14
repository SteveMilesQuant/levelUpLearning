import { Button, useDisclosure } from "@chakra-ui/react";
import PageHeader from "../components/PageHeader";
import { CampFormModal, CampGetType, CampGrid } from "../camps";

interface Props {
  campGetType: CampGetType;
}

const Camps = ({ campGetType }: Props) => {
  const {
    isOpen: newIsOpen,
    onOpen: newOnOpen,
    onClose: newOnClose,
  } = useDisclosure();

  const pageTitle =
    campGetType === CampGetType.schedule
      ? "Schedule Camps"
      : campGetType === CampGetType.teach
      ? "Teach Camps"
      : "Camps";

  return (
    <>
      <PageHeader
        rightButton={
          campGetType === CampGetType.schedule && (
            <Button size="lg" variant="outline" onClick={newOnOpen}>
              Add Camp
            </Button>
          )
        }
      >
        {pageTitle}
      </PageHeader>
      <CampGrid campGetType={campGetType} />
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
