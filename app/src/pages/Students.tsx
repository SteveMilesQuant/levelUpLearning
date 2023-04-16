import { Grid, GridItem, useDisclosure } from "@chakra-ui/react";
import StudentList from "../components/StudentList";
import BodyContainer from "../components/BodyContainer";
import { useState } from "react";
import { Student } from "../services/student-service";
import CampList from "../components/CampList";
import StudentForm from "../components/StudentForm";

const Students = () => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  return (
    <>
      <Grid
        templateAreas={{
          base: `"students camps coguardians"`,
        }}
        paddingLeft={8}
        paddingTop={10}
        gap={10}
      >
        <GridItem area="students">
          <StudentList
            selectedStudent={selectedStudent}
            onSelectStudent={(student) => setSelectedStudent(student)}
          />
        </GridItem>
        <GridItem area="camps">
          {selectedStudent && <CampList student={selectedStudent} />}
        </GridItem>
        <GridItem area="coguardians"></GridItem>
      </Grid>
    </>
  );
};

export default Students;
