import { useParams } from "react-router-dom";
import { Button, useDisclosure } from "@chakra-ui/react";
import PageHeader from "../components/PageHeader";
import {
  useCamp,
  CACHE_KEY_CAMPS,
  CampTabs,
  CampsContext,
  CampsContextType,
} from "../camps";
import { EnrollStudentModal } from "../students";
import { useUpdateCamp } from "../camps";
import { useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";
import AlertMessage from "../components/AlertMessage";
import { useUser } from "../users";
import BodyContainer from "../components/BodyContainer";

const Camp = () => {
  const { id: idStr } = useParams();
  const id = idStr ? parseInt(idStr) : undefined;
  const [alertContext, setAlertContext] = useState<
    undefined | { status: "error" | "success"; message: string }
  >(undefined);

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

  if (isLoading) return null;
  if (error) throw error;

  const headerButton =
    campsContextType === CampsContextType.schedule ? (
      <Button
        size="md"
        variant="outline"
        onClick={() => {
          updateCamp.mutate({
            ...camp,
            is_published: !camp.is_published,
          });
        }}
      >
        {camp.is_published ? "Unpublish" : "Publish"}
      </Button>
    ) : campsContextType === CampsContextType.camps ? (
      <Button
        size="md"
        variant="outline"
        onClick={newOnOpen}
        isDisabled={!user}
      >
        {user ? "Enroll Student" : "Sign in to enroll"}
      </Button>
    ) : undefined;

  return (
    <BodyContainer>
      {alertContext && (
        <AlertMessage
          status={alertContext.status}
          onClose={() => setAlertContext(undefined)}
        >
          {alertContext.message}
        </AlertMessage>
      )}
      <PageHeader hideUnderline={true} rightButton={headerButton}>
        {camp.program.title}
      </PageHeader>
      <CampTabs
        camp={camp}
        isReadOnly={campsContextType !== CampsContextType.schedule}
        showStudents={campsContextType !== CampsContextType.camps}
      />
      {campsContextType === CampsContextType.camps && user && (
        <EnrollStudentModal
          title="Enroll Student"
          campId={camp.id}
          gradeRange={camp.program.grade_range}
          isOpen={newIsOpen}
          onClose={newOnClose}
          onSuccess={(studentName) =>
            setAlertContext({
              status: "success",
              message: `Successfully enrolled ${studentName}.`,
            })
          }
          onError={(studentName) =>
            setAlertContext({
              status: "error",
              message: `Failed to enroll ${studentName}. Please try again.`,
            })
          }
        />
      )}
    </BodyContainer>
  );
};

export default Camp;
