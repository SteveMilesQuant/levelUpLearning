import BodyContainer from "../components/BodyContainer";
import PageHeader from "../components/PageHeader";
import { Text } from "@chakra-ui/react";

const DataRequest = () => {
  return (
    <BodyContainer>
      <PageHeader>Data requests</PageHeader>
      <Text>
        Please direct all requests for personal data via email to
        data-request@leveluplearningnc.com.
      </Text>
    </BodyContainer>
  );
};

export default DataRequest;
