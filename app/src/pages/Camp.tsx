import { useParams } from "react-router-dom";
import { HStack, useDisclosure, Text } from "@chakra-ui/react";
import PageHeader from "../components/PageHeader";
import {
  useCamp,
  CACHE_KEY_CAMPS,
  CampTabs,
  CampsContext,
  CampsContextType,
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

const Camp = () => {
  const { id: idStr } = useParams();
  const id = idStr ? parseInt(idStr) : undefined;

  const { data: user } = useUser();

  const {
    isOpen: newIsOpen,
    onOpen: newOnOpen,
    onClose: newOnClose,
  } = useDisclosure();
  const queryClient = useQueryClient();
  const { data: camp, isLoading, error } = useCamp(id);
  const updateCamp = useUpdateCamp({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CACHE_KEY_CAMPS });
      queryClient.invalidateQueries({
        queryKey: [...CACHE_KEY_CAMPS, camp?.id.toString()],
      });
    },
  });
  const campsContextType = useContext(CampsContext);

  const {
    isOpen: addStudentIsOpen,
    onOpen: addStudentOnOpen,
    onClose: addStudentOnClose,
  } = useDisclosure();

  if (isLoading) return null;
  if (error) throw error;

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

  const currentCapacity = (camp.capacity || 0) - (camp.current_enrollment || 0);
  const campAtCapacity = currentCapacity <= 0;
  const capacityString = campAtCapacity
    ? undefined
    : currentCapacity === 1
      ? currentCapacity + " spot left!"
      : currentCapacity <= CAMP_CAPACITY_DISPLAY_THRESHOLD
        ? currentCapacity + " spots left!"
        : undefined;

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

  const isPublicFacing = (campsContextType === CampsContextType.publicFullDay || campsContextType === CampsContextType.publicHalfDay || campsContextType === CampsContextType.publicSingleDay);

  const headerButton =
    campsContextType === CampsContextType.schedule
      ? publishButton
      : isPublicFacing
        ? <HStack spacing={5}>{capacityString && <Text size="xl" fontWeight="bold" fontFamily="verdana" textColor="brand.tertiary">{capacityString}</Text>}{enrollButton}</HStack>
        : undefined;

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
