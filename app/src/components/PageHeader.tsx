import { Divider, HStack, Heading } from "@chakra-ui/react";
import { ReactNode } from "react";

interface Props {
  children?: ReactNode;
  label: string;
}

const PageHeader = ({ children, label }: Props) => {
  return (
    <>
      <HStack justifyContent="space-between">
        <Heading fontSize="3xl">{label}</Heading>
        {children}
      </HStack>
      <Divider orientation="horizontal" marginY={5} />
    </>
  );
};

export default PageHeader;
