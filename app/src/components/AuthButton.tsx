import { Button, Text } from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import useLogin from "../hooks/useLogin";

const AuthButton = () => {
  const { signedIn, onLogin, onLogout } = useLogin();

  return (
    <>
      {!signedIn && (
        <Button
          leftIcon={<FcGoogle />}
          variant="outline"
          bgColor="white"
          onClick={() => onLogin()}
        >
          Sign In
        </Button>
      )}
      {signedIn && (
        <Button variant="outline" bgColor="white" onClick={() => onLogout()}>
          <Text>Sign Out</Text>
        </Button>
      )}
    </>
  );
};

export default AuthButton;
