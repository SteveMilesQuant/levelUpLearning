import { Outlet } from "react-router-dom";
import { HStack } from "@chakra-ui/react";
import NavBar from "../components/NavBar";
import SideIconList from "../components/SideIconList";
import useRoles from "../hooks/useRoles";
import BodyContainer from "../components/BodyContainer";

const Layout = () => {
  const { data: roles } = useRoles();

  return (
    <>
      <NavBar></NavBar>
      <HStack gap={0} alignItems="top">
        {roles && <SideIconList roles={roles} />}
        <BodyContainer>
          <Outlet />
        </BodyContainer>
      </HStack>
    </>
  );
};

export default Layout;
