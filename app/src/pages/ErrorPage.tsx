import { Heading, Text } from "@chakra-ui/react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();
  return (
    <>
      <Heading>ErrorPage</Heading>
      <Text>
        {isRouteErrorResponse(error) ? "Invalid page" : "Unexpected error."}
      </Text>
    </>
  );
};

export default ErrorPage;
