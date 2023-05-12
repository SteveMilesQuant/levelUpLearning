import { useParams } from "react-router-dom";
import {
  Button,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
} from "@chakra-ui/react";
import PageHeader from "../components/PageHeader";
import { useCamp, LevelScheduleList, CACHE_KEY_CAMPS } from "../camps";
import { ProgramForm } from "../programs";
import { EnrollStudentModal, StudentTable } from "../students";
import { InstructorList } from "../users";
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

  return (
    <>
      <PageHeader label={camp?.program.title} hideUnderline={true}>
        {campGetType === CampGetType.schedule && (
          <Button
            size="lg"
            variant="outline"
            onClick={() => {
              updateCamp.mutate({ ...camp, is_published: !camp.is_published });
            }}
          >
            {camp.is_published ? "Unpublish" : "Publish"}
          </Button>
        )}
        {campGetType === CampGetType.camps && (
          <Button size="lg" variant="outline" onClick={newOnOpen}>
            Enroll Student
          </Button>
        )}
      </PageHeader>
      <Tabs variant="enclosed">
        <TabList>
          <Tab>Camp</Tab>
          <Tab>Levels</Tab>
          <Tab>Instructors</Tab>
          {campGetType !== CampGetType.camps && <Tab>Students</Tab>}
        </TabList>
        <TabPanels>
          <TabPanel>
            <ProgramForm program={camp?.program} isReadOnly={true} />
          </TabPanel>
          <TabPanel>
            <LevelScheduleList campId={camp.id} campGetType={campGetType} />
          </TabPanel>
          <TabPanel>
            <InstructorList campId={camp.id} campGetType={campGetType} />
          </TabPanel>
          {campGetType !== CampGetType.camps && (
            <TabPanel>
              <StudentTable campId={camp.id} campGetType={campGetType} />
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
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
