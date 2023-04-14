import { useEffect } from "react";
import {
  TokenResponse,
  googleLogout,
  useGoogleLogin,
} from "@react-oauth/google";
import { Box, Button, HStack, Icon, Image, Text } from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import { BsArrowUpSquare } from "react-icons/bs";
import apiClient from "../services/api-client";
import logo from "../assets/logo.png";

interface Props {
  signedIn: boolean;
  setSignedIn: (signedIn: boolean) => void;
  onError: (error: string) => void;
}

const NavBar = ({ signedIn, setSignedIn, onError }: Props) => {
  // Check to see if we're already signed in
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      apiClient.defaults.headers.common = { Authorization: authToken };
      setSignedIn(true);
    }
  }, []);

  const apiSignIn = (
    codeResponse: Omit<
      TokenResponse,
      "error" | "error_description" | "error_uri"
    >
  ) => {
    apiClient.post("/signin", codeResponse).then((token) => {
      localStorage.setItem("authToken", token.data);
      apiClient.defaults.headers.common = { Authorization: token.data };
      setSignedIn(true);
    });
  };

  const googleLogin = useGoogleLogin({
    onSuccess: (codeResponse) => apiSignIn(codeResponse),
    onError: (error) => onError("Login Failed: " + error),
  });

  const logout = function () {
    googleLogout();
    localStorage.removeItem("authToken");
    apiClient.defaults.headers.common = {};
    setSignedIn(false);
  };

  return (
    <HStack justifyContent="space-between" padding="10px">
      <HStack spacing={4} paddingLeft={3}>
        <Icon as={BsArrowUpSquare} boxSize="40px" color="blue.300" />
        <Image src={logo} height="40px" paddingLeft={4} />
      </HStack>
      {!signedIn && (
        <Button variant="outline" bgColor="white" onClick={() => googleLogin()}>
          <HStack justifyContent="space-between" spacing={2}>
            <Icon as={FcGoogle} size={16} />
            <Text>Sign In</Text>
          </HStack>
        </Button>
      )}
      {signedIn && (
        <Button variant="outline" bgColor="white" onClick={() => logout()}>
          <Text>Sign Out</Text>
        </Button>
      )}
    </HStack>
  );
};

export default NavBar;
