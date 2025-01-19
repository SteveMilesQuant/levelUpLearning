import { useParams } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/react";
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

  const enrollButton = camp.enrollment_disabled ?
    (undefined)
    : user ?
      (
        <TextButton onClick={newOnOpen}>Enroll Student</TextButton>
      ) : (
        <AuthButton bgColor="brand.buttonBg">Sign in to enroll</AuthButton>
      );

  const headerButton =
    campsContextType === CampsContextType.schedule
      ? publishButton
      : campsContextType === CampsContextType.camps
        ? enrollButton
        : undefined;

  return (
    <BodyContainer>
      <PageHeader hideUnderline={true} rightButton={headerButton}>
        {camp.program.title}
      </PageHeader>
      <CampTabs
        camp={camp}
        isReadOnly={campsContextType !== CampsContextType.schedule}
        isPublicFacing={campsContextType === CampsContextType.camps}
      />
      {campsContextType === CampsContextType.camps && user && (
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
    </BodyContainer>
  );
};

export default Camp;
