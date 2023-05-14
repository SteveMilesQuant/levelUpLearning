import {
  Tab,
  TabList,
  TabPanels,
  Tabs,
  useDisclosure,
  TabPanel,
  Button,
} from "@chakra-ui/react";
import PageHeader from "../components/PageHeader";
import useStudents from "../students/hooks/useStudents";
import { StudentPage, StudentFormModal } from "../students";

const Students = () => {
  const { data: students } = useStudents();
  const {
    isOpen: newIsOpen,
    onOpen: newOnOpen,
    onClose: newOnClose,
  } = useDisclosure();

  return (
    <>
      <PageHeader
        hideUnderline={true}
        rightButton={
          <Button size="lg" variant="outline" onClick={newOnOpen}>
            Add Student
          </Button>
        }
      >
        My Students
      </PageHeader>
      <Tabs variant="enclosed">
        <TabList>
          {students?.map((student) => (
            <Tab key={student.id}>{student.name}</Tab>
          ))}
        </TabList>
        <TabPanels>
          {students?.map((student) => (
            <TabPanel key={student.id}>
              <StudentPage student={student} />
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
      <StudentFormModal
        title="Add Student"
        isOpen={newIsOpen}
        onClose={newOnClose}
      />
    </>
  );
};

export default Students;
