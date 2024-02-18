import { HStack, Text } from "@chakra-ui/react";

interface Props {
  subtotal?: number;
  total: number;
}

const CheckoutTotal = ({ subtotal, total }: Props) => {
  return (
    <HStack justifyContent="space-between" padding={2}>
      <Text fontSize={20}>
        <strong>Total:</strong>
      </Text>
      <HStack justifyContent="right" spacing={2}>
        {subtotal && (
          <Text textColor="red" textDecoration="line-through">
            ${subtotal}
          </Text>
        )}
        <Text>${total}</Text>
      </HStack>
    </HStack>
  );
};

export default CheckoutTotal;
