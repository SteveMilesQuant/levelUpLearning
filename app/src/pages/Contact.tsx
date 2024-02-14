import { Heading, Stack, Text } from "@chakra-ui/react";
import BodyContainer from "../components/BodyContainer";

const Contact = () => {
  return (
    <BodyContainer>
      <Stack textAlign="center" spacing={5}>
        <Heading fontSize="lg">
          Megan and Karen would love to hear from you! Please reach out if you
          have any questions!
        </Heading>
        <Text>Email: support@leveluplearningnc.com </Text>
        <Text>Phone: (919) 439-0924</Text>
        <Text>
          Location: As a new small business, we are currently working toward
          attaining a permanent establishment in the Apex area. For now, we are
          renting out spaces from local venues including the Apex Campus at Hope
          Community Church and Apex Baptist Church.
        </Text>
      </Stack>
    </BodyContainer>
  );
};

export default Contact;
