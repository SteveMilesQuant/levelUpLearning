import { HStack, Heading } from "@chakra-ui/react";
import { BsArrowUpSquare } from "react-icons/bs";
import AuthButton from "./AuthButton";
import LinkIcon from "./LinkIcon";

interface Props {
  signedIn: boolean;
  setSignedIn: (signedIn: boolean) => void;
  onError: (error: string) => void;
}

const NavBar = ({ signedIn, setSignedIn, onError }: Props) => {
  return (
    <HStack justifyContent="space-between" paddingX={4} paddingY={2}>
      <HStack spacing={4}>
        <LinkIcon
          icon={<BsArrowUpSquare size="2em" />}
          endpoint="/"
          label="Home"
        />
        <Heading fontFamily="monospace" fontSize="30px" color="blue.500">
          levelup
        </Heading>
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
