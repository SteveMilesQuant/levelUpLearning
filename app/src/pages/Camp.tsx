import { Navigate, useParams } from "react-router-dom";
import { HStack, useDisclosure, Text } from "@chakra-ui/react";
import PageHeader from "../components/PageHeader";
import {
  useCamp,
  CACHE_KEY_CAMPS,
  CampTabs,
  CampsContext,
  CampsContextType,
  Camp as CampObj
} from "../camps";
import { EnrollStudentModal, StudentFormModal } from "../students";
import { useUpdateCamp } from "../camps";
import { useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { useUser } from "../users";
import BodyContainer from "../components/BodyContainer";
import TextButton from "../components/TextButton";
import AuthButton from "../components/AuthButton";
import { CAMP_CAPACITY_DISPLAY_THRESHOLD } from "../camps/Camp";
import useAlert, { Alert } from "../hooks/useAlerts";

// Function: check context against camp type
// We have fullday, halfday, and singleday endpoints - make sure it matches the type of camp
const checkCampContext = (campsContextType: CampsContextType, camp: CampObj, setAlert: (alert?: Alert | undefined) => void) => {
  if (campsContextType === CampsContextType.publicFullDay) {
    if (camp.enroll_full_day_allowed === false) {
      setAlert({
        status: "error",
        message: `Camp with id=${camp.id} is not a full day week-long camp.`,
      });
      return <Navigate to="/camps/fullday" state={{ from: location }} replace />;
    }
  }
  else if (campsContextType === CampsContextType.publicHalfDay) {
    if (camp.enroll_half_day_allowed === false) {
      setAlert({
        status: "error",
        message: `Camp with id=${camp.id} is not a half day week-long camp.`,
      });
      return <Navigate to="/camps/halfday" state={{ from: location }} replace />;
    }
  }
  else if (campsContextType === CampsContextType.publicSingleDay) {
    if (!camp.single_day_only) {
      setAlert({
        status: "error",
        message: `Camp with id=${camp.id} is not a single day event.`,
      });
      return <Navigate to="/camps/singleday" state={{ from: location }} replace />;
    }
  }
  return undefined;
}

// Function: convert capacity to string for display
const capacityToString = (capacity: number) => {
  const campAtCapacity = capacity <= 0;
  const capacityString = campAtCapacity
    ? undefined
    : capacity === 1
      ? capacity + " spot left!"
      : capacity <= CAMP_CAPACITY_DISPLAY_THRESHOLD
        ? capacity + " spots left!"
        : undefined;
  return capacityString;
}

// Begin main object: Camp
const Camp = () => {
  // Context hooks
  const { id: idStr } = useParams();
  const id = idStr ? parseInt(idStr) : undefined;
  const campsContextType = useContext(CampsContext);

  // Data hooks
  const { data: user } = useUser();
  const { data: camp, isLoading, error } = useCamp(id);

  // Query hooks
  const {
    isOpen: newIsOpen,
    onOpen: newOnOpen,
    onClose: newOnClose,
  } = useDisclosure();
  const queryClient = useQueryClient();

  const updateCamp = useUpdateCamp({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CACHE_KEY_CAMPS });
      queryClient.invalidateQueries({
        queryKey: [...CACHE_KEY_CAMPS, camp?.id.toString()],
      });
    },
  });

  // Behavior hooks
  const {
    isOpen: addStudentIsOpen,
    onOpen: addStudentOnOpen,
    onClose: addStudentOnClose,
  } = useDisclosure();
  const { setAlert } = useAlert();

  // END OF HOOKS: check returns
  if (isLoading) return null;
  if (error) throw error;

  // Context check
  const checkCtx = checkCampContext(campsContextType, camp, setAlert);
  if (checkCtx) return checkCtx;

  // Local variables
  const isPublicFacing = (campsContextType === CampsContextType.publicFullDay || campsContextType === CampsContextType.publicHalfDay || campsContextType === CampsContextType.publicSingleDay);
  const currentCapacity = (camp.capacity || 0) - (camp.current_enrollment || 0);
  const campAtCapacity = currentCapacity <= 0;
  const capacityString = capacityToString(currentCapacity);

  // Conditional React objects
  const publishButton = (
    <TextButton
      onClick={() => {
        updateCamp.mutate({
          ...camp,
          is_published: !camp.is_published,
        });
      }}
    >
      {camp.is_published ? "Unpublish" : "Publish"}
    </TextButton>
  );
  const enrollButton = camp.enrollment_disabled ?
    (undefined)
    : campAtCapacity ?
      (<TextButton isDisabled={true}>Camp full</TextButton>)
      :
      user ?
        (
          <TextButton onClick={newOnOpen} isDisabled={campAtCapacity}>Register</TextButton>
        ) : (
          <AuthButton bgColor="brand.buttonBg" onSuccess={newOnOpen}>Register</AuthButton>
        );
  const headerButton =
    campsContextType === CampsContextType.schedule
      ? publishButton
      : isPublicFacing
        ? <HStack spacing={5}>{capacityString && <Text size="xl" fontWeight="bold" fontFamily="verdana" textColor="brand.tertiary">{capacityString}</Text>}{enrollButton}</HStack>
        : undefined;

  // Main React object build
  return (
    <BodyContainer>
      <PageHeader hideUnderline={true} rightButton={headerButton}>
        {camp.program.title}
      </PageHeader>
      <CampTabs
        camp={camp}
        isReadOnly={campsContextType !== CampsContextType.schedule}
        isPublicFacing={isPublicFacing}
      />
      <HStack>

        {isPublicFacing && user && (
          <>
            <EnrollStudentModal
              title="Enroll Student"
              camp={camp}
              campsContextType={campsContextType}
              gradeRange={camp.program.grade_range}
              isOpen={newIsOpen}
              onClose={newOnClose}
              onClickCreateStudent={addStudentOnOpen}
            />
            <StudentFormModal
              title="Add Student"
              isOpen={addStudentIsOpen}
              onClose={addStudentOnClose}
            />
          </>
        )}
      </HStack>
    </BodyContainer>
  );
};

export default Camp;
