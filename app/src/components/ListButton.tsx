import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  isSelected: boolean;
  onClick: () => void;
  hoverCursor?: string;
}

const ListButton = ({ children, isSelected, onClick, hoverCursor }: Props) => {
  /* Buttons don't play well with drag and drop, so use Box instead, but painstakingly copy all the style from Button */
  return (
    <Box
      borderRadius="md"
      alignItems="center"
      justifyContent="left"
      height={10}
      fontWeight="semibold"
      fontSize="lg"
      paddingInlineStart={4}
      paddingInlineEnd={4}
      bgColor={isSelected ? "brand.selected" : "brand.buttonBg"}
      verticalAlign="middle"
      lineHeight="1.2"
      display="inline-flex"
      width="100%"
      whiteSpace="nowrap"
      _hover={{ background: "brand.hover", cursor: hoverCursor || "pointer" }}
      onClick={onClick}
    >
      {children}
    </Box>
  );
};

export default ListButton;
