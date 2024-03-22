import { Box, Button } from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../users";
import ButtonText from "./ButtonText";

const AuthButton = () => {
  const { signedIn, onLogin, onLogout } = useAuth();

  return (
    <Box>
      {!signedIn && (
        <Button
          leftIcon={<FcGoogle />}
          bgColor="white"
          size="sm"
          onClick={() => onLogin()}
        >
          <ButtonText>Sign In</ButtonText>
        </Button>
      )}
      {signedIn && (
        <Button bgColor="white" size="sm" onClick={() => onLogout()}>
          <ButtonText>Sign Out</ButtonText>
        </Button>
      )}
    </Box>
  );
};

export default AuthButton;
