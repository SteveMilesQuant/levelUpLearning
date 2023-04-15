import { Grid, GridItem } from "@chakra-ui/react";
import StudentList from "../components/StudentList";
import BodyContainer from "../components/BodyContainer";

const Students = () => {
  return (
    <Grid
      templateAreas={{
        base: `"students camps coguardians"`,
      }}
    >
      <GridItem area="students">
        <BodyContainer>
          <StudentList />
        </BodyContainer>
      </GridItem>
      <GridItem area="camps">
        <BodyContainer>Camps</BodyContainer>
      </GridItem>
      <GridItem area="coguardians">
        <BodyContainer>Co-guardians</BodyContainer>
      </GridItem>
    </Grid>
  );
};

export default Students;
