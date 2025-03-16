import { HStack, useDisclosure } from "@chakra-ui/react";
import PageHeader from "../components/PageHeader";
import {
  CampFormModal,
  CampGrid,
  CampsContext,
  CampsContextType,
  useCamps,
  CampQuery,
} from "../camps";
import { useContext, useState } from "react";
import { useUser } from "../users";
import BodyContainer from "../components/BodyContainer";
import TextButton from "../components/TextButton";

const Camps = () => {
  const campsContextType = useContext(CampsContext);
  const { data: user } = useUser();
  const {
    isOpen: newIsOpen,
    onOpen: newOnOpen,
    onClose: newOnClose,
  } = useDisclosure();
  const [showPastCamps, setShowPastCamps] = useState(false);

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
        : "Upcoming Camps";
  const isReadOnly = campsContextType !== CampsContextType.schedule;

  const campList = camps.filter(
    (c) =>
      !c.dates ||
      c.dates.length === 0 ||
      (showPastCamps && new Date(c.dates[0] + "T00:00:00") <= new Date()) ||
      (!showPastCamps && new Date(c.dates[0] + "T00:00:00") > new Date())
  );

  return (
    <BodyContainer>
      <PageHeader
        rightButton={
          !isReadOnly && (
            <HStack justify="space-between" spacing={3}>
              {showPastCamps && (
                <TextButton onClick={() => setShowPastCamps(false)}>
                  Show future camps
                </TextButton>
              )}
              {!showPastCamps && (
                <TextButton onClick={() => setShowPastCamps(true)}>
                  Show past camps
                </TextButton>
              )}
              <TextButton onClick={newOnOpen}>Add Camp</TextButton>
            </HStack>
          )
        }
      >
        {pageTitle}
      </PageHeader>
      <CampGrid camps={campList} isReadOnly={isReadOnly} />
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
