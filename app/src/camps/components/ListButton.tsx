import { Button } from "@chakra-ui/react";

interface Props {
  children: string;
  isSelected: boolean;
  onClick: () => void;
}

const ListButton = ({ children, isSelected, onClick }: Props) => {
  return (
    <Button
      variant="ghost"
      fontSize="lg"
      bgColor={isSelected ? "gray.300" : undefined}
      onClick={onClick}
      justifyContent="left"
      width="100%"
    >
      {children}
    </Button>
  );
};

export default ListButton;
