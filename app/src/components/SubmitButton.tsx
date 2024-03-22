import { Button } from "@chakra-ui/react";
import { FormEvent } from "react";
import ButtonText from "./ButtonText";
import TextButton from "./TextButton";

interface Props {
  children: string;
  onClick: () => void;
  disabled?: boolean;
}

const SubmitButton = ({ children, onClick, disabled }: Props) => {
  return (
    <TextButton onClick={onClick} isDisabled={disabled}>
      {children}
    </TextButton>
  );
};

export default SubmitButton;
