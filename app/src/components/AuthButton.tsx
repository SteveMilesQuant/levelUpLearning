import { Button, HStack, Icon, Text } from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import useLogin from "../hooks/useLogin";

interface Props {
  signedIn: boolean;
  setSignedIn: (signedIn: boolean) => void;
  onError: (error: string) => void;
}

const AuthButton = ({ signedIn, setSignedIn, onError }: Props) => {
  const { onLogin, onLogout } = useLogin(setSignedIn, onError);

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
