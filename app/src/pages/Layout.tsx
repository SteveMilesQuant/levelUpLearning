import { Outlet } from "react-router-dom";
import { Box, HStack } from "@chakra-ui/react";
import NavBar from "../components/NavBar";
import { ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

const Layout = ({ children }: Props) => {
  // Include both Outlet and children, to allow both contexts

  return (
    <>
      <NavBar></NavBar>
      <HStack gap={0} alignItems="top">
        <Box>
          <Outlet />
          {children}
        </Box>
      </HStack>
    </>
  );
};

export default Layout;
