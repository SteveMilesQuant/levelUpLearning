import { Box, useBreakpointValue } from "@chakra-ui/react";
import NavBarMobile from "./NavBarMobile";
import NavBarDesktop from "./NavBarDesktop";

const NavBar = () => {
  const navbar = useBreakpointValue({ base: <NavBarMobile />, xl: <NavBarDesktop /> });
  return <Box width="full" position="sticky" top="0"
    zIndex="sticky">{navbar || null}</Box>;
};

export default NavBar;
