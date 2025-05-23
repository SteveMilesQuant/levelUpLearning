import { MdOutlineShoppingCart } from "react-icons/md";
import useShoppingCart from "../hooks/useShoppingCart";
import { Box, Icon, Text } from "@chakra-ui/react";
import { FaCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ShoppingCart = () => {
  const { items } = useShoppingCart();
  const navigate = useNavigate();

  if (items.length === 0) return null;

  const buttonSize = { base: "2em", xl: "2.5em" };

  return (
    <Box
      position="relative"
      onClick={() => {
        navigate("/checkout");
      }}
    >
      <Icon
        boxSize={buttonSize}
        color="brand.primary"
        as={MdOutlineShoppingCart}
        aria-label="Checkout"
      />
      <Box position="absolute" zIndex={1} left={-0.5} bottom={1}>
        <FaCircle color="rgb(62, 219, 240)" size="1em" />
      </Box>
      <Box
        position="absolute"
        zIndex={2}
        width="1em"
        height="1em"
        left={-0.5}
        bottom={2}
      >
        <Text fontSize={14} margin="auto" textAlign="center" textColor="brand.primary">
          {items.length}
        </Text>
      </Box>
    </Box>
  );
};

export default ShoppingCart;
