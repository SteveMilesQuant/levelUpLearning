import { Divider, HStack, Heading } from "@chakra-ui/react";
import { ReactNode } from "react";

interface Props {
  children?: ReactNode;
  label?: string;
  hideUnderline?: boolean;
  fontSize?: string;
}

const PageHeader = ({ children, label, hideUnderline, fontSize }: Props) => {
  return (
    <>
      <HStack justifyContent="space-between" marginBottom={5}>
        <Heading fontSize={fontSize || "3xl"}>{label}</Heading>
        {children}
      </HStack>
      {!hideUnderline && <Divider orientation="horizontal" marginY={5} />}
    </>
  );
};

export default PageHeader;
