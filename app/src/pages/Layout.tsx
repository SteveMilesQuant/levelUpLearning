import { Outlet } from "react-router-dom";
import { HStack } from "@chakra-ui/react";
import NavBar from "../components/NavBar";
import BodyContainer from "../components/BodyContainer";
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
        <BodyContainer>
          <Outlet />
          {children}
        </BodyContainer>
      </HStack>
    </>
  );
};

export default Layout;
