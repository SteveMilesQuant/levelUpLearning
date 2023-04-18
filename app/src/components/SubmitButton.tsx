import { Button } from "@chakra-ui/react";
import { FormEvent } from "react";

interface Props {
  children: string;
  onClick: (e: FormEvent) => void;
}

const SubmitButton = ({ children, onClick }: Props) => {
  return (
    <Button bgColor="blue.300" onClick={onClick}>
      {children}
    </Button>
  );
};

export default SubmitButton;
