import { Button, HStack, Image, Text } from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import apiClient from "../services/api-client";
import {
  TokenResponse,
  googleLogout,
  useGoogleLogin,
} from "@react-oauth/google";

interface Props {
  signedIn: boolean;
  setSignedIn: (signedIn: boolean) => void;
}

const NavBar = ({ signedIn, setSignedIn }: Props) => {
  const apiSignIn = (
    codeResponse: Omit<
      TokenResponse,
      "error" | "error_description" | "error_uri"
    >
  ) => {
    apiClient.post("/signin", codeResponse).then((token) => {
      apiClient.defaults.headers.common = { Authorization: token.data };
      setSignedIn(true);
    });
  };

  const googleLogin = useGoogleLogin({
    onSuccess: (codeResponse) => apiSignIn(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });

  const logout = function () {
    googleLogout();
    apiClient.defaults.headers.common = {};
    setSignedIn(false);
  };

  return (
    <HStack justifyContent="space-between" padding="10px">
      {/*<Image src={logo} height="32px" />*/}
      <Text>Level Up Learning</Text>
      {!signedIn && (
        <Button variant="outline" onClick={() => googleLogin()}>
          <HStack justifyContent="space-between" padding="3px">
            <FcGoogle size={16} />
            <Text>Sign In</Text>
          </HStack>
        </Button>
      )}
      {signedIn && (
        <Button variant="outline" onClick={() => logout()}>
          <Text>Sign Out</Text>
        </Button>
      )}
    </HStack>
  );
};

export default NavBar;
