import {
  Tab,
  TabList,
  TabPanels,
  Tabs,
  Box,
  useDisclosure,
  TabPanel,
} from "@chakra-ui/react";
import PageHeader from "../components/PageHeader";
import useStudents from "../students/hooks/useStudents";
import ActionButton from "../components/ActionButton";
import { IoMdAddCircleOutline } from "react-icons/io";
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
      <PageHeader label="My Students" hideUnderline={true}></PageHeader>
      <Tabs variant="enclosed">
        <TabList>
          {students?.map((student) => (
            <Tab key={student.id}>{student.name}</Tab>
          ))}
          <Box padding="4px">
            <ActionButton
              Component={IoMdAddCircleOutline}
              label="Add student"
              onClick={newOnOpen}
            />
          </Box>
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
