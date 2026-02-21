import { Box, ResponsiveValue } from "@chakra-ui/react";
import { ReactNode } from "react";

interface Props {
  children?: ReactNode;
  paddingY?: ResponsiveValue<number>;
}

const BodyContainer = ({ children, paddingY }: Props) => {
  if (!children) return null;
  return (
    <Box paddingX={8} paddingY={paddingY === undefined ? 10 : paddingY} w="full">
      {children}
    </Box>
  );
};

export default BodyContainer;
