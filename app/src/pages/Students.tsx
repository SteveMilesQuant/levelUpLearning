import { useState } from "react";
import { GridItem, LinkBox, Button, SimpleGrid } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { StudentList, Student } from "../students";
import CampList from "../camps/components/CampList";
import BodyContainer from "../components/BodyContainer";
import PageHeader from "../components/PageHeader";

const Students = () => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  return (
    <BodyContainer>
      <PageHeader label="Students"></PageHeader>
      <SimpleGrid columns={2} spacing={5}>
        <GridItem>
          <StudentList
            selectedStudent={selectedStudent}
            onSelectStudent={(student) => setSelectedStudent(student)}
          />
        </GridItem>
        <GridItem>
          {selectedStudent && (
            <CampList student={selectedStudent} marginBottom={5} />
          )}
          <LinkBox as={RouterLink} to="/camps">
            <Button size="lg" variant="outline">
              Find camps
            </Button>
          </LinkBox>
        </GridItem>
      </SimpleGrid>
    </BodyContainer>
  );
};

export default Students;
