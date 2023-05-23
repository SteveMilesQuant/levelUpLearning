import { Button, useDisclosure } from "@chakra-ui/react";
import PageHeader from "../components/PageHeader";
import {
  CampFormModal,
  CampGrid,
  CampsContext,
  CampsContextType,
} from "../camps";
import { useContext } from "react";

const Camps = () => {
  const {
    isOpen: newIsOpen,
    onOpen: newOnOpen,
    onClose: newOnClose,
  } = useDisclosure();
  const campsContextType = useContext(CampsContext);

  const pageTitle =
    campsContextType === CampsContextType.schedule
      ? "Schedule Camps"
      : campsContextType === CampsContextType.teach
      ? "Teach Camps"
      : "Camps";

  return (
    <>
      <PageHeader
        rightButton={
          campsContextType === CampsContextType.schedule && (
            <Button size="lg" variant="outline" onClick={newOnOpen}>
              Add Camp
            </Button>
          )
        }
      >
        {pageTitle}
      </PageHeader>
      <CampGrid />
      {campsContextType === CampsContextType.schedule && (
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
