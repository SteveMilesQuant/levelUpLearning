import { Box, HStack } from "@chakra-ui/react";
import AuthButton from "./AuthButton";
import SideIconList from "./SideIconList";

const NavBar = () => {
  return (
    <>
      <SideIconList />
      <HStack
        justifyContent="right"
        alignItems="center"
        padding={3}
        spacing={4}
        backgroundColor="brand.primary"
      >
        <AuthButton />
      </HStack>
    </>
  );
};

export default NavBar;
