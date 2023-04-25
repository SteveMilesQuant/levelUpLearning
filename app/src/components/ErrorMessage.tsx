import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  CloseButton,
} from "@chakra-ui/react";

interface Props {
  children: string;
  onClose?: () => void;
}

const ErrorMessage = ({ children, onClose }: Props) => {
  return (
    <Alert status="error">
      <AlertIcon />
      <AlertTitle>Error!</AlertTitle>
      <AlertDescription>{children}</AlertDescription>
      {onClose && (
        <CloseButton
          alignSelf="flex-start"
          position="relative"
          right={-1}
          onClick={onClose}
        />
      )}
    </Alert>
  );
};

export default ErrorMessage;
