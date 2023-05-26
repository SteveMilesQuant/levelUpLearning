import { Box, Stack, LinkBox, Button } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { CampGrid } from "../../camps";
import PageHeader from "../../components/PageHeader";
import { Student } from "../Student";
import StudentForm from "./StudentForm";

interface Props {
  student: Student;
}

const StudentPage = ({ student }: Props) => {
  return (
    <Stack spacing={5}>
      <StudentForm student={student} />
      <Box>
        <PageHeader fontSize="2xl">Enrolled Camps</PageHeader>
        <CampGrid camps={student.camps} isReadOnly={true} />
        <Box marginY={5}>
          <LinkBox as={RouterLink} to="/camps">
            <Button size="lg" variant="outline">
              Find camps
            </Button>
          </LinkBox>
        </Box>
      </Box>
    </Stack>
  );
};

export default StudentPage;
