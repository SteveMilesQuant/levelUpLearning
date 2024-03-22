import { Box, Button } from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../users";
import ButtonText from "./ButtonText";

interface Props {
  children?: string;
  bgColor?: string;
}

const AuthButton = ({ children, bgColor }: Props) => {
  const { signedIn, onLogin, onLogout } = useAuth();

  return (
    <Box>
      {!signedIn && (
        <Button
          leftIcon={<FcGoogle />}
          bgColor={bgColor || "white"}
          size="sm"
          onClick={() => onLogin()}
        >
          <ButtonText>{children || "Sign In"}</ButtonText>
        </Button>
      )}
      {signedIn && (
        <Button
          bgColor={bgColor || "white"}
          size="sm"
          onClick={() => onLogout()}
        >
          <ButtonText>Sign Out</ButtonText>
        </Button>
      )}
    </Box>
  );
};

export default AuthButton;
