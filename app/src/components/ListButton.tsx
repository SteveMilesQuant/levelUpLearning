import { Box } from "@chakra-ui/react";

interface Props {
  children: string;
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
      bgColor={isSelected ? "gray.300" : undefined}
      verticalAlign="middle"
      lineHeight="1.2"
      display="inline-flex"
      width="100%"
      whiteSpace="nowrap"
      _hover={{ background: "gray.100", cursor: hoverCursor || "pointer" }}
      onClick={onClick}
    >
      {children}
    </Box>
  );
};

export default ListButton;
