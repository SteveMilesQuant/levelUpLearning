import { Button, Text } from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../users";

const AuthButton = () => {
  const { signedIn, onLogin, onLogout } = useAuth();

  return (
    <>
      {!signedIn && (
        <Button
          leftIcon={<FcGoogle />}
          variant="outline"
          bgColor="white"
          textColor="brand.primary"
          fontSize="16px"
          onClick={() => onLogin()}
        >
          Sign In
        </Button>
      )}
      {signedIn && (
        <Button
          variant="outline"
          bgColor="white"
          textColor="brand.primary"
          fontSize="16px"
          onClick={() => onLogout()}
        >
          <Text>Sign Out</Text>
        </Button>
      )}
    </>
  );
};

export default AuthButton;
