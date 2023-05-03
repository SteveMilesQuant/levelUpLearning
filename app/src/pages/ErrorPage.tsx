import { Heading, Text } from "@chakra-ui/react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import BodyContainer from "../components/BodyContainer";

const ErrorPage = () => {
  const error = useRouteError();
  return (
    <BodyContainer>
      <Heading>ErrorPage</Heading>
      <Text>
        {isRouteErrorResponse(error) ? "Invalid page" : "Unexpected error."}
      </Text>
    </BodyContainer>
  );
};

export default ErrorPage;
