import { Box, SimpleGrid, LinkBox, Button } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { CampList } from "../../camps";
import PageHeader from "../../components/PageHeader";
import { Student } from "../Student";
import StudentForm from "./StudentForm";

interface Props {
  student: Student;
}

const StudentPage = ({ student }: Props) => {
  return (
    <>
      <SimpleGrid columns={1} spacing={5}>
        <StudentForm student={student} />
        <Box>
          <PageHeader label="Enrolled Camps" fontSize="2xl" />
          <CampList studentId={student.id} />
          <Box marginY={5}>
            <LinkBox as={RouterLink} to="/camps">
              <Button size="lg" variant="outline">
                Find camps
              </Button>
            </LinkBox>
          </Box>
        </Box>
      </SimpleGrid>
    </>
  );
};

export default StudentPage;
