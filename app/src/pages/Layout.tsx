import { Outlet } from "react-router-dom";
import { Box, HStack, Link } from "@chakra-ui/react";
import NavBar from "../components/NavBar";
import { ReactNode } from "react";
import { BsDot } from "react-icons/bs";
import AuthExpiredModal from "../components/AuthExpiredModal";

interface Props {
  children?: ReactNode;
}

const Layout = ({ children }: Props) => {
  // Include both Outlet and children, to allow both contexts

  return (
    <>
      <NavBar></NavBar>
      <HStack gap={0} alignItems="top">
        <AuthExpiredModal />
        <Box>
          <Outlet />
          {children}
        </Box>
      </HStack>
      <HStack
        spacing={1}
        width="100%"
        justifyContent="center"
        marginY={5}
        bgColor="brand.secondary"
      >
        <Link href="/about">About</Link>
        <BsDot />
        <Link href="/privacy">Privacy</Link>
        <BsDot />
        <Link href="/data-request">Data requests</Link>
      </HStack>
    </>
  );
};

export default Layout;
