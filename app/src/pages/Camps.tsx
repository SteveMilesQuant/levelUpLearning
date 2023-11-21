import { Button, useDisclosure } from "@chakra-ui/react";
import PageHeader from "../components/PageHeader";
import {
  CampFormModal,
  CampGrid,
  CampsContext,
  CampsContextType,
  useCamps,
  CampQuery,
} from "../camps";
import { useContext } from "react";
import { useUser } from "../users";
import BodyContainer from "../components/BodyContainer";

const Camps = () => {
  const campsContextType = useContext(CampsContext);
  const { data: user } = useUser();
  const {
    isOpen: newIsOpen,
    onOpen: newOnOpen,
    onClose: newOnClose,
  } = useDisclosure();

  const campQuery = {} as CampQuery;
  if (campsContextType !== CampsContextType.schedule)
    campQuery["is_published"] = true;
  if (campsContextType === CampsContextType.teach)
    campQuery["instructor_id"] = user?.id;
  const {
    data: camps,
    isLoading,
    error,
  } = useCamps(campQuery, campsContextType === CampsContextType.teach && !user);

  if (isLoading) return null;
  if (error) throw error;

  const pageTitle =
    campsContextType === CampsContextType.schedule
      ? "Schedule Camps"
      : campsContextType === CampsContextType.teach
      ? "Teach Camps"
      : "Camps";
  const isReadOnly = campsContextType !== CampsContextType.schedule;

  return (
    <BodyContainer>
      <PageHeader
        rightButton={
          !isReadOnly && (
            <Button size="md" variant="outline" onClick={newOnOpen}>
              Add Camp
            </Button>
          )
        }
      >
        {pageTitle}
      </PageHeader>
      <CampGrid camps={camps} isReadOnly={isReadOnly} />
      {!isReadOnly && (
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
