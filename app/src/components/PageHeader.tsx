import { Divider, HStack, Heading } from "@chakra-ui/react";
import { ReactNode } from "react";
import GoofyText from "./GoofyText";

interface Props {
  rightButton?: ReactNode;
  children?: string;
  hideUnderline?: boolean;
  fontSize?: string;
}

const PageHeader = ({
  rightButton,
  children,
  hideUnderline,
  fontSize,
}: Props) => {
  return (
    <>
      <HStack justifyContent="space-between" marginBottom={5}>
        <GoofyText fontSize={fontSize || { base: 40, md: 46, lg: 60 }} >
          {children}
        </GoofyText>
        {rightButton}
      </HStack>
      {!hideUnderline && <Divider orientation="horizontal" marginY={5} />}
    </>
  );
};

export default PageHeader;
