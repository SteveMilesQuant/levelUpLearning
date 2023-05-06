import { Heading, Text } from "@chakra-ui/react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();
  return (
    <>
      <Heading>Oops...</Heading>
      <Text marginY={5}>
        {isRouteErrorResponse(error) ? "Invalid page" : "Unexpected error."}
      </Text>
    </>
  );
};

export default ErrorPage;
