import { useBreakpointValue } from "@chakra-ui/react";
import NavBarMobile from "./NavBarMobile";
import NavBarDesktop from "./NavBarDesktop";

const NavBar = () => {
  const navbar = useBreakpointValue({ base: <NavBarMobile />, xl: <NavBarDesktop /> });
  return navbar;
};

export default NavBar;
