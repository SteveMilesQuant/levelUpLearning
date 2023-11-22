import { Box, HStack, Image } from "@chakra-ui/react";
import headerImage from "../assets/homeHeader.svg";
import AuthButton from "./AuthButton";
import SideIconList from "./SideIconList";

const NavBar = () => {
  return (
    <Box width="100%">
      <HStack
        position="fixed"
        justifyContent="space-between"
        width="100%"
        padding={2}
      >
        <Box>
          <SideIconList />
        </Box>
        <Box padding={1}>
          <AuthButton />
        </Box>
      </HStack>
      <Image src={headerImage} width="100%"></Image>
    </Box>
  );
};

export default NavBar;
