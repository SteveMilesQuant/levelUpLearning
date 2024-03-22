import { ReactNode } from "react";
import { Th } from "@chakra-ui/react";

interface Props {
  children?: ReactNode;
}

const ThText = ({ children }: Props) => {
  return (
    <Th textColor="brand.thText" fontFamily="Georgia">
      {children}
    </Th>
  );
};

export default ThText;
