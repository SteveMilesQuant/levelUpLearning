import { Outlet } from "react-router-dom";
import { Box, HStack, Link } from "@chakra-ui/react";
import NavBar from "../components/NavBar";
import { ReactNode } from "react";
import { BsDot } from "react-icons/bs";
import AuthExpiredModal from "../components/AuthExpiredModal";
import ContactVerificationModal from "../users/components/ContactVerificationModal";
import HomePageBanner from "../components/HomePageBanner";

interface Props {
  children?: ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <>
      <HomePageBanner />
      <NavBar></NavBar>
      <HStack gap={0} alignItems="top">
        <AuthExpiredModal />
        <ContactVerificationModal />
        <Box>
          {/* Include both Outlet and children, to allow both contexts */}
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
