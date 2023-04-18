import { SimpleGrid } from "@chakra-ui/react";
import BodyContainer from "../components/BodyContainer";
import PageHeader from "../components/PageHeader";
import useCamps from "../hooks/useCamps";
import CampCard from "../components/CampCard";

const Camps = () => {
  const { camps, error, isLoading, setError } = useCamps();

  return (
    <BodyContainer>
      <PageHeader label="Camps" />
      <SimpleGrid columns={{ sm: 1, md: 2, lg: 2, xl: 2 }} spacing={5}>
        {camps.map((camp) => (
          <CampCard camp={camp} />
        ))}
      </SimpleGrid>
    </BodyContainer>
  );
};

export default Camps;
