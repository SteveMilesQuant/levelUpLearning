import { Outlet } from "react-router-dom";
import { HStack } from "@chakra-ui/react";
import NavBar from "../components/NavBar";
import SideIconList from "../components/SideIconList";
import BodyContainer from "../components/BodyContainer";
import { useAuth } from "../users";
import { ReactNode } from "react";
import { useUser } from "../users";

interface Props {
  children?: ReactNode;
}

const Layout = ({ children }: Props) => {
  const { signedIn } = useAuth();
  const { data: user } = useUser(signedIn);

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
