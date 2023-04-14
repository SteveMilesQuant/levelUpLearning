import { HStack, Icon, Image } from "@chakra-ui/react";
import { BsArrowUpSquare } from "react-icons/bs";
import logo from "../assets/logo.png";
import AuthButton from "./AuthButton";

interface Props {
  signedIn: boolean;
  setSignedIn: (signedIn: boolean) => void;
  onError: (error: string) => void;
}

const NavBar = ({ signedIn, setSignedIn, onError }: Props) => {
  return (
    <HStack justifyContent="space-between" padding="10px">
      <HStack spacing={4} paddingLeft={3}>
        <Icon as={BsArrowUpSquare} boxSize="40px" color="blue.300" />
        <Image src={logo} height="40px" paddingLeft={4} />
      </HStack>
      <AuthButton
        signedIn={signedIn}
        setSignedIn={setSignedIn}
        onError={onError}
      />
    </HStack>
  );
};

export default NavBar;
