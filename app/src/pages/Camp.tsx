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
import { useCamp, LevelScheduleList } from "../camps";
import { ProgramForm } from "../programs";
import { EnrollStudentModal } from "../students";
import { InstructorList } from "../users";

interface Props {
  forScheduling: boolean;
}

const Camp = ({ forScheduling }: Props) => {
  const { id: idStr } = useParams();
  const id = idStr ? parseInt(idStr) : undefined;

  const {
    isOpen: newIsOpen,
    onOpen: newOnOpen,
    onClose: newOnClose,
  } = useDisclosure();
  const { data: camp, isLoading, error } = useCamp(id, false);

  if (isLoading) return null;
  if (error) throw error;

  return (
    <>
      <PageHeader label={camp?.program.title} hideUnderline={true}>
        {!forScheduling && (
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
        </TabList>
        <TabPanels>
          <TabPanel>
            <ProgramForm program={camp?.program} isReadOnly={true} />
          </TabPanel>
          <TabPanel>
            <LevelScheduleList campId={camp.id} forScheduling={forScheduling} />
          </TabPanel>
          <TabPanel>
            <InstructorList campId={camp.id} forScheduling={forScheduling} />
          </TabPanel>
        </TabPanels>
      </Tabs>
      <EnrollStudentModal
        title="Enroll Student"
        campId={camp?.id}
        isOpen={newIsOpen}
        onClose={newOnClose}
      />
    </>
  );
};

export default Camp;
