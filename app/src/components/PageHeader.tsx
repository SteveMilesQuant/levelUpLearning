import { Divider, HStack, Heading } from "@chakra-ui/react";
import { ReactNode } from "react";

interface Props {
  children?: ReactNode;
  label?: string;
  hideUnderline?: boolean;
}

const PageHeader = ({ children, label, hideUnderline }: Props) => {
  return (
    <>
      <HStack justifyContent="space-between" marginBottom={5}>
        <Heading fontSize="3xl">{label}</Heading>
        {children}
      </HStack>
      {!hideUnderline && <Divider orientation="horizontal" marginY={5} />}
    </>
  );
};

export default PageHeader;
