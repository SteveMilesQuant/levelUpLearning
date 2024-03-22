import { Button } from "@chakra-ui/react";

interface Props {
  children: string;
  onClick?: () => void;
  fontSize?: any;
  isDisabled?: boolean;
}
const TextButton = ({ children, onClick, fontSize, isDisabled }: Props) => {
  return (
    <Button
      onClick={onClick}
      size="md"
      bgColor="brand.buttonBg"
      fontSize={fontSize}
      isDisabled={isDisabled}
    >
      {children}
    </Button>
  );
};

export default TextButton;
