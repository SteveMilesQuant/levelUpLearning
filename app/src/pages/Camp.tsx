import { useParams } from "react-router-dom";
import { Button, useDisclosure } from "@chakra-ui/react";
import PageHeader from "../components/PageHeader";
import { useCamp, CACHE_KEY_CAMPS, CampTabs } from "../camps";
import { EnrollStudentModal } from "../students";
import { CampGetType, useUpdateCamp } from "../camps/hooks/useCamps";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  campGetType: CampGetType;
}

const Camp = ({ campGetType }: Props) => {
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
    campGetType === CampGetType.schedule ? (
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
    ) : campGetType === CampGetType.camps ? (
      <Button size="lg" variant="outline" onClick={newOnOpen}>
        Enroll Student
      </Button>
    ) : undefined;

  return (
    <>
      <PageHeader hideUnderline={true} rightButton={headerButton}>
        {camp?.program.title}
      </PageHeader>
      <CampTabs campGetType={campGetType} camp={camp} />
      {campGetType === CampGetType.camps && (
        <EnrollStudentModal
          title="Enroll Student"
          campId={camp?.id}
          isOpen={newIsOpen}
          onClose={newOnClose}
        />
      )}
    </>
  );
};

export default Camp;
