import { ReactNode } from "react";
import { Box } from "@chakra-ui/react";

interface Props {
  children: ReactNode;
}

const ButtonText = ({ children }: Props) => {
  return <Box textColor="brand.buttonText">{children}</Box>;
};

export default ButtonText;
