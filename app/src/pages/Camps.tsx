import { HStack, useDisclosure } from "@chakra-ui/react";
import PageHeader from "../components/PageHeader";
import {
  CampFormModal,
  CampsContext,
  CampsContextType,
  CampQuery,
} from "../camps";
import { useContext, useState } from "react";
import { useUser } from "../users";
import BodyContainer from "../components/BodyContainer";
import TextButton from "../components/TextButton";
import CampsQuery from "../camps/components/CampsQuery";

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
  if (campsContextType === CampsContextType.publicSingleDay) {
    campQuery["single_day_only"] = true;
  }
  else if (campsContextType === CampsContextType.publicFullDay) {
    campQuery["enroll_full_day_allowed"] = true;
    campQuery["single_day_only"] = false;
  }
  else if (campsContextType === CampsContextType.publicHalfDay) {
    campQuery["enroll_half_day_allowed"] = true;
    campQuery["single_day_only"] = false;
  }
  else if (campsContextType === CampsContextType.teach)
    campQuery["instructor_id"] = user?.id;

  if (campsContextType !== CampsContextType.schedule)
    campQuery["is_published"] = true;


  const pageTitle =
    campsContextType === CampsContextType.schedule
      ? "Schedule Camps"
      : campsContextType === CampsContextType.teach
        ? "Teach Camps"
        : campsContextType === CampsContextType.publicFullDay
          ?
          "Upcoming Full Day Camps"
          : campsContextType === CampsContextType.publicHalfDay
            ?
            "Upcoming Half Day Camps"
            : campsContextType === CampsContextType.publicSingleDay
              ?
              "Upcoming Single Day Events"
              : "";
  const isReadOnly = campsContextType !== CampsContextType.schedule;
  const disableQuery = campsContextType === CampsContextType.teach && !user;

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
      <CampsQuery campQuery={campQuery} isReadOnly={isReadOnly} showPastCamps={showPastCamps} disableQuery={disableQuery} />
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
