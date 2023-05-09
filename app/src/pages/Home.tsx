import { SimpleGrid, Icon, Text, Container } from "@chakra-ui/react";
import { IoConstructOutline } from "react-icons/io5";

const Home = () => {
  return (
    <SimpleGrid columns={1} spacing={5}>
      <Container centerContent>
        <Icon as={IoConstructOutline} boxSize="200px" />
      </Container>
      <Container centerContent>
        <Text fontSize="xl">
          Welcome to Level Up Writing! We are currently under construction, but
          feel free to log in with Google and peruse the site. We are on a
          temporary SQL server, so your information will be deleted at some
          point, but if you need it done sooner, email Steve at
          steven.miles.quant@gmail.com.
        </Text>
      </Container>
    </SimpleGrid>
  );
};

export default Home;
