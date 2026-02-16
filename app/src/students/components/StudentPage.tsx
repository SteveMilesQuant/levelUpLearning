import {
  Box,
  Stack,
  LinkBox,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { CampGrid } from "../../camps";
import { Student } from "../Student";
import StudentForm from "./StudentForm";
import TextButton from "../../components/TextButton";

interface Props {
  student: Student;
}

const StudentPage = ({ student }: Props) => {
  console.log(student);
  const hasPastCamps = student.student_camps.some(
    (c) =>
      c.dates &&
      c.dates.length > 0 &&
      new Date(c.dates[0] + "T00:00:00") <= new Date()
  );

  return (
    <Stack spacing={5}>
      <StudentForm student={student} />
      <Tabs variant="enclosed">
        <TabList>
          <Tab>
            <strong>Enrolled Camps</strong>
          </Tab>
          {hasPastCamps && (
            <Tab>
              <strong>Past Camps</strong>
            </Tab>
          )}
        </TabList>
        <TabPanels>
          <TabPanel>
            <CampGrid camps={student.student_camps} isReadOnly={true} showPastCamps={false} />
            <Box marginY={5}>
              <LinkBox as={RouterLink} to="/camps">
                <TextButton>Find camps</TextButton>
              </LinkBox>
            </Box>
          </TabPanel>
          {hasPastCamps && (
            <TabPanel>
              <CampGrid camps={student.student_camps} isReadOnly={true} showPastCamps={true} />
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </Stack>
  );
};

export default StudentPage;
