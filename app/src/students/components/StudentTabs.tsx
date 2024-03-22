import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@chakra-ui/react";
import StudentPage from "./StudentPage";
import useStudents from "../hooks/useStudents";

const StudentTabs = () => {
  const { data: students } = useStudents();

  return (
    <Tabs variant="enclosed">
      <TabList>
        {students?.map((student) => (
          <Tab key={student.id}>
            <strong>{student.name}</strong>
          </Tab>
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
  );
};

export default StudentTabs;
