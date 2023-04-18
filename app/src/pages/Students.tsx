import { useState } from "react";
import { Grid, GridItem, LinkBox, Button, Box } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import StudentList from "../components/StudentList";
import { Student } from "../services/student-service";
import CampList from "../components/CampList";
import BodyContainer from "../components/BodyContainer";

const Students = () => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  return (
    <BodyContainer>
      <Grid
        templateAreas={{
          base: `"students camps coguardians"`,
        }}
        gap={10}
      >
        <GridItem area="students">
          <StudentList
            selectedStudent={selectedStudent}
            onSelectStudent={(student) => setSelectedStudent(student)}
          />
        </GridItem>
        <GridItem area="camps">
          {selectedStudent && (
            <CampList student={selectedStudent} marginBottom={5} />
          )}
          <LinkBox as={RouterLink} to="/camps">
            <Button size="lg" variant="outline">
              Enroll in camp
            </Button>
          </LinkBox>
        </GridItem>
        <GridItem area="coguardians"></GridItem>
      </Grid>
    </BodyContainer>
  );
};

export default Students;
