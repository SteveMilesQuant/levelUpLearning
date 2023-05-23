import { useParams } from "react-router-dom";
import { Button, useDisclosure } from "@chakra-ui/react";
import PageHeader from "../components/PageHeader";
import { useCamp, CACHE_KEY_CAMPS, CampTabs } from "../camps";
import { EnrollStudentModal } from "../students";
import { CampsPageContext, useUpdateCamp } from "../camps";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  campsPageContext: CampsPageContext;
}

const Camp = ({ campsPageContext }: Props) => {
  const { id: idStr } = useParams();
  const id = idStr ? parseInt(idStr) : undefined;

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

  if (isLoading) return null;
  if (error) throw error;

  const headerButton =
    campsPageContext === CampsPageContext.schedule ? (
      <Button
        size="lg"
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
    ) : campsPageContext === CampsPageContext.camps ? (
      <Button size="lg" variant="outline" onClick={newOnOpen}>
        Enroll Student
      </Button>
    ) : undefined;

  return (
    <>
      <PageHeader hideUnderline={true} rightButton={headerButton}>
        {camp.program.title}
      </PageHeader>
      <CampTabs campsPageContext={campsPageContext} camp={camp} />
      {campsPageContext === CampsPageContext.camps && (
        <EnrollStudentModal
          title="Enroll Student"
          campId={camp.id}
          isOpen={newIsOpen}
          onClose={newOnClose}
        />
      )}
    </>
  );
};

export default Camp;
