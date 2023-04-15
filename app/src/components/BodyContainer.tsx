import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

const BodyContainer = ({ children }: Props) => {
  if (!children) return null;
  return <Box padding={10}>{children}</Box>;
};

export default BodyContainer;
