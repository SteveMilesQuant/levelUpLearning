import { Button, HStack, Icon, Image, Link } from "@chakra-ui/react";
import { BsArrowUpSquare } from "react-icons/bs";
import logo from "../assets/logo.png";
import AuthButton from "./AuthButton";
import { Link as RouterLink } from "react-router-dom";

interface Props {
  signedIn: boolean;
  setSignedIn: (signedIn: boolean) => void;
  onError: (error: string) => void;
}

const NavBar = ({ signedIn, setSignedIn, onError }: Props) => {
  return (
    <HStack justifyContent="space-between" padding="10px">
      <HStack spacing={4} paddingLeft={3}>
        <Button boxSize="50px" variant="ghost">
          <Link as={RouterLink} to="/">
            <Icon as={BsArrowUpSquare} boxSize="40px" color="blue.300" />
          </Link>
        </Button>
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
