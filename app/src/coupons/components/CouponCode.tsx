import { HStack, Input, Text } from "@chakra-ui/react";
import TextButton from "../../components/TextButton";
import { useState } from "react";

interface Props {
  onSubmit: (code: string) => void;
}

const CouponCode = ({ onSubmit }: Props) => {
  const [code, setCode] = useState("");

  const handleSubmit = () => {
    onSubmit(code);
    setCode("");
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <HStack justifyContent="space-between">
      <Text>
        <strong>Coupon:</strong>
      </Text>
      <Input value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter coupon code" />
      <TextButton onClick={handleSubmit}>
        Apply
      </TextButton>
    </HStack>
  );
};

export default CouponCode;
