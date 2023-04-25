import { Button, ListItem } from "@chakra-ui/react";

interface Props {
  children: string;
  isSelected: boolean;
  onClick: () => void;
}

const LevelListButton = ({ children, isSelected, onClick }: Props) => {
  return (
    <ListItem>
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
    </ListItem>
  );
};

export default LevelListButton;
