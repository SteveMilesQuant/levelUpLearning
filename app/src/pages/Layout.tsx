import { Outlet } from "react-router-dom";
import { Box, HStack } from "@chakra-ui/react";
import NavBar from "../components/NavBar";
import { ReactNode } from "react";
import AuthExpiredModal from "../components/AuthExpiredModal";
import ContactVerificationModal from "../users/components/ContactVerificationModal";
import Footer from "../components/Footer";
import usePageView from "../hooks/usePageView";
import AlertMessage from "../components/AlertMessage";
import useAlert from "../hooks/useAlerts";
import BodyContainer from "../components/BodyContainer";

interface Props {
  children?: ReactNode;
}

const Layout = ({ children }: Props) => {
  usePageView(); // for Google Analytics
  const { alert, setAlert } = useAlert();

  return (
    <>
      <NavBar></NavBar>
      {alert &&
        <BodyContainer>
          <AlertMessage
            status={alert.status}
            onClose={() => setAlert(undefined)}
          >
            {alert.message}
          </AlertMessage>
        </BodyContainer>}
      <HStack gap={0} alignItems="top" w="full">
        <AuthExpiredModal />
        <ContactVerificationModal />
        <Box w="full">
          {/* Include both Outlet and children, to allow both contexts */}
          <Outlet />
          {children}
        </Box>
      </HStack>
      <Footer />
    </>
  );
};

export default Layout;
