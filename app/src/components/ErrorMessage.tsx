import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  CloseButton,
} from "@chakra-ui/react";

interface Props {
  message: string;
  onClose: () => void;
}

const ErrorMessage = ({ message, onClose }: Props) => {
  return (
    <Alert status="error">
      <AlertIcon />
      <AlertTitle>Error!</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
      <CloseButton
        alignSelf="flex-start"
        position="relative"
        right={-1}
        onClick={onClose}
      />
    </Alert>
  );
};

export default ErrorMessage;
