import { Outlet } from "react-router-dom";
import { HStack } from "@chakra-ui/react";
import NavBar from "../components/NavBar";
import SideIconList from "../components/SideIconList";
import BodyContainer from "../components/BodyContainer";
import { ReactNode } from "react";
import { useUser } from "../users";

interface Props {
  children?: ReactNode;
}

const Layout = ({ children }: Props) => {
  const { data: user } = useUser();

  // Include both Outlet and children, to allow both contexts

  return (
    <>
      <NavBar></NavBar>
      <HStack gap={0} alignItems="top">
        {user && <SideIconList roles={user.roles} />}
        <BodyContainer>
          <Outlet />
          {children}
        </BodyContainer>
      </HStack>
    </>
  );
};

export default Layout;
