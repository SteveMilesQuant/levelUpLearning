import { HStack, Heading } from "@chakra-ui/react";
import { BsArrowUpSquare } from "react-icons/bs";
import AuthButton from "./AuthButton";
import LinkIcon from "./LinkIcon";

const NavBar = () => {
  return (
    <HStack
      justifyContent="space-between"
      paddingX={4}
      paddingY={2}
      backgroundColor="blue.100"
    >
      <HStack spacing={4}>
        <LinkIcon
          icon={<BsArrowUpSquare size="2em" />}
          endpoint="/"
          label="Home"
        />
        <Heading fontFamily="monospace" fontSize="30px" color="blue.500">
          levelup
        </Heading>
      </HStack>
      <AuthButton />
    </HStack>
  );
};

export default NavBar;
