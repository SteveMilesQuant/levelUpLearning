import { Outlet } from "react-router-dom";
import { HStack } from "@chakra-ui/react";
import NavBar from "../components/NavBar";
import SideIconList from "../components/SideIconList";
import BodyContainer from "../components/BodyContainer";
import useAuth from "../hooks/useAuth";
import { ReactNode } from "react";
import useUserRoles from "../hooks/useUserRoles";

interface Props {
  children?: ReactNode;
}

const Layout = ({ children }: Props) => {
  const { signedIn } = useAuth();
  const { data: roles } = useUserRoles(signedIn);

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
