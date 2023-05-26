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

const Camps = () => {
  const {
    isOpen: newIsOpen,
    onOpen: newOnOpen,
    onClose: newOnClose,
  } = useDisclosure();
  const campsContextType = useContext(CampsContext);
  const { data: user } = useUser();
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
      <CampGrid
        camps={camps}
        isReadOnly={campsContextType !== CampsContextType.schedule}
      />
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
