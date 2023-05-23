import { Button, useDisclosure } from "@chakra-ui/react";
import PageHeader from "../components/PageHeader";
import { CampFormModal, CampGrid, CampsPageContext } from "../camps";

interface Props {
  campsPageContext: CampsPageContext;
}

const Camps = ({ campsPageContext }: Props) => {
  const {
    isOpen: newIsOpen,
    onOpen: newOnOpen,
    onClose: newOnClose,
  } = useDisclosure();

  const pageTitle =
    campsPageContext === CampsPageContext.schedule
      ? "Schedule Camps"
      : campsPageContext === CampsPageContext.teach
      ? "Teach Camps"
      : "Camps";

  return (
    <>
      <PageHeader
        rightButton={
          campsPageContext === CampsPageContext.schedule && (
            <Button size="lg" variant="outline" onClick={newOnOpen}>
              Add Camp
            </Button>
          )
        }
      >
        {pageTitle}
      </PageHeader>
      <CampGrid campsPageContext={campsPageContext} />
      {campsPageContext === CampsPageContext.schedule && (
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
