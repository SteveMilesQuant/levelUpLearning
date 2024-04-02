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
  const futureCamps = student.camps.filter(
    (c) =>
      c.dates &&
      c.dates.length > 0 &&
      new Date(c.dates[0] + "T00:00:00") > new Date()
  );

  const pastCamps = student.camps.filter(
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
          {pastCamps.length > 0 && (
            <Tab>
              <strong>Past Camps</strong>
            </Tab>
          )}
        </TabList>
        <TabPanels>
          <TabPanel>
            <CampGrid camps={futureCamps} isReadOnly={true} />
            <Box marginY={5}>
              <LinkBox as={RouterLink} to="/camps">
                <TextButton>Find camps</TextButton>
              </LinkBox>
            </Box>
          </TabPanel>
          {pastCamps.length > 0 && (
            <TabPanel>
              <CampGrid camps={pastCamps} isReadOnly={true} />
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </Stack>
  );
};

export default StudentPage;
