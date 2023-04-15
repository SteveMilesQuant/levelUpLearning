import { Grid, GridItem } from "@chakra-ui/react";
import StudentList from "../components/StudentList";
import BodyContainer from "../components/BodyContainer";
import { useState } from "react";
import { Student } from "../services/student-service";
import CampList from "../components/CampList";

const Students = () => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  return (
    <Grid
      templateAreas={{
        base: `"students camps coguardians"`,
      }}
    >
      <GridItem area="students">
        <BodyContainer>
          <StudentList onSelectStudent={setSelectedStudent} />
        </BodyContainer>
      </GridItem>
      <GridItem area="camps">
        <BodyContainer>
          {selectedStudent && <CampList student={selectedStudent} />}
        </BodyContainer>
      </GridItem>
      <GridItem area="coguardians">
        <BodyContainer></BodyContainer>
      </GridItem>
    </Grid>
  );
};

export default Students;
