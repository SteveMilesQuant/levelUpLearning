import { IconButton } from "@chakra-ui/react";
import { AiFillEdit } from "react-icons/ai";
import { IconType } from "react-icons/lib";

interface Props {
  Component: IconType;
  onClick: () => void;
  label: string;
}

const ActionButton = ({ Component, onClick, label }: Props) => {
  return (
    <IconButton
      icon={<Component size="18px" />}
      aria-label={label}
      size="sm"
      variant="ghost"
      onClick={onClick}
    />
  );
};

export default ActionButton;
