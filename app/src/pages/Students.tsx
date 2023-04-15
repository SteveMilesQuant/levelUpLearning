import { Grid, GridItem, useDisclosure } from "@chakra-ui/react";
import StudentList from "../components/StudentList";
import BodyContainer from "../components/BodyContainer";
import { useState } from "react";
import { Student } from "../services/student-service";
import CampList from "../components/CampList";
import StudentForm from "../components/StudentForm";

const Students = () => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const {
    isOpen: newIsOpen,
    onOpen: newOnOpen,
    onClose: newOnClose,
  } = useDisclosure();

  return (
    <>
      <Grid
        templateAreas={{
          base: `"students camps coguardians"`,
        }}
      >
        <GridItem area="students">
          <BodyContainer>
            <StudentList
              selectedStudent={selectedStudent}
              onSelectStudent={setSelectedStudent}
              onAddStudent={newOnOpen}
            />
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
      <StudentForm
        title="Add Student"
        isOpen={newIsOpen}
        onClose={newOnClose}
      />
    </>
  );
};

export default Students;
