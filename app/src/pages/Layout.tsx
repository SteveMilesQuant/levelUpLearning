import { Outlet } from "react-router-dom";
import { HStack } from "@chakra-ui/react";
import NavBar from "../components/NavBar";
import SideIconList from "../components/SideIconList";
import useRoles from "../hooks/useRoles";
import BodyContainer from "../components/BodyContainer";
import useAuth from "../hooks/useAuth";
import { ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

const Layout = ({ children }: Props) => {
  const { signedIn } = useAuth();
  const { data: roles } = useRoles(signedIn);

  return (
    <>
      <NavBar></NavBar>
      <HStack gap={0} alignItems="top">
        {roles && <SideIconList roles={roles} />}
        <BodyContainer>
          <Outlet />
          {children}
        </BodyContainer>
      </HStack>
    </>
  );
};

export default Layout;
