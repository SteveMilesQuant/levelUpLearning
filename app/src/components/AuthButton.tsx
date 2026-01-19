import { Box, Button } from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../users";
import ButtonText from "./ButtonText";

interface Props {
  children?: string;
  bgColor?: string;
  onSuccess?: () => void;
}

const AuthButton = ({ children, bgColor, onSuccess }: Props) => {
  const { signedIn, onLogin, onLogout } = useAuth(onSuccess);

  const buttonSize = { base: "sm", xl: "md" };

  return (
    <Box>
      {!signedIn && (
        <Button
          leftIcon={<FcGoogle />}
          bgColor={bgColor || "white"}
          borderColor="brand.primary"
          borderWidth={2}
          size={buttonSize}
          onClick={() => onLogin()}
        >
          <ButtonText>{children || "Sign In"}</ButtonText>
        </Button>
      )}
      {signedIn && (
        <Button
          bgColor={bgColor || "white"}
          borderColor="brand.primary"
          borderWidth={2}
          size={buttonSize}
          onClick={() => onLogout()}
        >
          <ButtonText>Sign Out</ButtonText>
        </Button>
      )}
    </Box>
  );
};

export default AuthButton;
