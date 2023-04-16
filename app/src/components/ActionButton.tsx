import { IconButton, forwardRef } from "@chakra-ui/react";
import { IconType } from "react-icons/lib";

interface Props {
  Component: IconType;
  onClick?: () => void;
  label: string;
}

const ActionButton = forwardRef(({ Component, onClick, label }: Props, ref) => {
  return (
    <IconButton
      icon={<Component size="18px" />}
      aria-label={label}
      size="sm"
      variant="ghost"
      onClick={onClick}
      ref={ref}
    />
  );
});

export default ActionButton;
